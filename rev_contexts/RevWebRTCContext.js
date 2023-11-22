import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  RTCView,
} from 'react-native-webrtc';

import {KeepAwake} from 'react-native-keep-awake';

import {RevSiteDataContext} from './RevSiteDataContext';
import {RevRemoteSocketContext} from './RevRemoteSocketContext';
import {ReViewsContext} from './ReViewsContext';

import {revIsEmptyJSONObject} from '../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

import DeviceInfo from 'react-native-device-info';

import {RevDialingCall} from '../components/rev_views/rev_web_rtc_views/rev_views/rev_object_views/RevDialingCall';
import {RevIncomingCall} from '../components/rev_views/rev_web_rtc_views/rev_views/rev_object_views/RevIncomingCall';

import {useRevSiteStyles} from '../components/rev_views/RevSiteStyles';

// create the context
const RevWebRTCContext = createContext();

const config = {
  iceCandidatePoolSize: 5,
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

const sessionConstraints = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true,
};

const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
};

const channelConfig = {
  ordered: true, // data packets are sent in order
  maxPacketLifeTime: 10000, // packets will expire after 10 seconds
  maxRetransmits: 10, // the sender will retransmit a packet up to 3 times if it doesn't receive an ACK from the receiver
  label: 'my-channel', // a name for the channel
};

const RevWebRTCContextProvider = ({children}) => {
  const {revSiteStyles} = useRevSiteStyles();
  const deviceModel = DeviceInfo.getModel();

  const {revInitSiteModal, revCloseSiteModal} = useContext(ReViewsContext);

  // initialize state variable
  const [revPeerConnsData, setRevPeerConnsData] = useState([]);

  const [revQuedMessages, setRevQuedMessages] = useState([]);

  const [revWebServerOpen, setRevWebServerOpen] = useState(true);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState(null);
  const [revLoggedInEntityGUID, setRevLoggedInEntityGUID] = useState(0);

  const {REV_PORT, REV_IP} = useContext(RevRemoteSocketContext);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const [revIsCaller, setRevIsCaller] = useState(false);
  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const [revRemoteVideoStreamsArr, setRevRemoteVideoStreamsArr] = useState([]);

  const [revOffer, setRevOffer] = useState(null);
  const [revAnswer, setRevAnswer] = useState(null);
  const [revCandidate, setRevCandidate] = useState(null);

  let revOKGo = async (revVarArgs, revType = '') => {
    const {revEntity = {}, revDataType = ''} = revVarArgs;
    const {_revRemoteGUID = -1} = revEntity;

    if (_revRemoteGUID < 1) {
      return;
    }

    await revCreatePeerConnection(_revRemoteGUID);
  };

  const revInitWebServer = () => {
    const ws = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);

    SET_REV_WEB_SOCKET_SERVER(ws);

    ws.addEventListener('open', event => {
      setRevWebServerOpen(true);
    });
  };

  // function to initialize WebSocket and set up event listeners
  const initSocket = () => {
    REV_WEB_SOCKET_SERVER.onmessage = async event => {
      const message = JSON.parse(event.data);

      const {type: revMsgType} = message;

      console.log('>>> revMsgType', revMsgType);

      switch (revMsgType) {
        case 'rev_connection':
          break;
        case 'login':
          handleLogin(message.success);
          break;
        case 'offer':
          setRevOffer(message);
          break;
        case 'answer':
          setRevAnswer(message);
          break;
        case 'candidate':
          setRevCandidate(message);
          break;
        case 'rev_rand_logged_in_conns':
          revHandleRandLoggedInConnGUIDs(message);
          break;
        case 'revConnEntity':
          await revOKGo(message);
          break;
        case 'rev_unavailable':
          console.log(deviceModel, message, JSON.stringify(message));
          break;
        default:
          console.warn(`Received unknown message: ${JSON.stringify(message)}`);
      }
    };
  };

  const revSendWebServerMessage = (message, revWS = null) => {
    if (revWS == null) {
      revWS = REV_WEB_SOCKET_SERVER;
    }

    if (!revWS || revWS.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!revIsEmptyJSONObject(message)) {
      try {
        revWS.send(JSON.stringify(message));
      } catch (error) {
        console.log('*** revSendWebServerMessage - error', error);
      }
    }
  };

  const revGetRandLoggedInGUIDs = revLoggedInEntityGUID => {
    let revMessage = {
      type: 'rev_get_rand_connected_users',
      revEntityId: revLoggedInEntityGUID,
    };
    revSendWebServerMessage(revMessage);
  };

  const revHandleRandLoggedInConnGUIDs = () => {};

  const revWSLogIn = () => {
    let revMessage = {type: 'login', revEntity: REV_LOGGED_IN_ENTITY};
    revSendWebServerMessage(revMessage);
  };

  const handleLogin = success => {
    if (success === false) {
      REV_WEB_SOCKET_SERVER(null);
      alert('Ooops...try a different username');
    } else {
      console.log(deviceModel, '+++ Logged In +++');
    }
  };

  const revGetConnData = revPeerId => {
    return revPeerConnsData.find(c => c && c.peerId === revPeerId);
  };

  const getDataChannel = peerId => {
    const connection = revGetConnData(peerId);

    if (connection && connection.dataChannel) {
      return connection.dataChannel;
    }

    return null;
  };

  const getPeerConnection = peerId => {
    const connection = revGetConnData(peerId);
    if (connection) {
      return connection.pc;
    }
    return null;
  };

  const revUpdateConnDataState = revNewData => {
    const {peerId} = revNewData;

    setRevPeerConnsData(revPrev => {
      return revPrev.map(revCurr => {
        let revCurrPeerId = revCurr.peerId;

        if (peerId == revCurrPeerId) {
          revCurr = revNewData;
        }

        return revCurr;
      });
    });
  };

  const revCreateDataChannel = (pc, _revRemoteGUID) => {
    const revChanOptions = {
      id: 1,
      ordered: true,
      maxPacketLifeTime: 5000, // 5 seconds
      // maxRetransmits: 3,
      protocol: 'udp',
    };

    const revDataChannel = pc.createDataChannel(
      'rev_data_channel',
      revChanOptions,
    );

    // set up event listeners for data channel
    revDataChannel.onopen = () => {
      console.log('Data channel state:', revDataChannel.readyState);

      try {
        revInitSendMsgs().then(() => {
          console.log(deviceModel, '>>> ++ MSG SENT ++ <<<');
        });
      } catch (error) {
        console.log(deviceModel, '*** revDataChannel.onopen', error);
      }
    };

    revDataChannel.onclose = () => {
      console.log(deviceModel, 'Data channel closed');
    };

    revDataChannel.onerror = error => {
      console.error(deviceModel, `Data channel error: ${error}`);
    };

    revDataChannel.onstatechange = function (event) {
      console.log(
        deviceModel,
        '>>> DC state changed',
        revDataChannel.readyState,
      );
    };

    return revDataChannel;
  };

  // function to create peer connection and add to state JSON object
  const revCreatePeerConnection = async (
    peerId,
    {revIsVideoCall = false} = {},
  ) => {
    const pc = new RTCPeerConnection(config);

    // Remote side: Receive and process incoming tracks
    pc.ontrack = function (event) {
      const remoteStream = event.streams[0];
      remoteStream.id = peerId;

      remoteStream.getTracks().forEach(track => {
        console.log(deviceModel, '--- Received remote track:', track);
        // Do something with the remote track
      });

      if (revIsVideoCall) {
        setRevRemoteVideoStreamsArr([
          ...revRemoteVideoStreamsArr,
          remoteStream,
        ]);
      }
    };

    if (revIsVideoCall) {
      try {
        let revLocalMediaStream = await mediaDevices.getUserMedia(
          mediaConstraints,
        );
        revLocalMediaStream
          .getTracks()
          .forEach(track => pc.addTrack(track, revLocalMediaStream));

        setRevLocalVideoStream(revLocalMediaStream);
      } catch (error) {
        console.log('>>> error -set local streeam', error);
      }
    }

    // Accumulate incoming chunks
    let receivedChunks = [];

    pc.addEventListener('datachannel', event => {
      let datachannel = event.channel;

      datachannel.addEventListener('message', event => {
        let revChunkDataStr = event.data;

        /** START REV CALL PLUGIN HOOK HANDLERS */
        if (revChunkDataStr === 'EOF') {
          let revReceivedMsgStr = receivedChunks.join('');

          try {
            const {revMsg = {}} = JSON.parse(revReceivedMsgStr);
            const {_revInfoEntity = {_revMetadataList: []}} = revMsg;

            let revMsgVal = revGetMetadataValue(
              _revInfoEntity._revMetadataList,
              'rev_entity_desc',
            );

            console.log('! ! ! Received msg:', revMsgVal);
          } catch (error) {
            console.log('>>> ERROR - revDataChannel.onmessage', error);
          }

          // Clear the receivedChunks array for the next file
          receivedChunks = [];
        } else {
          // Regular data chunk, accumulate it
          receivedChunks.push(revChunkDataStr);
        }
        /** END REV CALL PLUGIN HOOK HANDLERS */
      });
    });

    // create data channel
    let dataChannel = revCreateDataChannel(pc, peerId);

    pc.onicecandidate = event => {
      if (event.candidate) {
        revSendWebServerMessage({
          type: 'candidate',
          revCandidate: event.candidate,
          revRecipientId: peerId,
          revSenderId: revLoggedInEntityGUID,
        });
      }
    };

    pc.oniceconnectionstatechange = async event => {
      let revICEConnectionState = pc.iceConnectionState;

      if (revICEConnectionState === 'connected') {
        console.log('! ! ! Peer connection established');
      } else if (pc.iceConnectionState === 'failed') {
        console.log(deviceModel, '*** Connection failed, retrying...');
      } else if (revICEConnectionState == 'closed') {
      }
    };

    setRevPeerConnsData(revPrev => {
      let revNewConns = revPrev.filter(
        revCurr => revCurr && revCurr.peerId !== peerId,
      );

      return [...revNewConns, {peerId, pc, dataChannel}];
    });

    return {pc, dataChannel};
  };

  const sendMessage = async (revPeerId, message) => {
    setRevQuedMessages(prevState => {
      return [...prevState, {revPeerId, ...message}];
    });
  };

  const revCloseLocalStream = () => {
    setRevIsCaller(false);

    if (revLocalVideoStream) {
      // Stop the tracks in the local stream object
      revLocalVideoStream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });

      // Release the local stream object
      revLocalVideoStream.release();

      // Remove the local video feed
      setRevLocalVideoStream(null);
    }
  };

  const revCloseRemotelStream = () => {
    if (revRemoteVideoStreamsArr.length > 0) {
      revRemoteVideoStreamsArr.forEach(stream => {
        stream.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      });
      setRevRemoteVideoStreamsArr([]);
    }
  };

  const revAsyncFilter = async (arr, predicate) => {
    try {
      const results = await Promise.all(arr.map(predicate));
      return arr.filter((_v, index) => results[index]);
    } catch (error) {
      console.log('*** error -revAsyncFilter', error);
    }
  };

  const revEndVideoCall = async revPeerId => {};

  const revInitVideoCall = async ({revTargetPeerId}) => {
    setRevIsCaller(true);

    let revConnection = null;

    try {
      const {pc} = await revCreatePeerConnection(revTargetPeerId, {
        revIsVideoCall: true,
      });

      revConnection = pc;
    } catch (error) {
      console.log('*** error -revInitVideoCall', error);
    }

    if (!revConnection) {
      console.log('*** ERR revConnection empty', revTargetPeerId);
    }
  };

  // function to send answer message to remote peer
  const sendAnswer = (answer, revRecipientId) => {
    const answerMessage = {
      type: 'answer',
      answer: answer,
      revRecipientId,
      revSenderId: revLoggedInEntityGUID,
    };

    revSendWebServerMessage(answerMessage);
  };

  // function to handle incoming offer message from remote peer
  const handleOffer = async revVarArgs => {
    if (revIsEmptyJSONObject(revVarArgs)) {
      return;
    }

    const {revEntity = {}, offer = {}, revDataType = 'revData'} = revVarArgs;
    const {_revRemoteGUID = -1} = revEntity;

    if (_revRemoteGUID < 1) {
      return;
    }

    const revIsVideoCall = revDataType == 'revVideo';

    let revConnData = revGetConnData(_revRemoteGUID);

    let _isRevAnswerPending = false;

    if (revIsEmptyJSONObject(revConnData)) {
      const {pc} = await revCreatePeerConnection(_revRemoteGUID);
      revConn = pc;
    } else {
      let {pc, isRevAnswerPending = false} = revConnData;
      revConn = pc;
      _isRevAnswerPending = isRevAnswerPending;
    }

    if (_isRevAnswerPending) {
      return;
    }

    const revInitAnswer = async () => {
      try {
        await revConn.setRemoteDescription(offer);
        let answerDescription = await revConn.createAnswer();
        await revConn.setLocalDescription(answerDescription);

        setRevPeerConnsData(revPrev => {
          return revPrev.map(revCurr => {
            if (revCurr && revCurr.peerId == _revRemoteGUID) {
              sendAnswer(revConn.localDescription, _revRemoteGUID);
              revCurr['isRevAnswerPending'] = true;
            }

            return revCurr;
          });
        });
      } catch (error) {
        console.log(deviceModel, '*** handleOffer', error);
      }
    };

    if (revIsVideoCall) {
      revInitSiteModal(
        <RevIncomingCall
          revVarArgs={{
            revCancelCallBackFunc: async () => {
              await revEndVideoCall(_revRemoteGUID);
            },
            revAcceptCallBackFunc: async () => {
              await revInitAnswer();
            },
          }}
        />,
      );
    } else {
      await revInitAnswer();
    }
  };

  // function to handle incoming answer message from remote peer
  const handleAnswer = async revData => {
    if (!revData) {
      return;
    }

    const {answer = {}, revSenderId} = revData;

    if (revIsEmptyJSONObject(answer)) {
      return;
    }

    let revConnData = revGetConnData(revSenderId);
    const {peerId, pc} = revConnData;

    if (peerId == revSenderId) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (e) {
        if (e.name === 'InvalidStateError' && pc.signalingState === 'stable') {
          // The connection is not in the correct state to set a remote description
          // Wait for the next signaling state change event to try again
          await new Promise(resolve => {
            pc.addEventListener('signalingstatechange', resolve, {
              once: true,
            });
          });
          // Try setting the remote description again
          await pc.setRemoteDescription(answer);
        } else {
          // Handle other errors
          console.log('Error setting remote description:', e);
        }
      }
    }

    revConnData['pc'] = pc;
    revUpdateConnDataState(revConnData);
  };

  // function to handle incoming candidate message from remote peer
  const handleCandidate = async revData => {
    if (revIsEmptyJSONObject(revData)) {
      return;
    }

    const {revSenderId, revCandidate} = revData;

    let revConnData = revGetConnData(revSenderId);
    const {peerId, pc} = revConnData;

    if (peerId == revSenderId) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(revCandidate));
        revConnData['pc'] = pc;
      } catch (error) {
        console.log(deviceModel, '*** ERROR - handleCandidate', error);
      }
    }

    revUpdateConnDataState(revConnData);
  };

  const revCreateOffer = async (
    _revRemoteGUID,
    {revIsVideoCall = false} = {},
  ) => {
    let revOfferDescription;

    let revConnData = revGetConnData(_revRemoteGUID);

    if (revIsEmptyJSONObject(revConnData)) {
      return;
    }

    const {peerId, pc} = revConnData;

    if (peerId == _revRemoteGUID) {
      try {
        revOfferDescription = await pc.createOffer(sessionConstraints);
        await pc.setLocalDescription(revOfferDescription);

        let revOfferMsgData = {
          type: 'offer',
          revOfferDescription: pc.localDescription,
          revRecipientId: peerId,
          revSenderId: revLoggedInEntityGUID,
          revDataType: revIsVideoCall ? 'revVideo' : 'revData',
        };

        if (revIsVideoCall) {
          revOfferMsgData['revIsVideoCall'] = true;
        }

        revSendWebServerMessage(revOfferMsgData);

        revConnData = {...revConnData, ...{isRevOfferPending: true}};
      } catch (error) {
        console.log('*** ERROR -revCreateOffer', error);
      }
    }

    revUpdateConnDataState(revConnData);
  };

  // Function to send message chunks
  function revSendChunks(revDataChannel, revMessage) {
    const REV_CHUNK_SIZE = 64; // Set the chunk size as needed
    const revTotalChunks = Math.ceil(revMessage.length / REV_CHUNK_SIZE);
    let revChunkIndex = 0;

    function revSendNextChunk() {
      const revStart = revChunkIndex * REV_CHUNK_SIZE;
      const revEnd = Math.min(revStart + REV_CHUNK_SIZE, revMessage.length);
      const revChunk = revMessage.substring(revStart, revEnd);

      revDataChannel.send(revChunk);

      revChunkIndex++;

      if (revChunkIndex < revTotalChunks) {
        revSendNextChunk();
      } else {
        revDataChannel.send('EOF');
      }
    }

    // Start sending the chunks
    revSendNextChunk();
  }

  const revInitSendMsgs = async () => {
    let revQuedMessagesLen = revQuedMessages.length;

    if (revQuedMessagesLen < 1) {
      return;
    }

    let revNewMsgsQueArr = [];

    let revPeer;

    for (let i = 0; i < revQuedMessagesLen; i++) {
      if (revIsEmptyJSONObject(revQuedMessages[i])) {
        continue;
      }

      const {revPeerId} = revQuedMessages[i];

      revPeer = getPeerConnection(revPeerId);
      let revDataChannel = getDataChannel(revPeerId);

      try {
        if (!revPeer) {
          await revCreatePeerConnection(revPeerId);
        }
      } catch (error) {
        console.log('ERR await revCreatePeerConnection', error);
      }

      if (!revPeer) {
        revNewMsgsQueArr.push(revQuedMessages[i]);
        return;
      }

      try {
        if (revDataChannel && revDataChannel.readyState === 'open') {
          revSendChunks(
            revDataChannel,
            JSON.stringify(revQuedMessages[i].revMsg),
          );
          continue;
        }

        let revSendTryCount = revQuedMessages[i][revSendTryCount];
        revSendTryCount = revSendTryCount ? revSendTryCount : 0;
        revQuedMessages[i][revSendTryCount] = revSendTryCount + 1;

        revNewMsgsQueArr.push(revQuedMessages[i]);
      } catch (error) {
        console.log(deviceModel, '*** revInitSendMsgs', error);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    setRevQuedMessages(revNewMsgsQueArr);
  };

  const revVideoParticipantView = revRemoteVideoStream => {
    return (
      <View>
        {revRemoteVideoStream && (
          <View style={styles.revParticipantVideoContainer}>
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revRemoteVideoStream.toURL()}
              zOrder={0}
              style={styles.revParticipantVideoStyle}
            />
          </View>
        )}
      </View>
    );
  };

  let RevModalContent = ({revVideoStream}) => {
    if (!revVideoStream) {
      console.log('>>> Failed to laod remote data stream !');
      return;
    }

    let revPeerId = revVideoStream.id;

    return (
      <View style={styles.revModalVideoChatArea}>
        <View style={styles.revModalrevPeerVideoContainer}>
          {revVideoStream && (
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revVideoStream.toURL()}
              zOrder={0}
              style={styles.revRemoteVideoStyle}
            />
          )}
        </View>
        <View style={styles.revMyVideoStreamContainer}>
          {revLocalVideoStream && (
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revLocalVideoStream.toURL()}
              zOrder={0}
              style={styles.revVideoStyle}
            />
          )}
        </View>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revVideoAudiencetContainer,
          ]}>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revVideoParticipantsWrapper,
            ]}>
            {revLocalVideoStream &&
              revVideoParticipantView(revLocalVideoStream)}
            {revLocalVideoStream &&
              revVideoParticipantView(revLocalVideoStream)}
            {revLocalVideoStream &&
              revVideoParticipantView(revLocalVideoStream)}
          </View>
        </View>
        <View style={styles.revEndCallBtnWrapper}>
          <TouchableOpacity
            onPress={async () => await revEndVideoCall(revPeerId)}>
            <Text style={styles.revEndCallBtn}>
              <FontAwesome name="power-off" style={styles.revEndCallBtnIcon} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setRevWebServerOpen(false);
    revInitWebServer();
  }, []);

  useEffect(() => {
    if (!REV_LOGGED_IN_ENTITY) {
      console.log(deviceModel, 'NOT LOGGED IN');
      return;
    }

    const {_revRemoteGUID = -1} = REV_LOGGED_IN_ENTITY;

    if (_revRemoteGUID < 1) {
      return;
    }

    setRevLoggedInEntityGUID(_revRemoteGUID);
    console.log(deviceModel, 'LOGGED IN');
  }, [REV_LOGGED_IN_ENTITY]);

  useEffect(() => {
    if (revLoggedInEntityGUID < 1 || !REV_PORT || !REV_IP) {
      return;
    }

    revInitWebServer();
  }, [revLoggedInEntityGUID, REV_PORT, REV_IP]);

  useEffect(() => {
    if (!REV_WEB_SOCKET_SERVER) {
      return;
    }

    initSocket();
  }, [REV_WEB_SOCKET_SERVER]);

  useEffect(() => {
    if (revWebServerOpen) {
      revWSLogIn();
    } else {
      console.log(deviceModel, 'WebSocket is not open');
    }
  }, [revWebServerOpen]);

  useEffect(() => {
    for (let i = 0; i < revPeerConnsData.length; i++) {
      if (revIsEmptyJSONObject(revPeerConnsData[i])) {
        continue;
      }

      const {peerId, pc = {}} = [i];
      const {localDescription = {type: ''}} = pc;

      if (
        revIsEmptyJSONObject(localDescription) ||
        !localDescription.type ||
        localDescription.type !== 'offer'
      ) {
        revCreateOffer(peerId);
      }
    }
  }, [revPeerConnsData]);

  useEffect(() => {
    revInitSendMsgs();
  }, [revQuedMessages]);

  useEffect(() => {
    if (revRemoteVideoStreamsArr.length > 0) {
      revInitSiteModal(
        <RevModalContent revVideoStream={revRemoteVideoStreamsArr[0]} />,
      );
    }
  }, [revRemoteVideoStreamsArr]);

  useEffect(() => {
    if (revIsCaller && revLocalVideoStream) {
      revInitSiteModal(
        <RevDialingCall
          revVarArgs={{
            revLocalVideoStream: revLocalVideoStream,
            revCancelCallBackFunc: async () => {
              await revEndVideoCall(revLocalVideoStream.id);
            },
          }}
        />,
      );
    }
  }, [revLocalVideoStream]);

  useEffect(() => {
    handleOffer(revOffer);
  }, [revOffer]);

  useEffect(() => {
    handleAnswer(revAnswer);
  }, [revAnswer]);

  useEffect(() => {
    handleCandidate(revCandidate);
  }, [revCandidate]);

  // create context value with state variables and functions
  const contextValue = {
    revPeerConnsData,
    revCreatePeerConnection,
    sendMessage,
    revInitVideoCall,
    revEndVideoCall,
    revGetRandLoggedInGUIDs,
  };

  return (
    <RevWebRTCContext.Provider value={contextValue}>
      {children}
    </RevWebRTCContext.Provider>
  );
};

export {RevWebRTCContextProvider, RevWebRTCContext};

const styles = StyleSheet.create({
  revModalVideoChatArea: {
    flex: 1,
    alignItems: 'flex-start',
    width: '100%',
    position: 'relative',
    backgroundColor: '#444',
    borderRadius: 5,
  },
  revModalrevPeerVideoContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  revPeerVideoContainer: {
    backgroundColor: '#F7F7F7',
    height: '100%',
    overflow: 'hidden',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    alignSelf: 'stretch',
    position: 'relative',
  },
  revRemoteVideoStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  revVideoStyle: {
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  revMyVideoStreamContainer: {
    backgroundColor: '#FFF',
    width: 75,
    height: 105,
    borderColor: '#FFF',
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'absolute',
    left: 10,
    top: 10,
    borderRadius: 3,
  },
  revEndCallBtnWrapper: {
    backgroundColor: '#e57373',
    alignSelf: 'center',
    padding: 1,
    position: 'absolute',
    bottom: '5%',
    borderRadius: 100,
  },
  revEndCallBtn: {
    backgroundColor: '#ba000d',
    width: 'auto',
    padding: 15,
    borderRadius: 100,
  },
  revEndCallBtnIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
  /** START Collective call audience */
  revVideoAudiencetContainer: {
    position: 'absolute',
    bottom: '20%', // adjust as needed
    left: 0,
    right: 0,
  },
  revVideoParticipantsWrapper: {
    alignItems: 'center',
    marginLeft: 8,
  },
  revParticipantVideoContainer: {
    backgroundColor: '#CCC',
    width: 55,
    height: 105,
    borderColor: '#DDD',
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 4,
    borderRadius: 3,
  },
  revParticipantVideoStyle: {
    backgroundColor: '#CCC',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  /** END Collective call audience */
});

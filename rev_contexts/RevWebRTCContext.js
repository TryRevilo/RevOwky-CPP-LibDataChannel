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
      urls: 'turn:192.168.54.220:3478',
      username: 'rev',
      credential: '123',
      credentialType: 'password',
      realm: 'myrealm',
      credentialLifetime: 3600,
      maxRateKbps: 1000,
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
  const [connections, setConnections] = useState([]);
  const latestConnections = useRef(connections);

  const [revQuedMessages, setRevQuedMessages] = useState([]);
  const [revVideoCallAudienceArr, setRevVideoCallAudienceArr] = useState([]);

  const [revWebServerOpen, setRevWebServerOpen] = useState(true);

  const [revPeerOffer, setRevPeerOffer] = useState(null);
  const [revPeerAnswer, setRevPeerAnswer] = useState(null);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState(null);
  const [revLoggedInEntityGUID, setRevLoggedInEntityGUID] = useState(0);

  const {REV_PORT, REV_IP} = useContext(RevRemoteSocketContext);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const [revIsCaller, setRevIsCaller] = useState(false);
  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const [revRemoteVideoStreamsArr, setRevRemoteVideoStreamsArr] = useState([]);

  // function to initialize WebSocket and set up event listeners
  const initSocket = () => {
    REV_WEB_SOCKET_SERVER.onmessage = async event => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'rev_connection':
          // revHandleWebServerConnection();
          break;
        case 'login':
          handleLogin(message.success);
          break;
        case 'offer':
          setRevPeerOffer(message);
          break;
        case 'answer':
          setRevPeerAnswer(message);
          break;
        case 'candidate':
          await handleCandidate(message);
          break;
        case 'rev_rand_logged_in_conns':
          revHandleRandLoggedInConnGUIDs(message);
          break;
        default:
          console.warn(`Received unknown message: ${JSON.stringify(message)}`);
      }
    };
  };

  const revSendWebServerMessage = (message, revWS = REV_WEB_SOCKET_SERVER) => {
    //attach the other peer username to our messages
    if (!revWS || revWS.readyState !== WebSocket.OPEN) {
      return;
    }

    if (message && 'revEntityId' in message) {
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

  const revHandleWebServerConnection = ws => {
    let revMessage = {type: 'login', revEntityId: revLoggedInEntityGUID};
    revSendWebServerMessage(revMessage, ws);
  };

  const handleLogin = success => {
    if (success === false) {
      REV_WEB_SOCKET_SERVER(null);
      alert('Ooops...try a different username');
    } else {
      console.log(deviceModel, '+++ Logged In +++');
    }
  };

  const getDataChannel = peerId => {
    const connection = latestConnections.current.find(c => c.peerId === peerId);
    if (connection && connection.dataChannel) {
      return connection.dataChannel;
    }
    return null;
  };

  const getPeerConnection = peerId => {
    const connection = latestConnections.current.find(c => c.peerId === peerId);
    if (connection) {
      return connection.pc;
    }
    return null;
  };

  const createDataChannel = (pc, peerId, channelName) => {
    console.log(deviceModel, '>>> createDataChannel <<<');

    const dataChannel = pc.createDataChannel(channelName, {
      ordered: true,
      maxPacketLifeTime: 500,
      maxRetransmits: 10,
      protocol: 'udp',
      negotiated: true,
      id: 1,
    });

    // set up event listeners for data channel
    dataChannel.onopen = async () => {
      console.log(deviceModel, '! ! ! Data channel opened');

      try {
        await revInitSendMsgs();
      } catch (error) {
        console.log(deviceModel, '*** dataChannel.onopen', error);
      }

      console.log(deviceModel, '>>> ++ MSG SENT ++ <<<');
    };
    dataChannel.onclose = () => {
      console.log(deviceModel, 'Data channel closed');
    };
    dataChannel.onerror = error => {
      console.error(deviceModel, `Data channel error: ${error}`);
    };
    dataChannel.onmessage = event => {
      let revMsgdata = event.data;
      revMsgdata = JSON.parse(revMsgdata);

      console.log(
        deviceModel,
        '! ! ! Received msg:',
        JSON.stringify(revMsgdata),
      );

      if (revMsgdata.revMsgType == 0) {
        let revPeerId = revMsgdata.revPeerId;

        revEndVideoCall(revPeerId).then(() =>
          console.log(deviceModel, '>>> DC Closed ! ! !'),
        );
      }
    };

    dataChannel.onstatechange = function (event) {
      console.log(deviceModel, '--- DC state changed', dataChannel.readyState);
    };

    setConnections(prevState => {
      const updatedConnections = [...prevState];
      const index = updatedConnections.findIndex(c => c.peerId === peerId);
      if (index !== -1) {
        updatedConnections[index].dataChannel = dataChannel;
      }

      latestConnections.current = updatedConnections;
      return updatedConnections;
    });

    return dataChannel;
  };

  // function to create peer connection and add to state JSON object
  const createPeerConnection = async (
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

      setRevRemoteVideoStreamsArr([...revRemoteVideoStreamsArr, remoteStream]);
    };

    try {
      if (revIsVideoCall) {
        let revLocalMediaStream = await mediaDevices.getUserMedia(
          mediaConstraints,
        );
        revLocalMediaStream
          .getTracks()
          .forEach(track => pc.addTrack(track, revLocalMediaStream));

        setRevLocalVideoStream(revLocalMediaStream);
      }
    } catch (error) {
      console.log('>>> error -set local streeam', error);
    }

    let revLatestConns = [...connections, {peerId, pc}];
    latestConnections.current = revLatestConns;
    setConnections(revLatestConns);

    // create data channel
    let dataChannel = createDataChannel(pc, peerId, 'my_channel');

    pc.onicecandidate = event => {
      if (event.candidate) {
        revSendWebServerMessage({
          type: 'candidate',
          revCandidate: event.candidate,
          revEntityId: peerId,
          revCandidateEntityId: revLoggedInEntityGUID,
        });
      }
    };

    pc.oniceconnectionstatechange = async event => {
      let revICEConnectionState = pc.iceConnectionState;

      console.log(
        deviceModel,
        '--- revICEConnectionState',
        revICEConnectionState,
      );

      if (revICEConnectionState === 'connected') {
        console.log('! ! ! Peer connection established');
      } else if (pc.iceConnectionState === 'failed') {
        console.log(deviceModel, '*** Connection failed, retrying...');
        // await pc.close(); // close the previous PeerConnection object

        // createPeerConnection(peerId); // create a new PeerConnection object
      } else if (revICEConnectionState == 'closed') {
        await revEndVideoCall(peerId);
      }
    };

    return {pc, dataChannel};
  };

  const sendMessage = async (peerId, message) => {
    setRevQuedMessages(prevState => {
      const newData = [...prevState, {revPeerId: peerId, revMessage: message}];
      return newData;
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

  const revClosePeerConnections = async revPeerId => {
    let revNewUpdatedConns = [];

    for (let i = 0; i < connections.length; i++) {
      let revCurrConn = connections[i];

      const revCurrPeerId = revCurrConn.peerId;

      if (revCurrPeerId == revPeerId) {
        try {
          try {
            await revCurrConn.pc.close();
          } catch (error) {
            console.log('*** error -revClosePeerConnections', error);
          }
        } catch (error) {
          console.log('*** ERROR await revCurrConn.pc.close();', error);
        }

        continue;
      }

      revNewUpdatedConns.push(revCurrConn);
    }

    setConnections(revNewUpdatedConns);
    latestConnections.current = revNewUpdatedConns;
  };

  const revCloseDataChannels = async revPeerId => {
    const updatedConnections = [...connections];
    const index = updatedConnections.findIndex(c => c.peerId === revPeerId);

    let revCurrConnObj = updatedConnections[index];

    if (index !== -1) {
      if ('dataChannel' in revCurrConnObj && revCurrConnObj.dataChannel) {
        console.log(
          index,
          revPeerId,
          JSON.stringify(revCurrConnObj.dataChannel),
        );

        let revEndCallMsg = {revMsgType: 0, revPeerId: revPeerId};
        sendMessage(revPeerId, revEndCallMsg);

        await new Promise(resolve => setTimeout(resolve, 5000));

        let revDataChannel = revCurrConnObj.dataChannel;
        await revDataChannel.close();
        revDataChannel = null;

        delete revCurrConnObj['dataChannel'];
      }
    }

    latestConnections.current = updatedConnections;
    setConnections(updatedConnections);
  };

  const revEndVideoCall = async revPeerId => {
    revCloseLocalStream();
    revCloseRemotelStream();
    await revCloseDataChannels(revPeerId);
    await revClosePeerConnections(revPeerId);
    revCloseSiteModal();
  };

  const revInitVideoCall = async ({revTargetPeerId}) => {
    setRevIsCaller(true);

    let revConnection = null;

    try {
      const {pc} = await createPeerConnection(revTargetPeerId, {
        revIsVideoCall: true,
      });

      revConnection = pc;
    } catch (error) {
      console.log('*** error -revInitVideoCall -createPeerConnection', error);
    }

    if (!revConnection) {
      console.log(
        '*** ERR revConnection empty -revTargetPeerId',
        revTargetPeerId,
      );
    }

    try {
      if (revIsEmptyJSONObject(revConnection.localDescription)) {
        await revCreateOffer(revTargetPeerId, revConnection);
      }
    } catch (error) {
      console.log('*** ERR -revInitVideoCall', error);
    }
  };

  // function to send answer message to remote peer
  const sendAnswer = (answer, peerId) => {
    const answerMessage = {
      type: 'answer',
      answer: answer,
      revEntityId: peerId,
      revAnswerEntityId: revLoggedInEntityGUID,
    };

    revSendWebServerMessage(answerMessage);
  };

  // function to handle incoming offer message from remote peer
  const handleOffer = async revData => {
    if (!revData) {
      return;
    }

    let peerId = revData.revEntityId;
    let offer = revData.offer;

    const revIsVideoCall = offer.sdp.includes('m=video');

    if (revIsVideoCall) {
      revInitSiteModal(
        <RevIncomingCall
          revVarArgs={{
            revLocalVideoStream: revLocalVideoStream,
            revCancelCallBackFunc: async () => {
              await revEndVideoCall(peerId);
            },
            revAcceptCallBackFunc: async () => {
              try {
                const {pc} = await createPeerConnection(peerId, {
                  revIsVideoCall: revIsVideoCall,
                });

                if (!pc) {
                  return;
                }

                await pc.setRemoteDescription(offer);
                // Create an answer to a remote offer
                const answerDescription = await pc.createAnswer();
                await pc.setLocalDescription(answerDescription);
                sendAnswer(pc.localDescription, peerId);
              } catch (error) {
                console.log(deviceModel, '*** handleOffer', error);
              }
            },
          }}
        />,
      );
    }
  };

  // function to handle incoming answer message from remote peer
  const handleAnswer = async revData => {
    if (!revData) {
      return;
    }

    const {revEntityId, answer} = revData;

    let pc = getPeerConnection(revEntityId);

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      if (e.name === 'InvalidStateError' && pc.signalingState === 'stable') {
        // The connection is not in the correct state to set a remote description
        // Wait for the next signaling state change event to try again
        await new Promise(resolve => {
          pc.addEventListener('signalingstatechange', resolve, {once: true});
        });
        // Try setting the remote description again
        await pc.setRemoteDescription(answer);
      } else {
        // Handle other errors
        console.log('Error setting remote description:', e);
      }
    }
  };

  // function to handle incoming candidate message from remote peer
  const handleCandidate = async revData => {
    let revEntityId = revData.revEntityId;
    let candidate = revData.revCandidate;

    const pc = getPeerConnection(revEntityId);

    if (!pc || pc.remoteDescription == null) {
      return;
    }

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.log(deviceModel, '*** error - handleCandidate', error);
    }
  };

  const revCreateOffer = async (peerId, pc) => {
    if (!pc) {
      return;
    }

    let revOfferDescription;

    try {
      revOfferDescription = await pc.createOffer(sessionConstraints);
    } catch (error) {
      console.log('>>> pc', JSON.stringify(pc));
      console.log(deviceModel, '*** revOfferDescription', error);
    }
    try {
      await pc.setLocalDescription(revOfferDescription);

      let revOfferMsgData = {
        type: 'offer',
        revOfferDescription: pc.localDescription,
        revEntityId: peerId,
        revOffererEntityId: revLoggedInEntityGUID,
      };

      revSendWebServerMessage(revOfferMsgData);
    } catch (error) {
      console.log(deviceModel, '*** ERROR -Offer', error);
    }
  };

  const revInitSendMsgs = async () => {
    let revQuedMessagesLen = revQuedMessages.length;

    if (
      revQuedMessagesLen < 1 ||
      (revQuedMessagesLen == 1 && revIsEmptyJSONObject(revQuedMessages[0]))
    ) {
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
          const {pc, dataChannel} = await createPeerConnection(revPeerId);

          revPeer = pc;
          revDataChannel = dataChannel;
        }
      } catch (error) {
        console.log('ERR await createPeerConnection', error);
      }

      if (!revPeer) {
        return;
      }

      try {
        if (revIsEmptyJSONObject(revPeer.localDescription)) {
          await revCreateOffer(revPeerId, revPeer);
        }

        if (revDataChannel && revDataChannel.readyState === 'open') {
          revDataChannel.send(JSON.stringify(revQuedMessages[i].revMessage));
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
              style={styles.revVideoStyle}
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
    if (
      !REV_LOGGED_IN_ENTITY ||
      REV_LOGGED_IN_ENTITY._remoteRevEntityGUID < 1
    ) {
      console.log(deviceModel, 'NOT LOGGED IN');
      return;
    }

    setRevLoggedInEntityGUID(REV_LOGGED_IN_ENTITY._remoteRevEntityGUID);
    console.log(deviceModel, 'LOGGED IN');
  }, [REV_LOGGED_IN_ENTITY]);

  useEffect(() => {
    if (revLoggedInEntityGUID < 1 || !REV_PORT || !REV_IP) {
      return;
    }

    const ws = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);

    ws.addEventListener('open', event => {
      // You can now start sending messages to the server
      revHandleWebServerConnection(ws);

      setRevWebServerOpen(true);
    });

    SET_REV_WEB_SOCKET_SERVER(ws);
  }, [revLoggedInEntityGUID, REV_PORT, REV_IP]);

  useEffect(() => {
    if (!REV_WEB_SOCKET_SERVER) {
      return;
    }

    if (revWebServerOpen) {
      initSocket();
    } else {
      console.log(deviceModel, 'WebSocket is not open');
    }
  }, [REV_WEB_SOCKET_SERVER, revWebServerOpen]);

  useEffect(() => {
    revInitSendMsgs();
  }, [revQuedMessages]);

  useEffect(() => {
    handleAnswer(revPeerAnswer);
  }, [revPeerAnswer]);

  useEffect(() => {
    handleOffer(revPeerOffer);
  }, [revPeerOffer]);

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

  // create context value with state variables and functions
  const contextValue = {
    connections,
    createPeerConnection,
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
    position: 'relative',
    backgroundColor: '#444',
  },
  revModalrevPeerVideoContainer: {
    flex: 1,
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

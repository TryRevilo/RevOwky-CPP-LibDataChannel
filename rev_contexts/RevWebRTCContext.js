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

import {useRevSiteStyles} from '../components/rev_views/RevSiteStyles';

const rev_settings = require('../rev_res/rev_settings.json');

// create the context
var RevWebRTCContext = createContext();

const revPeerConnConfig = {
  iceServers: [
    // {
    //   urls: ['stun:stun.l.google.com:19302'],
    // },
    {
      urls: `turn:${rev_settings.revIP}:${rev_settings.revTurnServerPort}`,
      username: 'rev',
      credential: '123',
    },
  ],
};

var revChanOptions = {
  id: 1,
  ordered: true,
  maxPacketLifeTime: 5000, // 5 seconds
  // maxRetransmits: 3,
  protocol: 'udp',
};

var mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
};

var RevWebRTCContextProvider = ({children}) => {
  const {revSiteStyles} = useRevSiteStyles();
  const deviceModel = DeviceInfo.getModel();

  const {revInitSiteModal, revCloseSiteModal} = useContext(ReViewsContext);

  // initialize state variable
  const revPeerConnsDataRef = useRef([]);
  const revPeerConnsCallBacksRef = useRef({});

  const [revQuedMessages, setRevQuedMessages] = useState([]);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState(null);
  const [revLoggedInEntityGUID, setRevLoggedInEntityGUID] = useState(0);

  const {REV_PORT, REV_IP} = useContext(RevRemoteSocketContext);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const [revIsCaller, setRevIsCaller] = useState(false);
  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const [revRemoteVideoStreamsArr, setRevRemoteVideoStreamsArr] = useState([]);

  const revRestartingPeerIdsArr = useRef([]);

  var revInitPeerConn = async revVarArgs => {
    const {revEntity = {}} = revVarArgs;
    const {_revRemoteGUID = -1} = revEntity;

    if (_revRemoteGUID < 1) {
      return;
    }

    let revPassVarArgs = {};

    /** START CONN SUCCESS */
    let revOnConnSuccess = null;

    if (revVarArgs.revOnConnSuccess) {
      revOnConnSuccess = revVarArgs.revOnConnSuccess;
    }

    revPassVarArgs['revOnConnSuccess'] = revOnConnSuccess;
    /** END CONN SUCCESS */

    /** START CONN FAIL */
    let revOnConnFail = null;

    if (revVarArgs.revOnConnFail) {
      revOnConnFail = revVarArgs.revOnConnFail;
    }

    revPassVarArgs['revOnConnFail'] = revOnConnFail;
    /** END CONN FAIL */

    /** START message sent */
    let revOnMessageSent = null;

    if (revVarArgs.revOnMessageSent) {
      revOnMessageSent = revVarArgs.revOnMessageSent;
    }

    revPassVarArgs['revOnMessageSent'] = revOnMessageSent;
    /** END message sent */

    /** START message received */
    let revOnMessageReceived = null;

    if (revVarArgs.revOnMessageReceived) {
      revOnMessageReceived = revVarArgs.revOnMessageReceived;
    }

    revPassVarArgs['revOnMessageReceived'] = revOnMessageReceived;
    /** END message received */

    revPeerConnsCallBacksRef.current[_revRemoteGUID] = revPassVarArgs;

    await revCreatePeerConn(revEntity, {
      isRevCaller: true,
      revDataType: '',
      revCallBacks: revPassVarArgs,
    });
  };

  var revOKGo = async revVarArgs => {
    const {revEntity = {}, revDataType = '', isRevCaller = false} = revVarArgs;
    const {_revRemoteGUID = -1} = revEntity;

    if (_revRemoteGUID < 1) {
      return;
    }

    await revCreatePeerConn(revEntity, {
      isRevCaller,
      revDataType,
    });
  };

  var revWSLogIn = () => {
    let revMessage = {type: 'login', revEntity: REV_LOGGED_IN_ENTITY};
    revSendWebServerMessage(revMessage);
  };

  var revInitWebServer = () => {
    const ws = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);
    SET_REV_WEB_SOCKET_SERVER(ws);
  };

  // function to initialize WebSocket and set up event listeners
  var initSocket = () => {
    REV_WEB_SOCKET_SERVER.onmessage = async event => {
      const revData = JSON.parse(event.data);

      const {type: revMsgType} = revData;

      console.log('>>> revMsgType', revMsgType);

      switch (revMsgType) {
        case 'connection':
          console.log('connected : ' + JSON.stringify(revData.success));
          break;
        case 'login':
          handleLogin(revData);
          break;
        case 'offer':
          handleOffer(revData);
          break;
        case 'answer':
          handleAnswer(revData);
          break;
        case 'candidate':
          handleCandidate(revData);
          break;
        case 'rev_init_close_peer_conn':
          revHandleInitClosePeerConn(revData);
          break;
        case 'rev_peer_close_complete':
          revHandlePeerClosed(revData);
          break;
        case 'rev_rand_logged_in_conns':
          revHandleRandLoggedInConnGUIDs(revData);
          break;
        case 'revConnEntity':
          revOKGo({...revData, isRevCaller: true});
          break;
        case 'rev_unavailable':
          revHandlePeerUnavailable(revData);
          break;
        case 'leave':
          handleLeave(revData);
          break;
        case 'rev_unavailable':
          console.log('ERR - rev_unavailable', JSON.stringify(revData));
          break;
        default:
          console.warn(`Received unknown message: ${JSON.stringify(revData)}`);
      }
    };

    revWSLogIn();
  };

  var revSendWebServerMessage = (message, revWS = null) => {
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

  var revGetRandLoggedInGUIDs = revLoggedInEntityGUID => {
    if (revLoggedInEntityGUID < 1) {
      return;
    }

    let revMessage = {
      type: 'rev_get_rand_connected_users',
      revEntityId: revLoggedInEntityGUID,
    };
    revSendWebServerMessage(revMessage);
  };

  var handleLogin = revData => {
    const {success = false, revError} = revData;

    if (success === false) {
      REV_WEB_SOCKET_SERVER(null);
    }

    console.log(deviceModel, '+++ Logged In : revError', revError);
  };

  var revUpdateConnDataState = revNewData => {
    if (revIsEmptyJSONObject(revNewData)) {
      return;
    }

    const {revPeerId = -1} = revNewData;

    if (revPeerId < 1) {
      return;
    }

    revPeerConnsDataRef.current = revPeerConnsDataRef.current.map(revCurr => {
      const {revPeerId: revCurrrevPeerId = -1} = revCurr;

      if (revPeerId == revCurrrevPeerId) {
        revCurr = revNewData;
      }

      return revCurr;
    });
  };

  var revUpdateConnDataItemState = (revPeerId, revKey, revNewData) => {
    if (revPeerId < 1) {
      return;
    }

    revPeerConnsDataRef.current = revPeerConnsDataRef.current.map(revCurr => {
      if (revCurr && revCurr.revPeerId == revPeerId) {
        revCurr[revKey] = revNewData;
      }

      return revCurr;
    });
  };

  var revGetConnData = revPeerId => {
    if (revPeerId < 1) {
      return null;
    }

    return revPeerConnsDataRef.current.find(
      c => c && c.revPeerId === revPeerId,
    );
  };

  var getDataChannel = revPeerId => {
    const connection = revGetConnData(revPeerId);

    if (connection && connection.dataChannel) {
      return connection.dataChannel;
    }

    return null;
  };

  var getPeerConnection = revPeerId => {
    if (revPeerId < 1) {
      return null;
    }

    const connection = revGetConnData(revPeerId);
    if (!revIsEmptyJSONObject(connection)) {
      const {revPeerConn = null} = connection;
      return revPeerConn;
    }
    return null;
  };

  var revDelConnData = _revRemoteGUID => {
    revPeerConnsDataRef.current = revPeerConnsDataRef.current.filter(
      revCurr => {
        if (revIsEmptyJSONObject(revCurr)) {
          return false;
        }

        const {revPeerId} = revCurr;
        return revPeerId !== _revRemoteGUID;
      },
    );
  };

  var revInitClosePeerConn = revPeerId => {
    if (revPeerId < 1) {
      return;
    }

    revRestartingPeerIdsArr.current.push(revPeerId);

    let revMessage = {
      type: 'rev_init_close_peer_conn',
      revRecipientId: revPeerId,
      revSenderId: revLoggedInEntityGUID,
    };

    revSendWebServerMessage(revMessage);
  };

  var revPeerCloseComplete = revPeerId => {
    if (revPeerId < 1) {
      return;
    }

    let revMessage = {
      type: 'rev_peer_close_complete',
      revRecipientId: revPeerId,
      revSenderId: revLoggedInEntityGUID,
    };

    revSendWebServerMessage(revMessage);
  };

  var revRecconnectPeer = revPeerId => {
    if (revPeerId < 1) {
      return;
    }

    revRestartingPeerIdsArr.current.push(revPeerId);

    let revMessage = {
      type: 'rev_reconnect',
      revRecipientId: revPeerId,
      revEntity: REV_LOGGED_IN_ENTITY,
    };

    revSendWebServerMessage(revMessage);
  };

  var revRestartPeerConn = async revPeerId => {
    if (revPeerId < 1) {
      return;
    }

    await revCloseConn(revPeerId);
    revRecconnectPeer(revPeerId);
  };

  var revConnRestartComplete = revPeerId => {
    if (revPeerId < 1) {
      return;
    }

    revRestartingPeerIdsArr.current = revRestartingPeerIdsArr.current.filter(
      revCurr => revCurr !== revPeerId,
    );
  };

  var revCloseConn = async (_revRemoteGUID, isRevPeerClosed = false) => {
    if (_revRemoteGUID < 1) {
      return;
    }

    revConnRestartComplete(_revRemoteGUID);

    return new Promise((resolve, reject) => {
      const revOnConnCloseCallBack = () => {
        const revExitInterval = revIntervalId => {
          revDelConnData(_revRemoteGUID);
          clearInterval(revIntervalId);

          const revFinIntval = () => {
            if (!revRestartingPeerIdsArr.current.includes(_revRemoteGUID)) {
              revConnRestartComplete(_revRemoteGUID);
              revPeerCloseComplete(_revRemoteGUID);

              clearInterval(revFinIntvalId);
              resolve();
            }
          };

          const revFinIntvalId = setInterval(revFinIntval, 1000);
        };

        let revDataChannel = getDataChannel(_revRemoteGUID);

        if (revDataChannel) {
          revDataChannel.close();
        }

        let revPeerConn = getPeerConnection(_revRemoteGUID);

        if (revPeerConn == null) {
          revConnRestartComplete(_revRemoteGUID);
          return revExitInterval(revIntervalId);
        }

        revPeerConn.close();
        revPeerConn.onicecandidate = null;
        revPeerConn.onaddstream = null;

        const {connectionState} = revPeerConn;

        if (connectionState == 'closed' || connectionState == 'disconnected') {
          if (!isRevPeerClosed) {
            revInitClosePeerConn(_revRemoteGUID);
          }

          return revExitInterval(revIntervalId);
        }
      };

      const revIntervalId = setInterval(revOnConnCloseCallBack, 1000);
    });
  };

  var revHandleInitClosePeerConn = async revVarArgs => {
    const {revSenderId} = revVarArgs;

    if (revSenderId < 1) {
      return;
    }

    await revCloseConn(revSenderId, true);
  };

  var revHandlePeerUnavailable = async revVarArgs => {
    const {revSenderId, revRecipientId} = revVarArgs;
    await revCloseConn(revRecipientId, true);
  };

  var revHandlePeerClosed = revVarArgs => {
    const {revSenderId} = revVarArgs;
    revConnRestartComplete(revSenderId);
  };

  const revCreateDataChannel = revPeerConn => {
    const revDataChannel = revPeerConn.createDataChannel('rev_data_channel');

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

  var revInitOffer = async (
    _revRemoteGUID,
    {revIsVideoCall = false, revOfferOptions = {}} = {},
  ) => {
    let revConnData = revGetConnData(_revRemoteGUID);

    if (_revRemoteGUID < 1 || revIsEmptyJSONObject(revConnData)) {
      return;
    }

    const {revPeerConn} = revConnData;

    let revSessionConstraints = {
      offerToReceiveAudio: revIsVideoCall,
      offerToReceiveVideo: revIsVideoCall,
      voiceActivityDetection: revIsVideoCall,
    };

    try {
      let revOfferDesc = await revPeerConn.createOffer(revSessionConstraints);
      await revPeerConn.setLocalDescription(revOfferDesc);

      revConnData['revPeerConn'] = revPeerConn;

      revUpdateConnDataState(revConnData);

      let revOfferMsgData = {
        type: 'offer',
        revOfferDescription: revOfferDesc,
        revRecipientId: _revRemoteGUID,
        revSenderId: revLoggedInEntityGUID,
        revDataType: revIsVideoCall ? 'revVideo' : 'revData',
      };

      if (revIsVideoCall) {
        revOfferMsgData['revIsVideoCall'] = true;
      }

      revSendWebServerMessage(revOfferMsgData);
    } catch (error) {
      console.log('*** ERROR -revInitOffer', error);
    }
  };

  // function to create peer connection and add to state JSON object
  const revCreatePeerConn = async (revEntity, revVarArgs = {}) => {
    const {_revRemoteGUID: revPeerId = -1} = revEntity;

    if (revPeerId < 1) {
      return;
    }

    const {
      isRevCaller = false,
      revIsVideoCall = false,
      revCallBacks = {},
    } = revVarArgs;

    let _revCallBacks = revCallBacks;

    if (revPeerConnsCallBacksRef.current.hasOwnProperty(revPeerId)) {
      let revPassVarArgs = revPeerConnsCallBacksRef.current[revPeerId];
      _revCallBacks = {...revCallBacks, ...revPassVarArgs};
    }

    const {revOnConnSuccess, revOnConnFail, revOnMessageReceived} =
      _revCallBacks;

    let revConnData = revGetConnData(revPeerId);

    if (revConnData) {
      const {revPeerConn = {}} = revConnData;
      const {connectionState} = revPeerConn;

      if (connectionState == 'connected') {
        return revConnData;
      } else {
        await revCloseConn(revPeerId);
      }
    }

    revRestartingPeerIdsArr.current = revRestartingPeerIdsArr.current.filter(
      revCurr => revCurr !== revPeerId,
    );

    revPeerConn = new RTCPeerConnection(revPeerConnConfig);

    // Remote side: Receive and process incoming tracks
    revPeerConn.ontrack = function (event) {
      const remoteStream = event.streams[0];
      remoteStream.id = revPeerId;

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
          .forEach(track => revPeerConn.addTrack(track, revLocalMediaStream));

        setRevLocalVideoStream(revLocalMediaStream);
      } catch (error) {
        console.log('>>> error -set local streeam', error);
      }
    }

    // Accumulate incoming chunks
    let receivedChunks = [];

    revPeerConn.addEventListener('datachannel', event => {
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

            if (revPeerConnsCallBacksRef.current.hasOwnProperty(revPeerId)) {
              let revCallBacks = revPeerConnsCallBacksRef.current[revPeerId];
              const {revOnMessageReceived} = revCallBacks;

              if (revOnMessageReceived) {
                revOnMessageReceived({_revPublisherEntity: revEntity, revMsg});
              }
            }
          } catch (error) {
            console.log('>>> ERROR - revDataChannel.onmessage', error);
          }

          // Clear the receivedChunks array for the next msg
          receivedChunks = [];
        } else {
          // Regular data chunk, accumulate it
          receivedChunks.push(revChunkDataStr);
        }
      });
    });

    // create data channel
    let dataChannel = revCreateDataChannel(revPeerConn);

    revPeerConn.oniceconnectionstatechange = async () => {
      const {iceConnectionState: revICEConnState} = revPeerConn;

      console.log('>>> ', deviceModel, 'revICEConnState :', revICEConnState);

      switch (revICEConnState) {
        case 'connected':
          revConnRestartComplete(revPeerId);

          revSendWebServerMessage({
            type: 'rev_connected_success',
            revRecipientId: revPeerId,
            revSenderId: revLoggedInEntityGUID,
          });

          if (revOnConnSuccess) {
            revOnConnSuccess();
          }
          break;

        case 'disconnected':
        case 'failed':
          if (revOnConnFail) {
            revOnConnFail(revICEConnState);
          }
          break;

        case 'closed':
          break;

        default:
          break;
      }
    };

    revPeerConn.onicecandidate = event => {
      if (revRestartingPeerIdsArr.current.includes(revPeerId)) {
        return;
      }

      if (event.candidate) {
        revSendWebServerMessage({
          type: 'candidate',
          revCandidate: event.candidate,
          revRecipientId: revPeerId,
          revSenderId: revLoggedInEntityGUID,
        });
      }
    };

    let revNewConns = revPeerConnsDataRef.current.filter(
      revCurr => revCurr && revCurr.revPeerId !== revPeerId,
    );

    revPeerConnsDataRef.current = [
      ...revNewConns,
      {revPeerId, revPeerConn, dataChannel, revRemoteCandidatesArr: []},
    ];

    if (isRevCaller) {
      await revInitOffer(revPeerId);
    }

    return {revPeerConn, dataChannel};
  };

  const sendMessage = async (revPeerId, message) => {
    if (revPeerId < 1) {
      return;
    }

    setRevQuedMessages(prevState => {
      return [...prevState, {revPeerId, ...message}];
    });
  };

  const revAsyncFilter = async (arr, predicate) => {
    try {
      const results = await Promise.all(arr.map(predicate));
      return arr.filter((_v, index) => results[index]);
    } catch (error) {
      console.log('*** error -revAsyncFilter', error);
    }
  };

  const revInitVideoCall = async ({revTargetrevPeerId}) => {};

  const revEndVideoCall = async revPeerId => {};

  // function to handle incoming offer message from remote peer
  var handleOffer = async revVarArgs => {
    if (revIsEmptyJSONObject(revVarArgs)) {
      return;
    }

    const {revEntity = {}, offer = {}, revDataType = 'revData'} = revVarArgs;
    const {_revRemoteGUID = -1} = revEntity;

    if (_revRemoteGUID < 1) {
      return;
    }

    const revIsVideoCall = revDataType == 'revVideo';

    let revPeerConn = getPeerConnection(_revRemoteGUID);

    try {
      if (revPeerConn) {
        await revRestartPeerConn(_revRemoteGUID);
        return;
      }

      ({revPeerConn} = await revCreatePeerConn(revEntity, {
        revIsVideoCall,
      }));

      let revRemDesc = new RTCSessionDescription(offer);
      await revPeerConn.setRemoteDescription(revRemDesc);

      let revAnswerDesc = await revPeerConn.createAnswer();
      await revPeerConn.setLocalDescription(revAnswerDesc);

      revUpdateConnDataItemState(_revRemoteGUID, 'revPeerConn', revPeerConn);

      await revProcessCandidates(_revRemoteGUID);

      // Send the answer to the remote peer via WebSocket
      const answerMessage = {
        type: 'answer',
        answer: revAnswerDesc,
        revRecipientId: _revRemoteGUID,
        revSenderId: revLoggedInEntityGUID,
      };

      revSendWebServerMessage(answerMessage);
      console.log('>>> INIT - answer . . .');
    } catch (error) {
      console.log(deviceModel, '*** ERROR - handleOffer', error);
    }
  };

  // function to handle incoming answer message from remote peer
  var handleAnswer = async revData => {
    if (!revData) {
      return;
    }

    const {answer = {}, revSenderId} = revData;

    if (revSenderId < 1 || revIsEmptyJSONObject(answer)) {
      return;
    }

    let revConnData = revGetConnData(revSenderId);

    if (revIsEmptyJSONObject(revConnData)) {
      return;
    }

    const {revPeerConn} = revConnData;

    let revRemDesc = new RTCSessionDescription(answer);

    try {
      await revPeerConn.setRemoteDescription(revRemDesc);
      console.log('>>> INIT - answer . . .');

      revConnData['revPeerConn'] = revPeerConn;
      revUpdateConnDataState(revConnData);
    } catch (e) {
      console.log('*** ERROR - handleAnswer', e);
    }
  };

  var isRevConnectionReady = revPeerConn => {
    // Check if both local and remote descriptions are set
    return (
      revPeerConn.localDescription !== null &&
      revPeerConn.remoteDescription !== null
    );
  };

  var revProcessCandidates = async revPeerId => {
    let revConnData = revGetConnData(revPeerId);

    if (revIsEmptyJSONObject(revConnData)) {
      return;
    }

    const {revPeerConn, revRemoteCandidatesArr = []} = revConnData;

    if (revRemoteCandidatesArr.length < 1) {
      return;
    }

    for (const candidate of revRemoteCandidatesArr) {
      await revPeerConn.addIceCandidate(candidate);
    }

    revConnData['revPeerConn'] = revPeerConn;
    revConnData['revRemoteCandidatesArr'] = [];
    revUpdateConnDataState(revConnData);
  };

  // function to handle incoming candidate message from remote peer
  var handleCandidate = async (revData = {}) => {
    const {revSenderId, revCandidate} = revData;
    let revConnData = revGetConnData(revSenderId);

    if (revSenderId < 1 || revIsEmptyJSONObject(revConnData)) {
      return;
    }

    const {revPeerConn, revRemoteCandidatesArr = []} = revConnData;
    let revConnectionReady = isRevConnectionReady(revPeerConn);

    let revRTCCand = new RTCIceCandidate(revCandidate);

    if (
      revRestartingPeerIdsArr.current.includes(revSenderId) ||
      !revConnectionReady
    ) {
      revRemoteCandidatesArr.push(revRTCCand);
      revConnData['revRemoteCandidatesArr'] = revRemoteCandidatesArr;
    } else {
      try {
        await revPeerConn.addIceCandidate(revRTCCand);
        revConnData['revPeerConn'] = revPeerConn;
      } catch (error) {
        console.log(deviceModel, '*** ERROR - handleCandidate', error);
      }
    }

    revUpdateConnDataState(revConnData);
  };

  var handleLeave = async revVarArgs => {
    const {revPeerId = -1} = revVarArgs;

    if (revPeerId < 1) {
      return;
    }

    await revCloseConn(revPeerId, true);
    console.log('>>> LEAVE - success . . .');
  };

  var revHandleRandLoggedInConnGUIDs = () => {};

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

  var revInitSendMsgs = async () => {
    let revQuedMessagesLen = revQuedMessages.length;

    if (revQuedMessagesLen < 1) {
      return;
    }

    let revNewMsgsQueArr = [];

    for (let i = 0; i < revQuedMessagesLen; i++) {
      if (revIsEmptyJSONObject(revQuedMessages[i])) {
        continue;
      }

      const {revPeerId} = revQuedMessages[i];
      let revConnData = revGetConnData(revPeerId);

      if (revIsEmptyJSONObject(revConnData)) {
        continue;
      }

      const {revPeerConn, dataChannel: revDataChannel} = revConnData;

      if (!revPeerConn) {
        revNewMsgsQueArr.push(revQuedMessages[i]);
        return;
      }

      try {
        if (revDataChannel && revDataChannel.readyState === 'open') {
          revSendChunks(
            revDataChannel,
            JSON.stringify(revQuedMessages[i].revMsg),
          );

          if (revPeerConnsCallBacksRef.current.hasOwnProperty(revPeerId)) {
            const {revOnMessageSent} =
              revPeerConnsCallBacksRef.current[revPeerId];

            if (revOnMessageSent) {
              revOnMessageSent(revQuedMessages[i].revMsg);
            }
          }

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

  var revVideoParticipantView = revRemoteVideoStream => {
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
    if (!REV_LOGGED_IN_ENTITY) {
      return;
    }

    const {_revRemoteGUID = -1} = REV_LOGGED_IN_ENTITY;

    if (_revRemoteGUID < 1) {
      return;
    }

    setRevLoggedInEntityGUID(_revRemoteGUID);
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

    REV_WEB_SOCKET_SERVER.addEventListener('open', event => {
      initSocket();
    });
  }, [REV_WEB_SOCKET_SERVER]);

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

  // create context value with state variables and functions
  const contextValue = {
    revPeerConnsData: revPeerConnsDataRef.current,
    revInitPeerConn,
    sendMessage,
    revInitVideoCall,
    revEndVideoCall,
    revGetRandLoggedInGUIDs,
    revRecconnectPeer,
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

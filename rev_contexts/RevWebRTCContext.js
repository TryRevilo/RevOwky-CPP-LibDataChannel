import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import {} from 'react-native';

import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';

import {KeepAwake} from 'react-native-keep-awake';

import {RevSiteDataContext} from './RevSiteDataContext';
import {RevRemoteSocketContext} from './RevRemoteSocketContext';

import {
  revIsEmptyJSONObject,
  revPingServer,
  revSetStateData,
  revTimeoutAsync,
} from '../rev_function_libs/rev_gen_helper_functions';

import DeviceInfo from 'react-native-device-info';

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

var revMediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
};

var RevWebRTCContextProvider = ({children}) => {
  const {REV_PORT, REV_IP, isRevSocketServerUp} = useContext(
    RevRemoteSocketContext,
  );
  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const deviceModel = DeviceInfo.getModel();

  const [revActivePeerIdsArr, setRevActivePeerIdsArr] = useState([]);
  const [revActiveVideoPeerIdsArr, setRevActiveVideoPeerIdsArr] = useState([]);

  const revPeerConnsDataRef = useRef({});
  const revPeerConnsObjRef = useRef({});
  const revPeerConnsCallBacksRef = useRef({});

  const revIsSendingQueRef = useRef(false);

  const revPeerMessagesArrRef = useRef({});
  const revQuedMessagesRef = useRef([]);
  const revSendMessagesFailArrRef = useRef([]);
  const revNewMessagesArrRef = useRef([]);

  const isRevVideoCallViewMaxRef = useRef(false);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState(null);
  const [revLoggedInEntityGUID, setRevLoggedInEntityGUID] = useState(0);

  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const [revRemoteVideoStreamsObj, setRevRemoteVideoStreamsObj] = useState({});

  const revOnAddLocalStreamRef = useRef(null);
  const revOnAddRemoteStreamRef = useRef(null);

  const revRestartingPeerIdsArr = useRef([]);

  const revOnVideoChatMessageReceivedRef = useRef(null);
  const revOnVideoChatMessageSentRef = useRef(null);

  var revInitPeerConn = async revVarArgs => {
    const {revEntity = {}} = revVarArgs;
    const {_revRemoteGUID: revPeerId = -1} = revEntity;

    if (revPeerId < 1) {
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

    /** START message received */
    let revOnRemoteVideoStreamAdded = null;

    if (revVarArgs.revOnRemoteVideoStreamAdded) {
      revOnRemoteVideoStreamAdded = revVarArgs.revOnRemoteVideoStreamAdded;
    }

    revPassVarArgs['revOnRemoteVideoStreamAdded'] = revOnRemoteVideoStreamAdded;
    /** END message received */

    revPeerConnsCallBacksRef.current[revPeerId] = revPassVarArgs;

    await revCreatePeerConn(revEntity, {
      isRevCaller: true,
      revDataType: '',
      revCallBacks: revPassVarArgs,
    });
  };

  var revOKGo = async revVarArgs => {
    const {revEntity = {}, revDataType = '', isRevCaller = false} = revVarArgs;
    const {revPeerId = -1} = revEntity;

    if (revPeerId < 1) {
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
    const revNewWS = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);
    SET_REV_WEB_SOCKET_SERVER(revNewWS);
  };

  // function to initialize WebSocket and set up event listeners
  var initSocket = () => {
    REV_WEB_SOCKET_SERVER.onmessage = async event => {
      const revData = JSON.parse(event.data);

      const {type: revMsgType} = revData;

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

  var revPushPeerIdsArr = revPeerId => {
    setRevActivePeerIdsArr(revPrev => {
      let revNewPeerIds = [...revPrev];

      if (!revNewPeerIds.includes(revPeerId)) {
        revNewPeerIds.push(revPeerId);
      }

      return revNewPeerIds;
    });
  };

  var revPushVideoCallPeerId = revPeerId => {
    new Promise(resolve => {
      let revNewPeerIds = [...revActiveVideoPeerIdsArr];

      if (!revNewPeerIds.includes(revPeerId)) {
        revNewPeerIds.push(revPeerId);
      }

      setRevActiveVideoPeerIdsArr(revNewPeerIds);

      resolve(revNewPeerIds);
    });
  };

  var revRemoveVideoCallPeerId = revPeerId => {
    return new Promise(resolve => {
      let revPeerIdsArr = [...revActiveVideoPeerIdsArr];
      revPeerIdsArr = revPeerIdsArr.filter(revCurr => revCurr != revPeerId);

      setRevActiveVideoPeerIdsArr(revPeerIdsArr);

      resolve(revPeerIdsArr);
    });
  };

  var revPushPeerMessages = (revMessage, revPeerIdsArr) => {
    const {revData} = revMessage;
    const {revMsg = {}} = revData;
    const {_revRemoteGUID: revMessageId = -1} = revMsg;

    let revCurrMessagesObj = revPeerMessagesArrRef.current;
    revCurrMessagesObj[revMessageId] = {...revMessage, revPeerIdsArr};

    revPeerMessagesArrRef.current = revCurrMessagesObj;
  };

  var revGetPeerMessagesArr = _revPeerIdsArr => {
    let revRetMessagesArr = [];

    Object.entries(revPeerMessagesArrRef.current).forEach(
      ([revMessageId, revData]) => {
        const {revPeerIdsArr} = revData;

        let revPeerIdsArrSort = revPeerIdsArr.sort();
        let _revPeerIdsArrSort = _revPeerIdsArr.sort();

        if (
          JSON.stringify(revPeerIdsArrSort) ==
          JSON.stringify(_revPeerIdsArrSort)
        ) {
          revRetMessagesArr.push(revData);
        }
      },
    );

    return revRetMessagesArr;
  };

  var revPushPeerData = (revPeerId, revKey, revData) => {
    if (!revPeerConnsDataRef.current.hasOwnProperty(revPeerId)) {
      revPeerConnsDataRef.current[revPeerId] = {};
    }

    if (!revPeerConnsDataRef.current[revPeerId].hasOwnProperty(revKey)) {
      revPeerConnsDataRef.current[revPeerId][revKey] = [];
    }

    revPeerConnsDataRef.current[revPeerId][revKey].push(revData);
  };

  var revGetPeersDataArr = (revPeerIdsArr = [], revKey) => {
    let revPeerDataArr = [];

    Object.entries(revPeerConnsDataRef.current).forEach(
      ([revPeerId, revCurrVal]) => {
        if (revPeerIdsArr.includes(revPeerId)) {
          let revCurrDataArr = revCurrVal[revKey];

          revPeerDataArr = [...revPeerDataArr, revCurrDataArr];
        }
      },
    );

    return revPeerDataArr;
  };

  var revUpdateConnDataState = revNewData => {
    if (!revNewData) {
      return;
    }

    const {revPeerId = -1} = revNewData;

    if (revPeerId < 1) {
      console.log('*** revUpdateConnDataState - revPeerId < 1');
      return;
    }

    revPeerConnsObjRef.current[revPeerId] = revNewData;
  };

  var revUpdateConnDataItemState = (revPeerId, revKey, revNewData) => {
    if (revPeerId < 1) {
      return;
    }

    if (!revPeerConnsObjRef.current.hasOwnProperty(revPeerId)) {
      revPeerConnsObjRef.current[revPeerId] = {};
    }

    revPeerConnsObjRef.current[revPeerId][revKey] = revNewData;
  };

  var revGetConnData = revPeerId => {
    if (
      revPeerId < 1 ||
      !revPeerConnsObjRef.current.hasOwnProperty(revPeerId)
    ) {
      return null;
    }

    return revPeerConnsObjRef.current[revPeerId];
  };

  var revGetDataChannel = revPeerId => {
    let revConnData = revGetConnData(revPeerId);

    if (revConnData && revConnData.revDataChannel) {
      return revConnData.revDataChannel;
    }

    return null;
  };

  var revGetPeerConn = revPeerId => {
    if (revPeerId < 1) {
      return null;
    }

    let revConnData = revGetConnData(revPeerId);

    if (revConnData) {
      const {revPeerConn = null} = revConnData;
      return revPeerConn;
    }

    return null;
  };

  var revDelConnData = revPeerId => {
    if (!revPeerConnsObjRef.current.hasOwnProperty(revPeerId)) {
      return;
    }

    revRemoveVideoCallPeerId(revPeerId);

    if (!revActiveVideoPeerIdsArr.length) {
      revStopLocalStream();
    }

    revCloseRemoteTracks(revPeerId);

    delete revPeerConnsObjRef.current[revPeerId];
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

  async function revCloseConn(revPeerId, isRevPeerClosed = false) {
    if (revPeerId < 1) {
      return;
    }

    revConnRestartComplete(revPeerId);

    return new Promise((resolve, reject) => {
      const revOnConnCloseCallBack = () => {
        const revExitInterval = revIntervalId => {
          revDelConnData(revPeerId);
          clearInterval(revIntervalId);

          const revFinIntval = () => {
            if (!revRestartingPeerIdsArr.current.includes(revPeerId)) {
              revConnRestartComplete(revPeerId);
              revPeerCloseComplete(revPeerId);

              clearInterval(revFinIntvalId);
              resolve();
            }
          };

          const revFinIntvalId = setInterval(revFinIntval, 1000);
        };

        let revDataChannel = revGetDataChannel(revPeerId);

        if (revDataChannel) {
          revDataChannel.close();
        }

        let revPeerConn = revGetPeerConn(revPeerId);

        if (revPeerConn == null) {
          revConnRestartComplete(revPeerId);
          return revExitInterval(revIntervalId);
        }

        revPeerConn.close();
        revPeerConn.onicecandidate = null;
        revPeerConn.onaddstream = null;

        const {connectionState} = revPeerConn;

        if (connectionState == 'closed' || connectionState == 'disconnected') {
          if (
            !isRevPeerClosed &&
            !revRestartingPeerIdsArr.current.includes(revPeerId)
          ) {
            revInitClosePeerConn(revPeerId);

            isRevPeerClosed = true;
          }

          if (!revRestartingPeerIdsArr.current.includes(revPeerId)) {
            return revExitInterval(revIntervalId);
          }
        }
      };

      const revIntervalId = setInterval(revOnConnCloseCallBack, 1000);
    });
  }

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
    revDataChannel.onopen = async () => {
      await revInitSendMsgs();
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

  var revInitOffer = async (revPeerId, {revIsVideoCall = false} = {}) => {
    let revConnData = revGetConnData(revPeerId);

    if (revPeerId < 1 || !revConnData) {
      return;
    }

    const {revPeerConn} = revConnData;

    let revSessionConstraints = {
      offerToReceiveAudio: revIsVideoCall,
      offerToReceiveVideo: revIsVideoCall,
      // voiceActivityDetection: revIsVideoCall,
    };

    try {
      let revOfferDesc = await revPeerConn.createOffer(revSessionConstraints);
      await revPeerConn.setLocalDescription(revOfferDesc);

      revConnData['revPeerConn'] = revPeerConn;

      revUpdateConnDataState(revConnData);

      let revOfferMsgData = {
        type: 'offer',
        revOfferDescription: revOfferDesc,
        revRecipientId: revPeerId,
        revSenderId: revLoggedInEntityGUID,
        revDataType: revIsVideoCall ? 'revVideo' : 'revData',
      };

      revSendWebServerMessage(revOfferMsgData);
    } catch (error) {
      console.log('*** ERROR -revInitOffer', error);
    }
  };

  // function to create peer connection and add to state JSON object
  const revCreatePeerConn = async (revEntity, revVarArgs = {}) => {
    const {_revRemoteGUID: revPeerId = -1} = revEntity;

    let revRemoteStream;

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

    const {revOnConnSuccess, revOnConnFail} = _revCallBacks;

    let revConnData = revGetConnData(revPeerId);

    let revPeerConn = null;

    if (revConnData) {
      ({revPeerConn = {}} = revConnData);
      const {connectionState} = revPeerConn;

      if (connectionState == 'connected' && !revIsVideoCall) {
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
    revPeerConn.addEventListener('track', async event => {
      revRemoteStream = revRemoteStream || new MediaStream();
      revRemoteStream.addTrack(event.track, revRemoteStream);

      await revPushVideoCallPeerId(revPeerId);

      setRevRemoteVideoStreamsObj(revPrev => ({
        ...revPrev,
        [revPeerId]: revRemoteStream,
      }));

      if (revOnAddRemoteStreamRef.current) {
        revOnAddRemoteStreamRef.current({
          revPeerId,
          revStream: revRemoteStream,
        });
      }
    });

    // Accumulate incoming chunks
    let receivedChunks = {};

    revPeerConn.addEventListener('datachannel', event => {
      let revDataChannel = event.channel;

      revDataChannel.addEventListener('message', event => {
        let revDataStr = event.data;
        let revData = JSON.parse(revDataStr);
        const {revMsgGUID, revChunk} = revData;

        if (!receivedChunks.hasOwnProperty(revMsgGUID)) {
          receivedChunks[revMsgGUID] = [];
        }

        /** START REV CALL PLUGIN HOOK HANDLERS */
        if (revChunk === 'EOF') {
          let revReceivedMsgStr = receivedChunks[revMsgGUID].join('');

          try {
            /** START REV CALL PLUGIN HOOK HANDLERS */
            let revReceivedMsgStr = receivedChunks[revMsgGUID].join('');
            let revReceivedMsg = JSON.parse(revReceivedMsgStr);

            if (revPeerConnsCallBacksRef.current.hasOwnProperty(revPeerId)) {
              let revCallBacks = revPeerConnsCallBacksRef.current[revPeerId];
              const {revOnMessageReceived} = revCallBacks;

              if (revOnVideoChatMessageReceivedRef.current) {
                revOnVideoChatMessageReceivedRef.current(revReceivedMsg);
              } else if (revOnMessageReceived) {
                revOnMessageReceived(revReceivedMsg);
              }
            }
          } catch (error) {
            console.log('*** ERROR - revReceivedMsgStr', error);
            console.log('*** ERROR - revReceivedMsgStr', revReceivedMsgStr);
          }

          // Clear the receivedChunks array for the next file
          delete receivedChunks[revMsgGUID];
        } else {
          // Regular data chunk, accumulate it
          receivedChunks[revMsgGUID].push(revChunk);
        }
        /** END REV CALL PLUGIN HOOK HANDLERS */
      });
    });

    // create data channel
    let revDataChannel = revCreateDataChannel(revPeerConn);

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

    revPeerConnsObjRef.current[revPeerId] = {
      revPeerId,
      revIsVideoCall,
      revEntity,
      revPeerConn,
      revDataChannel,
      revRemoteCandidatesArr: [],
    };

    await revPushPeerIdsArr(revPeerId);

    if (isRevCaller) {
      if (revIsVideoCall) {
        await revInitTracks(revPeerId);
      }

      await revInitOffer(revPeerId, {revIsVideoCall});
    }

    return {revPeerConn, revDataChannel};
  };

  const revSendWebRTCMessage = async (revPeerId, message) => {
    if (revPeerId < 1) {
      return;
    }

    revNewMessagesArrRef.current.push({revPeerId, ...message});

    if (!revIsSendingQueRef.current) {
      await revInitSendMsgs();
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

  async function revInitTracks(revPeerId) {
    let revPeerConn = revGetPeerConn(revPeerId);

    if (!revPeerConn) {
      return;
    }

    isRevVideoCallViewMaxRef.current = true;

    try {
      let revStream = await mediaDevices.getUserMedia(revMediaConstraints);

      revStream.getTracks().forEach(track => {
        console.log(deviceModel, '--- track.kind', track.kind);

        revPeerConn.addTrack(track, revStream);
      });

      setRevLocalVideoStream({
        revPeerId: REV_LOGGED_IN_ENTITY._revRemoteGUID,
        revStream,
      });
    } catch (error) {
      console.log('>>> error -set local streeam', error);
    }
  }

  const revInitVideoCall = async ({revPeerIdsArr = []}) => {
    if (!Array.isArray(revPeerIdsArr)) {
      return;
    }

    setRevActiveVideoPeerIdsArr(revPeerIdsArr);

    for (let i = 0; i < revPeerIdsArr.length; i++) {
      const {revEntity} = revGetConnData(revPeerIdsArr[i]);

      await revCreatePeerConn(revEntity, {
        revIsVideoCall: true,
        isRevCaller: true,
      });
    }
  };

  function revStopLocalStream() {
    if (revLocalVideoStream && revLocalVideoStream.revStream) {
      revLocalVideoStream.revStream.getTracks().forEach(track => {
        track.stop();
      });

      setRevLocalVideoStream(null);
    }
  }

  function revCloseRemoteTracks(revPeerId) {
    let revConnData = revGetConnData(revPeerId);

    if (!revConnData) {
      return;
    }

    const {revPeerConn} = revConnData;

    if (revPeerConn == null) {
      return;
    }

    // Get the senders associated with the peer connection
    const revSenders = revPeerConn.getSenders();

    // Iterate through the senders to access the tracks
    revSenders.forEach(revSender => {
      const revTrack = revSender.track;

      if (revTrack) {
        // Access properties of the track
        console.log('Track ID:', revTrack.id);
        console.log('Track Kind:', revTrack.kind);
        console.log('Track Label:', revTrack.label);

        revTrack.stop();
      }
    });
  }

  const revEndVideoCall = async (revPeerIdsArr = [], revCallBack) => {
    for (let i = 0; i < revPeerIdsArr.length; i++) {
      let revPeerId = revPeerIdsArr[i];

      let revConnData = revGetConnData(revPeerId);

      if (!revConnData) {
        continue;
      }

      const {revPeerConn, revEntity} = revConnData;

      if (!revPeerConn) {
        continue;
      }

      revCloseRemoteTracks(revPeerId);

      await revCloseConn(revPeerId);
      await revCreatePeerConn(revEntity);
    }

    isRevVideoCallViewMaxRef.current = false;

    if (revCallBack) {
      revCallBack();
    }
  };

  // function to handle incoming offer message from remote peer
  var handleOffer = async revVarArgs => {
    if (revIsEmptyJSONObject(revVarArgs)) {
      return;
    }

    const {revEntity = {}, offer = {}, revDataType = 'revData'} = revVarArgs;
    const {_revRemoteGUID: revPeerId = -1} = revEntity;

    if (revPeerId < 1) {
      return;
    }

    const revIsVideoCall = revDataType == 'revVideo';

    let revPeerConn = revGetPeerConn(revPeerId);

    try {
      if (revPeerConn) {
        await revRestartPeerConn(revPeerId);
        return;
      }

      ({revPeerConn} = await revCreatePeerConn(revEntity, {
        revIsVideoCall,
      }));

      let revRemDesc = new RTCSessionDescription(offer);
      await revPeerConn.setRemoteDescription(revRemDesc);

      if (revIsVideoCall) {
        await revInitTracks(revPeerId);
      }

      let revAnswerDesc = await revPeerConn.createAnswer();
      await revPeerConn.setLocalDescription(revAnswerDesc);

      revUpdateConnDataItemState(revPeerId, 'revPeerConn', revPeerConn);

      await revProcessCandidates(revPeerId);

      // Send the answer to the remote peer via WebSocket
      const answerMessage = {
        type: 'answer',
        answer: revAnswerDesc,
        revRecipientId: revPeerId,
        revSenderId: revLoggedInEntityGUID,
      };

      revSendWebServerMessage(answerMessage);
    } catch (error) {
      console.log(deviceModel, '*** ERROR - handleOffer', error);
    }
  };

  // function to handle incoming answer message from remote peer
  var handleAnswer = async revData => {
    if (!revData) {
      return;
    }

    const {answer = {}, revSenderId: revPeerId = -1} = revData;

    if (revPeerId < 1 || revIsEmptyJSONObject(answer)) {
      return;
    }

    let revConnData = revGetConnData(revPeerId);

    if (!revConnData) {
      return;
    }

    const {revPeerConn} = revConnData;

    try {
      let revRemDesc = new RTCSessionDescription(answer);
      await revPeerConn.setRemoteDescription(revRemDesc);

      revConnData['revPeerConn'] = revPeerConn;
      revUpdateConnDataState(revConnData);
    } catch (e) {
      console.log('*** ERROR - handleAnswer', e);
      console.log('*** revConnData', JSON.stringify(revConnData));
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

    if (!revConnData) {
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

    if (revSenderId < 1 || !revConnData) {
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
  var revSendChunks = async (revDataChannel, revMessage) => {
    const REV_CHUNK_SIZE = 128 * 1024; // 128KB

    const {revMsgGUID} = revMessage;

    let revMessageStr = JSON.stringify(revMessage);
    const revTotalChunks = Math.ceil(revMessageStr.length / REV_CHUNK_SIZE);
    let revChunkIndex = 0;

    async function revSendNextChunk() {
      if (revChunkIndex < revTotalChunks) {
        const revStart = revChunkIndex * REV_CHUNK_SIZE;
        const revEnd = Math.min(
          revStart + REV_CHUNK_SIZE,
          revMessageStr.length,
        );

        const revChunk = revMessageStr.substring(revStart, revEnd);
        revDataChannel.send(JSON.stringify({revMsgGUID, revChunk: revChunk}));

        revChunkIndex++;

        // Continue sending next chunk after a delay
        await revTimeoutAsync({revCallback: revSendNextChunk});
      } else {
        // After sending all chunks, send 'EOF'
        revDataChannel.send(JSON.stringify({revMsgGUID, revChunk: 'EOF'}));
      }
    }

    // Start sending the chunks
    await revSendNextChunk();
  };

  var revInitSendMsgs = async () => {
    revIsSendingQueRef.current = true;

    let revQuedMessages = revQuedMessagesRef.current;
    let revQuedMessagesLen = revQuedMessages.length;

    revQuedMessagesRef.current = [];

    let revUnsentMessages = [];

    for (let i = 0; i < revQuedMessagesLen; i++) {
      if (revIsEmptyJSONObject(revQuedMessages[i])) {
        continue;
      }

      let revQuedMessage = revQuedMessages[i];

      const {revType, revPeerId, revMsg, revSendTryCount = 0} = revQuedMessage;
      let revConnData = revGetConnData(revPeerId);

      if (!revConnData) {
        continue;
      }

      if (revSendTryCount >= 5) {
        revSendMessagesFailArrRef.current.push({...revQuedMessage});
        continue;
      }

      const {revPeerConn, revDataChannel} = revConnData;

      if (!revPeerConn || !revDataChannel) {
        continue;
      }

      try {
        if (revDataChannel.readyState === 'open') {
          let revSendMsg = {...revMsg};

          await revSendChunks(revDataChannel, revSendMsg);

          if (revPeerConnsCallBacksRef.current.hasOwnProperty(revPeerId)) {
            const {revOnMessageSent} =
              revPeerConnsCallBacksRef.current[revPeerId];

            if (revOnVideoChatMessageSentRef.current) {
              revOnVideoChatMessageSentRef.current(revSendMsg);
            }

            if (!isRevVideoCallViewMaxRef.current && revOnMessageSent) {
              revOnMessageSent(revSendMsg);
            }
          }

          continue;
        }
      } catch (error) {
        console.log(deviceModel, '*** revInitSendMsgs', error);
      }

      revQuedMessage['revSendTryCount'] = revSendTryCount + 1;
      revUnsentMessages.push(revQuedMessage);
    }

    revQuedMessagesRef.current = [
      ...revUnsentMessages,
      ...revNewMessagesArrRef.current,
    ];

    revNewMessagesArrRef.current = [];

    if (revQuedMessagesRef.current.length) {
      await revInitSendMsgs();
    } else {
      revIsSendingQueRef.current = false;
    }
  };

  useEffect(() => {
    if (!REV_LOGGED_IN_ENTITY) {
      return;
    }

    const {_revRemoteGUID: revPeerId = -1} = REV_LOGGED_IN_ENTITY;

    if (revPeerId < 1) {
      return;
    }

    setRevLoggedInEntityGUID(revPeerId);
  }, [REV_LOGGED_IN_ENTITY]);

  useEffect(() => {
    if (
      !isRevSocketServerUp ||
      revLoggedInEntityGUID < 1 ||
      !REV_PORT ||
      !REV_IP
    ) {
      return;
    }

    revInitWebServer();
  }, [isRevSocketServerUp, revLoggedInEntityGUID, REV_PORT, REV_IP]);

  useEffect(() => {
    if (!REV_WEB_SOCKET_SERVER) {
      return;
    }

    REV_WEB_SOCKET_SERVER.addEventListener('open', event => {
      initSocket();
    });

    REV_WEB_SOCKET_SERVER.addEventListener('close', event => {});
  }, [REV_WEB_SOCKET_SERVER]);

  useEffect(() => {
    if (revOnAddLocalStreamRef.current) {
      revOnAddLocalStreamRef.current(revLocalVideoStream);
    }
  }, [revLocalVideoStream]);

  // create context value with state variables and functions
  const contextValue = {
    revPeerConnsData: revPeerConnsObjRef.current,
    revActivePeerIdsArr,
    revPushVideoCallPeerId,
    revRemoveVideoCallPeerId,
    revActiveVideoPeerIdsArr,
    revInitPeerConn,
    revGetConnData,
    revPushPeerData,
    revUpdateConnDataItemState,
    revGetPeersDataArr,
    revPushPeerMessages,
    revGetPeerMessagesArr,
    revLocalVideoStream,
    revRemoteVideoStreamsObj,
    revSetOnVideoChatMessageSent: _revOnVideoChatMessageSent => {
      revOnVideoChatMessageSentRef.current = _revOnVideoChatMessageSent;
    },
    revSetOnVideoChatMessageReceived: _revOnVideoChatMessageReceived => {
      revOnVideoChatMessageReceivedRef.current = _revOnVideoChatMessageReceived;
    },
    isRevVideoCallViewMax: () => isRevVideoCallViewMaxRef.current,
    revSendWebRTCMessage,
    revInitVideoCall,
    revSetOnAddLocalStream: _revOnAddLocalStream => {
      revOnAddLocalStreamRef.current = _revOnAddLocalStream;
    },
    revSetOnAddRemoteStream: _revOnAddRemoteStream => {
      revOnAddRemoteStreamRef.current = _revOnAddRemoteStream;
    },
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

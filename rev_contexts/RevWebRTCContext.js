import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import {} from 'react-native';

import {revPluginsLoader} from '../components/rev_plugins_loader';

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

import {
  revIsEmptyJSONObject,
  revTimeoutAsync,
} from '../rev_function_libs/rev_gen_helper_functions';

import DeviceInfo from 'react-native-device-info';

import {RevDialingCall} from '../components/rev_views/rev_web_rtc_views/rev_views/rev_object_views/RevDialingCall';

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
  const deviceModel = DeviceInfo.getModel();

  const {revInitSiteModal, SET_REV_SITE_BODY} = useContext(ReViewsContext);

  // initialize state variable

  const revPeerIdsArr = useRef([]);

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

  const {REV_PORT, REV_IP} = useContext(RevRemoteSocketContext);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const [revIsCaller, setRevIsCaller] = useState(false);
  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const revRemoteVideoStreamsArrRef = useRef({});

  let revOnAddLocalStream = null;
  let revOnAddRemoteStream = null;

  const revRestartingPeerIdsArr = useRef([]);

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

  var revPushPeerIdsArr = revPeerId => {
    if (!revPeerIdsArr.current.includes(revPeerId)) {
      revPeerIdsArr.current.push(revPeerId);
    }
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
    if (revIsEmptyJSONObject(revNewData)) {
      return;
    }

    const {revPeerId = -1} = revNewData;

    if (revPeerId < 1) {
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

    if (revConnData && revConnData.dataChannel) {
      return revConnData.dataChannel;
    }

    return null;
  };

  var revGetPeerConnection = revPeerId => {
    if (revPeerId < 1) {
      return null;
    }

    let revConnData = revGetConnData(revPeerId);

    if (!revIsEmptyJSONObject(revConnData)) {
      const {revPeerConn = null} = revConnData;
      return revPeerConn;
    }

    return null;
  };

  var revDelConnData = revPeerId => {
    if (!revPeerConnsObjRef.current.hasOwnProperty(revPeerId)) {
      return;
    }

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

        let revPeerConn = revGetPeerConnection(revPeerId);

        if (revPeerConn == null) {
          revConnRestartComplete(revPeerId);
          return revExitInterval(revIntervalId);
        }

        revPeerConn.close();
        revPeerConn.onicecandidate = null;
        revPeerConn.onaddstream = null;

        const {connectionState} = revPeerConn;

        if (connectionState == 'closed' || connectionState == 'disconnected') {
          if (!isRevPeerClosed) {
            revInitClosePeerConn(revPeerId);
          }

          return revExitInterval(revIntervalId);
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
      console.log('Data channel state:', revDataChannel.readyState);

      await revInitSendMsgs();
      console.log(deviceModel, '>>> ++ MSG SENT ++ <<<');
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
    revPeerId,
    {revIsVideoCall: _revIsVideoCall = false} = {},
  ) => {
    let revConnData = revGetConnData(revPeerId);

    if (revPeerId < 1 || revIsEmptyJSONObject(revConnData)) {
      return;
    }

    const {revIsVideoCall, revPeerConn} = revConnData;

    let revSessionConstraints = {
      offerToReceiveAudio: _revIsVideoCall,
      offerToReceiveVideo: _revIsVideoCall,
      voiceActivityDetection: _revIsVideoCall,
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
        revDataType: _revIsVideoCall ? 'revVideo' : 'revData',
      };

      if (_revIsVideoCall) {
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
    revPeerConn.ontrack = function (event) {
      let remoteStream = event.streams[0];
      remoteStream.id = revPeerId;

      remoteStream.getTracks().forEach(track => {
        console.log(deviceModel, '--- Received remote track:', track);
        // Do something with the remote track
      });

      if (revIsVideoCall) {
        revOnAddRemoteStream({revPeerId, revRemoteStream: remoteStream});
        revRemoteVideoStreamsArrRef.current[revPeerId] = remoteStream;
      }
    };

    if (revIsVideoCall) {
      let revVideoCall = revPluginsLoader({
        revPluginName: 'rev_plugin_video_call',
        revViewName: 'RevVideoCall',
        revVarArgs: {
          revOnAddLocalStream: revCallBack => {
            revOnAddLocalStream = revCallBack;
          },
          revOnAddRemoteStream: revCallBack => {
            revOnAddRemoteStream = revCallBack;
          },
          revOnVideoChatMessageSent: revCallBack => {
            revUpdateConnDataItemState(
              revPeerId,
              'revOnVideoChatMessageSent',
              revCallBack,
            );
          },
          revOnVideoChatMessageReceived: revCallBack => {
            revUpdateConnDataItemState(
              revPeerId,
              'revOnVideoChatMessageReceived',
              revCallBack,
            );
          },
        },
      });

      SET_REV_SITE_BODY(revVideoCall);

      isRevVideoCallViewMaxRef.current = true;

      try {
        let revLocalMediaStream = await mediaDevices.getUserMedia(
          mediaConstraints,
        );
        revLocalMediaStream
          .getTracks()
          .forEach(track => revPeerConn.addTrack(track, revLocalMediaStream));

        revOnAddLocalStream(revLocalMediaStream);
        // setRevLocalVideoStream(revLocalMediaStream);
      } catch (error) {
        console.log('>>> error -set local streeam', error);
      }
    }

    // Accumulate incoming chunks
    let receivedChunks = {};

    revPeerConn.addEventListener('datachannel', event => {
      let datachannel = event.channel;

      datachannel.addEventListener('message', event => {
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

              const {revOnVideoChatMessageReceived} = revGetConnData(revPeerId);

              if (revOnVideoChatMessageReceived) {
                revOnVideoChatMessageReceived(revReceivedMsg);
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

    revPeerConnsObjRef.current[revPeerId] = {
      revPeerId,
      revIsVideoCall,
      revEntity,
      revPeerConn,
      dataChannel,
      revRemoteCandidatesArr: [],
    };

    if (isRevCaller) {
      await revInitOffer(revPeerId, {revIsVideoCall});
    }

    revPushPeerIdsArr(revPeerId);

    return {revPeerConn, dataChannel};
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

  const revInitVideoCall = async ({revPeerIdsArr = []}) => {
    if (!Array.isArray(revPeerIdsArr)) {
      return;
    }

    for (let i = 0; i < revPeerIdsArr.length; i++) {
      const {revEntity} = revGetConnData(revPeerIdsArr[i]);

      await revCreatePeerConn(revEntity, {
        revIsVideoCall: true,
        isRevCaller: true,
      });
    }
  };

  const revEndVideoCall = async revPeerId => {};

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

    let revPeerConn = revGetPeerConnection(revPeerId);

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

      if (revIsEmptyJSONObject(revConnData)) {
        continue;
      }

      if (revSendTryCount >= 5) {
        revSendMessagesFailArrRef.current.push({...revQuedMessage});
        continue;
      }

      const {
        revPeerConn,
        dataChannel: revDataChannel,
        revOnVideoChatMessageSent = null,
      } = revConnData;

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

            if (revOnVideoChatMessageSent) {
              revOnVideoChatMessageSent(revSendMsg);
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
    revPeerConnsData: revPeerConnsObjRef.current,
    revGetPeerIdsArr: () => revPeerIdsArr.current,
    revInitPeerConn,
    revGetConnData,
    revPushPeerData,
    revGetPeersDataArr,
    revPushPeerMessages,
    revGetPeerMessagesArr,
    isRevVideoCallViewMax: () => isRevVideoCallViewMaxRef.current,
    revSendWebRTCMessage,
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

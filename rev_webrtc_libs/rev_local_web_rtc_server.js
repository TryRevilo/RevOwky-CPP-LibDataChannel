import {useState, useContext, useCallback, useEffect} from 'react';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCMediaStream,
  RTCVideoTrack,
  RTCAudioTrack,
} from 'react-native-webrtc';

import DeviceInfo from 'react-native-device-info';

import {RevSiteDataContext} from '../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../rev_contexts/RevRemoteSocketContext';

import {
  revIsEmptyVar,
  revIsEmptyJSONObject,
} from '../rev_function_libs/rev_gen_helper_functions';

var sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  },
};

let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
};

export function useRevWebSocket() {
  const deviceModel = DeviceInfo.getModel();

  const {REV_LOGGED_IN_ENTITY, REV_PEER_CONNECTIONS, SET_REV_PEER_CONNECTIONS} =
    useContext(RevSiteDataContext);

  const {REV_PORT, REV_IP, REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER} =
    useContext(RevRemoteSocketContext);

  let revURL = 'ws://' + REV_IP + ':' + REV_PORT;

  useEffect(() => {
    if (REV_LOGGED_IN_ENTITY && REV_LOGGED_IN_ENTITY._revRemoteEntityGUID > 0) {
      SET_REV_WEB_SOCKET_SERVER(revConnectWebSocket(revURL));
    }
  }, [REV_LOGGED_IN_ENTITY]);

  const revConnectWebSocket = revURL => {
    let revtWebSocket = new WebSocket(revURL);

    revtWebSocket.addEventListener('error', event => {
      console.log('>>> ERR ', JSON.stringify(event));
    });

    revtWebSocket.addEventListener('close', () => {
      revtWebSocket = null;
    });

    revtWebSocket.addEventListener('open', () => {});

    revtWebSocket.addEventListener('message', async event => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'rev_connection':
          revHandleWebServerConnection(data);
          break;
        //when we make connection
        case 'login':
          revHandleWebServerLogIn(data);
          break;
        //when somebody wants to call us
        case 'offer':
          await revHandleWebServerOffer(data);
          break;
        case 'answer':
          await revHandleWebServerAnswer(data);
          break;
        //when a remote peer sends an ice candidate to us
        case 'candidate':
          await revHandleWebServerCandidate(data);
          break;
        case 'leave':
          handleLeave(data);
          break;
        case 'revConnEntity':
          if (deviceModel.localeCompare('TECNO LE6') == 0) {
            // await revCreateNewPeerConnection(data.revEntity, true);
          }
          break;
        case 'error':
          console.log('error : ' + JSON.stringify(data));
          break;
        default:
          console.log('default : ' + JSON.stringify(data));
          break;
      }
    });

    return revtWebSocket;
  };

  const revCreateNewPeerConnection = async (revPeerEntity, revIsInitiator) => {
    let revPeerRemoteEntityGUID = revPeerEntity._revRemoteEntityGUID;

    console.log(
      deviceModel,
      '>>> revCreateNewPeerConnection - revPeerRemoteEntityGUID ',
      revPeerRemoteEntityGUID,
    );

    if (
      REV_PEER_CONNECTIONS.revPeerRemoteEntityGUID &&
      'revPeerConn' in REV_PEER_CONNECTIONS.revPeerRemoteEntityGUID
    ) {
      console.log(deviceModel, '>> ALREADY - ', revPeerRemoteEntityGUID);
      return REV_PEER_CONNECTIONS[revPeerRemoteEntityGUID].revPeerConn;
    }

    REV_PEER_CONNECTIONS[revPeerRemoteEntityGUID] = {};

    if (revIsEmptyJSONObject(revPeerEntity)) {
      return;
    }

    let peerConstraints = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
      sdpSemantics: 'unified-plan',
    };

    try {
      const peerA = new RTCPeerConnection(peerConstraints, {
        optional: [{RtpDataChannels: true}],
      });

      /** START DATA CHANNEL INIT */
      const dataChannel = revCreateDataChannel(revPeerEntity, peerA);

      SET_REV_PEER_CONNECTIONS(prevState => ({
        ...prevState,
        [revPeerRemoteEntityGUID]: {
          ...(prevState[revPeerRemoteEntityGUID] || {}),
          ...prevState[revPeerRemoteEntityGUID],
          ['revDataChannel']: dataChannel,
        },
      }));
      /** END DATA CHANNEL INIT */

      // listen for the datachannel event on the PeerConnection
      peerA.ondatachannel = event => {
        // handle the datachannel creation
        console.log('+++ DataChannel created:', event.channel);
      };

      // add the local stream to the PeerConnection (if using audio/video)
      let localMediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      localMediaStream
        .getTracks()
        .forEach(track => peerA.addTrack(track, localMediaStream));

      // listen for the remote track event on the PeerConnection
      peerA.ontrack = event => {
        const {track, streams} = event;

        console.log(deviceModel, ' +++ remoteStream +++');
        console.log(deviceModel, '+++ Received new track:', track);
      };

      // listen for the connectionstatechange event on the PeerConnection
      peerA.onconnectionstatechange = event => {
        // handle the connection state change
        console.log('Connection state changed:', peerA.connectionState);
      };

      // listen for ICE candidates on the PeerConnection
      peerA.onicecandidate = event => {
        if (event.candidate) {
          // Send ICE candidate to signalling server
          let revCandidateMsg = {
            type: 'candidate',
            revCandidate: event.candidate,
            revEntity: revPeerEntity,
            revCandidateEntity: REV_LOGGED_IN_ENTITY,
          };

          revSendWebServerMessage(revCandidateMsg);
        } else {
          // all ICE candidates have been sent
          console.log(
            '=== All ICE candidates have been sent ===',
            JSON.stringify(event),
          );
        }
      };

      // listen for the negotiationneeded event on the PeerConnection
      peerA.onnegotiationneeded = async () => {
        // send the offer to the other peer
        await revSendOffer(revPeerEntity, peerA);
      };

      if (revIsInitiator) {
        await revCreateOffer(revPeerEntity, peerA);
      }

      SET_REV_PEER_CONNECTIONS(prevState => ({
        ...prevState,
        [revPeerRemoteEntityGUID]: {
          ...(prevState[revPeerRemoteEntityGUID] || {}),
          ['revPeerConn']: peerA,
        },
      }));

      return peerA;
    } catch (error) {
      console.log('ERR -> revInitConn -> ' + error);
    }
  };

  const revCreateDataChannel = (revEntity, peerConnection) => {
    let revPeerRemoteEntityGUID = revEntity._revRemoteEntityGUID;

    const dc = peerConnection.createDataChannel('myDataChannel');
    // listen for the datachannel state changes
    dc.onopen = () => {
      console.log('DataChannel opened');
    };

    dc.onclose = () => {
      console.log('DataChannel closed');
    };
    // listen for incoming messages on the datachannel
    dc.onmessage = event => {
      console.log('Received message:', event.data);
    };
    dc.onmessage = event => {
      console.log(deviceModel, `=== Received message: ${event.data}`);
    };

    return dc;
  };

  /** MESSAGE HANDLERS */

  const revSendWebServerMessage = useCallback(
    message => {
      if (
        REV_WEB_SOCKET_SERVER &&
        REV_WEB_SOCKET_SERVER.readyState === WebSocket.OPEN
      ) {
        REV_WEB_SOCKET_SERVER.send(JSON.stringify(message));
      }
    },
    [REV_WEB_SOCKET_SERVER],
  );

  const revHandleWebServerConnection = revData => {
    let revMessage = {type: 'login', revEntity: REV_LOGGED_IN_ENTITY};
    revSendWebServerMessage(revMessage);
  };

  const revHandleWebServerLogIn = revData => {};

  const revSendOffer = async (revEntity, revPeerConnection) => {
    try {
      // Create an offer and send it to the remote peer
      const offerDescription = await revPeerConnection.createOffer(
        sessionConstraints,
      );

      await revPeerConnection.setLocalDescription(offerDescription);

      let revOfferMsgData = {
        type: 'offer',
        revOfferDescription: offerDescription.sdp,
        revEntity: revEntity,
        revOffererEntity: REV_LOGGED_IN_ENTITY,
      };

      // Send the offer to the remote peer and wait for the answer
      revSendWebServerMessage(revOfferMsgData);
    } catch (error) {
      console.log(deviceModel, ' >>> error - revCreateOffer - ', error);
    }
  };

  const revCreateOffer = async (revEntity, revPeerConnection) => {
    let revSignalingState = revPeerConnection.signalingState;

    console.log('>>> revSignalingState', revSignalingState);

    await revSendOffer(revEntity, revPeerConnection);
  };

  const revHandleWebServerOffer = async revData => {
    console.log('>>> revHandleWebServerOffer', JSON.stringify(revData));

    let revPeerEntity = revData.revEntity;
    let revOfferSDP = revData.sdp;

    if (
      revIsEmptyJSONObject(revPeerEntity) ||
      !revPeerEntity.hasOwnProperty('_revRemoteEntityGUID')
    ) {
      return;
    }

    let revPeerEntityEntityGUID = revPeerEntity._revRemoteEntityGUID;

    let revPeerConn = await revCreateNewPeerConnection(revPeerEntity, false);

    if (revIsEmptyJSONObject(revPeerConn)) {
      return;
    }

    // Set the modified answer as the remote description
    try {
      const remoteDescription = new RTCSessionDescription({
        type: 'offer',
        sdp: revOfferSDP,
      });
      await revPeerConn.setRemoteDescription(remoteDescription);
    } catch (error) {
      console.log('*** error - offer - setRemoteDescription ', error);
    }

    try {
      const answerDescription = await revPeerConn.createAnswer(
        sessionConstraints,
      );

      console.log('>>> answerDescription', JSON.stringify(answerDescription));

      await revPeerConn.setLocalDescription(answerDescription);

      const answerMessage = {
        type: 'answer',
        answer: answerDescription,
        revEntity: revPeerEntity,
        revAnswerEntity: REV_LOGGED_IN_ENTITY,
      };

      revSendWebServerMessage(answerMessage);
    } catch (error) {
      console.log('*** error -rtcAnswer ', error);
    }

    SET_REV_PEER_CONNECTIONS(prevState => ({
      ...prevState,
      [revPeerEntityEntityGUID]: {
        ...(prevState[revPeerEntityEntityGUID] || {}),
        ...prevState[revPeerEntityEntityGUID],
        ['hasSentOffer']: true,
      },
    }));
  };

  const revHandleWebServerAnswer = async revData => {
    let revPeerEntity = revData.revEntity;
    let revPeerEntityEntityGUID = revPeerEntity._revRemoteEntityGUID;
    let revSDPAnswer = revData.answer;

    let revPeerConn = await revCreateNewPeerConnection(revPeerEntity, false);

    if (revIsEmptyJSONObject(revPeerConn)) {
      return;
    }

    // Check if the signaling state is "stable"
    if (
      revPeerConn.signalingState === 'have-local-offer' ||
      revPeerConn.signalingState === 'have-local-pranswer'
    ) {
      // Set the remote answer SDP as the remote description
      console.log('>>> revSDPAnswer ', JSON.stringify(revSDPAnswer));

      try {
        const remoteDescription = new RTCSessionDescription({
          type: 'answer',
          sdp: revSDPAnswer,
        });
        await revPeerConn.setRemoteDescription(remoteDescription);

        SET_REV_PEER_CONNECTIONS(prevState => ({
          ...prevState,
          [revPeerEntityEntityGUID]: {
            ...(prevState[revPeerEntityEntityGUID] || {}),
            ...prevState[revPeerEntityEntityGUID],
            ['revPeerConn']: revPeerConn,
          },
        }));
      } catch (error) {
        console.log('+++ rtcAnswer +++ error', JSON.stringify(error));
      }
    } else {
      // The RTCPeerConnection object is not in the "stable" state
    }
  };

  const revHandleWebServerCandidate = async revData => {
    if (!revData.candidate || !revData.revEntity) {
      return;
    }

    let revPeerEntity = revData.revEntity;

    if (
      revIsEmptyJSONObject(revPeerEntity) ||
      !('_revRemoteEntityGUID' in revPeerEntity)
    ) {
      return;
    }

    let revPeerEntityEntityGUID = revPeerEntity._revRemoteEntityGUID;

    let revPeerConn = await revCreateNewPeerConnection(revPeerEntity, false);

    if (!revPeerConn) {
      return;
    }

    if (revPeerConn.remoteDescription === null) {
      console.log(
        deviceModel,
        revPeerEntityEntityGUID,
        '*** Remote description is null ***\n\n',
      );
      return;
    } else {
      console.log('+++ Remote description is - NOT - null +++');
    }

    const rtcCandidate = new RTCIceCandidate(revData.candidate);

    if (!rtcCandidate) {
      return;
    }

    try {
      await revPeerConn.addIceCandidate(rtcCandidate);

      SET_REV_PEER_CONNECTIONS(prevState => ({
        ...prevState,
        [revPeerEntityEntityGUID]: {
          ...(prevState[revPeerEntityEntityGUID] || {}),
          ...prevState[revPeerEntityEntityGUID],
          ['revPeerConn']: revPeerConn,
        },
      }));
    } catch (error) {
      console.error('>>> rtcCandidate - error ', JSON.stringify(error));
    }
  };

  const revGetDataChannel = async revPeerEntity => {
    let revDataChannelId = revPeerEntity._revRemoteEntityGUID;

    let revPeer = REV_PEER_CONNECTIONS[revDataChannelId];

    if (revIsEmptyVar(revPeer) || revIsEmptyJSONObject(revPeer)) {
      revPeer = await revCreateNewPeerConnection(revPeerEntity, true);
    }

    if (revIsEmptyJSONObject(revPeer)) {
      return null;
    }

    let revDataChannel =
      'revDataChannel' in revPeer ? revPeer.revDataChannel : null;

    return revDataChannel;
  };

  return {revCreateNewPeerConnection, revGetDataChannel};
}

export const useRevDataChannelSendMessage = () => {
  const {revGetDataChannel} = useRevWebSocket();

  const [messageQueue, setMessageQueue] = useState([]);

  let revTxtMessageDataChannel;

  const revSend = revMessage => {
    revTxtMessageDataChannel.send(JSON.stringify(revMessage));
    console.log('>>> Data channel is open. Message sent successfully ! ! !');
  };

  const revDataChannelSendMessage = async (revPeerEntity, revMessage) => {
    revTxtMessageDataChannel = await revGetDataChannel(revPeerEntity);

    if (revTxtMessageDataChannel)
      console.log('>>> readyState', 'readyState' in revTxtMessageDataChannel);

    if (
      revTxtMessageDataChannel &&
      revTxtMessageDataChannel.readyState === 'open'
    ) {
      revSend(revMessage);
    } else {
      console.log('*** Messages Data channel is not open');
      setMessageQueue(queue => [...queue, revMessage]);
    }
  };

  useEffect(() => {
    const sendQueuedMessages = () => {
      if (
        revTxtMessageDataChannel &&
        revTxtMessageDataChannel.readyState === 'open'
      ) {
        messageQueue.forEach(message => {
          revSend(message);
          setMessageQueue(queue => queue.filter(msg => msg !== message));
        });
      }
    };

    if (revTxtMessageDataChannel) {
      console.log('>>> readyState -', revTxtMessageDataChannel.readyState);

      revTxtMessageDataChannel.onopen = sendQueuedMessages;
    }

    return () => {
      if (revTxtMessageDataChannel) {
        revTxtMessageDataChannel.onopen = null;
      }
    };
  }, [revTxtMessageDataChannel, messageQueue]);

  return {revDataChannelSendMessage};
};

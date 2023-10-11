import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';

import {RevSiteDataContext} from './RevSiteDataContext';
import {RevRemoteSocketContext} from './RevRemoteSocketContext';

import DeviceInfo from 'react-native-device-info';

let peerConstraints = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
};

let sessionConstraints = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true,
};

const RevLibWebRTCCLientContext = createContext();

const RevLibWebRTCCLientContextProvider = ({children}) => {
  const deviceModel = DeviceInfo.getModel();

  const [REV_PEER_CONNECTIONS, SET_REV_PEER_CONNECTIONS] = useState({});

  const {REV_PORT, REV_IP, REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER} =
    useContext(RevRemoteSocketContext);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const [revLoggedInEntity, setRevLoggedInEntity] = useState({});

  useEffect(() => {
    if (
      !REV_PORT ||
      !REV_IP ||
      !REV_LOGGED_IN_ENTITY ||
      REV_LOGGED_IN_ENTITY._revRemoteEntityGUID < 1
    ) {
      return;
    }

    setRevLoggedInEntity({
      _revRemoteEntityGUID: REV_LOGGED_IN_ENTITY._revRemoteEntityGUID,
    });

    SET_REV_WEB_SOCKET_SERVER(revSetupWebSocket());
  }, [REV_PORT, REV_IP, REV_LOGGED_IN_ENTITY]);

  const revSetupWebSocket = () => {
    let conn = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);

    conn.onopen = function () {
      console.log(deviceModel, '>>> Connected to the signaling server <<<');

      // revHandleWebServerConnection();
    };

    //when we got a message from a signaling server
    conn.onmessage = async msg => {
      let data = JSON.parse(msg.data);

      console.log(deviceModel, '>>> data.type :', data.type);

      switch (data.type) {
        case 'rev_connection':
          revHandleWebServerConnection();
          break;
        case 'login':
          handleLogin(data.success);
          break;
        case 'offer':
          await handleOffer(data);
          break;
        case 'answer':
          await handleAnswer(data);
          break;
        case 'candidate':
          handleCandidate(data);
          break;
        case 'leave':
          handleLeave(data.revEntity);
          break;
        case 'error':
          console.log('ERR : ' + JSON.stringify(data));
          break;
        default:
          console.log('>>> DEFAULT <<<', JSON.stringify(data));
          break;
      }
    };

    conn.onclose = function () {
      // setTimeout(setupWebSocket, 1000);
    };

    return conn;
  };

  const revSendWebServerMessage = message => {
    //attach the other peer username to our messages
    if (
      !REV_WEB_SOCKET_SERVER ||
      REV_WEB_SOCKET_SERVER.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    if (message && message.revEntity) {
      try {
        REV_WEB_SOCKET_SERVER.send(JSON.stringify(message));
      } catch (error) {
        console.log('*** revSendWebServerMessage - error', error);
      }
    }
  };

  const revHandleWebServerConnection = () => {
    let revMessage = {type: 'login', revEntity: revLoggedInEntity};
    revSendWebServerMessage(revMessage);
  };

  // Login when the user clicks the button
  const revWebRTCLogIn = revEntity => {
    if (revEntity._revRemoteEntityGUID > 0) {
      revSendWebServerMessage({
        type: 'login',
        revEntity: revEntity,
      });
    }
  };

  const handleLogin = success => {
    if (success === false) {
      alert('Ooops...try a different username');
    } else {
      console.log(deviceModel, '+++ Logged In +++');
      revHandleWebServerConnection();
    }
  };

  const revGetEntityRCTObject = (revTargetEntity, revProp) => {
    if (!revTargetEntity || !revTargetEntity._revRemoteEntityGUID) {
      console.log('ERR -> !revEntity || !revEntity._revRemoteEntityGUID');
      return;
    }

    let remoteRevEntityGUID = revTargetEntity._revRemoteEntityGUID;

    if (REV_PEER_CONNECTIONS.hasOwnProperty(remoteRevEntityGUID)) {
      let revRCTConnectionObject = REV_PEER_CONNECTIONS[remoteRevEntityGUID];
      return revRCTConnectionObject[revProp];
    }

    return null;
  };

  const revInitDataChannel = revPeerEntity => {
    let revTargetConn = revGetEntityRCTObject(revPeerEntity, 'revConnection');

    console.log('>>> revTargetConn', JSON.stringify(revTargetConn));

    let revDataChannel = revTargetConn.createDataChannel('my-channel');

    // listen for the datachannel state changes
    revDataChannel.onopen = () => {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DataChannel opened');
    };

    revDataChannel.onerror = function (error) {
      console.log('Ooops...error:', error);
    };

    revDataChannel.onclose = () => {
      console.log('!!! Data channel is closed');
    };

    revTargetConn.ondatachannel = function (event) {
      console.log('!!! Data channel is created!');

      event.channel.onopen = function () {
        console.log('+++ Data channel is open and ready to be used.');

        // When we receive a message from the other peer, display it on the screen
        event.channel.onmessage = async event => {
          console.log('+++ onmessage -> event.data :\n\t\t' + event.data);
        };
      };
    };

    return revDataChannel;
  };

  const revInitConn = async revTargetEntity => {
    let revTargetConn = revGetEntityRCTObject(revTargetEntity, 'revConnection');

    if (revTargetConn) {
      return;
    }

    let remoteRevEntityGUID = revTargetEntity._revRemoteEntityGUID;

    try {
      let revTargetConn = new RTCPeerConnection(peerConstraints);

      console.log('>>> remoteRevEntityGUID', remoteRevEntityGUID);

      if (!REV_PEER_CONNECTIONS.hasOwnProperty(remoteRevEntityGUID)) {
        REV_PEER_CONNECTIONS[remoteRevEntityGUID] = {
          revConnection: revTargetConn,
        };
      }

      // Creating data channel
      let revDataChannel = revInitDataChannel(revTargetEntity);

      if (!REV_PEER_CONNECTIONS.hasOwnProperty(remoteRevEntityGUID)) {
        REV_PEER_CONNECTIONS[remoteRevEntityGUID] = {
          revDataChannel: revDataChannel,
        };
      }

      // Setup ice handling
      revTargetConn.onicecandidate = event => {
        if (event.candidate) {
          revSendWebServerMessage({
            type: 'candidate',
            revCandidate: event.candidate,
            revEntity: revTargetEntity,
            revCandidateEntity: revLoggedInEntity,
          });
        }
      };

      // Listen for when remote peer adds their stream
      revTargetConn.onaddstream = event => {
        console.log(deviceModel, '+++ onaddstream');
        setRemoteStream(event.stream);
        console.log(deviceModel, '+++ onaddstream success');
      };

      // Listen for negotiation needed
      revTargetConn.onnegotiationneeded = async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('>>> onnegotiationneeded <<<');
      };

      // Listen for the "connectionstatechange" event on the peer connection
      revTargetConn.addEventListener('connectionstatechange', event => {
        console.log(
          `Peer connection state changed to: ${revTargetConn.connectionState}`,
        );

        if (revTargetConn.connectionState === 'connected') {
          // The peer connection is established and ready to transmit data
          console.log('Peer connected!');
        }
      });

      revTargetConn.addEventListener('iceconnectionstatechange', event => {
        console.log('ice state changed: ', revTargetConn.iceConnectionState);
      });
    } catch (err) {
      console.log('ERR -> new RTCPeerConnection -> ' + err);
    }
  };

  // When somebody sends us an offer
  const handleOffer = async revData => {
    let revEntity = revData.revEntity;
    let revOfferSDP = revData.sdp;

    // Create an answer to an offer
    try {
      await revInitConn(revEntity);

      let revMyConn = revGetEntityRCTObject(revEntity, 'revConnection');

      const remoteDescription = new RTCSessionDescription({
        type: 'offer',
        sdp: revOfferSDP,
      });
      await revMyConn.setRemoteDescription(remoteDescription);

      // Set the answer as the local description for the connection
      const answerDescription = await revMyConn.createAnswer(
        sessionConstraints,
      );

      await revMyConn.setLocalDescription(answerDescription);

      const answerMessage = {
        type: 'answer',
        answer: revMyConn.localDescription,
        revEntity: revEntity,
        revAnswerEntity: revLoggedInEntity,
      };

      revSendWebServerMessage(answerMessage);
    } catch (error) {
      console.log('*** error - handleOffer', error);
    }
  };

  // When we got an answer from a remote user
  const handleAnswer = async revData => {
    console.log(
      deviceModel,
      '>>> revData -handleAnswer',
      JSON.stringify(revData),
    );

    let revPeerEntity = revData.revEntity;
    let revSDPAnswer = revData.answer;

    let revPeerConn = revGetEntityRCTObject(revPeerEntity, 'revConnection');

    try {
      let remoteDescription = new RTCSessionDescription({
        type: 'answer',
        sdp: revSDPAnswer,
      });
      await revPeerConn.setRemoteDescription(remoteDescription);
    } catch (error) {
      console.log('+++ rtcAnswer +++ error', JSON.stringify(error));
    }
  };

  // When we got an ice candidate from a remote user
  const handleCandidate = revData => {
    console.log(
      deviceModel,
      '>>> handleCandidate',
      JSON.stringify(revData.candidate),
    );

    let revEntity = revData.revEntity;

    let revConnection = revGetEntityRCTObject(revEntity, 'revConnection');

    if (!revConnection) {
      return;
    }

    const rtcCandidate = new RTCIceCandidate(revData.candidate);

    if (!rtcCandidate) {
      console.log('>>> ! ! ! rtcCandidate <<<');
      return;
    }

    // Add the new ICE candidate to the connection
    if (revConnection.remoteDescription) {
      revConnection
        .addIceCandidate(rtcCandidate)
        .then(() => {
          console.log(deviceModel, '+++ ICE candidate added successfully');
        })
        .catch(error => {
          console.error(deviceModel, '*** Error adding ICE candidate:', error);
        });
    } else {
      console.warn('Remote description not set yet');
    }
  };

  // Initiating a data messanger
  const revInitiateDataMessanger = async (
    revMessage,
    revMessageRecipientEntity,
  ) => {
    if (
      !revMessageRecipientEntity ||
      !revMessageRecipientEntity._revRemoteEntityGUID
    )
      return;

    await revInitConn(revMessageRecipientEntity);

    let revConnection = revGetEntityRCTObject(
      revMessageRecipientEntity,
      'revConnection',
    );

    // Check if the remote description has already been set
    if (revConnection.currentRemoteDescription) {
      console.log(deviceModel, '+++ Remote description has already been set');

      console.log('revConnection', revConnection.connectionState);

      // Check the connection state of the peer connection
      if (revConnection.connectionState === 'connected') {
        // The connection is established and ready to transmit data
        let revDataChannel = revGetEntityRCTObject(
          revMessageRecipientEntity,
          'revDataChannel',
        );

        console.log('revDataChannel', revDataChannel.readyState);

        let revSendMsg = JSON.stringify(revMessage);

        if (revDataChannel.readyState == 'open') {
          console.log('OPEN . . .');
          revDataChannel.send(revSendMsg);
        } else {
          revDataChannel.onopen = function (event) {
            if (revDataChannel.readyState == 'open') {
              console.log('DATA.C OPEN . . .');

              revDataChannel.send(revSendMsg);
            }
          };
        }
      } else {
        console.log('Peer connection not yet connected.');
      }
    } else {
      console.log(deviceModel, '--- Remote description has not been set yet');

      const offerDescription = await revConnection.createOffer(
        sessionConstraints,
      );

      await revConnection.setLocalDescription(offerDescription);

      let revOfferMsgData = {
        type: 'offer',
        revOfferDescription: revConnection.localDescription,
        revEntity: revMessageRecipientEntity,
        revOffererEntity: revLoggedInEntity,
      };

      revSendWebServerMessage(revOfferMsgData);
    }
  };

  const revInitCall = async revEntity => {
    await revInitConn(revEntity);
    let revTargetConn = revGetEntityRCTObject(revEntity, 'revConnection');

    // add the local stream to the PeerConnection (if using audio/video)
    let localMediaStream = await mediaDevices.getUserMedia(mediaConstraints);

    localMediaStream
      .getTracks()
      .forEach(track => revTargetConn.addTrack(track, localMediaStream));

    // listen for the remote track event on the PeerConnection
    revTargetConn.ontrack = event => {
      const {track, streams} = event;
    };
  };

  return (
    <RevLibWebRTCCLientContext.Provider
      value={{
        REV_IP,
        revSetupWebSocket,
        revWebRTCLogIn,
        revInitConn,
        revInitiateDataMessanger,
        revInitCall,
      }}>
      {children}
    </RevLibWebRTCCLientContext.Provider>
  );
};

export {RevLibWebRTCCLientContextProvider, RevLibWebRTCCLientContext};

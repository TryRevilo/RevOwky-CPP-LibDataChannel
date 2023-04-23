import React, {useContext, createContext, useState, useEffect} from 'react';

import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';

import {RevSiteDataContext} from './RevSiteDataContext';
import {RevRemoteSocketContext} from './RevRemoteSocketContext';

import DeviceInfo from 'react-native-device-info';

// create the context
const RevWebRTCContext = createContext();

const config = {
  iceCandidatePoolSize: 10,
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
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
  maxRetransmits: 3, // the sender will retransmit a packet up to 3 times if it doesn't receive an ACK from the receiver
  label: 'my-channel', // a name for the channel
};

const RevWebRTCContextProvider = ({children}) => {
  const deviceModel = DeviceInfo.getModel();

  // initialize state variable
  const [connections, setConnections] = useState([]);
  const [revQuedMessages, setRevQuedMessages] = useState([]);
  const [revWebServerOpen, setRevWebServerOpen] = useState(true);

  const [revPeerOffer, setRevPeerOffer] = useState(null);
  const [revPeerAnswer, setRevPeerAnswer] = useState(null);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState(null);
  const [revLoggedInEntityGUID, setRevLoggedInEntityGUID] = useState(0);

  const {REV_PORT, REV_IP} = useContext(RevRemoteSocketContext);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

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
        default:
          console.warn(`Received unknown message: ${message}`);
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
    const connection = connections.find(c => c.peerId === peerId);
    if (connection && connection.dataChannel) {
      return connection.dataChannel;
    }
    return null;
  };

  const getPeerConnection = peerId => {
    const connection = connections.find(c => c.peerId === peerId);
    if (connection) {
      return connection.pc;
    }
    return null;
  };

  const createDataChannel = (pc, peerId, channelName) => {
    const dataChannel = pc.createDataChannel(channelName, {ordered: true});

    // set up event listeners for data channel
    dataChannel.onopen = () => {
      console.log('Data channel opened');
    };
    dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
    dataChannel.onerror = error => {
      console.error(`Data channel error: ${error}`);
    };
    dataChannel.onmessage = event => {
      console.log(`Received message from data channel: ${event.data}`);
    };

    setConnections(prevState => {
      const updatedConnections = [...prevState];
      const index = updatedConnections.findIndex(c => c.peerId === peerId);
      if (index !== -1) {
        updatedConnections[index].dataChannel = dataChannel;
      }
      return updatedConnections;
    });
  };

  // function to create peer connection and add to state JSON object
  const createPeerConnection = async peerId => {
    const pc = new RTCPeerConnection(config);

    // add the local stream to the PeerConnection (if using audio/video)
    let localMediaStream = await mediaDevices.getUserMedia(mediaConstraints);

    localMediaStream
      .getTracks()
      .forEach(track => pc.addTrack(track, localMediaStream));

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

    pc.oniceconnectionstatechange = event => {
      console.log(deviceModel, '--- pc.iceCon.State', pc.iceConnectionState);

      if (pc.iceConnectionState === 'connected') {
        console.log('Peer connection established');

        // create data channel
        createDataChannel(pc, peerId, 'my_channel');
      }
    };

    setConnections(prevState => [...prevState, {peerId, pc}]);

    return {pc};
  };

  const sendMessage = async (peerId, message) => {
    setRevQuedMessages(prevState => {
      const newData = [...prevState, {revPeerId: peerId, revMessage: message}];
      return newData;
    });
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

    const {pc} = await createPeerConnection(peerId);

    if (!pc) {
      return;
    }

    try {
      await pc.setRemoteDescription(offer);

      console.log(deviceModel, '>>> setRemoteDescription SUCCESSFUL <<<');

      // Create an answer to a remote offer
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      console.log(deviceModel, '>>> setLocalDescription SUCCESSFUL <<<');

      sendAnswer(pc.localDescription, peerId);
    } catch (error) {
      console.log(deviceModel, '*** handleOffer', error);
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
      console.log(deviceModel, '>>> R-Desc -ANS- SUCCESSSFUL ! ! !');
    } catch (e) {
      console.log(deviceModel, '*** handleAnswer', e);

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
      console.log(deviceModel, '+++ Candidate added successfully ! ! !');
    } catch (error) {
      console.log(deviceModel, '*** error - handleCandidate', error);
    }
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

    console.log(
      deviceModel,
      '{ WebSocket open }',
      REV_WEB_SOCKET_SERVER !== null &&
        REV_WEB_SOCKET_SERVER.readyState === WebSocket.OPEN,
    );

    if (revWebServerOpen) {
      initSocket();
    } else {
      console.log(deviceModel, 'WebSocket is not open');
    }
  }, [REV_WEB_SOCKET_SERVER, revWebServerOpen]);

  const revCreateOffer = async (peerId, pc) => {
    console.log(deviceModel, '--- START WAIT ----');
    try {
      let revOfferDescription = await pc.createOffer(sessionConstraints);
      await pc.setLocalDescription(revOfferDescription);

      let revOfferMsgData = {
        type: 'offer',
        revOfferDescription: pc.localDescription,
        revEntityId: peerId,
        revOffererEntityId: revLoggedInEntityGUID,
      };

      revSendWebServerMessage(revOfferMsgData);

      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.log(deviceModel, '*** +++ Offer', error);
    }

    console.log(deviceModel, '--- END WAIT ----');
  };

  const revInitSendMsgs = async () => {
    let revQuedMessagesLen = revQuedMessages.length;

    if (revQuedMessagesLen < 1) {
      return;
    }

    console.log(deviceModel, '>>> Qued', revQuedMessagesLen);

    let revNewMsgsQueArr = [];

    for (let i = 0; i < revQuedMessagesLen; i++) {
      const {revPeerId} = revQuedMessages[i];

      let revPeer = getPeerConnection(revPeerId);
      let revDataChannel = getDataChannel(revPeerId);

      try {
        if (!revPeer) {
          await createPeerConnection(revPeerId);
          // await new Promise(resolve => setTimeout(resolve, 1000));

          revNewMsgsQueArr.push(revQuedMessages[i]);

          continue;
        }

        if (
          !revPeer.localDescription ||
          ('type' in revPeer.localDescription &&
            revPeer.localDescription.type !== 'offer')
        ) {
          await revCreateOffer(revPeerId, revPeer);
        } else {
          if (revDataChannel && revDataChannel.readyState === 'open') {
            console.log(deviceModel, '>>> dc', revDataChannel.readyState);

            revDataChannel.send(JSON.stringify(revQuedMessages[i].revMessage));

            continue;
          }

          revNewMsgsQueArr.push(revQuedMessages[i]);
        }
      } catch (error) {
        console.log(deviceModel, '*** revInitSendMsgs', error);
      }
    }

    // await new Promise(resolve => setTimeout(resolve, 1000));

    setRevQuedMessages(revNewMsgsQueArr);
  };

  useEffect(() => {
    revInitSendMsgs();
  }, [revQuedMessages]);

  // create context value with state variables and functions
  const contextValue = {
    connections,
    createPeerConnection,
    sendMessage,
  };

  useEffect(() => {
    handleAnswer(revPeerAnswer);
  }, [revPeerAnswer]);

  useEffect(() => {
    handleOffer(revPeerOffer);
  }, [revPeerOffer]);

  return (
    <RevWebRTCContext.Provider value={contextValue}>
      {children}
    </RevWebRTCContext.Provider>
  );
};

export {RevWebRTCContextProvider, RevWebRTCContext};

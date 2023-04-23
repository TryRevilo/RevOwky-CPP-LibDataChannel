import React, {createContext, useState} from 'react';
import {RTCPeerConnection, RTCDataChannel} from 'react-native-webrtc';

const WebRTCContext = createContext();

const WebRTCProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [peers, setPeers] = useState([]);

  const connectWebSocket = () => {
    const newSocket = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);
    setSocket(newSocket);
  };

  const createPeerConnection = id => {
    const pc = new RTCPeerConnection({
      iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
    });

    const dc = pc.createDataChannel('data', {ordered: true});
    dc.onopen = () => console.log('Data Channel is open');
    dc.onmessage = event =>
      console.log('Data Channel message received:', event.data);
    dc.onerror = error => console.error('Data Channel error:', error);

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
        socket.send(
          JSON.stringify({
            type: 'candidate',
            candidate: event.candidate,
            to: id,
          }),
        );
      }
    };

    pc.onnegotiationneeded = () => {
      console.log('Negotiation needed');
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          console.log('Local Description set:', pc.localDescription);
          socket.send(
            JSON.stringify({
              type: 'offer',
              sdp: pc.localDescription,
              to: id,
            }),
          );
        })
        .catch(error => console.error('Error creating offer:', error));
    };

    setPeers(prevPeers => [...prevPeers, {id, pc}]);
  };

  return (
    <WebRTCContext.Provider
      value={{socket, peers, connectWebSocket, createPeerConnection}}>
      {children}
    </WebRTCContext.Provider>
  );
};

export {WebRTCContext, WebRTCProvider};

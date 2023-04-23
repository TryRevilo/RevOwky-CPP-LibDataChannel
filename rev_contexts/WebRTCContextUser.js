import React, {useContext, useEffect} from 'react';
// ...

import {WebRTCContext} from './WebRTCContext';

const WebRTCContextUser = () => {
  const {socket, peers, connectWebSocket, createPeerConnection} =
    useContext(WebRTCContext);

  useEffect(() => {
    connectWebSocket();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.type === 'offer') {
          console.log('Offer received:', message.sdp);
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
                  to: message.from,
                }),
              );
            }
          };

          pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
            .then(() => {
              console.log('Remote Description set:', pc.remoteDescription);
              return pc.createAnswer();
            })
            .then(answer => pc.setLocalDescription(answer))
            .then(() => {
              console.log('Local Description set:', pc.localDescription);
              socket.send(
                JSON.stringify({
                  type: 'answer',
                  sdp: pc.localDescription,
                  to: message.from,
                }),
              );
            })
            .catch(error => console.error('Error creating answer:', error));

          setPeers(prevPeers => [...prevPeers, {id: message.from, pc}]);
        } else if (message.type === 'answer') {
          console.log('Answer received:', message.sdp);
          const peer = peers.find(p => p.id === message.from);
          peer.pc
            .setRemoteDescription(new RTCSessionDescription(message.sdp))
            .then(() =>
              console.log('Remote Description set:', peer.pc.remoteDescription),
            )
            .catch(error =>
              console.error('Error setting remote description:', error),
            );
        } else if (message.type === 'candidate') {
          console.log('Candidate received:', message.candidate);
          const peer = peers.find(p => p.id === message.from);
          peer.pc
            .addIceCandidate(new RTCIceCandidate(message.candidate))
            .then(() => console.log('Ice candidate added'))
            .catch(error =>
              console.error('Error adding ice candidate:', error),
            );
        }
      };
    }
  }, [socket, peers]);

  const handleButtonClick = () => {
    createPeerConnection('123');
  };

  return (
    <View>
      <Text>Peers:</Text>
      {peers.map(peer => (
        <Text key={peer.id}>{peer.id}</Text>
      ))}
      <Button title="Create Peer Connection" onPress={handleButtonClick} />
    </View>
  );
};

export default WebRTCContextUser;

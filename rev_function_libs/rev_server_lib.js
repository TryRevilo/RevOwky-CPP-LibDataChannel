import React, {createContext, useState, useRef, useEffect} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
// } from 'react-native-webrtc';

var RNFS = require('react-native-fs');

import {RevSendFile} from './RevSendFile';

const AppFolder = 'Owki';
const DirectoryPath = '/storage/emulated/0/Documents/' + AppFolder;
RNFS.mkdir(DirectoryPath);

var path = DirectoryPath + '/rev_test.txt';

// write the file
RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
  .then(success => {
    console.log('FILE WRITTEN!');
  })
  .catch(err => {
    console.log(err.message);
  });

function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

const RemoteSocketContext = createContext();

const RemoteSocketContextProvider = ({children}) => {
  const [REV_PORT, setREV_PORT] = useState(8000);
  const [REV_IP, setREV_IP] = useState('192.168.191.220');

  const [configuration, setConfiguration] = useState({
    iceServers: [{url: 'stun:stun.1.google.com:19302'}],
  });

  const constraints = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
    audio: true,
    video: {
      mandatory: {
        minWidth: 500,
        minHeight: 300,
        minFrameRate: 30,
      },
    },
  };

  const [SESSION_CONSTRAINTS, setSESSION_CONSTRAINTS] = useState(constraints);

  var [myConnection, setMyConnection] = useState({});
  var [peerConnections, setPeerConnections] = useState({});

  var [newPeerDataChannelMessage, setNewPeerDataChannelMessage] = useState({});

  const userVideo = useRef();
  const [peerStream, setPeerStream] = useState();

  const [localPortraitVideos, setLocalPortraitVideo] = useState([
    {revId: 1, revLocalStream: null},
  ]);

  const [peerVideos, setPeerVideos] = useState([{revId: 1, stream: null}]);

  async function sendMessage(peerId, msg, callback) {
    peerConnections[peerId].dataChannel.send(msg);
    callback();
  }

  async function sendBinaryData(peerId, msg, callback) {
    peerConnections[peerId].dataChannel.send(msg);
    callback();
  }

  var revSetUpRemoteWebSocket = () => {
    // handleLeave();

    conn = new WebSocket(`ws://${REV_IP}:${REV_PORT}`);

    conn.onerror = function (err) {
      console.log('Got error', err);

      return;
    };

    conn.onopen = function () {
      console.log('Connected to the signaling server');

      revWebRTCLogIn();
    };

    // When we got a message from a signaling server
    conn.onmessage = function (msg) {
      var data = JSON.parse(msg.data);

      console.log('>>> data.type : ' + data.type);

      switch (data.type) {
        case 'connection':
          console.log('connected : ' + JSON.stringify(data.success));
          break;
        // When we make connection
        case 'login':
          handleLogin(data.success);
          break;
        // When somebody wants to call us
        case 'offer':
          handleOffer(data);
          break;
        case 'answer':
          handleAnswer(data);
          break;
        // When a remote peer sends an ice candidate to us
        case 'candidate':
          handleCandidate(data.candidate);
          break;
        case 'leave':
          handleLeave(data);
          break;
        case 'rev_data':
          console.log('data : ' + JSON.stringify(data));
          break;
        case 'error':
          console.log('ERR : ' + JSON.stringify(data));
          break;
        default:
          break;
      }
    };

    conn.onclose = function () {
      // SetTimeout(setupWebSocket, 1000);
    };
  };

  function revWebRTCLogIn() {
    send({
      type: 'login',
    });
  }

  // Alias for sending JSON encoded messages
  function send(message) {
    if (message) {
      try {
        conn.send(JSON.stringify(message));
      } catch (error) {}
    }
  }

  function revWebRTCSendFile(peerId) {
    console.log('revWebRTCSendFile');

    new RevSendFile(peerConnections[peerId].peerConnection).transferFile(
      'file:///storage/emulated/0/DCIM/Camera/file_to_send.txt',
    );
  }

  function handleLogin(success) {
    if (success === false) {
      alert('oops...try a different username');
    } else {
      // myConnection = new RTCPeerConnection(configuration);

      // peerConnections[1] = {['peerConnection']: myConnection};

      // setMyConnection(myConnection);

      // revCreateDataChannel(1, 'sendChannel');

      // initIce(myConnection);

      // myConnection.onaddstream = e => {
      //   console.log('+++ 1 onaddstream' + e.stream.getTracks().length);
      // };

      // myConnection.onnegotiationneeded = function () {
      //   // await new Promise(resolve => setTimeout(resolve, 2000));

      //   myConnection
      //     .createOffer(SESSION_CONSTRAINTS)
      //     .then(async offerDescription => {
      //       console.log('offerDescription');

      //       await myConnection.setLocalDescription(offerDescription);

      //       send({
      //         type: 'offer',
      //         offer: offerDescription,
      //       });
      //     })
      //     .catch(e => {
      //       console.log('*** ERR offerDescription : ' + e);
      //     });
      // };
    }
  }

  // When somebody wants to call us
  function handleOffer(data) {
    console.log('>>> OFFER <<<');

    createPeerConnection(2, data);
  }

  function handleAnswer(data) {
    console.log('>>> handleAnswer <<<');

    // myConnection
    //   .setRemoteDescription(
    //     new RTCSessionDescription(data.answer.localDescription),
    //   )
    //   .then(() => {
    //     console.log('+++ handleAnswer setRemoteDescription');
    //   })
    //   .catch(e => {
    //     console.log(`*** handleAnswer: ${e} \n!!! RE-START`);

    //     revSetUpRemoteWebSocket();
    //   });
  }

  // When we got an ice candidate from a remote user
  function handleCandidate(candidate) {
    console.log('>>> handleCandidate <<<');

    // let iceCandidate = new RTCIceCandidate(candidate);

    // if (!peerConnections.hasOwnProperty(2)) return;

    // let pc = peerConnections[2].peerConnection;

    // if (pc.remoteDescription) {
    //   pc.addIceCandidate(iceCandidate)
    //     .then(_ => {
    //       console.log('+++ ICE Added Successfully !');
    //     })
    //     .catch(e => {
    //       console.log(`*** addIceCandidate: ${e}`);
    //     });
    // }
  }

  function initIce(conn) {
    // conn.onicecandidate = function (event) {
    //   console.log('>>> onicecandidate : ' + !!event.candidate);

    //   if (event.candidate) {
    //     send({
    //       type: 'candidate',
    //       candidate: event.candidate,
    //     });
    //   }
    // };

    // conn.oniceconnectionstatechange = e =>
    //   console.log(',,, Ice : ' + conn.iceConnectionState);

    // if (conn.iceConnectionState.localeCompare('failed') === 0) {
    //   revSetUpRemoteWebSocket();

    //   console.log('!!! RE-START - ICE conn.F');
    // }
  }

  function revCreateDataChannel(channelId, channelType) {
    // let pc = peerConnections[channelId].peerConnection;

    // let dataChannel = pc.createDataChannel(channelType);
    // dataChannel.binaryType = 'arraybuffer';

    let handleSendChannelStatusChange = event => {
      // console.log(
      //   'XXX c-Type : ' +
      //     channelType +
      //     ' : ' +
      //     dataChannel.readyState +
      //     ' event : ' +
      //     JSON.stringify(event),
      // );

      // if (
      //   !dataChannel ||
      //   !dataChannel.readyState ||
      //   dataChannel.readyState.localeCompare('closed') === 0
      // ) {
      //   send({type: 'leave'});
      //   handleLeave();
      // }
    };

    class Channel {
      static BYNARY_TYPE_CHANNEL = 'arraybuffer';
      static MAXIMUM_SIZE_DATA_TO_SEND = 65535;
      static BUFFER_THRESHOLD = 65535;
      static LAST_DATA_OF_FILE = 'LDOF7';
    }

    function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    let dataChannelCallback = event => {
      let receivedBuffer = [];
      let totalBytesFileBuffer = 0;
      let totalBytesArrayBuffers = 0;

      let selectedFileURI;
      let name;
      let type;
      let size;

      let sC = event.channel;

      let handleDataChannelMessageReceived = function (event) {
        let {data} = event;

        data = JSON.parse(data);

        let {message, fileContent} = data;

        try {
          if (data.byteLength) {
            receivedBuffer.push(fileContent);

            totalBytesArrayBuffers += data.byteLength;
          } else if (message === Channel.LAST_DATA_OF_FILE) {
            data['bytesArrayBuffer'] = receivedBuffer.join('');

            RNFS.writeFile(
              DirectoryPath + '/' + name,
              receivedBuffer.join(''),
              'base64',
            )
              .then(success => {
                console.log('FILE WRITTEN!');
              })
              .catch(err => {
                console.log(err.message);
              });

            setNewPeerDataChannelMessage(data);

            // sC.close();

            receivedBuffer = [];
            totalBytesFileBuffer = 0;
            totalBytesArrayBuffers = 0;
          } else {
            selectedFileURI = data.selectedFileURI;
            name = data.name;
            type = data.type;
            size = data.size;

            totalBytesFileBuffer = data.totalByte || 0;
          }
        } catch (err) {
          receivedBuffer = [];
          totalBytesFileBuffer = 0;
          totalBytesArrayBuffers = 0;
        }
      };

      sC.onopen = handleSendChannelStatusChange;
      sC.onclose = handleSendChannelStatusChange;
      sC.onmessage = handleDataChannelMessageReceived;
    };

    pc.ondatachannel = dataChannelCallback;

    peerConnections[channelId]['dataChannel'] = dataChannel;
  }

  function createPeerConnection(channelId, data) {
    let pc;

    if (!peerConnections.hasOwnProperty(channelId)) {
      try {
        pc = new RTCPeerConnection(configuration);
      } catch (e) {
        console.log('*** Something went wrong! pc not created !', e);

        return;
      }
    } else {
      pc = peerConnections[channelId].peerConnection;
    }

    peerConnections[channelId] = {peerConnection: pc};

    setPeerConnections(peerConnections);

    initIce(pc);

    revCreateDataChannel(channelId, 'receiveChannel');

    pc.setRemoteDescription(new RTCSessionDescription(data.offer)).then(() => {
      pc.createAnswer().then(localDescription => {
        pc.setLocalDescription(localDescription).then(() => {
          send({
            type: 'answer',
            localDescription,
          });
        });
      });
    });

    pc.onaddstream = e => {
      console.log(`&&& ${channelId} onaddstream ${e.stream.toURL()}`);

      pc.addStream(e.stream);

      setPeerStream(e.stream);

      setPeerVideos([{revId: channelId, revPeerStream: e.stream}]);
    };
  }

  async function handleLeave() {
    console.log('peerConnections : ' + Object.keys(peerConnections).length);

    for (let key of Object.keys(peerConnections)) {
      let currConn = peerConnections[key].peerConnection;

      currConn.close();
      currConn.onicecandidate = null;
      currConn.onaddstream = null;

      peerConnections[key].dataChannel.close();

      delete peerConnections[key];
    }

    console.log('peerConnections : ' + JSON.stringify(peerConnections));

    // send({type: 'leave'});

    // setPeerConnections({});
  }

  return (
    <RemoteSocketContext.Provider
      value={{
        REV_PORT,
        REV_IP,
        SESSION_CONSTRAINTS,
        myConnection,
        revSetUpRemoteWebSocket,
        sendMessage,
        revWebRTCSendFile,
        newPeerDataChannelMessage,
        peerConnections,
        handleLeave,
        userVideo,
        peerStream,
        localPortraitVideos,
        setLocalPortraitVideo,
        peerVideos,
      }}>
      {children}
    </RemoteSocketContext.Provider>
  );
};

/* START SEND FILE **/

/* END SEND FILE **/

const styles = StyleSheet.create({
  peerStreamNullContainer: {
    display: 'flex',
    width: '100%',
    marginTop: '4%',
  },
  peerStreamNull: {
    color: '#f8bbd0',
    fontSize: 37,
    textAlign: 'center',
    marginTop: 8,
  },
  peerStreamNullTxt: {
    color: '#f8bbd0',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 10,
    marginTop: -7,
  },
});

export {RemoteSocketContextProvider, RemoteSocketContext};

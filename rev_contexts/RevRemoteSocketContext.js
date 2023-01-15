import React, {createContext, useState, useRef} from 'react';

var RNFS = require('react-native-fs');

import {RevSendFile} from '../rev_function_libs/RevSendFile';

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

const RevRemoteSocketContext = createContext();

const RevRemoteSocketContextProvider = ({children}) => {
  const [REV_PORT, setREV_PORT] = useState(4000);
  const [REV_IP, setREV_IP] = useState('192.168.0.13');
  const [REV_ROOT_URL, setREV_ROOT_URL] = useState(
    'http://' + REV_IP + ':' + REV_PORT,
  );

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

  var [myConnection, setMyConnection] = useState({});
  var [peerConnections, setPeerConnections] = useState({});

  var [newPeerDataChannelMessage, setNewPeerDataChannelMessage] = useState({});

  const userVideo = useRef();
  const [peerStream, setPeerStream] = useState();

  const [localPortraitVideos, setLocalPortraitVideo] = useState([
    {revId: 1, revLocalStream: null},
  ]);

  const [peerVideos, setPeerVideos] = useState([{revId: 1, stream: null}]);

  function revWebRTCSendFile(peerId) {
    console.log('>>> revWebRTCSendFile');

    new RevSendFile(peerConnections[peerId].peerConnection).transferFile(
      'file:///storage/emulated/0/DCIM/Camera/file_to_send.txt',
    );
  }

  const revHandleMsgSentEvent = data => {
    console.log('>>> revHandleMsgSentEvent : ' + JSON.stringify(data));

    setNewPeerDataChannelMessage(data);
  };

  async function handleLeave() {}

  return (
    <RevRemoteSocketContext.Provider
      value={{
        REV_PORT,
        setREV_PORT,
        REV_IP,
        setREV_IP,
        REV_ROOT_URL,
        setREV_ROOT_URL,
        myConnection,
        revHandleMsgSentEvent,
        revWebRTCSendFile,
        newPeerDataChannelMessage,
        setNewPeerDataChannelMessage,
        peerConnections,
        handleLeave,
        userVideo,
        peerStream,
        localPortraitVideos,
        setLocalPortraitVideo,
        peerVideos,
      }}>
      {children}
    </RevRemoteSocketContext.Provider>
  );
};

export {RevRemoteSocketContextProvider, RevRemoteSocketContext};

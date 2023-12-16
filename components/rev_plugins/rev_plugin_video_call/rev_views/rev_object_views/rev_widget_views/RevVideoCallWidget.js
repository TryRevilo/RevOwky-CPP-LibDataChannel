import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RTCView} from 'react-native-webrtc';

import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevVideoCallWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {
    revOnAddLocalStream,
    revOnAddRemoteStream,
    revOnVideoChatMessageReceived,
  } = revVarArgs;

  const {revEndVideoCall} = useContext(RevWebRTCContext);

  const revLocalStreamRef = useRef(null);
  const [revLocalStreamView, setRevLocalStreamView] = useState(null);
  const revRemotePeerStreamsObjRef = useRef({});

  const [revMainPeerStream, setRevMainPeerStream] = useState(null);
  const [revMainPeerStreamView, setRevMainPeerStreamView] = useState(null);
  const [revPeerStreamsViewsArr, setRevPeerStreamsViewsArr] = useState([]);

  revOnAddLocalStream(revLocalStream => {
    revLocalStreamRef.current = revLocalStream;

    if (revLocalStream) {
      setRevLocalStreamView(
        <View style={styles.revMyVideoStreamContainer}>
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={revLocalStream.toURL()}
            zOrder={0}
            style={styles.revVideoStyle}
          />
        </View>,
      );
    }
  });

  revOnAddRemoteStream(revPeerRemoteStream => {
    const {revPeerId, revRemoteStream} = revPeerRemoteStream;

    let revNewPeerRemoteStream = {...revRemotePeerStreamsObjRef.current};
    revNewPeerRemoteStream[revPeerId] = revRemoteStream;

    revRemotePeerStreamsObjRef.current[revPeerId] = revRemoteStream;

    let revNewVideoParticipantViewsArr = [];
    let revMainPeer = null;

    Object.entries(revRemotePeerStreamsObjRef.current).forEach(
      ([revPeerId, revRemoteStream]) => {
        if (!revMainPeer && revRemoteStream) {
          revMainPeer = {revPeerId, revRemoteStream};
        }

        revNewVideoParticipantViewsArr.push(
          <RevVideoParticipantView
            key={revPeerId}
            revRemoteVideoStream={revRemoteStream}
          />,
        );
      },
    );

    setRevMainPeerStream(revMainPeer);
    setRevPeerStreamsViewsArr(revNewVideoParticipantViewsArr);
  });

  revOnVideoChatMessageReceived(revMessage => {
    console.log('>>> revMessage', JSON.stringify(revMessage));
  });

  var RevVideoParticipantView = ({revRemoteVideoStream}) => {
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

  useEffect(() => {
    if (revMainPeerStream) {
      setRevMainPeerStreamView(
        <RTCView
          mirror={true}
          objectFit={'cover'}
          streamURL={revMainPeerStream.revRemoteStream.toURL()}
          zOrder={0}
          style={styles.revRemoteVideoStyle}
        />,
      );
    }
  }, [revMainPeerStream]);

  return (
    <View style={styles.revModalVideoChatArea}>
      <View style={styles.revModalrevPeerVideoContainer}>
        {revMainPeerStreamView}
      </View>

      {revLocalStreamView}

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
          {revPeerStreamsViewsArr}
        </View>
      </View>
      <View style={styles.revEndCallBtnWrapper}>
        <TouchableOpacity onPress={async () => await revEndVideoCall([])}>
          <Text style={styles.revEndCallBtn}>
            <FontAwesome name="power-off" style={styles.revEndCallBtnIcon} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

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
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    overflow: 'hidden',
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

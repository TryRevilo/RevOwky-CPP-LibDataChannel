import React, {useState, useContext} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RTCView} from 'react-native-webrtc';

import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';
import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import PeerVideoView from '../PeerVideoView';

import DeviceInfo from 'react-native-device-info';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

function RevVideoCallModal({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();
  const deviceModel = DeviceInfo.getModel();

  const [isModalVisible, setModalVisible] = useState(false);

  if (revVarArgs && 'isModalVisible' in revVarArgs) {
    setModalVisible(revVarArgs.isModalVisible);
  }

  const {revInitVideoCall} = useContext(RevWebRTCContext);
  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const [revPeerVideoView, setRevPeerVideoView] = useState(null);
  const [revPeerVideoViewsArr, setRevPeerVideoViewsArr] = useState([]);

  const revOnAddRemoteStream = () => {
    console.log(deviceModel, '>>> revOnAddRemoteStreamCallBack <<<');
  };

  const toggleModal = async () => {
    let revTargetPeerId =
      REV_LOGGED_IN_ENTITY._remoteRevEntityGUID == 407 ? 375 : 407;

    let revOnAddLocalStream = revLocalStream => {
      console.log('>>> CALL LIVE <<<');

      setModalVisible(!isModalVisible);
      setRevLocalVideoStream(revLocalStream);
    };

    try {
      await revInitVideoCall({
        revTargetPeerId: revTargetPeerId,
        revOnAddLocalStream: revOnAddLocalStream,
        revOnAddRemoteStream: revOnAddRemoteStream,
      });
    } catch (error) {
      console.log('*** error -toggleModal', error);
    }
  };

  let RevCallBtn = () => {
    return (
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.currentChatOptionTab}>
          <FontAwesome
            name="video-camera"
            style={styles.currentChatOptionTabIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  let peerVideosArr = [
    {revId: null, revId: null, revPeerStream: revLocalVideoStream},
  ];

  const revVideoParticipantView = () => {
    return (
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revVideoParticipantContainer,
        ]}></View>
    );
  };

  let RevModalContent = () => {
    return (
      <View style={styles.modalVideoChatArea}>
        <View style={styles.modalPeerVideoContainer}>
          {revLocalVideoStream && (
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revLocalVideoStream.toURL()}
              zOrder={0}
              style={styles.videoStyle}
            />
          )}
        </View>
        <View style={styles.myVideoStreamContainer}>
          {revLocalVideoStream && (
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revLocalVideoStream.toURL()}
              zOrder={0}
              style={styles.videoStyle}
            />
          )}
        </View>
        <View
          style={[revSiteStyles.revFlexWrapper, styles.revVideoAudiencetArea]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            Participants
          </Text>

          {revVideoParticipantView()}
        </View>
        <View style={styles.endCallBtnWrapper}>
          <TouchableOpacity onPress={() => toggleModal()}>
            <Text style={styles.endCallBtn}>
              <FontAwesome name="power-off" style={styles.endCallBtnIcon} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      <RevCallBtn />
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left">
        <RevModalContent />
      </Modal>
    </View>
  );
}

export default RevVideoCallModal;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
  currentChatOptionTab: {
    backgroundColor: '#ffebee',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 50,
    opacity: 0.5,
  },
  currentChatOptionTabIcon: {
    color: '#ec407a',
    textAlign: 'center',
    fontSize: 11,
  },
  modalVideoChatArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#444',
  },
  modalPeerVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  peerVideoContainer: {
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
  videoStyle: {
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  myVideoStreamContainer: {
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
  endCallBtnWrapper: {
    backgroundColor: '#e57373',
    alignSelf: 'center',
    padding: 1,
    position: 'absolute',
    bottom: '5%',
    borderRadius: 100,
  },
  endCallBtn: {
    backgroundColor: '#ba000d',
    width: 'auto',
    padding: 15,
    borderRadius: 100,
  },
  endCallBtnIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
  /** START Collective call audience */
  revVideoAudiencetArea: {
    position: 'absolute',
    bottom: '10%', // adjust as needed
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  revVideoParticipantContainer: {
    backgroundColor: '#444',
    borderStyle: 'solid',
    borderColor: '#444',
    borderWidth: 1,
  },

  /** END Collective call audience */
});

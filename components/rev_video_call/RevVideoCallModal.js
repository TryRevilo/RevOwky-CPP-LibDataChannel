import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import PeerVideoView from '../rev_call/PeerVideoView';

function RevVideoCallModal() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

  let RevModalContent = () => {
    return (
      <View style={styles.modalVideoChatArea}>
        <View style={styles.modalPeerVideoContainer}>
          {[].map(peerVideo => (
            <PeerVideoView
              key={peerVideo.revId}
              revId={peerVideo.revId}
              revPeerStream={peerVideo.revPeerStream}
            />
          ))}
        </View>
        <View style={styles.myVideoStreamContainer}></View>
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
});

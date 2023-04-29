import React, {useState, useEffect} from 'react';
import {View, Modal, Button, StyleSheet} from 'react-native';

import {RTCView} from 'react-native-webrtc';

const RevIncomingCallModal = ({revVarArgs}) => {
  console.log('--->>> RevIncomingCallModal <<<');

  const [modalVisible, setModalVisible] = useState(true);
  const [revLocalVideoStream, setRevLocalVideoStream] = useState(
    revVarArgs.revLocalVideoStream,
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  const revModalContent = () => {
    return (
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
    );
  };

  const renderModal = () => {
    return (
      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="slide">
        {revModalContent()}
        <Button onPress={closeModal} title="Close Modal" />
      </Modal>
    );
  };

  useEffect(() => {
    setModalVisible(true);
  }, []);

  return (
    <>
      {renderModal()}
      {/* Your component content here */}
    </>
  );
};

export default RevIncomingCallModal;

const styles = StyleSheet.create({
  modalPeerVideoContainer: {
    flex: 1,
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
});

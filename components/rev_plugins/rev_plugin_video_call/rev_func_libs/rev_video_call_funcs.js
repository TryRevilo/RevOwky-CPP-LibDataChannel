import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';

export const revModalView = revLocalVideoStream => {
  console.log('XXX revModalView', JSON.stringify(revLocalVideoStream));

  let RevModalContent = () => {
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

  return (
    <Modal isVisible={true} onSwipeComplete={() => true} swipeDirection="left">
      <RevModalContent />
    </Modal>
  );
};

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

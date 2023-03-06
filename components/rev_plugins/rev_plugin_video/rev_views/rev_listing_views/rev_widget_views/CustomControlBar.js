import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

const CustomControlBar = ({onPausePress, onPlayPress, paused}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={paused ? onPlayPress : onPausePress}
        style={styles.overlay}>
        <View style={styles.playButton}>
          <Text style={styles.playButtonText}>Play</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 50,
  },
  playPauseButton: {
    height: 30,
    width: 30,
    marginHorizontal: 15,
  },
  playButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  playButtonText: {
    color: '#444',
    fontSize: 14,
  },
});

export default CustomControlBar;

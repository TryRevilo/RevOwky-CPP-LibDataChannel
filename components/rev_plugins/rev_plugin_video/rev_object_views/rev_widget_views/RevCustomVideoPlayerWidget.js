import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Animated} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export const RevCustomVideoPlayerWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;
  let revURL = revVarArgs.revURL;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    };

    const fadeIn = () => {
      setShowControls(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => fadeOut(), 3000);
    };

    const interval = setInterval(() => {
      if (videoRef.current && !isPlaying) {
        setShowControls(true);
        fadeOut();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [fadeAnim, isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setShowControls(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      videoRef.current.play();
      setTimeout(() => setShowControls(false), 3000);
    }
    setIsPlaying(!isPlaying);
  };

  const handleFastForward = () => {
    videoRef.current.seek(videoRef.current.getCurrentTime() + 10);
  };

  const handleRewind = () => {
    videoRef.current.seek(videoRef.current.getCurrentTime() - 10);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setShowControls(!showControls);
          if (showControls) {
            clearTimeout();
          } else {
            setTimeout(() => setShowControls(false), 3000);
          }
        }}>
        <Video
          ref={videoRef}
          source={{uri: revURL}}
          style={styles.video}
          resizeMode="contain"
          onPlaybackResume={() => setShowControls(false)}
          onPlaybackStalled={() => setIsPlaying(false)}
          onEnd={() => setIsPlaying(false)}
          onPlaybackRateChange={() => setShowControls(true)}
          onProgress={() => setShowControls(false)}
          paused={true} // <-- Set the video to initially paused
        />
        {showControls && (
          <Animated.View style={[styles.controls, {opacity: fadeAnim}]}>
            <TouchableOpacity onPress={handleRewind}>
              <Text>Rewind</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause}>
              <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFastForward}>
              <Text>Fast Forward</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        {!isPlaying && !showControls && (
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  playButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

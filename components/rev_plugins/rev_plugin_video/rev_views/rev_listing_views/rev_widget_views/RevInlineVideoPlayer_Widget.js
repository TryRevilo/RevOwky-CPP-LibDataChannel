import React, {useState, useRef} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevInlineVideoPlayer_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  let revURL = revVarArgs.revURL;

  const videoRef = useRef(null);
  const videoProgressVall = useRef(0);

  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleProgress = ({currentTime, seekableDuration}) => {
    setCurrentTime(currentTime);

    let revCuurPlayPos = currentTime / seekableDuration;
    if (videoProgressVall.current) {
      videoProgressVall.current.setNativeProps({
        style: {width: `${revCuurPlayPos * 100}%`},
      });
    }
  };

  const handleLoad = event => {
    const {naturalSize} = event;
    const {width, height} = naturalSize;
    const videoAspectRatio = width / height;
    setAspectRatio(videoAspectRatio);

    setDuration(event.duration);
  };

  const revHandleTogglePlayback = () => {
    setPaused(!paused);
  };

  const handleForward = () => {
    videoRef.current.seek(currentTime + 10);
  };

  const ForwardButton = () => {
    return (
      <TouchableOpacity onPress={handleForward} style={styles.revVidMoveBtn}>
        <FontAwesome
          name="fast-forward"
          style={[revSiteStyles.revSiteTxtBold, revSiteStyles.revSiteTxtMedium]}
        />
      </TouchableOpacity>
    );
  };

  const handleRewind = () => {
    videoRef.current.seek(currentTime - 10);
  };

  const RewindButton = () => {
    return (
      <TouchableOpacity onPress={handleRewind} style={styles.revVidMoveBtn}>
        <FontAwesome
          name="fast-backward"
          style={[revSiteStyles.revSiteTxtBold, revSiteStyles.revSiteTxtMedium]}
        />
      </TouchableOpacity>
    );
  };

  const RevPauseButton = () => {
    return (
      <TouchableOpacity
        onPress={revHandleTogglePlayback}
        style={styles.revVidMoveBtn}>
        <FontAwesome
          name={paused ? 'play' : 'pause'}
          style={[revSiteStyles.revSiteTxtBold, revSiteStyles.revSiteTxtMedium]}
        />
      </TouchableOpacity>
    );
  };

  const RevOverLayPlayBtn = () => {
    return (
      <View
        key={'revOverlayButton_' + revGetRandInteger()}
        style={styles.revOverlayButton}>
        <View style={styles.revPlayButton}>
          <Text style={styles.revPlayButtonText}>Play</Text>
        </View>
      </View>
    );
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  const TimeDisplay = () => {
    return (
      <Text
        style={[revSiteStyles.revSiteTxtColor, revSiteStyles.revSiteTxtSmall]}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    );
  };

  return (
    <View key={revGetRandInteger(100, 1000)} style={styles.revVideoContainer}>
      <TouchableWithoutFeedback onPress={revHandleTogglePlayback}>
        <View style={{flex: 1}}>
          <Video
            ref={videoRef}
            source={{
              uri: revURL,
            }}
            paused={paused}
            style={[styles.revVideo, {aspectRatio}]}
            onLoad={handleLoad}
            onProgress={handleProgress}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.revProgressContainer}>
        <View
          ref={videoProgressVall}
          style={[
            styles.revProgressBar,
            {width: `${videoProgressVall.current * 100}%`},
          ]}
        />
      </View>

      <View style={[revSiteStyles.revFlexWrapper, styles.revVidMoveWrapper]}>
        <ForwardButton />
        <RevPauseButton />
        <RewindButton />
        <TimeDisplay />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revVideoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  revVideo: {
    flex: 1,
  },
  revOverlayButton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revPlayButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 32,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  revPlayButtonText: {
    color: '#444',
    fontSize: 10,
  },
  revProgressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  revProgressBar: {
    height: '100%',
    backgroundColor: 'red',
  },
  revVidMoveWrapper: {
    alignItems: 'center',
  },
  revVidMoveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});

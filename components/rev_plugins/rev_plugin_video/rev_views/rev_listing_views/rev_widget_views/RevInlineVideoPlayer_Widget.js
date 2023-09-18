import React, {useEffect, useState, useRef} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevInlineVideoPlayer_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  let revURL = revVarArgs.revURL;

  const revVideoRef = useRef(null);
  const revVideoProgressVall = useRef(0);
  const [revVideoDuration, setRevVideoDuration] = useState(0);

  const [revPaused, setRevPaused] = useState(true);
  const [revAspectRatio, setRevAspectRatio] = useState(null);

  const [isRevVideoLoaded, setIsRevVideoLoaded] = useState(false);
  const [isRevInternetReachable, setIsRevInternetReachable] = useState(true);

  const [revCurrentTime, setRevCurrentTime] = useState(0);

  const handleRevProgress = ({currentTime, seekableDuration}) => {
    let revCuurPlayPos = currentTime / seekableDuration;

    if (revVideoProgressVall.current) {
      revVideoProgressVall.current.setNativeProps({
        style: {
          width: `${revCuurPlayPos * 100}%`,
          backgroundColor: 'green',
        },
      });
    }

    if (revCurrentTime > 0 && Math.floor(currentTime) >= revVideoDuration) {
      revVideoRef.current.seek(0);
      setRevCurrentTime(0);
      handleRevTogglePlayback();

      revVideoProgressVall.current.setNativeProps({
        style: {
          width: `${revCuurPlayPos * 0}%`,
        },
      });
    } else {
      setRevCurrentTime(currentTime);
    }
  };

  const handleRevLoad = event => {
    setRevVideoDuration(Math.floor(event.duration));

    setIsRevVideoLoaded(true);

    const {naturalSize} = event;
    const {width, height} = naturalSize;
    const revVideorevAspectRatio = width / height;
    setRevAspectRatio(revVideorevAspectRatio);
  };

  const handleRevTogglePlayback = () => {
    setRevPaused(!revPaused);
  };

  const RevForwardButton = () => {
    return (
      <TouchableOpacity
        onPress={handleRevForwardTabPressed}
        style={styles.revVidMoveBtn}>
        <FontAwesome
          name="fast-forward"
          style={[revSiteStyles.revSiteTxtBold, revSiteStyles.revSiteTxtMedium]}
        />
      </TouchableOpacity>
    );
  };

  const handleRevForwardTabPressed = () => {
    setRevCurrentTime(prev => {
      let revNewVal = prev + 10;
      revVideoRef.current.seek(revNewVal);

      return revNewVal;
    });
  };

  const handleRevRewindTabPressed = () => {
    setRevCurrentTime(prev => {
      let revNewVal = prev - 10;
      revVideoRef.current.seek(revNewVal);

      return revNewVal;
    });
  };

  const RevRewindButton = () => {
    return (
      <TouchableOpacity
        onPress={handleRevRewindTabPressed}
        style={styles.revVidMoveBtn}>
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
        onPress={handleRevTogglePlayback}
        style={styles.revVidMoveBtn}>
        <FontAwesome
          name={revPaused ? 'play' : 'pause'}
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

  const revFormatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  const RevTimeDisplay = () => {
    return (
      <Text
        style={[revSiteStyles.revSiteTxtColor, revSiteStyles.revSiteTxtSmall]}>
        {revFormatTime(revCurrentTime)} / {revFormatTime(revVideoDuration)}
      </Text>
    );
  };

  const handleRevVideoError = error => {
    if (error.message.includes('Network request failed')) {
      setIsRevInternetReachable(false);
    }
  };

  NetInfo.fetch().then(state => {
    setIsRevInternetReachable(state.isRevInternetReachable);
  });

  const revRewindTabRef = useRef(null);
  const revForwardTabRef = useRef(null);

  useEffect(() => {
    revRewindTabRef.current = <RevRewindButton />;
    revForwardTabRef.current = <RevForwardButton />;
  }, []);

  return (
    <View style={revSiteStyles.revFlexContainer}>
      {
        <>
          {!isRevVideoLoaded && (
            <Text
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtTiny_X,
              ]}>
              Loading video...
            </Text>
          )}
          <View style={styles.revVideoContainer}>
            <TouchableWithoutFeedback onPress={handleRevTogglePlayback}>
              <View style={{flex: 1}}>
                <Video
                  ref={revVideoRef}
                  source={{
                    uri: revURL,
                  }}
                  paused={revPaused}
                  style={[styles.revVideo, {aspectRatio: revAspectRatio}]}
                  onLoad={handleRevLoad}
                  onProgress={handleRevProgress}
                  onError={handleRevVideoError}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.revProgressContainer}>
              <View
                ref={revVideoProgressVall}
                style={[
                  styles.revProgressBar,
                  {width: `${revVideoProgressVall.current * 100}%`},
                ]}
              />
            </View>

            <View
              style={[revSiteStyles.revFlexWrapper, styles.revVidMoveWrapper]}>
              {revRewindTabRef.current}
              <RevPauseButton />
              {revForwardTabRef.current}
              <RevTimeDisplay />
            </View>
          </View>
        </>
      }
      {!isRevVideoLoaded && !isRevInternetReachable && (
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
            {paddingHorizontal: 9, paddingVertical: 5},
          ]}>
          Unable to connect to the server.
        </Text>
      )}
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
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  revProgressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  revVidMoveWrapper: {
    alignItems: 'center',
  },
  revVidMoveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});

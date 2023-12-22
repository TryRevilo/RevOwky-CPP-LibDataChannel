import React, {useEffect, useState, useRef} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevInlineVideoPlayer_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  let revURL = revVarArgs.revURL;

  const revVideoRef = useRef(null);
  const revVideoProgressVall = useRef(0);
  const [revVideoDuration, setRevVideoDuration] = useState(0);

  const [revPaused, setRevPaused] = useState(true);
  const [revAspectRatio, setRevAspectRatio] = useState(0);
  const [revVidWidth, setRevVidWidth] = useState(1);
  const [revVidHeight, setRevVidHeight] = useState(1);

  const [isRevVideoLoaded, setIsRevVideoLoaded] = useState(false);
  const [isRevInternetReachable, setIsRevInternetReachable] = useState(true);

  const [revCurrentTime, setRevCurrentTime] = useState(0);

  // State variable to store dimensions
  const [revContainerDimensions, setRevContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const revVidFooterTabStylesArr = [
    revSiteStyles.revSiteTxtColor,
    revSiteStyles.revSiteTxtBold,
    revSiteStyles.revSiteTxtTiny_X,
  ];

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

    setRevVidWidth(width);
    setRevVidHeight(height);
  };

  const handleRevTogglePlayback = () => {
    setRevPaused(!revPaused);
  };

  const handleRevRewindTabPressed = () => {
    setRevCurrentTime(prev => {
      let revNewVal = prev - 10;
      revVideoRef.current.seek(revNewVal);

      return revNewVal;
    });
  };

  const handleRevForwardTabPressed = () => {
    setRevCurrentTime(prev => {
      let revNewVal = prev + 10;
      revVideoRef.current.seek(revNewVal);

      return revNewVal;
    });
  };

  const RevPauseButton = () => {
    return (
      <TouchableOpacity
        onPress={handleRevTogglePlayback}
        style={styles.revVidFooterTab}>
        <FontAwesome
          name={revPaused ? 'play' : 'pause'}
          style={revVidFooterTabStylesArr}
        />
      </TouchableOpacity>
    );
  };

  const RevRewindButton = () => {
    return (
      <TouchableOpacity
        onPress={handleRevRewindTabPressed}
        style={styles.revVidFooterTab}>
        <FontAwesome name="fast-backward" style={revVidFooterTabStylesArr} />
      </TouchableOpacity>
    );
  };

  const RevForwardButton = () => {
    return (
      <TouchableOpacity
        onPress={handleRevForwardTabPressed}
        style={styles.revVidFooterTab}>
        <FontAwesome name="fast-forward" style={revVidFooterTabStylesArr} />
      </TouchableOpacity>
    );
  };

  const RevOverLayPlayBtn = () => {
    return (
      <>
        {revPaused ? (
          <TouchableOpacity
            onPress={handleRevTogglePlayback}
            style={styles.revOverlayButton}>
            <View style={styles.revPlayButton}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtBold,
                  revSiteStyles.revSiteTxtTiny_X,
                ]}>
                Play
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </>
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
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny_X,
        ]}>
        {revFormatTime(revCurrentTime)} / {revFormatTime(revVideoDuration)}
      </Text>
    );
  };

  const RevViewsCountDisplay = () => {
    return (
      <Text style={{marginLeft: 12}}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          {'Views ~ '}
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          2
        </Text>
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

  useEffect(() => {
    if (revVidWidth && revVidHeight) {
      setRevAspectRatio(revVidWidth / revVidHeight);
    }
  }, [revVidWidth, revVidHeight]);

  // Callback function to update dimensions when layout changes
  const handleRevLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setRevContainerDimensions({width, height});
  };

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
                {paddingHorizontal: 9, paddingVertical: 5},
              ]}>
              Loading video...
            </Text>
          )}
          <View style={styles.revVideoContainer}>
            <TouchableWithoutFeedback
              onPress={handleRevTogglePlayback}
              onLayout={handleRevLayout}
              style={{flex: 1}}>
              <Video
                ref={revVideoRef}
                source={{
                  uri: revURL,
                }}
                paused={revPaused}
                onLoad={handleRevLoad}
                onProgress={handleRevProgress}
                onError={handleRevVideoError}
                resizeMode={'contain'}
                style={{
                  height:
                    (revContainerDimensions.width / revVidWidth) * revVidHeight,
                }}
              />
            </TouchableWithoutFeedback>

            {revPaused && (
              <Ionicons
                name="tv-outline"
                style={[
                  revSiteStyles.revSiteTxtColorLight_X,
                  styles.revOverlayScreen,
                  {fontSize: 105},
                ]}
              />
            )}

            <RevOverLayPlayBtn />

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
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revVidFooterTabsWrapper,
              ]}>
              {revRewindTabRef.current}
              <RevPauseButton />
              {revForwardTabRef.current}
              <RevTimeDisplay />
              <RevViewsCountDisplay />
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
            {
              paddingHorizontal: 9,
              paddingVertical: 5,
              position: 'absolute',
              bottom: 42,
            },
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
    minHeight: 205,
    backgroundColor: '#EEEEEE',
    position: 'relative',
  },
  revOverlayButton: {
    ...StyleSheet.absoluteFillObject,
    top: '31%',
    left: '44%',
  },
  revOverlayScreen: {
    ...StyleSheet.absoluteFillObject,
    top: '15%',
    left: '32%',
  },
  revPlayButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    width: 32,
    height: 32,
    opacity: 0.7,
    borderRadius: 8,
  },
  revProgressContainer: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  revProgressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  revVidFooterTabsWrapper: {
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderTopColor: '#FFFFFF',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    bottom: 0,
  },
  revVidFooterTab: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const SLIDE_DURATION = 500; // duration of slide animation in milliseconds

export const useRevSlideInView = () => {
  const revSlideInView = ({revViewContent = null}) => {
    const [slideAnim] = useState(new Animated.Value(0)); // initialize animation value
    const [isVisible, setIsVisible] = useState(false); // state to control visibility of the View

    useEffect(() => {
      if (isVisible) {
        Animated.timing(slideAnim, {
          toValue: 1, // animate to 1 (slide up)
          duration: SLIDE_DURATION,
          useNativeDriver: true, // use native driver for performance
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0, // animate to 0 (slide down)
          duration: SLIDE_DURATION,
          useNativeDriver: true,
        }).start();
      }
    }, [isVisible]);

    const bottomPosition = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, -100], // adjust to quarter of Parent view height
    });

    return (
      <Animated.View style={[styles.slideInView, {bottom: bottomPosition}]}>
        {revViewContent}
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    slideInView: {
      position: 'absolute',
      backgroundColor: 'white',
      width: '100%',
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return {revSlideInView};
};

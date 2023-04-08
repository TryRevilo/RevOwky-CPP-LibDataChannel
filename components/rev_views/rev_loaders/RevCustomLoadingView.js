import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

import {revIsEmptyVar} from '../../../rev_function_libs/rev_gen_helper_functions';

const RevCustomLoadingView = ({text, backgroundColor}) => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: revIsEmptyVar(backgroundColor)
            ? '#F8FAFF'
            : backgroundColor,
        },
      ]}>
      <Animated.View
        style={[styles.spinnerContainer, {transform: [{rotate: spin}]}]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </Animated.View>

      {revIsEmptyVar(text) ? null : <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    height: '100%',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 37,
    height: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  text: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
  },
});

export default RevCustomLoadingView;

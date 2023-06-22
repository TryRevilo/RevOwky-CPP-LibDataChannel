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
import {useRevSiteStyles} from '../RevSiteStyles';

const RevCustomLoadingView = ({revLoadintText, backgroundColor}) => {
  const {revSiteStyles} = useRevSiteStyles();

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
        styles.revContainer,
        {
          backgroundColor: revIsEmptyVar(backgroundColor)
            ? '#FFF'
            : backgroundColor,
        },
      ]}>
      <Animated.View
        style={[styles.revSpinnerContainer, {transform: [{rotate: spin}]}]}>
        <ActivityIndicator size={12} color="#FFD700" />
      </Animated.View>

      {revIsEmptyVar(revLoadintText) ? null : (
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny_X,
            revSiteStyles.revSiteTxtBold,
            styles.revPromptTextStyles,
          ]}>
          {revLoadintText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  revContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    marginTop: 12,
  },
  revSpinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
    height: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    backgroundColor: '#FFF',
  },
  revPromptTextStyles: {
    marginTop: 12,
  },
});

export default RevCustomLoadingView;

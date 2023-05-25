import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';

import React, {useContext} from 'react';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevGenLibs_Server_React,
} = NativeModules;

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

export const useRevLikeInlineFormAction = () => {
  const revLikeInlineFormAction = (
    revAnnotationName,
    revAnnotationValue,
    revEntityGUID,
    revOwnerEntityGUID,
  ) => {
    console.log(
      'revAnnotationName, revAnnotationValue, revEntityGUID, revOwnerEntityGUID',
      revAnnotationName,
      revAnnotationValue,
      revEntityGUID,
      revOwnerEntityGUID,
    );

    let revRetVal = RevPersLibCreate_React.revPersRevEntityAnnotationWithValues(
      revAnnotationName,
      revAnnotationValue,
      revEntityGUID,
      revOwnerEntityGUID,
    );

    console.log('>>> revRetVal -revLikeInlineFormAction', revRetVal);
  };

  return {revLikeInlineFormAction};
};

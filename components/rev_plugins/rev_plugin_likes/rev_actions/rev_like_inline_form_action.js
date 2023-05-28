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
  RevPersLibDelete_React,
  RevGenLibs_Server_React,
} = NativeModules;

export const useRevLikeInlineFormAction = () => {
  const revLikeInlineFormAction = (
    revAnnotationName,
    revAnnotationValue,
    revEntityGUID,
    revOwnerEntityGUID,
  ) => {
    let revAnnsStr =
      RevPersLibRead_React.revGetAllRevEntityAnnoationIds_By_AnnName_RevEntity_GUID(
        'rev_like',
        revEntityGUID,
      );

    let revAnnsArr = JSON.parse(revAnnsStr);

    for (let i = 0; i < revAnnsArr.length; i++) {
      let revAnnDel =
        RevPersLibDelete_React.revDeleteEntityAnnotation_By_AnnotationID(
          revAnnsArr[i],
        );
    }

    let revRetVal = RevPersLibCreate_React.revPersRevEntityAnnotationWithValues(
      revAnnotationName,
      revAnnotationValue,
      revEntityGUID,
      revOwnerEntityGUID,
    );

    return revRetVal;
  };

  return {revLikeInlineFormAction};
};

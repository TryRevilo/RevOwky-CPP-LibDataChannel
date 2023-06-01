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

import {useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID} from '../../../rev_libs_pers/rev_pers_annotations/rev_read/RevPersReadAnnotationsCustomHooks';

const revUpdateLikesStatsMetadata = (revMetadataID, revNewVal) => {
  return RevPersLibUpdate_React.setMetadataValue_BY_MetadataId(
    revMetadataID,
    revNewVal,
  );
};

export const useRevLikeInlineFormAction = () => {
  const {revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID} =
    useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID();

  const revLikeInlineFormAction = (
    revAnnotationName,
    revAnnotationValue,
    revEntityGUID,
    revOwnerEntityGUID,
  ) => {
    let revEntityAnnData =
      revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(
        'rev_like',
        revEntityGUID,
        revOwnerEntityGUID,
      );

    console.log('>>> revEntityAnnData', revEntityAnnData);

    let revAnnotationId = revEntityAnnData._revAnnotationId;

    if (revAnnotationId < 1) {
      let revRetVal =
        RevPersLibCreate_React.revPersRevEntityAnnotationWithValues(
          revAnnotationName,
          revAnnotationValue.toString(),
          revEntityGUID,
          revOwnerEntityGUID,
        );
    } else {
      let revSavedAnnotationValue = revEntityAnnData._revAnnotationValue;

      if (revSavedAnnotationValue == revAnnotationValue) {
        // Delete like
        RevPersLibDelete_React.revDeleteEntityAnnotation_By_AnnotationID(
          revAnnotationId,
        );
      } else {
        // Set opposite like
        let revInverseAnnotationValue = Number(revAnnotationValue);
        revInverseAnnotationValue = -revInverseAnnotationValue;

        console.log('>>> revInverseAnnotationValue', revInverseAnnotationValue);

        RevPersLibUpdate_React.revPersSetRevAnnVal_By_RevAnnId(
          revAnnotationId,
          revInverseAnnotationValue.toString(),
        );
      }
    }

    let revLikesStatsMetadataStr =
      RevPersLibRead_React.revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(
        'rev_tot_likes_stats',
        revEntityGUID,
      );

    let revLikesStatsMetadata = JSON.parse(revLikesStatsMetadataStr);

    let revCurrVal = Number(revLikesStatsMetadata._metadataValue);

    let revUpdatedLikesStatsValNum =
      (revCurrVal ? revCurrVal : 0) + Number(revAnnotationValue);

    return revUpdateLikesStatsMetadata(
      revLikesStatsMetadata.revMetadataId,
      revUpdatedLikesStatsValNum.toString(),
    );
  };

  return {revLikeInlineFormAction};
};

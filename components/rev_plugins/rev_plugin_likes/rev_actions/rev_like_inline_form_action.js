import {NativeModules} from 'react-native';

import React from 'react';

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

    let revAnnotationId = revEntityAnnData._revAnnotationId;
    let revSavedAnnotationValue = revEntityAnnData._revAnnotationValue;
    let revSavedAnnotationValueInt = Number(revSavedAnnotationValue);

    let revLikesStatsMetadataStr =
      RevPersLibRead_React.revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(
        'rev_tot_likes_stats',
        revEntityGUID,
      );

    let revLikesStatsMetadata = JSON.parse(revLikesStatsMetadataStr);
    let revCurrMetadataStasValInt = Number(
      revLikesStatsMetadata._metadataValue,
    );

    if (revAnnotationId < 1) {
      RevPersLibCreate_React.revPersRevEntityAnnotationWithValues(
        revAnnotationName,
        revAnnotationValue.toString(),
        revEntityGUID,
        revOwnerEntityGUID,
      );

      revCurrMetadataStasValInt =
        revCurrMetadataStasValInt + revAnnotationValue;
    } else {
      if (revSavedAnnotationValueInt == revAnnotationValue) {
        // Delete like
        RevPersLibDelete_React.revDeleteEntityAnnotation_By_AnnotationID(
          revAnnotationId,
        );

        revCurrMetadataStasValInt =
          revCurrMetadataStasValInt - revAnnotationValue;
      } else {
        RevPersLibUpdate_React.revPersSetRevAnnVal_By_RevAnnId(
          revAnnotationId,
          revAnnotationValue.toString(),
        );

        revCurrMetadataStasValInt =
          revCurrMetadataStasValInt + revAnnotationValue;
      }
    }

    // Update stats
    revUpdateLikesStatsMetadata(
      revLikesStatsMetadata.revMetadataId,
      revCurrMetadataStasValInt.toString(),
    );

    return;
  };

  return {revLikeInlineFormAction};
};

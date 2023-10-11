import React from 'react';
import {NativeModules} from 'react-native';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevPersLibDelete_React,
} = NativeModules;

import {useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID} from '../rev_read/RevPersReadAnnotationsCustomHooks';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevSaveNewAnnotation = () => {
  const {revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID} =
    useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID();

  const revUpdateAnnStatsMetadata = (_revMetadataId, revNewVal) => {
    return RevPersLibUpdate_React.setMetadataValue_BY_MetadataId(
      _revMetadataId,
      revNewVal,
    );
  };

  const revSaveNewAnnotation = ({
    revAnnotationName,
    revAnnotationValue,
    revEntityGUID,
    revOwnerEntityGUID,
    revAnnMetadataStatsName,
  }) => {
    let revEntityAnnData =
      revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(
        revAnnotationName,
        revEntityGUID,
        revOwnerEntityGUID,
      );

    let revAnnotationId = revEntityAnnData._revAnnotationId;
    let revAnnotationResStatus = revEntityAnnData._revAnnotationResStatus;
    let revSavedAnnotationValue = revEntityAnnData._revAnnotationValue;
    let revSavedAnnotationValueInt = Number(revSavedAnnotationValue);

    if (!revStringEmpty(revAnnMetadataStatsName)) {
      let revLikesStatsMetadataStr =
        RevPersLibRead_React.revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(
          revAnnMetadataStatsName,
          revEntityGUID,
        );

      let revLikesStatsMetadata = JSON.parse(revLikesStatsMetadataStr);
      let revCurrMetadataStasValInt = Number(
        revLikesStatsMetadata._revMetadataValue,
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
          // Delete ann stat
          if (revAnnotationResStatus == -1) {
            RevPersLibDelete_React.revDeleteEntityAnnotation_By_AnnotationID(
              revAnnotationId,
            );
          } else if (revAnnotationResStatus == -3) {
            RevPersLibUpdate_React.revPersSetRevAnnResStatus_By_RevAnnId(
              revAnnotationId,
              -2,
            );

            RevPersLibUpdate_React.revPersSetRevAnnVal_By_RevAnnId(
              revAnnotationId,
              revAnnotationValue,
            );
          } else {
            RevPersLibUpdate_React.revPersSetRevAnnResStatus_By_RevAnnId(
              revAnnotationId,
              -3,
            );

            RevPersLibUpdate_React.revPersSetRevAnnVal_By_RevAnnId(
              revAnnotationId,
              0,
            );
          }

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

      // Update Ann metadata stats value
      revUpdateAnnStatsMetadata(
        revLikesStatsMetadata._revMetadataId,
        revCurrMetadataStasValInt.toString(),
      );
    }

    return revAnnotationId;
  };

  return {revSaveNewAnnotation};
};

import React from 'react';
import {NativeModules} from 'react-native';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevPersLibDelete_React,
} = NativeModules;

import {userevPersGetAnn_By_Name_EntityGUID_OwnerGUID} from '../rev_read/RevPersReadAnnotationsCustomHooks';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevSaveNewAnnotation = () => {
  const {revPersGetAnn_By_Name_EntityGUID_OwnerGUID} =
    userevPersGetAnn_By_Name_EntityGUID_OwnerGUID();

  const revUpdateAnnStatsMetadata = (_revId, revNewVal) => {
    return RevPersLibUpdate_React.revPersSetMetadataVal_BY_Id(
      _revId,
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
    let revEntityAnnData = revPersGetAnn_By_Name_EntityGUID_OwnerGUID(
      revAnnotationName,
      revEntityGUID,
      revOwnerEntityGUID,
    );

    let revAnnotationId = revEntityAnnData._revId;
    let revAnnotationResStatus = revEntityAnnData._revResolveStatus;
    let revSavedAnnotationValue = revEntityAnnData._revValue;
    let revSavedAnnotationValueInt = Number(revSavedAnnotationValue);

    if (!revStringEmpty(revAnnMetadataStatsName)) {
      let revLikesStatsMetadataStr =
        RevPersLibRead_React.revPersGetMetadata_By_Name_EntityGUID(
          revAnnMetadataStatsName,
          revEntityGUID,
        );

      let revLikesStatsMetadata = JSON.parse(revLikesStatsMetadataStr);
      let revCurrMetadataStasValInt = Number(revLikesStatsMetadata._revValue);

      if (revAnnotationId < 1) {
        RevPersLibCreate_React.revPersAnn_With_Values(
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
            RevPersLibDelete_React.revPersDeleteAnn_By_AnnId(revAnnotationId);
          } else if (revAnnotationResStatus == -3) {
            RevPersLibUpdate_React.revPersSetAnnResStatus_By_Id(
              revAnnotationId,
              -2,
            );

            RevPersLibUpdate_React.revPersSetAnnVal_By_Id(
              revAnnotationId,
              revAnnotationValue,
            );
          } else {
            RevPersLibUpdate_React.revPersSetAnnResStatus_By_Id(
              revAnnotationId,
              -3,
            );

            RevPersLibUpdate_React.revPersSetAnnVal_By_Id(revAnnotationId, 0);
          }

          revCurrMetadataStasValInt =
            revCurrMetadataStasValInt - revAnnotationValue;
        } else {
          RevPersLibUpdate_React.revPersSetAnnVal_By_Id(
            revAnnotationId,
            revAnnotationValue.toString(),
          );

          revCurrMetadataStasValInt =
            revCurrMetadataStasValInt + revAnnotationValue;
        }
      }

      // Update Ann metadata stats value
      revUpdateAnnStatsMetadata(
        revLikesStatsMetadata._revId,
        revCurrMetadataStasValInt.toString(),
      );
    }

    return revAnnotationId;
  };

  return {revSaveNewAnnotation};
};

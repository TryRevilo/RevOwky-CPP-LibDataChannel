import {NativeModules} from 'react-native';

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibRead_React, RevPersLibUpdate_React} = NativeModules;

import {
  revGetDuplicateMetadataArr,
  revIsDuplicateMetadata,
  revArrIncludesElement,
  revGetMetadataValue,
  revGetRemoteMetadataId,
} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

/** START REV ENTITY UPDATE */
var revEntityUdateData = (revEntityOriginal, revEntityUpdate) => {
  let revEntityGUID = revEntityOriginal._remoteRevEntityGUID;

  let revWalkRevEntityMetadata = (
    revEntityUpdateMetadataArr,
    revOriginalMetatadataArr,
  ) => {
    let revEntityNewMetaDataArr = [];
    let revEntityUpdateMetaDataArr = [];
    let revEntityDeleteMetadataArr = [];

    /** REV START DELETE SAVED DUPLICATES */
    let revSavedMetadataDuplicatesArr = revGetDuplicateMetadataArr(
      revOriginalMetatadataArr,
    );

    for (let i = 0; i < revSavedMetadataDuplicatesArr.length; i++) {
      let revCurrDuplicateMetadata = revSavedMetadataDuplicatesArr[i];
      let revCurrDuplicateMetadataRemId =
        revCurrDuplicateMetadata.remoteRevMetadataId;

      /** REV START GET LAST ONES ADDED */
      for (let j = 0; j < revSavedMetadataDuplicatesArr.length; j++) {
        let revSavedMetadataDuplicatesArrRemId =
          revSavedMetadataDuplicatesArr[j].remoteRevMetadataId;

        if (
          revCurrDuplicateMetadataRemId == revSavedMetadataDuplicatesArrRemId
        ) {
          continue;
        }

        let revIsDuplicate = revIsDuplicateMetadata(
          revSavedMetadataDuplicatesArr,
          revCurrDuplicateMetadata,
        );

        if (revIsDuplicate === false) {
          continue;
        }

        let revCurrDuplicateMetadataDate = Number(
          revCurrDuplicateMetadata._revPublishedDate,
        );
        let revSavedMetadataDuplicateDate = Number(
          revSavedMetadataDuplicatesArr[j]._revPublishedDate,
        );

        if (
          revCurrDuplicateMetadataDate &&
          revCurrDuplicateMetadataDate <= revSavedMetadataDuplicateDate
        ) {
          continue;
        }

        revEntityDeleteMetadataArr.push(revCurrDuplicateMetadata);
      }
      /** REV END GET LAST ONES ADDED */
    }
    /** REV END DELETE SAVED DUPLICATES */

    for (let i = 0; i < revEntityUpdateMetadataArr.length; i++) {
      let revUpdateMetadata = revEntityUpdateMetadataArr[i];

      let revMetadataName = revUpdateMetadata._revMetadataName;

      let revUpdateMetadataValue = revUpdateMetadata._metadataValue;
      let revOriginalMetadataValue = revGetMetadataValue(
        revOriginalMetatadataArr,
        revMetadataName,
      );

      if (!revOriginalMetadataValue || !revUpdateMetadata._revIsUnique) {
        let revIsInOriginalMetadataList = revArrIncludesElement(
          revGetMetadataValuesArr(revOriginalMetatadataArr, revMetadataName),
          revUpdateMetadata._metadataValue,
        );
        let revIsUpdateDuplicateVal = revIsDuplicateMetadata(
          revEntityUpdateMetaDataArr,
          revUpdateMetadata,
        );

        if (!revIsInOriginalMetadataList && !revIsUpdateDuplicateVal) {
          revUpdateMetadata['revEntityGUID'] = revEntityGUID;

          revEntityNewMetaDataArr.push(revUpdateMetadata);
        }
      } else if (
        revOriginalMetadataValue &&
        revOriginalMetadataValue.localeCompare(revUpdateMetadataValue) !== 0
      ) {
        let remoteRevMetadataId = revGetRemoteMetadataId(
          revOriginalMetatadataArr,
          revMetadataName,
        );

        if (remoteRevMetadataId && remoteRevMetadataId > 0) {
          revUpdateMetadata.remoteRevMetadataId = remoteRevMetadataId;
          revEntityUpdateMetaDataArr.push(revUpdateMetadata);
        }
      }

      for (let i = 0; i < revOriginalMetatadataArr.length; i++) {
        let revOriginalMetatadata = revOriginalMetatadataArr[i];

        if (revUpdateMetadata._revIsUnique) {
          let revDeleteMetadataValue = revGetMetadataValue(
            revEntityUpdateMetadataArr,
            revOriginalMetatadata._revMetadataName,
          );

          if (!revDeleteMetadataValue) {
            revEntityDeleteMetadataArr.push(revOriginalMetatadata);
          }
        } else {
          let revUpdateMetadataValuesArr = revGetMetadataValuesArr(
            revEntityUpdateMetadataArr,
            revOriginalMetatadata._revMetadataName,
          );

          if (
            !revArrIncludesElement(
              revUpdateMetadataValuesArr,
              revOriginalMetatadata._metadataValue,
            )
          ) {
            revEntityDeleteMetadataArr.push(revOriginalMetatadata);
          }
        }
      }

      /** REV START REMOVE DUPLICATES */
      let revMetadataDuplicatesArr = revGetDuplicateMetadataArr(
        revEntityUpdateMetadataArr,
      );
      revMetadataDuplicatesArr = revMetadataDuplicatesArr.concat(
        revGetDuplicateMetadataArr(revEntityUpdateMetadataArr),
      );

      for (let dup = 0; dup < revMetadataDuplicatesArr.length; dup++) {
        let revMetadata = revMetadataDuplicatesArr[dup];

        if (revMetadata.remoteRevMetadataId < 1) {
          continue;
        }

        /** REV START GET LAST ONES ADDED */
        for (let i = 0; i < revMetadataDuplicatesArr.length; i++) {
          if (
            revMetadata._revPublishedDate &&
            revMetadata._revPublishedDate <
              revMetadataDuplicatesArr[i]._revTimePublished
          ) {
            continue;
          }

          revEntityDeleteMetadataArr.push(revMetadata);
        }
        /** REV END GET LAST ONES ADDED */
      }
      /** REV END REMOVE DUPLICATES */
    }

    return {
      revEntityNewMetaDataArr: revEntityNewMetaDataArr,
      revEntityUpdateMetaDataArr: revEntityUpdateMetaDataArr,
      revEntityDeleteMetadataArr: revEntityDeleteMetadataArr,
    };
  };

  return revWalkRevEntityMetadata(
    revEntityUpdate._revEntityMetadataList,
    revEntityOriginal._revEntityMetadataList,
  );
};

/** END REV ENTITY UPDATE */

export const useRevDeleteEntity = () => {
  const revDeleteEntity = revVarArgs => {
    if (
      revIsEmptyJSONObject(revVarArgs._revInfoEntity) ||
      !revVarArgs.hasOwnProperty('_revEntityGUID')
    ) {
      return -1;
    }

    let revEntityGUID = revVarArgs._revEntityGUID;

    if (revEntityGUID < 0) {
      return -1;
    }

    let revRetResStatusVal = 1;

    revRetResStatusVal =
      RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
        -3,
        revEntityGUID,
      );

    revRetResStatusVal =
      RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
        -3,
        revVarArgs._revInfoEntity._revEntityGUID,
      );

    let revInfoMetadataList = revVarArgs._revInfoEntity._revEntityMetadataList;

    for (let i = 0; i < revInfoMetadataList.length; i++) {
      let revMetadataId = revInfoMetadataList[i].revMetadataId;
      RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
        -3,
        revMetadataId,
      );
    }

    return revRetResStatusVal;
  };

  return {revDeleteEntity};
};

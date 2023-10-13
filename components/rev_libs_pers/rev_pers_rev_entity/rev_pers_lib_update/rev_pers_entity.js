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
  let revEntityGUID = revEntityOriginal._revRemoteGUID;

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
      let revCurrDuplicateMetadataRemId = revCurrDuplicateMetadata._revRemoteId;

      /** REV START GET LAST ONES ADDED */
      for (let j = 0; j < revSavedMetadataDuplicatesArr.length; j++) {
        let revSavedMetadataDuplicatesArrRemId =
          revSavedMetadataDuplicatesArr[j]._revRemoteId;

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
          revCurrDuplicateMetadata._revTimePublished,
        );
        let revSavedMetadataDuplicateDate = Number(
          revSavedMetadataDuplicatesArr[j]._revTimePublished,
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

      let revMetadataName = revUpdateMetadata._revName;

      let revUpdateMetadataValue = revUpdateMetadata._revValue;
      let revOriginalMetadataValue = revGetMetadataValue(
        revOriginalMetatadataArr,
        revMetadataName,
      );

      if (!revOriginalMetadataValue || !revUpdateMetadata._revIsUnique) {
        let revIsInOriginalMetadataList = revArrIncludesElement(
          revGetMetadataValuesArr(revOriginalMetatadataArr, revMetadataName),
          revUpdateMetadata._revValue,
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
        let _revRemoteId = revGetRemoteMetadataId(
          revOriginalMetatadataArr,
          revMetadataName,
        );

        if (_revRemoteId && _revRemoteId > 0) {
          revUpdateMetadata._revRemoteId = _revRemoteId;
          revEntityUpdateMetaDataArr.push(revUpdateMetadata);
        }
      }

      for (let i = 0; i < revOriginalMetatadataArr.length; i++) {
        let revOriginalMetatadata = revOriginalMetatadataArr[i];

        if (revUpdateMetadata._revIsUnique) {
          let revDeleteMetadataValue = revGetMetadataValue(
            revEntityUpdateMetadataArr,
            revOriginalMetatadata._revName,
          );

          if (!revDeleteMetadataValue) {
            revEntityDeleteMetadataArr.push(revOriginalMetatadata);
          }
        } else {
          let revUpdateMetadataValuesArr = revGetMetadataValuesArr(
            revEntityUpdateMetadataArr,
            revOriginalMetatadata._revName,
          );

          if (
            !revArrIncludesElement(
              revUpdateMetadataValuesArr,
              revOriginalMetatadata._revValue,
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

        if (revMetadata._revRemoteId < 1) {
          continue;
        }

        /** REV START GET LAST ONES ADDED */
        for (let i = 0; i < revMetadataDuplicatesArr.length; i++) {
          if (
            revMetadata._revTimePublished &&
            revMetadata._revTimePublished <
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
    revEntityUpdate._revMetadataList,
    revEntityOriginal._revMetadataList,
  );
};

/** END REV ENTITY UPDATE */

export const useRevDeleteEntity = () => {
  const revDeleteEntity = revVarArgs => {
    if (
      revIsEmptyJSONObject(revVarArgs._revInfoEntity) ||
      !revVarArgs.hasOwnProperty('_revGUID')
    ) {
      return -1;
    }

    let revEntityGUID = revVarArgs._revGUID;

    if (revEntityGUID < 0) {
      return -1;
    }

    let revRetResStatusVal = 1;

    revRetResStatusVal =
      RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
        -3,
        revEntityGUID,
      );

    revRetResStatusVal =
      RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
        -3,
        revVarArgs._revInfoEntity._revGUID,
      );

    let revInfoMetadataList = revVarArgs._revInfoEntity._revMetadataList;

    for (let i = 0; i < revInfoMetadataList.length; i++) {
      let _revId = revInfoMetadataList[i]._revId;
      RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
        -3,
        _revId,
      );
    }

    return revRetResStatusVal;
  };

  return {revDeleteEntity};
};

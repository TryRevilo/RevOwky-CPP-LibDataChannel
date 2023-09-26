import React, {useContext, useRef, useEffect} from 'react';

import {NativeModules} from 'react-native';

import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';

const {RevPersLibRead_React, RevPersLibUpdate_React} = NativeModules;

import {REV_UPDATE_METADATA_ARR_URL} from './rev_pers_urls';
/** START REV ENTITY UPDATE */

export var revEntityUdateData = (revEntityOriginal, revEntityUpdate) => {
  let revEntityGUID = revEntityOriginal._remoteRevEntityGUID;

  let revWalkRevEntityMetadata = (
    revEntityUpdateMetadataArr,
    revOriginalMetatadataArr,
  ) => {
    let revEntityNewMetaDataArr = [];
    let revEntityUpdateMetaDataArr = [];
    let revEntityDeleteMetadataArr = [];

    /** REV START DELETE SAVED DUPLICATES */
    let revSavedMetadataDuplicatesArr = window.revGetDuplicateMetadataArr(
      revOriginalMetatadataArr,
    );

    for (let i = 0; i < revSavedMetadataDuplicatesArr.length; i++) {
      let revCurrDuplicateMetadata = revSavedMetadataDuplicatesArr[i];

      /** REV START GET LAST ONES ADDED */
      for (let t = 0; t < revSavedMetadataDuplicatesArr.length; t++) {
        if (
          revCurrDuplicateMetadata._revRemoteMetadataId ==
          revSavedMetadataDuplicatesArr[t]._revRemoteMetadataId
        ) {
          continue;
        }

        let revIsDuplicate = window.revIsDuplicateMetadata(
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
          revSavedMetadataDuplicatesArr[t]._revTimePublished,
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

    /** REV START DELETE SAVED DUPLICATES */

    for (let i = 0; i < revEntityUpdateMetadataArr.length; i++) {
      let revUpdateMetadata = revEntityUpdateMetadataArr[i];

      let revMetadataName = revUpdateMetadata._revMetadataName;

      let revUpdateMetadataValue = revUpdateMetadata._revMetadataValue;
      let revOriginalMetadataValue = window.revGetMetadataValue(
        revOriginalMetatadataArr,
        revMetadataName,
      );

      if (!revOriginalMetadataValue || !revUpdateMetadata._revIsUnique) {
        let revIsInOriginalMetadataList = window.revArrIncludesElement(
          window.revGetMetadataValuesArr(
            revOriginalMetatadataArr,
            revMetadataName,
          ),
          revUpdateMetadata._revMetadataValue,
        );
        let revIsUpdateDuplicateVal = window.revIsDuplicateMetadata(
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
        let _revRemoteMetadataId = window.revGetRemoteMetadataId(
          revOriginalMetatadataArr,
          revMetadataName,
        );

        if (_revRemoteMetadataId && _revRemoteMetadataId > 0) {
          revUpdateMetadata._revRemoteMetadataId = _revRemoteMetadataId;
          revEntityUpdateMetaDataArr.push(revUpdateMetadata);
        }
      }

      for (let i = 0; i < revOriginalMetatadataArr.length; i++) {
        let revOriginalMetatadata = revOriginalMetatadataArr[i];

        if (revUpdateMetadata._revIsUnique) {
          let revDeleteMetadataValue = window.revGetMetadataValue(
            revEntityUpdateMetadataArr,
            revOriginalMetatadata._revMetadataName,
          );

          if (!revDeleteMetadataValue) {
            revEntityDeleteMetadataArr.push(revOriginalMetatadata);
          }
        } else {
          let revUpdateMetadataValuesArr = window.revGetMetadataValuesArr(
            revEntityUpdateMetadataArr,
            revOriginalMetatadata._revMetadataName,
          );

          if (
            !window.revArrIncludesElement(
              revUpdateMetadataValuesArr,
              revOriginalMetatadata._revMetadataValue,
            )
          ) {
            revEntityDeleteMetadataArr.push(revOriginalMetatadata);
          }
        }
      }

      /** REV START REMOVE DUPLICATES */
      let revMetadataDuplicatesArr = window.revGetDuplicateMetadataArr(
        revEntityUpdateMetadataArr,
      );
      revMetadataDuplicatesArr = revMetadataDuplicatesArr.concat(
        window.revGetDuplicateMetadataArr(revEntityUpdateMetadataArr),
      );

      for (let dup = 0; dup < revMetadataDuplicatesArr.length; dup++) {
        let revMetadata = revMetadataDuplicatesArr[dup];

        if (revMetadata._revRemoteMetadataId < 1) {
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
    revEntityUpdate._revEntityMetadataList,
    revEntityOriginal._revEntityMetadataList,
  );
};

/** END REV ENTITY UPDATE */

export const useRev_Server_UpdateMetadata = () => {
  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const rev_Server_UpdateMetadata = (revMetadataArr, revCallBack) => {
    revPostServerData(
      `${REV_ROOT_URL}${REV_UPDATE_METADATA_ARR_URL}`,
      revMetadataArr,
      revRetData => {
        revCallBack(revRetData);
      },
    );
  };

  return {rev_Server_UpdateMetadata};
};

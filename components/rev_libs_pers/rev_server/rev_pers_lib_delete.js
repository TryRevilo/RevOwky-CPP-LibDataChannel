import React, {useContext} from 'react';

import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';

import {REV_DELETE_REV_ENTITIES_URL} from './rev_pers_urls';

const {RevPersLibRead_React} = NativeModules;

export const useRev_Server_DeleteEntities_By_entityGUIDsArr = () => {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const rev_Server_DeleteEntities_By_entityGUIDsArr = (
    revEntityGUIDsArr,
    revCallBack,
  ) => {
    revPostServerData(
      `${REV_ROOT_URL}${REV_DELETE_REV_ENTITIES_URL}`,
      revEntityGUIDsArr,
      revRetData => {
        revCallBack(revRetData);
      },
    );
  };

  const revSyncDeleteServerData = revCallBack => {
    let revDeleEntityGUIDsStr =
      RevPersLibRead_React.revPersGetALLRevEntityGUIDs_By_ResStatus(-3);

    let revDeleEntityGUIDsArr = [];

    try {
      revDeleEntityGUIDsArr = JSON.parse(revDeleEntityGUIDsStr);
    } catch (error) {
      console.log('>>> error ' + error);
    }

    let revPostDelEntityGUIDsArr = [];

    if (!revDeleEntityGUIDsArr.length) {
      return revCallBack();
    }

    for (let i = 0; i < revDeleEntityGUIDsArr.length; i++) {
      if (i > 2) {
        break;
      }

      let revCurrEntityGUID = revDeleEntityGUIDsArr[i];
      let revCurrEntityStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revCurrEntityGUID);

      let revCurRemoteEntityGUID =
        JSON.parse(revCurrEntityStr)._revRemoteEntityGUID;

      if (revCurRemoteEntityGUID && revCurRemoteEntityGUID >= 0)
        revPostDelEntityGUIDsArr.push(revCurRemoteEntityGUID);
    }

    console.log(
      '>>> revPostDelEntityGUIDsArr ' +
        JSON.stringify(revPostDelEntityGUIDsArr),
    );

    let revServData = {
      filter: revPostDelEntityGUIDsArr,
    };

    rev_Server_DeleteEntities_By_entityGUIDsArr(
      revServData,
      revDelEnitityGUIDsRetData => {
        console.log(
          '>>> revDelEnitityGUIDsRetData ' +
            JSON.stringify(revDelEnitityGUIDsRetData),
        );
      },
    );
  };

  return {revSyncDeleteServerData};
};

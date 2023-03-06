import React, {useContext, useRef, useEffect} from 'react';

import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';
import {revGetServerData_JSON} from './rev_pers_lib_read';

import {REV_DELETE_REV_ENTITIES_URL} from './rev_pers_urls';

export const useRev_Server_DeleteEntities_By_entityGUIDsArr = () => {
  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);

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

  return {rev_Server_DeleteEntities_By_entityGUIDsArr};
};

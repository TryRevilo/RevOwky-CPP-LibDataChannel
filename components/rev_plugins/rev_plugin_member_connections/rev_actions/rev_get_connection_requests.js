import React, {useContext} from 'react';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../../rev_contexts/RevRemoteSocketContext';

import {revGetServerData_JSON} from '../../../rev_libs_pers/rev_server/rev_pers_lib_read';

export const useRevGetConnectionRequests = () => {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);
  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const revGetConnectionRequests = revCallBack => {
    let revLoggedInRemoteEntityGUID = REV_LOGGED_IN_ENTITY._remoteRevEntityGUID;

    if (revLoggedInRemoteEntityGUID < 1) {
      return revCallBack(null);
    }

    let revURL = `${REV_ROOT_URL}/rev_api?rev_logged_in_entity_guid=${revLoggedInRemoteEntityGUID}&revPluginHookContextsRemoteArr=revHookRemoteHandlerOwky_GetConnRequestEntities`;

    revGetServerData_JSON(revURL, revRetData => {
      if (revRetData.hasOwnProperty('revError')) {
        revRetData = revGetLocalData();
        revRetData = {
          revTimelineEntities: revRetData,
          revEntityPublishersArr: [],
        };
      }

      return revCallBack(revRetData);
    });
  };

  return {revGetConnectionRequests};
};

import React, {useContext} from 'react';
import {NativeModules} from 'react-native';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../../rev_contexts/RevRemoteSocketContext';

import {revPostServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_create';

const {RevPersLibCreate_React, RevPersLibRead_React} = NativeModules;

export const useRevUpdateConnectionRequestStatus = () => {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);
  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const revUpdateConnectionRequestStatus = revCallBack => {
    if (REV_LOGGED_IN_ENTITY < 1) {
      return revCallBack(null);
    }

    let revAcceptedRelsArrStr =
      RevPersLibRead_React.revPersGetRevEntityRels_By_ResStatus_RelType(
        0,
        'rev_entity_connect_members',
      );
    let revAcceptedRelsArr = JSON.parse(revAcceptedRelsArrStr);

    let revPersAcceptedRelsArr = [];

    for (let i = 0; i < revAcceptedRelsArr.length; i++) {
      let revCurrRel = revAcceptedRelsArr[i];

      revPersAcceptedRelsArr.push({
        revResolveStatus: 2,
        revEntityRelationshipId: revCurrRel._remoteRevEntityRelationshipId,
        revEntityRelationshipRemoteId:
          revCurrRel._revEntityRelationshipRemoteId,
      });
    }

    console.log(
      '>>> revPersAcceptedRelsArr ' + JSON.stringify(revPersAcceptedRelsArr),
    );

    let revURL =
      REV_ROOT_URL +
      '/rev_base_api_post?revPluginHookContextsRemoteArr=revHookRemoteHandlerUpdateRelationshipsResStatus';

    revPostServerData(
      revURL,
      {
        revLoggedInEntityGUID: REV_LOGGED_IN_ENTITY._revRemoteEntityGUID,
        revUpdateRelsResStatusArr: revPersAcceptedRelsArr,
      },
      revRetRelData => {
        console.log('>>> revRetRelData ' + JSON.stringify(revRetRelData));

        revCallBack(revRetRelData);
      },
    );
  };

  return {revUpdateConnectionRequestStatus};
};

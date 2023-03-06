import React, {useContext} from 'react';
import {NativeModules} from 'react-native';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revGetEntityGUID,
  revGetRemoteEntityGUID,
} from '../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

const {RevPersLibRead_React} = NativeModules;

export const useRevConnectUser_Action = () => {
  const {REV_LOGGED_IN_ENTITY_GUID, REV_LOGGED_IN_ENTITY} =
    useContext(RevSiteDataContext);

  const revConnectUser_Action = (revVarArgs, revCallBack) => {
    if (revIsEmptyJSONObject(revVarArgs)) {
      return revCallBack(-1);
    }

    // Start - return if revEntityType !== 'rev_user_entity'
    // Start - get local entity GUID
    // Start - save user locally if entityGUID < 0
    // Start - save relationship locally if entityGUID >= 0
    let revTargetRemoteEntityGUID = revGetRemoteEntityGUID(revVarArgs);

    console.log('>>> revTargetRemoteEntityGUID ' + revTargetRemoteEntityGUID);

    if (revTargetRemoteEntityGUID < 0) {
      // START save user to local DB
      // END save user to local DB
      return revCallBack(-1);
    }

    let revTargetEntityStr =
      RevPersLibRead_React.revPersGetRevEntity_By_RemoteRevEntityGUID(
        revTargetRemoteEntityGUID,
      );

    console.log('>>> revTargetEntityStr ' + revTargetEntityStr);

    let revTargetEntity = JSON.parse(revTargetEntityStr);

    let revTargetEntityGUID = revTargetEntity._revEntityGUID;

    let revConnectUserRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revConnectUserRel._revEntityRelationshipType = 'rev_entity_connect_members';
    revConnectUserRel._revOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
    revConnectUserRel._revEntityTargetGUID = revTargetEntityGUID;
    revConnectUserRel._remoteRevEntityTargetGUID = revTargetRemoteEntityGUID;
    revConnectUserRel._revEntitySubjectGUID = REV_LOGGED_IN_ENTITY_GUID;
    revConnectUserRel._remoteRevEntitySubjectGUID = REV_LOGGED_IN_ENTITY_GUID;

    console.log('>>> revConnectUserRel ' + JSON.stringify(revConnectUserRel));

    //   let revConnectUserRelId = RevPersLibCreate_React.revPersRelationshipJSON(
    //     JSON.stringify(revConnectUserRel),
    //   );

    revCallBack(123);
  };

  return {revConnectUser_Action};
};

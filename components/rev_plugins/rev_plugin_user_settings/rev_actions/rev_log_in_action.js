import {useContext} from 'react';

import {NativeModules} from 'react-native';

import {RevRemoteSocketContext} from '../../../../rev_contexts/RevRemoteSocketContext';

import {useRevCreateNewUserEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_read';

const {RevPersLibRead_React} = NativeModules;

export const useRevLogin = () => {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {revCreateNewUserEntity} = useRevCreateNewUserEntity();

  const revLogin = async (revUserId, revPassword) => {
    let revUniqueIdEntityGUID =
      RevPersLibRead_React.revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(
        'rev_entity_unique_id',
        revUserId,
      );

    let revUserIdOwnerGUID =
      RevPersLibRead_React.revGetEntityOwnerGUID_BY_EntityGUID(
        revUniqueIdEntityGUID,
      );

    let revPasswordEntityGUID =
      RevPersLibRead_React.revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(
        'revPassword1',
        revPassword,
      );

    let revPasswordOwnerGUID =
      RevPersLibRead_React.revGetEntityOwnerGUID_BY_EntityGUID(
        revPasswordEntityGUID,
      );

    let revLoggedInUserGUID = -1;

    if (revUserIdOwnerGUID == revPasswordOwnerGUID) {
      let revUserSettingsGUIDsArrStr =
        RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
          'rev_entity_info',
          revPasswordOwnerGUID,
        );

      let revUserSettingsGUIDsArr = JSON.parse(revUserSettingsGUIDsArrStr);

      if (revUserSettingsGUIDsArr.length) {
        let revUserSettingsGUID = revUserSettingsGUIDsArr[0];

        revLoggedInUserGUID =
          RevPersLibRead_React.revGetEntityOwnerGUID_BY_EntityGUID(
            revUserSettingsGUID,
          );
      }
    }

    if (revLoggedInUserGUID < 1) {
      let revLogInURL =
        REV_ROOT_URL +
        '/rev_api?' +
        'rev_entity_unique_id=' +
        revUserId +
        '&revPassword1=' +
        revPassword +
        '&revPluginHookContextsRemoteArr=revHookRemoteHandlerLogIn,revHookRemoteSendLoggedInPresenceToConnections,revHookRemoteHandlerProfile,revHookRemoteHandlerProfileStats';

      let revData = await revGetServerData(revLogInURL);

      if (
        revIsEmptyJSONObject(revData) ||
        !revData.hasOwnProperty('revLoggedInUserEntity')
      ) {
        return -1;
      }

      revLoggedInUserGUID = revCreateNewUserEntity(
        revData.revLoggedInUserEntity,
      );
    }

    return revLoggedInUserGUID;
  };

  return {revLogin};
};

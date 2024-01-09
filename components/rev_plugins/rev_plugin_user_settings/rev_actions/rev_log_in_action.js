import {useContext} from 'react';

import {NativeModules} from 'react-native';

import {RevRemoteSocketContext} from '../../../../rev_contexts/RevRemoteSocketContext';

import {useRevCreateNewUserEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_read';
import {revGetInfoEntity} from '../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

const {RevPersLibRead_React} = NativeModules;

export const useRevLogin = () => {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {revCreateNewUserEntity} = useRevCreateNewUserEntity();

  const revDownloadUserProfile = async (revUserId, revPassword) => {
    try {
      let revLogInURL =
        REV_ROOT_URL +
        '/rev_api?' +
        'rev_entity_unique_id=' +
        revUserId +
        '&revPassword1=' +
        revPassword +
        '&revIsSettings=' +
        true +
        '&revPluginHookContextsRemoteArr=revHookRemoteHandlerLogIn,revHookRemoteSendLoggedInPresenceToConnections,revHookRemoteHandlerProfile,revHookRemoteHandlerProfileStats';

      let revData = await revGetServerData(revLogInURL);

      if (revIsEmptyJSONObject(revData) || revData.hasOwnProperty('revError')) {
        return -1;
      }

      const {revLoggedInUserEntity = {}, revProfileConnEntitiesArr = []} =
        revData;

      let revLoggedInUserGUID = revCreateNewUserEntity(revLoggedInUserEntity);

      for (let i = 0; i < revProfileConnEntitiesArr.length; i++) {
        revCreateNewUserEntity(revProfileConnEntitiesArr[i]);
      }

      return revLoggedInUserGUID;
    } catch (error) {
      console.log('*** ERROR - revDownloadUserProfile', error);

      return -1;
    }
  };

  const revLogin = async (revUserId, revPassword) => {
    let revUniqueIdEntityGUID =
      RevPersLibRead_React.revPersGetMetadataOwnerGUID_By_Name_Value(
        'rev_entity_unique_id',
        revUserId,
      );

    if (revUniqueIdEntityGUID < 1) {
      return await revDownloadUserProfile(revUserId, revPassword);
    }

    let revUserIdOwnerGUID =
      RevPersLibRead_React.revPersGetEntityOwnerGUID_BY_EntityGUID(
        revUniqueIdEntityGUID,
      );

    let revPasswordEntityGUID =
      RevPersLibRead_React.revPersGetMetadataOwnerGUID_By_Name_Value(
        'revPassword1',
        revPassword,
      );

    let revPasswordOwnerGUID =
      RevPersLibRead_React.revPersGetEntityOwnerGUID_BY_EntityGUID(
        revPasswordEntityGUID,
      );

    let revLoggedInUserGUID = -1;

    if (revUserIdOwnerGUID == revPasswordOwnerGUID) {
      let revUserSettingsGUIDsArrStr =
        RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
          'rev_entity_info',
          revPasswordOwnerGUID,
        );

      let revUserSettingsGUIDsArr = JSON.parse(revUserSettingsGUIDsArrStr);

      if (revUserSettingsGUIDsArr.length) {
        let revUserSettingsGUID = revUserSettingsGUIDsArr[0];

        revLoggedInUserGUID =
          RevPersLibRead_React.revPersGetEntityOwnerGUID_BY_EntityGUID(
            revUserSettingsGUID,
          );
      }
    }

    console.log('>>> revLoggedInUserGUID', revLoggedInUserGUID);

    if (revLoggedInUserGUID < 1) {
      revLoggedInUserGUID = await revDownloadUserProfile(
        revUserId,
        revPassword,
      );
    }

    return revLoggedInUserGUID;
  };

  return {revLogin};
};

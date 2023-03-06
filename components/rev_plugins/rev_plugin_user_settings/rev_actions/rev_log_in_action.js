import {NativeModules} from 'react-native';

const {RevPersLibRead_React} = NativeModules;

export const useRevLogin = () => {
  const revLogin = (revUserId, revPassword) => {
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

      if (!revUserSettingsGUIDsArr.length) {
        return -1;
      }

      let revUserSettingsGUID = revUserSettingsGUIDsArr[0];

      revLoggedInUserGUID =
        RevPersLibRead_React.revGetEntityOwnerGUID_BY_EntityGUID(
          revUserSettingsGUID,
        );
    }

    return revLoggedInUserGUID;
  };

  return {revLogin};
};

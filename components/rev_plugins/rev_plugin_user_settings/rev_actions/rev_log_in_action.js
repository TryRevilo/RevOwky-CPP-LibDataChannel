import {NativeModules} from 'react-native';

const {RevPersLibRead_React} = NativeModules;

export const revLogin = (revUserId, revPassword) => {
  let revUserIdOwnerGUID =
    RevPersLibRead_React.revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(
      'rev_entity_unique_id',
      revUserId,
    );

  let revPasswordOwnerGUID =
    RevPersLibRead_React.revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(
      'revPassword1',
      revPassword,
    );

  return revUserIdOwnerGUID == revPasswordOwnerGUID ? revPasswordOwnerGUID : -1;
};

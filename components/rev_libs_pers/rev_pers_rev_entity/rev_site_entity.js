import {NativeModules} from 'react-native';

const {RevPersLibCreate_React, RevPersLibRead_React} = NativeModules;

import {REV_ENTITY_STRUCT} from '../rev_db_struct_models/revEntity';

export const revGetSiteEntity = revLoggedInEntityGUID => {
  let revEntitiesStr =
    RevPersLibRead_React.getRevEntityByRevEntityOwnerGUID_Subtype(
      revLoggedInEntityGUID,
      'rev_site',
    );

  return JSON.parse(revEntitiesStr);
};

export const useRevCreateSiteEntity = () => {
  const revCreateSiteEntity = revOwnerEntityGUID => {
    if (revOwnerEntityGUID < 1) {
      return null;
    }

    let revPersEntity = REV_ENTITY_STRUCT();
    revPersEntity._revEntityType = 'rev_entity';
    revPersEntity._revEntitySubType = 'rev_site';
    revPersEntity._revEntityOwnerGUID = revOwnerEntityGUID;

    let revEntityGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revPersEntity),
    );

    return revEntityGUID;
  };

  return {revCreateSiteEntity};
};

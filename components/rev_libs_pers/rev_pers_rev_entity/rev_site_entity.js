import {NativeModules} from 'react-native';

const {RevPersLibCreate_React, RevPersLibRead_React} = NativeModules;

import {REV_ENTITY_STRUCT} from '../rev_db_struct_models/revEntity';

import {useRevPersGetRevEntities_By_ResolveStatus_SubType} from './rev_pers_lib_read/rev_pers_entity_custom_hooks';

export const useRevGetSiteEntity = () => {
  const revGetSiteEntity = revLoggedInEntityGUID => {
    let revEntitiesStr =
      RevPersLibRead_React.getRevEntityByRevEntityOwnerGUID_Subtype(
        revLoggedInEntityGUID,
        'rev_site',
      );

    return JSON.parse(revEntitiesStr);
  };

  return {revGetSiteEntity};
};

export const useRevGetLoggedInSiteEntity = () => {
  const {revPersGetRevEntities_By_ResolveStatus_SubType} =
    useRevPersGetRevEntities_By_ResolveStatus_SubType();

  const revGetLoggedInSiteEntity = () => {
    let revEntitiesArr = revPersGetRevEntities_By_ResolveStatus_SubType(
      2,
      'rev_site',
    );

    return Array.isArray(revEntitiesArr) && revEntitiesArr.length > 0
      ? revEntitiesArr[0]
      : null;
  };

  return {revGetLoggedInSiteEntity};
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

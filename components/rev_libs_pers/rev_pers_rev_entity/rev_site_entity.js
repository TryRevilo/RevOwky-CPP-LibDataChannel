import {NativeModules} from 'react-native';

const {RevPersLibCreate_React, RevPersLibRead_React} = NativeModules;

import {REV_ENTITY_STRUCT} from '../rev_db_struct_models/revEntity';

export const revGetSiteEntity = () => {
  let revEntitiesStr =
    RevPersLibRead_React.revPersGetALLRevEntity_By_SubType('rev_site');
  let revEntitiesArr = JSON.parse(revEntitiesStr);

  return revEntitiesArr.length > 0 ? revEntitiesArr[0] : null;
};

export const revCreateSiteEntity = (revOwnerEntityGUID = -1) => {
  let revPersEntity = REV_ENTITY_STRUCT();
  revPersEntity._revEntityType = 'rev_entity';
  revPersEntity._revEntitySubType = 'rev_site';
  revPersEntity._revEntityOwnerGUID = revOwnerEntityGUID;

  let revEntityGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersEntity),
  );

  return revEntityGUID;
};

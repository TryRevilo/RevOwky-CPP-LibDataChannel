import {NativeModules} from 'react-native';

import {REV_ENTITY_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

const {RevPersLibCreate_React, RevPersLibRead_React} = NativeModules;

export const revRegisterUserEntity = revVarArgs => {
  let revUserId = revVarArgs.revUserId;
  let revFullNames = revVarArgs.revFullNames;
  let revPassword1 = revVarArgs.revPassword1;
  let revPassword2 = revVarArgs.revPassword2;
  let revEMail = revVarArgs.revEMail;

  let revPersUserEntity = REV_ENTITY_STRUCT();
  revPersUserEntity._revType = 'rev_user_entity';
  revPersUserEntity._revSubType = 'rev_user_entity';

  let revPersUserEntityGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersUserEntity),
  );

  if (revPersUserEntityGUID < 1) {
    return -1;
  }

  /** Rev START save user info */
  let revPersUserEntityInfo = REV_ENTITY_STRUCT();
  revPersUserEntityInfo._revType = 'rev_object';
  revPersUserEntityInfo._revSubType = 'rev_entity_info';
  revPersUserEntityInfo._revOwnerGUID = revPersUserEntityGUID;

  revPersUserEntityInfo._revMetadataList = [
    REV_METADATA_FILLER('rev_entity_unique_id', revUserId),
    REV_METADATA_FILLER('rev_full_names', revFullNames),
  ];

  let revPersUserEntityInfoGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersUserEntityInfo),
  );

  if (revPersUserEntityInfoGUID < 1) {
    return -1;
  }

  let revPersUserEntityInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
  revPersUserEntityInfoRel._revType = 'rev_entity_info';
  revPersUserEntityInfoRel._revOwnerGUID = revPersUserEntityGUID;
  revPersUserEntityInfoRel._revTargetGUID = revPersUserEntityGUID;
  revPersUserEntityInfoRel._revSubjectGUID = revPersUserEntityInfoGUID;

  let revPersUserEntityInfoRel_Id =
    RevPersLibCreate_React.revPersRelationshipJSON(
      JSON.stringify(revPersUserEntityInfoRel),
    );

  if (revPersUserEntityInfoRel_Id < 1) {
    return -1;
  }
  /** Rev END save user info */

  /** START SAVE SETTINGS */
  let revPersUserEntitySettings = REV_ENTITY_STRUCT();
  revPersUserEntitySettings._revType = 'rev_object';
  revPersUserEntitySettings._revSubType = 'rev_settings_entity';
  revPersUserEntitySettings._revOwnerGUID = revPersUserEntityGUID;
  revPersUserEntitySettings._revContainerGUID = revPersUserEntityGUID;

  let revPersUserEntitySettingsGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersUserEntitySettings),
  );

  let revPersEntitySettingsInfo = REV_ENTITY_STRUCT();
  revPersEntitySettingsInfo._revType = 'rev_object';
  revPersEntitySettingsInfo._revSubType = 'rev_entity_info';
  revPersEntitySettingsInfo._revOwnerGUID = revPersUserEntityGUID;

  revPersEntitySettingsInfo._revMetadataList = [
    REV_METADATA_FILLER('revPassword1', revPassword1),
    REV_METADATA_FILLER('revPassword2', revPassword2),
    REV_METADATA_FILLER('rev_email', revEMail),
  ];

  let revPersEntitySettingsInfoGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersEntitySettingsInfo),
  );

  if (revPersEntitySettingsInfoGUID < 0) {
    return -1;
  } else {
    let revPersEntitySettingsInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revPersEntitySettingsInfoRel._revType = 'rev_entity_info';
    revPersEntitySettingsInfoRel._revOwnerGUID = revPersUserEntityGUID;
    revPersEntitySettingsInfoRel._revTargetGUID = revPersUserEntitySettingsGUID;
    revPersEntitySettingsInfoRel._revSubjectGUID =
      revPersEntitySettingsInfoGUID;

    let revPersEntitySettingsInfoRel_Id =
      RevPersLibCreate_React.revPersRelationshipJSON(
        JSON.stringify(revPersEntitySettingsInfoRel),
      );

    if (revPersEntitySettingsInfoRel_Id < 1) {
      return -1;
    }
  }
  /** END SAVE SETTINGS */

  return revPersUserEntityGUID;
};

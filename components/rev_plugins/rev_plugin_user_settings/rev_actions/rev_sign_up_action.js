import {NativeModules} from 'react-native';

import {REV_ENTITY_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

const {RevPersLibCreate_React, RevPersLibRead_React, RevWebRTCReactModule} =
  NativeModules;

export const revRegisterUserEntity = revVarArgs => {
  let revUserId = revVarArgs.revUserId;
  let revFullNames = revVarArgs.revFullNames;
  let revPassword1 = revVarArgs.revPassword1;
  let revPassword2 = revVarArgs.revPassword2;
  let revEMail = revVarArgs.revEMail;

  let revPersEntity = REV_ENTITY_STRUCT();
  revPersEntity._revEntityType = 'rev_user_entity';
  revPersEntity._revEntitySubType = 'rev_user_entity';

  let revPersInfoEntity = REV_ENTITY_STRUCT();
  revPersInfoEntity._revEntityType = 'rev_object';
  revPersInfoEntity._revEntitySubType = 'rev_entity_info';
  revPersInfoEntity._revEntityMetadataList = [
    REV_METADATA_FILLER('rev_entity_unique_id', revUserId),
    REV_METADATA_FILLER('rev_full_names', revFullNames),
    REV_METADATA_FILLER('revPassword1', revPassword1),
    REV_METADATA_FILLER('revPassword2', revPassword2),
    REV_METADATA_FILLER('rev_email', revEMail),
  ];

  revPersEntity._revInfoEntity = revPersInfoEntity;

  let revPersEntityGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersEntity),
  );

  return revPersEntityGUID;
};

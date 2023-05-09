import React from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibCreate_React} = NativeModules;

import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

export const useRevHandleSendMsgAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revHandleSendMsgAction = async revVarArgs => {
    let revTargetEntityGUID = revVarArgs.revTargetEntityGUID;
    let revEntityOwnerGUID = revVarArgs.revEntityOwnerGUID;

    if (revTargetEntityGUID < 1) {
      return {revTargetEntityGUID: revTargetEntityGUID};
    }

    if (revEntityOwnerGUID < 1) {
      return {revEntityOwnerGUID: revEntityOwnerGUID};
    }

    revVarArgs['revEntitySubType'] = 'rev_stranger_chat_message';

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_entity_desc_val', revVarArgs.revEntityDescVal),
    ];

    revVarArgs['revPersEntityInfoMetadataList'] = revPersEntityInfoMetadataList;

    let revRetEntity = revVarArgs; // await revSaveNewEntity(revVarArgs);
    let revPersEntityGUID = revRetEntity._revEntityGUID;

    revVarArgs['revEntity'] = revRetEntity;

    /** START SET OWNER AS SENDER */
    if (revPersEntityGUID > 0) {
      let revMsgSenderOfRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revMsgSenderOfRel._revEntityRelationshipType = 'rev_stranger_chat_of';

      revMsgSenderOfRel._revEntityGUID = revPersEntityGUID;
      revMsgSenderOfRel._remoteRevEntityGUID = -1;

      revMsgSenderOfRel._revEntityTargetGUID = revEntityOwnerGUID;
      revMsgSenderOfRel._revEntitySubjectGUID = revTargetEntityGUID;

      //   let revMsgRelId = RevPersLibCreate_React.revPersRelationshipJSON(
      //     JSON.stringify(revMsgSenderOfRel),
      //   );

      let revMsgRelId = -1;

      revVarArgs['revMsgRelId'] = revMsgRelId;
    }

    /** END SET OWNER AS SENDER */

    return revVarArgs;
  };

  return {revHandleSendMsgAction};
};

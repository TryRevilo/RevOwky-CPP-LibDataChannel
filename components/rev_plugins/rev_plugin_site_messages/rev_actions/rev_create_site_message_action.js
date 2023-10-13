import React, {useEffect} from 'react';
import {NativeModules} from 'react-native';

import {revPostServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_create';
import {REV_CREATE_NEW_REV_ENTITY_URL} from '../../../rev_libs_pers/rev_server/rev_pers_urls';
import {revPersGetFilledRevEntity_By_GUID} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetMetadataContainingMetadataName} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

const {RevPersLibUpdate_React} = NativeModules;

import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

export const useRevCreateCommentAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateCommentAction = async (revVarArgs, revPersCallBack) => {
    let revCommentContainerGUID = revVarArgs.revCommentContainerGUID;
    let revIsCommentUpdate = revVarArgs.revIsCommentUpdate;
    let revEntityOwnerGUID = revVarArgs.revEntityOwnerGUID;

    if (revCommentContainerGUID < 1) {
      return revPersCallBack({});
    }

    if (revEntityOwnerGUID < 1) {
      return revPersCallBack({});
    }

    let revRetData = {};

    let revPersEntityGUID = -1;

    if (!revIsCommentUpdate) {
      revVarArgs['revEntitySubType'] = 'rev_message';

      let revPersEntityInfoMetadataList = [
        REV_METADATA_FILLER('rev_entity_desc_val', revVarArgs.revEntityDescVal),
      ];

      revVarArgs['revPersEntityInfoMetadataList'] =
        revPersEntityInfoMetadataList;

      let revMsgRecipientOfRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revMsgRecipientOfRel._revType = 'rev_msg_recipient_of';
      revMsgRecipientOfRel._revTargetGUID = -1;
      revMsgRecipientOfRel._revSubjectGUID = revCommentContainerGUID;

      revVarArgs['revTargetRelsArr'] = [revMsgRecipientOfRel];

      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
      revRetData['revNewEntityGUID'] = revPersEntityGUID;
    } else {
      let revCommentText = revVarArgs.revCommentText;

      let revFilledEntity =
        revPersGetFilledRevEntity_By_GUID(revPersEntityGUID);
      let revCurrMetadata = revGetMetadataContainingMetadataName(
        revFilledEntity._revInfoEntity._revMetadataList,
        'rev_entity_desc_val',
      );

      let _revId = revCurrMetadata._revId;
      let revCurrMetadataVal = revCurrMetadata._revValue;

      if (revCurrMetadataVal.localeCompare(revCommentText) !== 0) {
        let revMetadataUpdateStatus =
          RevPersLibUpdate_React.revPersSetMetadataVal_BY_Id(
            _revId,
            revCommentText,
          );

        if (revMetadataUpdateStatus > 0) {
          let revEntityUpdateStatus =
            RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
              -101,
              revPersEntityGUID,
            );

          if (revEntityUpdateStatus == 1) {
            revRetData['revUpdateMetadataIdsArr'] = [_revId];
          }
        }
      }
    }

    revPersCallBack(revRetData);
  };

  return {revCreateCommentAction};
};

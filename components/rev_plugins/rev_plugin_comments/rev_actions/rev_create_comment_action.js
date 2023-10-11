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
      revVarArgs['revEntitySubType'] = 'rev_comment';

      let revPersEntityInfoMetadataList = [
        REV_METADATA_FILLER('rev_comment_value', revVarArgs.revCommentText),
      ];

      revVarArgs['revPersEntityInfoMetadataList'] =
        revPersEntityInfoMetadataList;

      let revCommentRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revCommentRel._revEntityRelationshipType = 'rev_comment';
      revCommentRel._revEntityTargetGUID = revCommentContainerGUID;
      revCommentRel._revEntitySubjectGUID = -1;

      revVarArgs['revSubjectRelsArr'] = [revCommentRel];

      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
      revRetData['revNewEntityGUID'] = revPersEntityGUID;
    } else {
      let revCommentText = revVarArgs.revCommentText;

      let revFilledEntity =
        revPersGetFilledRevEntity_By_GUID(revPersEntityGUID);
      let revCurrMetadata = revGetMetadataContainingMetadataName(
        revFilledEntity._revInfoEntity._revEntityMetadataList,
        'rev_comment_value',
      );

      let _revMetadataId = revCurrMetadata._revMetadataId;
      let revCurrMetadataVal = revCurrMetadata._revMetadataValue;

      if (revCurrMetadataVal.localeCompare(revCommentText) !== 0) {
        let revMetadataUpdateStatus =
          RevPersLibUpdate_React.setMetadataValue_BY_MetadataId(
            _revMetadataId,
            revCommentText,
          );

        if (revMetadataUpdateStatus > 0) {
          let revEntityUpdateStatus =
            RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
              -101,
              revPersEntityGUID,
            );

          if (revEntityUpdateStatus == 1) {
            revRetData['revUpdateMetadataIdsArr'] = [_revMetadataId];
          }
        }
      }
    }

    revPersCallBack(revRetData);
  };

  return {revCreateCommentAction};
};

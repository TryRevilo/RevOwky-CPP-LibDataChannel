import React from 'react';
import {NativeModules} from 'react-native';

import {revGetMetadataContainingMetadataName} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

const {RevPersLibUpdate_React} = NativeModules;

import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revGetInfoEntity} from '../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

export const useRevCreateCommentAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateCommentAction = async (revVarArgs, revPersCallBack) => {
    const {
      _revContainerGUID = -1,
      revIsCommentUpdate = false,
      revCommentEntity,
      revCommentText = '',
      _revOwnerGUID = -1,
    } = revVarArgs;

    if (_revContainerGUID < 1) {
      return revPersCallBack({});
    }

    if (_revOwnerGUID < 1) {
      return revPersCallBack({});
    }

    let revRetData = {};

    let revPersEntityGUID = -1;

    if (!revIsCommentUpdate) {
      revVarArgs['_revSubType'] = 'rev_comment';

      revVarArgs['_revMetadataList'] = [
        REV_METADATA_FILLER('rev_entity_desc', revCommentText),
      ];

      let revCommentRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revCommentRel._revType = 'rev_comment';
      revCommentRel._revTargetGUID = _revContainerGUID;
      revCommentRel._revSubjectGUID = -1;

      revVarArgs['revSubjectRelsArr'] = [revCommentRel];

      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
      revRetData['revNewEntityGUID'] = revPersEntityGUID;
    } else {
      let revCommentInfoEntity = revGetInfoEntity(revCommentEntity);

      if (!revCommentInfoEntity) {
        return null;
      }

      let revCurrMetadata = revGetMetadataContainingMetadataName(
        revCommentInfoEntity._revMetadataList,
        'rev_entity_desc',
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

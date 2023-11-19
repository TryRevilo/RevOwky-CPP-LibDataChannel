import React from 'react';
import {NativeModules} from 'react-native';

import {revPersGetFilledRevEntity_By_GUID} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetMetadataContainingMetadataName} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

const {RevPersLibUpdate_React} = NativeModules;

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

export const useRevCreateSitePostAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateSitePostAction = async (revVarArgs, revPersCallBack) => {
    const {
      _revGUID = -1,
      revEntityOwnerGUID = -1,
      revSitePostText = '',
    } = revVarArgs;

    let revPersEntityGUID = _revGUID;

    if (revEntityOwnerGUID < 1) {
      return revPersCallBack({});
    }

    let revRetData = {};

    if (revPersEntityGUID < 0) {
      revVarArgs['_revSubType'] = 'rev_kiwi';

      revVarArgs['revPersEntityInfoMetadataList'] = [
        REV_METADATA_FILLER('rev_entity_desc', revSitePostText),
      ];

      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
      revRetData['revNewEntityGUID'] = revPersEntityGUID;
    } else {
      let rev_entity_desc = revSitePostText;

      let revFilledEntity =
        revPersGetFilledRevEntity_By_GUID(revPersEntityGUID);
      let revCurrMetadata = revGetMetadataContainingMetadataName(
        revFilledEntity._revInfoEntity._revMetadataList,
        'rev_entity_desc',
      );

      let _revId = revCurrMetadata._revId;
      let revCurrMetadataVal = revCurrMetadata._revValue;

      if (revCurrMetadataVal.localeCompare(rev_entity_desc) !== 0) {
        let revMetadataUpdateStatus =
          RevPersLibUpdate_React.revPersSetMetadataVal_BY_Id(
            _revId,
            rev_entity_desc,
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

  return {revCreateSitePostAction};
};

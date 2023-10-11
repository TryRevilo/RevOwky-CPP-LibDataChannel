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
    let revPersEntityGUID = revVarArgs._revEntityGUID;
    let revEntityOwnerGUID = revVarArgs.revEntityOwnerGUID;

    if (revEntityOwnerGUID < 1) {
      return revPersCallBack({});
    }

    let revRetData = {};

    if (revPersEntityGUID < 0) {
      revVarArgs['revEntitySubType'] = 'rev_kiwi';

      let revPersEntityInfoMetadataList = [
        REV_METADATA_FILLER('revPostText', revVarArgs.revSitePostText),
      ];

      revVarArgs['revPersEntityInfoMetadataList'] =
        revPersEntityInfoMetadataList;

      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
      revRetData['revNewEntityGUID'] = revPersEntityGUID;
    } else {
      let revPostText = revVarArgs.revSitePostText;

      let revFilledEntity =
        revPersGetFilledRevEntity_By_GUID(revPersEntityGUID);
      let revCurrMetadata = revGetMetadataContainingMetadataName(
        revFilledEntity._revInfoEntity._revEntityMetadataList,
        'revPostText',
      );

      let _revMetadataId = revCurrMetadata._revMetadataId;
      let revCurrMetadataVal = revCurrMetadata._revMetadataValue;

      if (revCurrMetadataVal.localeCompare(revPostText) !== 0) {
        let revMetadataUpdateStatus =
          RevPersLibUpdate_React.setMetadataValue_BY_MetadataId(
            _revMetadataId,
            revPostText,
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

  return {revCreateSitePostAction};
};

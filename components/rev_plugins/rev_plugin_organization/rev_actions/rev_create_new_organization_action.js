import React from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibUpdate_React} = NativeModules;

import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevCreateNewOrganizationAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateNewOrganizationAction = async (
    revVarArgs,
    revPersCallBack,
  ) => {
    revVarArgs['revEntitySubType'] = 'rev_organization';

    const {revEntityNameVal, revEntityDescVal, revMainOrganizationIconPath} =
      revVarArgs;

    if (
      revStringEmpty(revEntityNameVal) ||
      revStringEmpty(revEntityDescVal) ||
      revStringEmpty(revMainOrganizationIconPath)
    ) {
      return revPersCallBack(-1);
    }

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_entity_name_val', revEntityNameVal),
      REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
      REV_METADATA_FILLER(
        'rev_main_organization_icon_val',
        revMainOrganizationIconPath,
      ),
    ];

    revVarArgs['revPersEntityInfoMetadataList'] = revPersEntityInfoMetadataList;

    try {
      let revPersEntity = await revSaveNewEntity(revVarArgs);
      return revPersCallBack(revPersEntity._revEntityGUID);
    } catch (error) {
      console.log('*** error', error);
      return revPersCallBack(-1);
    }
  };

  return {revCreateNewOrganizationAction};
};

import React from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibUpdate_React} = NativeModules;

import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevEditUserInfoFormAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revEditUserInfoFormAction = async (revVarArgs, revPersCallBack) => {
    revVarArgs['revEntitySubType'] = 'rev_user_info';

    const {
      revEntityNameVal,
      revEntityDescVal,
      revAboutEntityInfo,
      revMainEntityIconPath,
      revEntityBannerIconPath,
    } = revVarArgs;

    if (
      revStringEmpty(revEntityNameVal) ||
      revStringEmpty(revEntityDescVal) ||
      revStringEmpty(revMainEntityIconPath)
    ) {
      return revPersCallBack(-1);
    }

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_full_names', revEntityNameVal),
      REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
      REV_METADATA_FILLER('rev_about_entity_info', revAboutEntityInfo),
      REV_METADATA_FILLER('rev_main_entity_icon_val', revMainEntityIconPath),
      REV_METADATA_FILLER(
        'rev_main_entity_banner_icon_val',
        revEntityBannerIconPath,
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

  return {revEditUserInfoFormAction};
};

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

export const useRevCreateNewOrganizationAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateNewOrganizationAction = async (
    revVarArgs,
    revPersCallBack,
  ) => {
    let revRetData = {};

    let revPersEntityGUID = -1;

    revVarArgs['revEntitySubType'] = 'rev_organization';

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_entity_name_val', revVarArgs.revEntityNameVal),
      REV_METADATA_FILLER('rev_entity_desc_val', revVarArgs.revEntityDescVal),
    ];

    revVarArgs['revPersEntityInfoMetadataList'] = revPersEntityInfoMetadataList;

    try {
      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
      revRetData['revNewEntityGUID'] = revPersEntityGUID;

      revPersCallBack(revRetData);
    } catch (error) {
      console.log('*** error', error);
    }
  };

  return {revCreateNewOrganizationAction};
};

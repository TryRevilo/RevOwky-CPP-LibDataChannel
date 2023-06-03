import React, {useEffect} from 'react';
import {NativeModules} from 'react-native';

import {revPostServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_create';
import {REV_CREATE_NEW_REV_ENTITY_URL} from '../../../rev_libs_pers/rev_server/rev_pers_urls';
import {revPersGetFilledRevEntity_By_GUID} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetMetadataContainingMetadataName} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

const {RevPersLibUpdate_React} = NativeModules;

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevCreateFlagFormAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateFlagFormAction = async revVarArgs => {
    const {
      revFlagEntityGUID = -1,
      _revEntityGUID = -1,
      revEntityOwnerGUID = -1,
      revFlagValsArr = [],
      revFlagRefLinkValsArr = [],
      revEntityNameVal = '',
      revEntityDescVal = '',
    } = revVarArgs;

    if (
      _revEntityGUID < 1 ||
      revEntityOwnerGUID < 1 ||
      !revFlagValsArr.length
    ) {
      return revPersCallBack({});
    }

    let revPersEntityGUID = revFlagEntityGUID;

    if (revPersEntityGUID < 0) {
      revVarArgs['revEntitySubType'] = 'rev_flag';

      revVarArgs['revPersEntityInfoMetadataList'] = [];

      for (let i = 0; i < revFlagValsArr.length; i++) {
        let revFlagVal = revFlagValsArr[i];

        revVarArgs.revPersEntityInfoMetadataList.push(
          REV_METADATA_FILLER(revFlagVal, revFlagVal),
        );
      }

      for (let i = 0; i < revFlagRefLinkValsArr.length; i++) {
        let revFlagRefLinkVal = revFlagRefLinkValsArr[i];

        revVarArgs.revPersEntityInfoMetadataList.push(
          REV_METADATA_FILLER(revFlagRefLinkVal, revFlagRefLinkVal),
        );
      }

      if (!revStringEmpty(revEntityNameVal)) {
        revVarArgs.revPersEntityInfoMetadataList.push(
          REV_METADATA_FILLER('rev_entity_name_val', revEntityNameVal),
        );
      }

      if (!revStringEmpty(revEntityDescVal)) {
        revVarArgs.revPersEntityInfoMetadataList.push(
          REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
        );
      }

      let revFlagRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revFlagRel._revEntityRelationshipType = 'rev_flag_of';
      revFlagRel._revEntityTargetGUID = _revEntityGUID;
      revFlagRel._revEntitySubjectGUID = -1;

      revVarArgs['revSubjectRelsArr'] = [revFlagRel];

      revPersEntityGUID = await revSaveNewEntity(revVarArgs);
    }

    return revPersEntityGUID;
  };

  return {revCreateFlagFormAction};
};

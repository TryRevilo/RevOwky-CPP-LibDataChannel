import React from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibUpdate_React} = NativeModules;

import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';
import {useRevGetRevEntityMetadata_By_MetadataName_MetadataValue} from '../../../rev_libs_pers/rev_pers_metadata/rev_read/RevPersReadMetadataCustomHooks';

import {
  revStringEmpty,
  revReplaceWiteSpaces,
} from '../../../../rev_function_libs/rev_string_function_libs';
import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';

export const useRevCreateNewTagFormAction = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();
  const {revGetRevEntityMetadata_By_MetadataName_MetadataValue} =
    useRevGetRevEntityMetadata_By_MetadataName_MetadataValue();

  const revCreateNewTagFormAction = async revVarArgs => {
    const {revEntityNameVal = '', revEntityDescVal = ''} = revVarArgs;
    const {revEntityGUID} = revVarArgs;

    if (revStringEmpty(revEntityNameVal)) {
      return -1;
    }

    let revEntityNameValPers = revReplaceWiteSpaces(revEntityNameVal, '_');

    let revSavedTagMetadata =
      revGetRevEntityMetadata_By_MetadataName_MetadataValue(
        'rev_entity_name_val',
        'Jfjdsvk',
      );

    if (!revIsEmptyJSONObject(revSavedTagMetadata)) {
      return revSavedTagMetadata._revMetadataEntityGUID;
    }

    revVarArgs['revEntitySubType'] = 'rev_tag';

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_entity_name_val', revEntityNameValPers),
    ];

    if (!revStringEmpty(revEntityDescVal)) {
      revPersEntityInfoMetadataList.push(
        REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
      );
    }

    revVarArgs['revPersEntityInfoMetadataList'] = revPersEntityInfoMetadataList;

    if (revEntityGUID > 0) {
      let revEntityTagRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revEntityTagRel._revEntityRelationshipType = 'rev_tag_of';
      revEntityTagRel._revEntityTargetGUID = revEntityGUID;
      revEntityTagRel._revEntitySubjectGUID = -1;

      revVarArgs['revSubjectRelsArr'] = [revEntityTagRel];
    }

    try {
      let revPersEntity = await revSaveNewEntity(revVarArgs);
      return revPersEntity._revEntityGUID;
    } catch (error) {
      console.log('*** error', error);
      return -1;
    }
  };

  return {revCreateNewTagFormAction};
};

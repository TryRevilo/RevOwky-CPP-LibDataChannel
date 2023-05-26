import React from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibUpdate_React} = NativeModules;

import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

import {useRevSaveNewEntity} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevCreateNewAdDetailsForm = () => {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revCreateNewAdDetailsForm = async (revVarArgs, revPersCallBack) => {
    const {
      revEntityNameVal = '',
      revEntityDescVal = '',
      revMainCampaignIconPath = '',
      revOrganizationEntityGUID = -1,
      revProductLineGUID = -1,
    } = revVarArgs;

    if (
      revStringEmpty(revEntityNameVal) ||
      revStringEmpty(revEntityDescVal) ||
      revStringEmpty(revMainCampaignIconPath) ||
      revOrganizationEntityGUID < 1 ||
      revProductLineGUID < 1
    ) {
      return revPersCallBack(-1);
    }

    revVarArgs['revEntitySubType'] = 'rev_ad';

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_entity_name_val', revEntityNameVal),
      REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
      REV_METADATA_FILLER('revMainCampaignIconPath', revMainCampaignIconPath),
    ];

    revVarArgs['revPersEntityInfoMetadataList'] = revPersEntityInfoMetadataList;

    let revOrgRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revOrgRel._revEntityRelationshipType = 'rev_organization_of';
    revOrgRel._revEntityTargetGUID = -1;
    revOrgRel._revEntitySubjectGUID = revOrganizationEntityGUID;

    let revProductLineRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revProductLineRel._revEntityRelationshipType = 'rev_product_line_of';
    revProductLineRel._revEntityTargetGUID = -1;
    revProductLineRel._revEntitySubjectGUID = revProductLineGUID;

    revVarArgs['revTargetRelsArr'] = [revOrgRel, revProductLineRel];

    try {
      let revPersEntity = await revSaveNewEntity(revVarArgs);
      return revPersCallBack(revPersEntity._revEntityGUID);
    } catch (error) {
      console.log('*** error -revCreateNewAdDetailsForm', error);
      return revPersCallBack(-1);
    }
  };

  return {revCreateNewAdDetailsForm};
};

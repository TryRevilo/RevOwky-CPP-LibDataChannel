import {NativeModules} from 'react-native';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevGenLibs_Server_React,
} = NativeModules;

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const userevPersGetMetadata_By_Name_EntityGUID = () => {
  const revPersGetMetadata_By_Name_EntityGUID = (
    revMetadataName,
    revEntityGUID,
  ) => {
    let revMetadataStr =
      RevPersLibRead_React.revPersGetMetadata_By_Name_EntityGUID(
        revMetadataName,
        revEntityGUID,
      );
    return JSON.parse(revMetadataStr);
  };

  return {revPersGetMetadata_By_Name_EntityGUID};
};

export const useRevGetRevEntityMetadata_By_MetadataName_MetadataValue = () => {
  const revGetRevEntityMetadata_By_MetadataName_MetadataValue = (
    revMetadataName,
    revMetadataValue,
  ) => {
    let revRetMetadataStr =
      RevPersLibRead_React.revGetRevEntityMetadata_By_MetadataName_MetadataValue(
        revMetadataName,
        revMetadataValue,
      );

    if (!revStringEmpty(revRetMetadataStr) && revRetMetadataStr !== 'null') {
      let revRetMetadata = JSON.parse(revRetMetadataStr);

      revRetMetadata['_revGUID'] = revRetMetadata._revGUID;

      return revRetMetadata;
    }

    return {};
  };

  return {revGetRevEntityMetadata_By_MetadataName_MetadataValue};
};

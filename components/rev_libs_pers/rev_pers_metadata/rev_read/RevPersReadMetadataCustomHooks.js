import {NativeModules} from 'react-native';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevGenLibs_Server_React,
} = NativeModules;

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revStringEmpty} from '../../../../rev_function_libs/rev_string_function_libs';

export const useRevGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID =
  () => {
    const revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID = (
      revMetadataName,
      revEntityGUID,
    ) => {
      let revMetadataStr =
        RevPersLibRead_React.revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(
          revMetadataName,
          revEntityGUID,
        );
      return JSON.parse(revMetadataStr);
    };

    return {revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID};
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

      revRetMetadata['_revMetadataEntityGUID'] = revRetMetadata._revEntityGUID;

      return revRetMetadata;
    }

    return {};
  };

  return {revGetRevEntityMetadata_By_MetadataName_MetadataValue};
};

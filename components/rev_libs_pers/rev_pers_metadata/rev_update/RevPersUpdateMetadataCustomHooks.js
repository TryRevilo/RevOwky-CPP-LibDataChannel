import {NativeModules} from 'react-native';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevGenLibs_Server_React,
} = NativeModules;

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';

export const useRevSetMetadataArrayRemoteID = (
  revEntityGUID,
  revMetadataArr,
) => {
  for (let i = 0; i < revMetadataArr.length; i++) {
    let revCurrMetadata = revMetadataArr[i];

    if (revIsEmptyJSONObject(revCurrMetadata)) {
      continue;
    }

    let _revMetadataId = revCurrMetadata._revMetadataId;
    let _revRemoteMetadataId = revCurrMetadata._revRemoteMetadataId;

    if (_revMetadataId < 1 || _revRemoteMetadataId < 1) {
      continue;
    }

    RevPersLibUpdate_React.setRemoteRevEntityMetadataId(
      _revMetadataId,
      _revRemoteMetadataId,
    );
  }

  return true;
};

export const useRevUpdateRevEntityStats = () => {
  const revUpdateRevEntityStats = (
    revEntityGUID,
    revStatsName,
    revStatsVal,
  ) => {};

  return {revUpdateRevEntityStats};
};

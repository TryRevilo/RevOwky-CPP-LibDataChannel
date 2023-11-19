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
  if (!Array.isArray(revMetadataArr)) {
    return false;
  }

  for (let i = 0; i < revMetadataArr.length; i++) {
    let revCurrMetadata = revMetadataArr[i];

    if (revIsEmptyJSONObject(revCurrMetadata)) {
      continue;
    }

    let _revId = revCurrMetadata._revId;
    let _revRemoteId = revCurrMetadata._revRemoteId;

    if (_revId < 1 || _revRemoteId < 1) {
      continue;
    }

    RevPersLibUpdate_React.revPersSetRemoteMetadataId(_revId, _revRemoteId);
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

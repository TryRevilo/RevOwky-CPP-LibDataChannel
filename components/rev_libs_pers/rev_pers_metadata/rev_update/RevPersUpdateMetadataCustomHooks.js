import {NativeModules} from 'react-native';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevWebRTCReactModule,
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

    let revLocalMetadataId = revCurrMetadata.localMetadataId;
    let revRemoteMetadataId = revCurrMetadata.metadataId;

    if (revLocalMetadataId < 1 || revRemoteMetadataId < 1) {
      continue;
    }

    RevPersLibUpdate_React.setRemoteRevEntityMetadataId(
      revLocalMetadataId,
      revRemoteMetadataId,
    );
  }

  return true;
};

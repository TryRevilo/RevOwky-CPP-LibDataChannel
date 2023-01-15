import React, {useCallback} from 'react';
import {NativeModules} from 'react-native';

var RNFS = require('react-native-fs');
import RNFetchBlob from 'react-native-fetch-blob';

import {REV_ENTITY_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

import {revPostServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_create';
import {REV_CREATE_NEW_REV_ENTITY_URL} from '../../../rev_libs_pers/rev_server/rev_pers_urls';

const {RevPersLibCreate_React} = NativeModules;

const revWriteFile = async revFile => {
  return new Promise(async (resolve, reject) => {
    let revName = revFile.name;
    let revURI = revFile.uri;

    let stats = await RNFetchBlob.fs.stat(revURI);

    let revStatsPath = 'file://' + stats.path;

    const DirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media';

    var path = DirectoryPath + '/_rev_' + revName;

    const ifstream = await RNFetchBlob.fs.readStream(
      revStatsPath,
      'base64',
      4096,
    );

    ifstream.open();
    ifstream.onData(async chunk => {
      await RNFetchBlob.fs.appendFile(path, chunk, 'base64');
    });

    ifstream.onEnd(() => {
      resolve(revStatsPath);
    });
  });
};

export const revCreateSitePostAction = async (revVarArgs, revPersCallBack) => {
  let revEntityOwnerGUID = revVarArgs._revEntityOwnerGUID;

  if (revEntityOwnerGUID < 1) {
    return -1;
  }

  let revPostText = revVarArgs.revSitePostText;

  let revPersEntity = REV_ENTITY_STRUCT();
  revPersEntity._revEntityType = 'rev_object';
  revPersEntity._revEntitySubType = 'rev_kiwi';
  revPersEntity._revEntityOwnerGUID = revEntityOwnerGUID;
  revPersEntity._revEntityChildableStatus = 301;

  let revPersEntityGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersEntity),
  );

  if (revPersEntityGUID < 1) {
    revPersCallBack(-1);
  }

  /** START REV INFO */
  let revPersEntityInfo = REV_ENTITY_STRUCT();
  revPersEntityInfo._remoteRevEntityGUID = -1;
  revPersEntityInfo._revEntityResolveStatus = 0;
  revPersEntityInfo._revEntityChildableStatus = 3;
  revPersEntityInfo._revEntityType = 'revObject';
  revPersEntityInfo._revEntitySubType = 'rev_entity_info';
  revPersEntityInfo._revEntityOwnerGUID = revPersEntityGUID;
  revPersEntityInfo._revEntityContainerGUID = revPersEntityGUID;
  revPersEntityInfo._revEntityChildableStatus = 3;
  /** END REV INFO */

  revPersEntityInfo._revEntityMetadataList = [
    REV_METADATA_FILLER('revPostText', revPostText),
  ];

  let resEntityInfoGUID = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersEntityInfo),
  );

  if (resEntityInfoGUID < 1) {
    revPersCallBack(-1);
  }

  /** REV START ATTACH INFO */
  revPersEntityInfo._revEntityGUID = resEntityInfoGUID;
  revPersEntity._revInfoEntity = revPersEntityInfo;
  /** REV END ATTACH INFO */

  let revInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
  revInfoRel._revEntityRelationshipType = 'rev_entity_info';
  revInfoRel._revOwnerGUID = revEntityOwnerGUID;
  revInfoRel._revEntityTargetGUID = revPersEntityGUID;
  revInfoRel._revEntitySubjectGUID = resEntityInfoGUID;

  let revinfoRelId = RevPersLibCreate_React.revPersRelationshipJSON(
    JSON.stringify(revInfoRel),
  );

  if (revinfoRelId < 1) {
    revPersCallBack(-1);
  }

  // START Save selected media
  let revSelectedMedia = revVarArgs.revSelectedMedia;

  for (const key in revSelectedMedia) {
    if (Object.hasOwnProperty.call(revSelectedMedia, key)) {
      const revFile = revSelectedMedia[key];

      let revName = revFile.name;
      let revURI = revFile.uri;
      let revType = revFile.type;
      let revSize = revFile.size;

      let revStatsPath = await revWriteFile(revFile);

      let revPersFileEntity = REV_ENTITY_STRUCT();
      revPersFileEntity._revEntityType = 'rev_object';
      revPersFileEntity._revEntitySubType = 'rev_file';
      revPersFileEntity._revEntityOwnerGUID = revEntityOwnerGUID;

      revPersFileEntity._revEntityMetadataList = [
        REV_METADATA_FILLER('rev_file_name', revName),
        REV_METADATA_FILLER('rev_file_uri', revStatsPath),
        REV_METADATA_FILLER('rev_file_type', revType),
        REV_METADATA_FILLER('rev_file_size', revSize.toString()),
      ];

      let revPersFileEntityGUID = RevPersLibCreate_React.revPersInitJSON(
        JSON.stringify(revPersFileEntity),
      );

      let revEntityRel = REV_ENTITY_RELATIONSHIP_STRUCT();

      revEntityRel._revEntityTargetGUID = revPersEntityGUID;
      revEntityRel._revEntitySubjectGUID = revPersFileEntityGUID;
      revEntityRel._revEntityRelationshipType = 'rev_file_of';
      revEntityRel._revOwnerGUID = revEntityOwnerGUID;

      let revRelId = RevPersLibCreate_React.revPersRelationshipJSON(
        JSON.stringify(revEntityRel),
      );
    }
  }
  // END Save selected media

  let revKiwiPersArr = {filter: [revPersEntity]};

  revPostServerData(
    REV_CREATE_NEW_REV_ENTITY_URL,
    revKiwiPersArr,
    revRetData => {
      console.log('>>> revRetData ' + JSON.stringify(revRetData));

      revPersCallBack(revPersEntityGUID);
    },
  );
};

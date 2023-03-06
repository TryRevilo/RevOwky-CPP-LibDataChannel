import React, {useContext} from 'react';
import {DeviceEventEmitter, NativeModules} from 'react-native';

var RNFS = require('react-native-fs');
import RNFetchBlob from 'react-native-fetch-blob';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

import {REV_ENTITY_STRUCT} from '../../rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../rev_db_struct_models/revEntityRelationship';

import {useRevPersSyncDataComponent} from '../../rev_server/RevPersSyncDataComponent';

import {revGetFileObjectSubType} from '../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revIsEmptyVar,
  revGetFileType,
} from '../../../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibCreate_React} = NativeModules;

const useRevCreateNewEntity = () => {
  const {REV_LOGGED_IN_ENTITY_GUID, REV_SITE_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const revCreateNewEntity = revPersData => {
    if (REV_LOGGED_IN_ENTITY_GUID < 1 || REV_SITE_ENTITY_GUID < 1) {
      return -1;
    }

    if (revIsEmptyVar(revPersData)) {
      return -1;
    }

    if (!revPersData.hasOwnProperty('_revEntityType')) {
      return -1;
    }

    if (!revPersData.hasOwnProperty('_revEntitySubType')) {
      return -1;
    }

    if (!revPersData.hasOwnProperty('_revEntityOwnerGUID')) {
      return -1;
    }

    revPersData._revEntitySiteGUID = REV_SITE_ENTITY_GUID;

    let revPersEntityGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revPersData),
    );

    return revPersEntityGUID;
  };

  return {revCreateNewEntity};
};

var usRevSetNewRemoteFile = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const revSetNewRemoteFile = (revLocalFile, revSeedId) => {
    let revCurrTime = new Date().getTime();

    let revNewFileNameConst = REV_LOGGED_IN_ENTITY_GUID + '_' + revCurrTime;

    if (revSeedId) revNewFileNameConst = revNewFileNameConst + '_' + revSeedId;

    let revFileType = revGetFileType(revLocalFile);
    let revNewFileName = revNewFileNameConst + '.' + revFileType;

    return revNewFileName;
  };

  return {revSetNewRemoteFile};
};

export const useRevSetFileObject = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const revSetFileObject = (
    revEntitySubType,
    revEntityContainerGUID,
    revFileName,
  ) => {
    let revFileEntity = REV_ENTITY_STRUCT();
    revFileEntity._revEntityResolveStatus = 0;
    revFileEntity._revEntityType = 'rev_object';
    revFileEntity._revEntitySubType = revEntitySubType;
    revFileEntity._revRemoteEntityGUID = -1;
    revFileEntity._revEntityOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
    revFileEntity._revEntityContainerGUID = revEntityContainerGUID;
    revFileEntity._revTimeCreated = new Date().getTime();
    revFileEntity._revEntityChildableStatus = 2;

    let revFileEntityMetadataList = [
      REV_METADATA_FILLER('rev_remote_file_name', revFileName),
    ];

    revFileEntity._revEntityMetadataList = revFileEntityMetadataList;

    return revFileEntity;
  };

  return {revSetFileObject};
};

export const revWriteFile_ = async revFile => {
  return new Promise(async (resolve, reject) => {
    let revName = revFile.name;
    let revURI = revFile.uri;
    let revNewFileName = revFile.revNewFileName;

    let stats = await RNFetchBlob.fs.stat(revURI);

    let revStatsPath = 'file://' + stats.path;

    const DirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media';

    var path = DirectoryPath + '/_rev_' + revNewFileName;

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

export const revWriteFile = revFile => {
  let revURI = revFile.uri;
  let revNewFileName = revFile.revNewFileName;

  const revDirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media/';

  let revDestFilePath = revDirectoryPath + revNewFileName;

  let revResStatus = RevPersLibCreate_React.revCopyFile(
    revURI,
    revDestFilePath,
  );
};

export const useRevCreateMediaAlbum = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {revCreateNewEntity} = useRevCreateNewEntity();

  const {revSetNewRemoteFile} = usRevSetNewRemoteFile();
  const {revSetFileObject} = useRevSetFileObject();

  const revCreateMediaAlbum = (revEntityContainerGUID, revFileObjectsArr) => {
    let revPicAlbumObject = REV_ENTITY_STRUCT();
    revPicAlbumObject._revEntityResolveStatus = 0;
    revPicAlbumObject._revEntityChildableStatus = 301;
    revPicAlbumObject._revEntityType = 'rev_object';
    revPicAlbumObject._revEntitySubType = 'rev_pics_album';
    revPicAlbumObject._revEntityOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
    revPicAlbumObject.revEntityContainerGUID = revEntityContainerGUID;
    revPicAlbumObject._revTimeCreated = new Date().getTime();

    let revPicAlbumEntityGUID = revCreateNewEntity(revPicAlbumObject);

    /** START CREATE PICS ALBUM REL */
    let revPicsAlbumRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revPicsAlbumRel._revEntityRelationshipType = 'rev_pics_album_of';
    revPicsAlbumRel._revEntityTargetGUID = revEntityContainerGUID;
    revPicsAlbumRel._revEntitySubjectGUID = revPicAlbumEntityGUID;

    let revPicsAlbumRelId = RevPersLibCreate_React.revPersRelationshipJSON(
      JSON.stringify(revPicsAlbumRel),
    );
    /** END CREATE PICS ALBUM REL */

    /** START SET OBJECT */
    let revFilesPersArr = [];
    let revEntityGUIDs = [];

    for (let i = 0; i < revFileObjectsArr.length; i++) {
      let revFile = revFileObjectsArr[i];

      let revFileType = revGetFileType(revFile);
      let revFileSubtype = revGetFileObjectSubType(revFile);

      let revNewFileName = revSetNewRemoteFile(revFile, i);

      revFile['revNewFileName'] = revNewFileName;

      let revEntityFileObject = revSetFileObject(
        revFileSubtype,
        -1,
        revNewFileName,
      );

      revEntityFileObject._revEntityMetadataList.push(
        REV_METADATA_FILLER(revFileType, revFileType),
      );

      revEntityFileObject._revEntityGUID = i;
      revEntityGUIDs.push(i);

      // START SAVE FILE OBJECT
      let revPersFileEntityGUID = revCreateNewEntity(revEntityFileObject);

      if (revPersFileEntityGUID > 0) {
        let revPicsAlbumFileRel = REV_ENTITY_RELATIONSHIP_STRUCT();
        revPicsAlbumFileRel._revEntityRelationshipType = 'rev_picture_of';
        revPicsAlbumFileRel._revEntityTargetGUID = revPicAlbumEntityGUID;
        revPicsAlbumFileRel._revEntitySubjectGUID = revPersFileEntityGUID;

        let revPicRelId = RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revPicsAlbumFileRel),
        );

        if (revPicRelId > 0) {
          revWriteFile(revFile);
        }
      }
    }
    /** END SET FILE OBJECT */
  };

  return {revCreateMediaAlbum};
};

export const useRevSaveNewEntity = () => {
  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();
  const {revCreateNewEntity} = useRevCreateNewEntity();
  const {revCreateMediaAlbum} = useRevCreateMediaAlbum();

  const revSaveNewEntity = async revVarArgs => {
    let revEntityOwnerGUID = revVarArgs._revEntityOwnerGUID;
    let revPostText = revVarArgs.revSitePostText;

    let revPersEntityData = REV_ENTITY_STRUCT();
    revPersEntityData._revEntityType = 'rev_object';
    revPersEntityData._revEntitySubType = 'rev_kiwi';
    revPersEntityData._revEntityOwnerGUID = revEntityOwnerGUID;

    let revPersEntityGUID = revCreateNewEntity(revPersEntityData);

    if (revPersEntityGUID < 1) {
      return -1;
    }

    /** START REV INFO */
    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('revPostText', revPostText),
    ];

    let revPersInfoEntityData = REV_ENTITY_STRUCT();
    revPersInfoEntityData._revEntityType = 'rev_object';
    revPersInfoEntityData._revEntitySubType = 'rev_entity_info';
    revPersInfoEntityData._revEntityOwnerGUID = revEntityOwnerGUID;
    revPersInfoEntityData._revEntityContainerGUID = revPersEntityGUID;
    revPersInfoEntityData._revEntityMetadataList =
      revPersEntityInfoMetadataList;

    let resEntityInfoGUID = revCreateNewEntity(revPersInfoEntityData);

    if (resEntityInfoGUID < 0) {
      return -1;
    }

    let revInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revInfoRel._revEntityRelationshipType = 'rev_entity_info';
    revInfoRel._revOwnerGUID = revEntityOwnerGUID;
    revInfoRel._revEntityTargetGUID = revPersEntityGUID;
    revInfoRel._revEntitySubjectGUID = resEntityInfoGUID;

    let revinfoRelId = RevPersLibCreate_React.revPersRelationshipJSON(
      JSON.stringify(revInfoRel),
    );

    if (revinfoRelId < 1) {
      return -1;
    }

    // START Save selected media
    if (
      revVarArgs.hasOwnProperty('revSelectedMedia') &&
      !revIsEmptyVar(revVarArgs.revSelectedMedia)
    ) {
      let revSelectedMedia = revVarArgs.revSelectedMedia;

      revCreateMediaAlbum(revPersEntityGUID, revSelectedMedia);
    }
    // END Save selected media

    revPersSyncDataComponent(-1, revSynchedGUIDsArr => {
      console.log(
        '>>> NEW -revSynchedGUIDsArr ' + JSON.stringify(revSynchedGUIDsArr),
      );
    });

    return revPersEntityGUID;
  };

  return {revSaveNewEntity};
};

import React, {useContext} from 'react';
import {NativeModules} from 'react-native';

var RNFS = require('react-native-fs');
import RNFetchBlob from 'react-native-fetch-blob';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

import {useRevGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID} from '../../rev_pers_metadata/rev_read/RevPersReadMetadataCustomHooks';

import {REV_ENTITY_STRUCT} from '../../rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../rev_db_struct_models/revEntityRelationship';

import {useRevPersSyncDataComponent} from '../../rev_server/RevPersSyncDataComponent';

import {
  revGetFileObjectSubType,
  revIsEmptyJSONObject,
  revIsEmptyVar,
  revGetFileType,
  revGetFileAbsolutePath,
} from '../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revCompareStrings,
  revGetFilePathType,
  revStringEmpty,
} from '../../../../rev_function_libs/rev_string_function_libs';

const {RevPersLibCreate_React, RevPersLibUpdate_React} = NativeModules;

export const useRevCreateNewEntity = () => {
  const {REV_LOGGED_IN_ENTITY_GUID, REV_SITE_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const revCreateNewEntity = revPersData => {
    let revEntityType = revPersData._revEntityType;

    if (
      revEntityType !== 'rev_user_entity' &&
      (REV_LOGGED_IN_ENTITY_GUID < 1 || REV_SITE_ENTITY_GUID < 1)
    ) {
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

    if (revSeedId >= 0) {
      revNewFileNameConst = revSeedId + '_' + revNewFileNameConst;
    }

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
    revFileEntity._revEntityResolveStatus = -1;
    revFileEntity._revEntityType = 'rev_object';
    revFileEntity._revEntitySubType = revEntitySubType;
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

export const revWriteFile = async revFile => {
  let revURI = revFile.uri;
  let revNewFileName = revFile.revNewFileName;

  let revFilePathType = revGetFilePathType(revURI);

  const revDirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media/';

  let revDestFilePath = revDirectoryPath + revNewFileName;

  try {
    let revFilePath = await revGetFileAbsolutePath(revURI);

    let revResStatus = RevPersLibCreate_React.revCopyFile(
      revFilePath,
      revDestFilePath,
    );

    return revResStatus;
  } catch (error) {
    console.log('*** error -revWriteFile', error);
  }
};

export const useRevCreateMediaAlbum = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {revCreateNewEntity} = useRevCreateNewEntity();

  const {revSetNewRemoteFile} = usRevSetNewRemoteFile();
  const {revSetFileObject} = useRevSetFileObject();

  const revCreateMediaAlbum = async (
    revEntityContainerGUID,
    revFileObjectsArr,
  ) => {
    let revPicAlbumObject = REV_ENTITY_STRUCT();
    revPicAlbumObject._revEntityResolveStatus = -1;
    revPicAlbumObject._revEntityChildableStatus = 301;
    revPicAlbumObject._revEntityType = 'rev_object';
    revPicAlbumObject._revEntitySubType = 'rev_pics_album';
    revPicAlbumObject._revEntityOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
    revPicAlbumObject.revEntityContainerGUID = revEntityContainerGUID;
    revPicAlbumObject._revTimeCreated = new Date().getTime();

    let revPicAlbumEntityGUID = revCreateNewEntity(revPicAlbumObject);

    if (revPicAlbumEntityGUID < 1) {
      return;
    }

    /** START CREATE PICS ALBUM REL */
    let revPicsAlbumRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revPicsAlbumRel._revEntityRelationshipType = 'rev_pics_album_of';
    revPicsAlbumRel._revEntityTargetGUID = revEntityContainerGUID;
    revPicsAlbumRel._revEntitySubjectGUID = revPicAlbumEntityGUID;

    let revPicsAlbumRelId = RevPersLibCreate_React.revPersRelationshipJSON(
      JSON.stringify(revPicsAlbumRel),
    );

    if (revPicsAlbumRelId < 1) {
      return;
    }
    /** END CREATE PICS ALBUM REL */

    /** START SET OBJECT */
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
          await revWriteFile(revFile);
        }
      }
    }
    /** END SET FILE OBJECT */
  };

  return {revCreateMediaAlbum};
};

export const useRevSetRemoteRelGUID = () => {
  const revSetRemoteRelGUID = (revEntityGUID, remoteRevEntityGUID) => {
    let revUpdateSetRemoteSubjectGUID =
      RevPersLibUpdate_React.revPersUpdateSetRemoteSubjectGUID(
        revEntityGUID,
        remoteRevEntityGUID,
      );

    let revUpdateSetRemoteTargetGUID =
      RevPersLibUpdate_React.revPersUpdateSetRemoteTargetGUID(
        revEntityGUID,
        remoteRevEntityGUID,
      );

    return revUpdateSetRemoteSubjectGUID && revUpdateSetRemoteTargetGUID
      ? 1
      : -1;
  };

  return {revSetRemoteRelGUID};
};

export const useRevSaveNewEntity = () => {
  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();
  const {revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID} =
    useRevGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID();

  const {revCreateNewEntity} = useRevCreateNewEntity();
  const {revCreateMediaAlbum} = useRevCreateMediaAlbum();

  const revSaveNewEntity = async revVarArgs => {
    if (revIsEmptyJSONObject(revVarArgs)) {
      return;
    }

    if (
      !revVarArgs.hasOwnProperty(
        'revEntityOwnerGUID' || revVarArgs.revEntityOwnerGUID < 1,
      )
    ) {
      return -1;
    }

    if (
      !revVarArgs.hasOwnProperty(
        'revEntitySubType' || revIsEmptyVar(revVarArgs._revEntitySubType),
      )
    ) {
      return -1;
    }

    if ('_revEntityGUID' in revVarArgs && revVarArgs._revEntityGUID) {
      let revEntityGUID = revVarArgs._revEntityGUID;
      let revPersEntityInfoMetadataList =
        revVarArgs.revPersEntityInfoMetadataList;

      for (let i = 0; i < revPersEntityInfoMetadataList.length; i++) {
        let revPersEntityInfoMetadata = revPersEntityInfoMetadataList[i];

        let revUpdateMetadataVal = revPersEntityInfoMetadata._metadataValue;

        let revMetadata =
          revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(
            revPersEntityInfoMetadata._revMetadataName,
            revEntityGUID,
          );

        let revMetadataId = revMetadata.revMetadataId;
        let revMetadataValue = revMetadata._metadataValue;

        if (
          revStringEmpty(revUpdateMetadataVal) ||
          revCompareStrings(
            revMetadataValue,
            revPersEntityInfoMetadata._metadataValue,
          ) == 0
        ) {
          continue;
        }

        if (revMetadataId > 0) {
          let revUpdateStatus =
            RevPersLibUpdate_React.setMetadataValue_BY_MetadataId(
              revMetadataId,
              revUpdateMetadataVal,
            );

          console.log(revMetadataId, '>>> revUpdateStatus', revUpdateStatus);
        } else {
          revPersEntityInfoMetadata['_revMetadataEntityGUID'] = revEntityGUID;

          console.log(
            revMetadataId,
            'revPersEntityInfoMetadata',
            revPersEntityInfoMetadata,
          );

          let revPersMetedataStatus =
            RevPersLibCreate_React.revPersSaveEntityMetadataJSONStr(
              JSON.stringify(revPersEntityInfoMetadata),
            );

          console.log('>>> revPersMetedataStatus', revPersMetedataStatus);
        }
      }

      return;
    } else {
      return;
    }

    let revEntityOwnerGUID = revVarArgs.revEntityOwnerGUID;

    let revPersEntityData = REV_ENTITY_STRUCT();
    revPersEntityData._revEntityType = 'rev_object';
    revPersEntityData._revEntitySubType = revVarArgs.revEntitySubType;
    revPersEntityData._revEntityOwnerGUID = revEntityOwnerGUID;
    revPersEntityData._revEntityContainerGUID =
      'revContainerEntityGUID' in revVarArgs &&
      revVarArgs.revContainerEntityGUID > 0
        ? revVarArgs.revContainerEntityGUID
        : -1;

    let revPersEntityGUID = revCreateNewEntity(revPersEntityData);

    revPersEntityData['_revEntityGUID'] = revPersEntityGUID;

    if (revPersEntityGUID < 1) {
      return -1;
    }

    /** START SAVE SUBJECT RELS */
    if (
      revVarArgs.hasOwnProperty('revSubjectRelsArr') &&
      Array.isArray(revVarArgs.revSubjectRelsArr)
    ) {
      let revSubjectRelsArr = revVarArgs.revSubjectRelsArr;

      for (let i = 0; i < revSubjectRelsArr.length; i++) {
        let revSubjectRel = revSubjectRelsArr[i];

        if (revIsEmptyJSONObject(revSubjectRel)) {
          continue;
        }

        if (
          !revSubjectRel ||
          !revSubjectRel._revEntityTargetGUID ||
          revSubjectRel._revEntityTargetGUID < 1
        ) {
          continue;
        }

        revSubjectRel._revEntitySubjectGUID = revPersEntityGUID;

        let revSubjectRelId = RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revSubjectRel),
        );
      }
    }
    /** END SAVE SUBJECT RELS */

    /** START SAVE TARGET RELS */
    if (
      revVarArgs.hasOwnProperty('revTargetRelsArr') &&
      Array.isArray(revVarArgs.revTargetRelsArr)
    ) {
      let revTargetRelsArr = revVarArgs.revTargetRelsArr;

      for (let i = 0; i < revTargetRelsArr.length; i++) {
        let revTargetRel = revTargetRelsArr[i];

        if (revIsEmptyJSONObject(revTargetRel)) {
          continue;
        }

        if (
          !revTargetRel ||
          !revTargetRel._revEntitySubjectGUID ||
          revTargetRel._revEntitySubjectGUID < 1
        ) {
          continue;
        }

        revTargetRel._revEntityTargetGUID = revPersEntityGUID;

        let revTargetRelId = RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revTargetRel),
        );
      }
    }
    /** END SAVE TARGET RELS */

    /** START REV INFO */
    let revPersInfoEntityData = REV_ENTITY_STRUCT();
    revPersInfoEntityData._revEntityType = 'rev_object';
    revPersInfoEntityData._revEntitySubType = 'rev_entity_info';
    revPersInfoEntityData._revEntityOwnerGUID = revEntityOwnerGUID;
    revPersInfoEntityData._revEntityContainerGUID = revPersEntityGUID;
    revPersInfoEntityData._revEntityMetadataList =
      revVarArgs.revPersEntityInfoMetadataList;

    let resEntityInfoGUID = revCreateNewEntity(revPersInfoEntityData);

    revPersInfoEntityData['_revEntityGUID'] = resEntityInfoGUID;
    revPersEntityData['_revInfoEntity'] = revPersInfoEntityData;

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

      await revCreateMediaAlbum(revPersEntityGUID, revSelectedMedia);
    }
    // END Save selected media

    revPersSyncDataComponent(-1, revSynchedGUIDsArr => {
      console.log(
        '>>> NEW -revSynchedGUIDsArr ' + JSON.stringify(revSynchedGUIDsArr),
      );
    });

    return revPersEntityData;
  };

  return {revSaveNewEntity};
};

export const useRevCreateNewUserEntity = () => {
  const {revSetRemoteRelGUID} = useRevSetRemoteRelGUID();

  const revCreateNewUserEntity = revUserEntity => {
    if (revIsEmptyJSONObject(revUserEntity)) {
      return -1;
    }

    if (
      revUserEntity.hasOwnProperty('_remoteRevEntityGUID') &&
      revUserEntity._remoteRevEntityGUID
    ) {
      revUserEntity['_revEntityResolveStatus'] = 0;
    }

    if (
      !revUserEntity.hasOwnProperty('_revInfoEntity') ||
      revIsEmptyJSONObject(revUserEntity._revInfoEntity)
    ) {
      return -1;
    }

    let revUserEntityInfo = JSON.parse(
      JSON.stringify(revUserEntity._revInfoEntity),
    );
    delete revUserEntity['_revInfoEntity'];

    let revUserEntityGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revUserEntity),
    );

    if (revUserEntityGUID < 1) {
      return -1;
    }

    /** START SAVE INFO */
    revUserEntityInfo['_revEntityOwnerGUID'] = revUserEntityGUID;
    revUserEntityInfo['_revEntityResolveStatus'] = 0;

    let revUserEntityInfoMetadataList =
      revUserEntityInfo._revEntityMetadataList;

    for (let i = 0; i < revUserEntityInfoMetadataList.length; i++) {
      revUserEntityInfoMetadataList[i]['_resolveStatus'] = 0;
    }

    let revUserEntityInfoGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revUserEntityInfo),
    );
    /** END SAVE INFO */

    if (revUserEntityInfoGUID < 0) {
      return -1;
    }

    let revPersUserEntityInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revPersUserEntityInfoRel._revEntityRelationshipType = 'rev_entity_info';
    revPersUserEntityInfoRel._revOwnerGUID = revUserEntityGUID;
    revPersUserEntityInfoRel._revEntityTargetGUID = revUserEntityGUID;
    revPersUserEntityInfoRel._revEntitySubjectGUID = revUserEntityInfoGUID;

    let revPersUserEntityInfoRel_Id =
      RevPersLibCreate_React.revPersRelationshipJSON(
        JSON.stringify(revPersUserEntityInfoRel),
      );

    if (revPersUserEntityInfoRel_Id < 1) {
      return -1;
    }

    let revUserEntitySettings = revUserEntity._revEntitySettings;

    revUserEntitySettings['_revEntityOwnerGUID'] = revUserEntityGUID;
    revUserEntitySettings._revEntityContainerGUID = revUserEntityGUID;
    revUserEntitySettings['_revEntityResolveStatus'] = 0;

    let revUserEntitySettingsInfo = JSON.parse(
      JSON.stringify(revUserEntitySettings._revInfoEntity),
    );

    delete revUserEntitySettings['_revInfoEntity'];

    let revUserEntitySettingsGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revUserEntitySettings),
    );

    revUserEntitySettingsInfo['_revEntityOwnerGUID'] = revUserEntityGUID;
    revUserEntitySettingsInfo['_revEntityResolveStatus'] = 0;

    let revUserEntitySettingsMetadataList =
      revUserEntitySettingsInfo._revEntityMetadataList;

    for (let i = 0; i < revUserEntitySettingsMetadataList.length; i++) {
      if (!revUserEntitySettingsMetadataList[i]) {
        continue;
      }

      revUserEntitySettingsMetadataList[i]['_resolveStatus'] = 0;
    }

    let revUserEntitySettingsInfoGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revUserEntitySettingsInfo),
    );

    if (revUserEntitySettingsInfoGUID < 0) {
      return -1;
    } else {
      let revPersEntitySettingsInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revPersEntitySettingsInfoRel._revEntityRelationshipType =
        'rev_entity_info';
      revPersEntitySettingsInfoRel._revOwnerGUID = revUserEntityGUID;
      revPersEntitySettingsInfoRel._revEntityTargetGUID =
        revUserEntitySettingsGUID;
      revPersEntitySettingsInfoRel._revEntitySubjectGUID =
        revUserEntitySettingsInfoGUID;

      let revPersEntitySettingsInfoRel_Id =
        RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revPersEntitySettingsInfoRel),
        );

      if (revPersEntitySettingsInfoRel_Id < 1) {
        return -1;
      }
    }

    /** START SET REMOTE REL GUID */
    // Set remote user rel subject and target GUIDS
    revSetRemoteRelGUID(revUserEntityGUID, revUserEntity._remoteRevEntityGUID);

    // Set remote user info rel subject and target GUIDS
    revSetRemoteRelGUID(
      revUserEntityInfoGUID,
      revUserEntityInfo._remoteRevEntityGUID,
    );

    // Set remote user settings rel subject and target GUIDS
    revSetRemoteRelGUID(
      revUserEntitySettingsGUID,
      revUserEntitySettings._remoteRevEntityGUID,
    );

    // Set remote user settings info rel subject and target GUIDS
    revSetRemoteRelGUID(
      revUserEntitySettingsInfoGUID,
      revUserEntitySettingsInfo._remoteRevEntityGUID,
    );
    /** END SET REMOTE REL GUID */

    return revUserEntityGUID;
  };

  return {revCreateNewUserEntity};
};

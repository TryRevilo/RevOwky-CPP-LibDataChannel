import React, {useContext} from 'react';
import {NativeModules} from 'react-native';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

import {
  useRevGetRevEntityMetadata_By_MetadataName_MetadataValue,
  userevPersGetMetadata_By_Name_EntityGUID,
} from '../../rev_pers_metadata/rev_read/RevPersReadMetadataCustomHooks';

import {useRevPersSyncDataComponent} from '../../rev_server/RevPersSyncDataComponent';

import {REV_ENTITY_STRUCT} from '../../rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../rev_db_struct_models/revEntityRelationship';

import {
  useRevPersGetRevEnty_By_EntityGUID,
  revPersGetSubjectGUID_BY_RelStr_TargetGUID,
  revPersGetSubjectGUIDs_BY_RelStr_TargetGUID,
} from '../rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {
  revGetFileObjectSubType,
  revIsEmptyJSONObject,
  revIsEmptyVar,
  revGetFileType,
  revGetFileAbsolutePath,
  revTimeoutAsync,
  revCurrDelayedTime,
} from '../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revCompareStrings,
  revReplaceWiteSpaces,
  revStringEmpty,
} from '../../../../rev_function_libs/rev_string_function_libs';
import {revGetMetadataValue} from '../../rev_db_struct_models/revEntityMetadata';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevPersLibDelete_React,
} = NativeModules;

export const useRevCreateNewEntity = () => {
  const {REV_LOGGED_IN_ENTITY_GUID, REV_SITE_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const revCreateNewEntity = revPersData => {
    let revEntityType = revPersData._revType;

    if (
      revEntityType !== 'rev_user_entity' &&
      (REV_LOGGED_IN_ENTITY_GUID < 1 || REV_SITE_ENTITY_GUID < 1)
    ) {
      return -1;
    }

    if (revIsEmptyVar(revPersData)) {
      return -1;
    }

    if (!revPersData.hasOwnProperty('_revType')) {
      return -1;
    }

    if (!revPersData.hasOwnProperty('_revSubType')) {
      return -1;
    }

    if (!revPersData.hasOwnProperty('_revOwnerGUID')) {
      return -1;
    }

    revPersData._revSiteGUID = REV_SITE_ENTITY_GUID;

    let revPersEntityGUID = RevPersLibCreate_React.revPersInitJSON(
      JSON.stringify(revPersData),
    );

    return revPersEntityGUID;
  };

  return {revCreateNewEntity};
};

var usRevSetNewRemoteFile = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const revSetNewRemoteFile = async (revLocalFile, revSeedId) => {
    const revCallback = () => {
      let revCurrTime = new Date().getTime();

      let revNewFileNameConst = REV_LOGGED_IN_ENTITY_GUID + '_' + revCurrTime;

      if (revSeedId >= 0) {
        revNewFileNameConst = revSeedId + '_' + revNewFileNameConst;
      }

      let revFileType = revGetFileType(revLocalFile);
      let revNewFileName = revNewFileNameConst + '.' + revFileType;

      return revNewFileName;
    };

    return await revTimeoutAsync({revCallback});
  };

  return {revSetNewRemoteFile};
};

export const useRevSetFileObject = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const revSetFileObject = (revSubType, revContainerGUID, revFileName) => {
    let revFileEntity = REV_ENTITY_STRUCT();
    revFileEntity._revResolveStatus = -1;
    revFileEntity._revType = 'rev_object';
    revFileEntity._revSubType = revSubType;
    revFileEntity._revOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
    revFileEntity._revContainerGUID = revContainerGUID;
    revFileEntity._revTimeCreated = new Date().getTime();
    revFileEntity._revChildableStatus = 2;

    let revFileInfoEntity = REV_ENTITY_STRUCT();
    revFileInfoEntity._revResolveStatus = 0;
    revFileInfoEntity._revType = 'rev_object';
    revFileInfoEntity._revSubType = 'rev_entity_info';
    revFileInfoEntity._revOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
    revFileInfoEntity._revTimeCreated = new Date().getTime();
    revFileInfoEntity._revChildableStatus = 2;

    revFileInfoEntity._revMetadataList = [
      REV_METADATA_FILLER('rev_remote_file_name', revFileName),
    ];

    revFileEntity._revInfoEntity = revFileInfoEntity;

    return revFileEntity;
  };

  return {revSetFileObject};
};

export const revWriteFile = async revFile => {
  let revURI = revFile.uri;
  let revNewFileName = revFile.revNewFileName;

  const revDirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media/';

  let revDestFilePath = revDirectoryPath + revNewFileName;

  try {
    let revFilePath = await revGetFileAbsolutePath(revURI);

    if (revStringEmpty(revFilePath) || revStringEmpty(revDestFilePath)) {
      return -1;
    }

    let revResStatus = RevPersLibCreate_React.revCopyFile(
      revFilePath,
      revDestFilePath,
    );

    return revResStatus;
  } catch (error) {
    console.log('*** error -revWriteFile', error);
  }
};

export const useRevInitPersFile = () => {
  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const {revSetNewRemoteFile} = usRevSetNewRemoteFile();

  const revInitPersFile = async (revFile, revSeed) => {
    const {uri: revURI} = revFile;

    revFile['revFileName'] = revFile.name;

    let revFileExt = revGetFileType(revFile);
    revFile['revFileExt'] = revFileExt;

    let revFileObjectSubType = revGetFileObjectSubType(revFile);
    revFile['revFileObjectSubType'] = revFileObjectSubType;

    revFile['revMIME'] = revFile.type;

    let revFileAbsolutePath = await revGetFileAbsolutePath(revURI);
    revFile['revFileAbsolutePath'] = revFileAbsolutePath;

    let revNewFileName = await revSetNewRemoteFile(revFile, revSeed);
    revFile['revNewFileName'] = revNewFileName;

    let revFileDelayedTime = await revCurrDelayedTime();
    let revFileGUID =
      REV_LOGGED_IN_ENTITY._revRemoteGUID + '' + revFileDelayedTime;

    revFile['_revRemoteGUID'] = Number(revFileGUID);

    return revFile;
  };

  const revInitPersFilesArr = async revFilesArr => {
    for (let i = 0; i < revFilesArr.length; i++) {
      revFilesArr[i] = await revInitPersFile(revFilesArr[i]);
    }

    return revFilesArr;
  };

  return {revInitPersFile, revInitPersFilesArr};
};

export const useRevCreateMediaAlbum = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {revCreateNewEntity} = useRevCreateNewEntity();

  const {revSetNewRemoteFile} = usRevSetNewRemoteFile();
  const {revSetFileObject} = useRevSetFileObject();

  const revCreateMediaAlbum = async (revContainerGUID, revFileObjectsArr) => {
    if (!Array.isArray(revFileObjectsArr) || !revFileObjectsArr.length) {
      return;
    }

    let revPicAlbumEntityGUID = revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      'rev_pics_album_of',
      revContainerGUID,
    );

    if (revPicAlbumEntityGUID < 1) {
      let revPicAlbumObject = REV_ENTITY_STRUCT();
      revPicAlbumObject._revResolveStatus = -1;
      revPicAlbumObject._revChildableStatus = 301;
      revPicAlbumObject._revType = 'rev_object';
      revPicAlbumObject._revSubType = 'rev_pics_album';
      revPicAlbumObject._revOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
      revPicAlbumObject.revContainerGUID = revContainerGUID;
      revPicAlbumObject._revTimeCreated = new Date().getTime();

      revPicAlbumEntityGUID = revCreateNewEntity(revPicAlbumObject);

      if (revPicAlbumEntityGUID < 1) {
        return;
      }

      /** START CREATE PICS ALBUM REL */
      let revPicsAlbumRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revPicsAlbumRel._revType = 'rev_pics_album_of';
      revPicsAlbumRel._revTargetGUID = revContainerGUID;
      revPicsAlbumRel._revSubjectGUID = revPicAlbumEntityGUID;

      let revPicsAlbumRelId = RevPersLibCreate_React.revPersRelationshipJSON(
        JSON.stringify(revPicsAlbumRel),
      );

      if (revPicsAlbumRelId < 1) {
        return;
      }
      /** END CREATE PICS ALBUM REL */
    }

    /** START SET OBJECT */
    let revEntityGUIDs = [];

    for (let i = 0; i < revFileObjectsArr.length; i++) {
      let revFile = revFileObjectsArr[i];

      if (
        revIsEmptyJSONObject(revFile) ||
        !('uri' in revFile) ||
        revStringEmpty(revFile.uri)
      ) {
        continue;
      }

      let revFilePath = '';

      try {
        revFilePath = await revGetFileAbsolutePath(revFile.uri);
      } catch (error) {
        console.log('*** error -revFileObjectsArr.length', error);

        continue;
      }

      if (revStringEmpty(revFilePath)) {
        continue;
      }

      let revFileType = revGetFileType(revFile);
      let revFileSubtype = revGetFileObjectSubType(revFile);

      if (revIsEmptyVar(revFileType) || revIsEmptyVar(revFileSubtype)) {
        continue;
      }

      let revNewFileName = await revSetNewRemoteFile(revFile, i);

      if (revIsEmptyVar(revNewFileName)) {
        continue;
      }

      revFile['revNewFileName'] = revNewFileName;

      let revEntityFileObject = revSetFileObject(
        revFileSubtype,
        -1,
        revNewFileName,
      );

      revEntityFileObject._revMetadataList.push(
        REV_METADATA_FILLER(revFileType, revFileType),
      );

      revEntityFileObject._revMetadataList.push(
        REV_METADATA_FILLER('revFileName', revFile.name),
      );

      revEntityFileObject._revMetadataList.push(
        REV_METADATA_FILLER('revFileSize', revFile.size.toString()),
      );

      revEntityFileObject._revGUID = i;
      revEntityGUIDs.push(i);

      // START SAVE FILE OBJECT
      let revPersFileEntityGUID = revCreateNewEntity(revEntityFileObject);

      if (!revIsEmptyVar(revPersFileEntityGUID) && revPersFileEntityGUID > 0) {
        let revPicsAlbumFileRel = REV_ENTITY_RELATIONSHIP_STRUCT();
        revPicsAlbumFileRel._revType = 'rev_picture_of';
        revPicsAlbumFileRel._revTargetGUID = revPicAlbumEntityGUID;
        revPicsAlbumFileRel._revSubjectGUID = revPersFileEntityGUID;

        let revPicRelId = RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revPicsAlbumFileRel),
        );

        if (revPicRelId > 0) {
          try {
            await revWriteFile(revFile);
          } catch (error) {
            console.log('*** error -revWriteFile', error);
          }
        }

        if ('revEntityIcon' in revFile) {
          let revCurrEntityIconGUIDsArr =
            revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
              'rev_entity_icon_of',
              revContainerGUID,
            );

          if (revCurrEntityIconGUIDsArr.length) {
            for (let i = 0; i < revCurrEntityIconGUIDsArr.length; i++) {
              let revCurrEntityIconGUID = revCurrEntityIconGUIDsArr[i];

              RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
                -3,
                revCurrEntityIconGUID,
              );
            }
          }

          let revMainEntityIconRel = REV_ENTITY_RELATIONSHIP_STRUCT();
          revMainEntityIconRel._revType = 'rev_entity_icon_of';
          revMainEntityIconRel._revTargetGUID = revContainerGUID;
          revMainEntityIconRel._revSubjectGUID = revPersFileEntityGUID;

          RevPersLibCreate_React.revPersRelationshipJSON(
            JSON.stringify(revMainEntityIconRel),
          );
        }

        if ('revEntityBannerIcon' in revFile) {
          let revEntityBannerIconRel = REV_ENTITY_RELATIONSHIP_STRUCT();
          revEntityBannerIconRel._revType = 'rev_entity_banner_icon_of';
          revEntityBannerIconRel._revTargetGUID = revContainerGUID;
          revEntityBannerIconRel._revSubjectGUID = revPersFileEntityGUID;

          RevPersLibCreate_React.revPersRelationshipJSON(
            JSON.stringify(revEntityBannerIconRel),
          );
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
      RevPersLibUpdate_React.revPersSetRemoteSubjectGUID(
        revEntityGUID,
        remoteRevEntityGUID,
      );

    let revUpdateSetRemoteTargetGUID =
      RevPersLibUpdate_React.revPersSetRemoteTargetGUID(
        revEntityGUID,
        remoteRevEntityGUID,
      );

    return revUpdateSetRemoteSubjectGUID && revUpdateSetRemoteTargetGUID
      ? 1
      : -1;
  };

  return {revSetRemoteRelGUID};
};

export const useRevCreateNewTag = () => {
  const {revGetRevEntityMetadata_By_MetadataName_MetadataValue} =
    useRevGetRevEntityMetadata_By_MetadataName_MetadataValue();

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const revCreateNewTag = revVarArgs => {
    const {revEntityNameVal = '', revEntityDescVal = ''} = revVarArgs;
    const {_revContainerGUID = -1} = revVarArgs;

    if (revStringEmpty(revEntityNameVal) || _revContainerGUID < 0) {
      return -1;
    }

    let revEntityNameValPers = revReplaceWiteSpaces(revEntityNameVal, '_');

    let revSavedTagMetadata =
      revGetRevEntityMetadata_By_MetadataName_MetadataValue(
        'rev_entity_name_val',
        revEntityNameVal,
      );

    if (!revIsEmptyJSONObject(revSavedTagMetadata)) {
      return revSavedTagMetadata._revGUID;
    }

    revVarArgs['revSubType'] = 'rev_tag';
    revVarArgs['_revOwnerGUID'] = REV_LOGGED_IN_ENTITY_GUID;

    let _revMetadataList = [
      REV_METADATA_FILLER('rev_entity_name_val', revEntityNameValPers),
    ];

    if (!revStringEmpty(revEntityDescVal)) {
      _revMetadataList.push(
        REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
      );
    }

    revVarArgs['_revMetadataList'] = _revMetadataList;

    let revEntityTagRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revEntityTagRel._revType = 'rev_tag_of';
    revEntityTagRel._revTargetGUID = _revContainerGUID;
    revEntityTagRel._revSubjectGUID = -1;

    revVarArgs['revSubjectRelsArr'] = [revEntityTagRel];

    return revVarArgs;
  };

  return {revCreateNewTag};
};

export const useRevSaveNewEntity = () => {
  const {REV_SITE_ENTITY_GUID} = useContext(RevSiteDataContext);

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();
  const {revPersGetMetadata_By_Name_EntityGUID} =
    userevPersGetMetadata_By_Name_EntityGUID();

  const {revCreateNewUserEntity} = useRevCreateNewUserEntity();
  const {revCreateNewEntity} = useRevCreateNewEntity();
  const {revCreateMediaAlbum} = useRevCreateMediaAlbum();
  const {revCreateNewTag} = useRevCreateNewTag();

  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();

  const revSaveNewEntity = async revVarArgs => {
    if (revIsEmptyJSONObject(revVarArgs)) {
      return;
    }

    const {
      _revType = 'rev_object',
      _revSubType = '',
      _revGUID = -1,
      _revRemoteGUID = -1,
      _revOwnerGUID = -1,
      _revContainerGUID = -1,
      _revMetadataList = [],
      _revInfoEntity = {},
      _revPublisherEntity = {},
      _revChildrenList = [],
      _revSettings = {},
    } = revVarArgs;

    let revPublisherLocalGUID = _revOwnerGUID;

    let revLocalOwnerEntityStr = RevPersLibRead_React.revPersGetEntity_By_GUID(
      revPublisherLocalGUID,
    );

    let revLocalOwnerEntity = JSON.parse(revLocalOwnerEntityStr);

    if (
      revIsEmptyJSONObject(revLocalOwnerEntity) ||
      (_revType !== 'rev_user_entity' && revPublisherLocalGUID < 1)
    ) {
      if (revIsEmptyJSONObject(_revPublisherEntity)) {
        return -1;
      }

      const {_revGUID = -1, _revRemoteGUID = -1} = _revPublisherEntity;
      revPublisherLocalGUID = _revGUID;

      if (revPublisherLocalGUID < 1) {
        if (_revRemoteGUID < 1) {
          return -1;
        }

        revPublisherLocalGUID =
          RevPersLibRead_React.revPersGetLocalEntityGUID_BY_RemoteEntityGUID(
            _revRemoteGUID,
          );
      }

      if (revPublisherLocalGUID < 1) {
        revPublisherLocalGUID = revCreateNewUserEntity(_revPublisherEntity);

        if (revPublisherLocalGUID) {
          return -1;
        }
      }
    }

    if (revIsEmptyVar(_revSubType)) {
      return -1;
    }

    let revPersEntityGUID = -1;
    let revInfoLocalGUID = -1;
    let revInfoRemoteGUID = -1;
    let revInfoMetadataList = [];

    ({
      _revGUID: revInfoLocalGUID = -1,
      _revRemoteGUID: revInfoRemoteGUID = -1,
      _revMetadataList: revInfoMetadataList = [],
    } = _revInfoEntity);

    if (_revGUID > 0) {
      revPersEntityGUID = _revGUID;

      let revSavedEntity = revPersGetRevEnty_By_EntityGUID(_revGUID);
      const {_revInfoEntity = {_revGUID: -1}} = revSavedEntity;
      revInfoLocalGUID = _revInfoEntity._revGUID;
    }

    let revPersMetadataList = _revMetadataList.length
      ? _revMetadataList
      : revInfoMetadataList;

    if (revInfoLocalGUID > 0) {
      for (let i = 0; i < revPersMetadataList.length; i++) {
        let revPersEntityInfoMetadata = revPersMetadataList[i];

        const {_revValue: revUpdateMetadataVal = '', _revName = ''} =
          revPersEntityInfoMetadata;

        let revMetadata = revPersGetMetadata_By_Name_EntityGUID(
          _revName,
          revInfoLocalGUID,
        );

        console.log('>>> revMetadata', JSON.stringify(revMetadata));

        const {_revId = -1, revMetadataValue = ''} = revMetadata;

        if (revStringEmpty(revUpdateMetadataVal)) {
          RevPersLibDelete_React.revDeleteEntityMetadata_By_ID(_revId);

          continue;
        }

        if (revCompareStrings(revMetadataValue, revUpdateMetadataVal) == 0) {
          continue;
        }

        if (_revId > 0) {
          RevPersLibUpdate_React.revPersSetMetadataVal_BY_Id(
            _revId,
            revUpdateMetadataVal,
          );
        } else {
          revPersEntityInfoMetadata['_revGUID'] = revInfoLocalGUID;

          RevPersLibCreate_React.revPersSaveEntityMetadataJSONStr(
            JSON.stringify(revPersEntityInfoMetadata),
          );
        }
      }
    } else {
      let revPersEntityData = REV_ENTITY_STRUCT(revVarArgs);
      revPersEntityData._revType = _revType;
      revPersEntityData._revSubType = _revSubType;
      revPersEntityData._revOwnerGUID = revPublisherLocalGUID;
      revPersEntityData._revContainerGUID = _revContainerGUID;

      if (_revRemoteGUID > 0) {
        revPersEntityData._revResolveStatus = 0;
      }

      if (revPersMetadataList.length) {
        for (let i = 0; i < revPersMetadataList.length; i++) {
          const {_revId = -1, _revRemoteId = -1} = revPersMetadataList[i];

          if (_revId < 1 && _revRemoteId > 0) {
            revPersMetadataList[i]['_revResolveStatus'] = 0;
          }
        }

        /** START REV INFO */
        let revPersInfoEntityData = REV_ENTITY_STRUCT(_revInfoEntity);
        revPersInfoEntityData._revType = 'rev_object';
        revPersInfoEntityData._revSubType = 'rev_entity_info';
        revPersInfoEntityData._revOwnerGUID = revPublisherLocalGUID;
        revPersInfoEntityData._revMetadataList = revPersMetadataList;

        if (revInfoRemoteGUID > 0) {
          revPersInfoEntityData._revResolveStatus = 0;
        }

        revPersEntityData._revInfoEntity = revPersInfoEntityData;
      }

      revPersEntityGUID = revCreateNewEntity(revPersEntityData);

      revPersEntityData['_revGUID'] = revPersEntityGUID;

      if (revPersEntityGUID < 1) {
        return -1;
      }

      /** START SAVE SUBJECT RELS */
      const {revSubjectRelsArr = [], revTargetRelsArr = []} = revVarArgs;

      for (let i = 0; i < revSubjectRelsArr.length; i++) {
        let revSubjectRel = revSubjectRelsArr[i];

        if (revIsEmptyJSONObject(revSubjectRel)) {
          continue;
        }

        if (
          !revSubjectRel ||
          !revSubjectRel._revTargetGUID ||
          revSubjectRel._revTargetGUID < 1
        ) {
          continue;
        }

        revSubjectRel._revSubjectGUID = revPersEntityGUID;

        let revSubjectRelId = RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revSubjectRel),
        );
      }
      /** END SAVE SUBJECT RELS */

      /** START SAVE TARGET RELS */
      for (let i = 0; i < revTargetRelsArr.length; i++) {
        let revTargetRel = revTargetRelsArr[i];

        if (revIsEmptyJSONObject(revTargetRel)) {
          continue;
        }

        if (
          !revTargetRel ||
          !revTargetRel._revSubjectGUID ||
          revTargetRel._revSubjectGUID < 1
        ) {
          continue;
        }

        revTargetRel._revTargetGUID = revPersEntityGUID;

        let revTargetRelId = RevPersLibCreate_React.revPersRelationshipJSON(
          JSON.stringify(revTargetRel),
        );
      }
      /** END SAVE TARGET RELS */

      /** START SAVE REMOTE */
      revPersSyncDataComponent().then(revRes => {
        console.log('>>> revRes', revRes);
      });
      /** END SAVE REMOTE */
    }

    // START Save selected media
    const {revSelectedMedia = []} = revVarArgs;

    try {
      await revCreateMediaAlbum(revPersEntityGUID, revSelectedMedia);
    } catch (error) {
      console.log('*** error -revCreateMediaAlbum', error);
    }
    // END Save selected media

    // START Save Tags
    const {revTagsArr = []} = revVarArgs;

    for (let i = 0; i < revTagsArr.length; i++) {
      let revCurrTag = revTagsArr[i];
      revCurrTag['_revContainerGUID'] = revPersEntityGUID;

      let revPersTagVarArgs = revCreateNewTag(revCurrTag);

      try {
        await revSaveNewEntity(revPersTagVarArgs);
      } catch (error) {
        console.log('*** error -revCreateNewTag', error);
      }
    }
    // END Save Tags

    if (Array.isArray(_revChildrenList) && _revChildrenList.length) {
      for (let i = 0; i < _revChildrenList.length; i++) {
        _revChildrenList[i]['_revPublisherEntity'] = _revPublisherEntity;

        try {
          await revSaveNewEntity(_revChildrenList[i]);
        } catch (error) {
          console.log('*** error -_revChildrenList', error);
        }
      }
    }

    if (!revIsEmptyJSONObject(_revSettings)) {
      try {
        await revSaveNewEntity(_revSettings);
      } catch (error) {
        console.log('*** error -_revSettings', error);
      }
    }

    return revPersEntityGUID;
  };

  return {revSaveNewEntity};
};

export const useRevCreateNewUserEntity = () => {
  const {revSetRemoteRelGUID} = useRevSetRemoteRelGUID();

  const revCreateNewUserEntity = revUserEntity => {
    if (revIsEmptyJSONObject(revUserEntity)) {
      return -1;
    }

    const {_revRemoteGUID = -1, _revInfoEntity = {}} = revUserEntity;

    if (_revRemoteGUID > 0) {
      revUserEntity['_revResolveStatus'] = 0;
    }

    if (revIsEmptyJSONObject(_revInfoEntity)) {
      return -1;
    }

    let revUserEntityInfo = JSON.parse(JSON.stringify(_revInfoEntity));
    const {
      _revRemoteGUID: revRemoteInfoGUID = -1,
      _revMetadataList: revUserEntityInfoMetadataList = [],
    } = revUserEntityInfo;

    let revUserEntityGUID =
      RevPersLibRead_React.revPersGetLocalEntityGUID_BY_RemoteEntityGUID(
        _revRemoteGUID,
      );

    if (revUserEntityGUID < 1) {
      revUserEntity['_revInfoEntity'] = {};

      revUserEntityGUID = RevPersLibCreate_React.revPersInitJSON(
        JSON.stringify(revUserEntity),
      );
    }

    if (revUserEntityGUID < 1) {
      return -1;
    }

    /** START SAVE INFO */
    revUserEntityInfo['_revOwnerGUID'] = revUserEntityGUID;
    revUserEntityInfo['_revContainerGUID'] = revUserEntityGUID;
    revUserEntityInfo['_revResolveStatus'] = 0;

    for (let i = 0; i < revUserEntityInfoMetadataList.length; i++) {
      revUserEntityInfoMetadataList[i]['_revResolveStatus'] = 0;
    }

    revUserEntityInfo['_revMetadataList'] = revUserEntityInfoMetadataList;

    let revUserEntityInfoGUID =
      RevPersLibRead_React.revPersGetLocalEntityGUID_BY_RemoteEntityGUID(
        revRemoteInfoGUID,
      );

    if (revUserEntityInfoGUID < 1) {
      revUserEntityInfoGUID = RevPersLibCreate_React.revPersInitJSON(
        JSON.stringify(revUserEntityInfo),
      );
    }
    /** END SAVE INFO */

    if (revUserEntityInfoGUID < 0) {
      return -1;
    }

    let revPersUserEntityInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revPersUserEntityInfoRel._revType = 'rev_entity_info';
    revPersUserEntityInfoRel._revResolveStatus = 0;
    revPersUserEntityInfoRel._revOwnerGUID = revUserEntityGUID;
    revPersUserEntityInfoRel._revTargetGUID = revUserEntityGUID;
    revPersUserEntityInfoRel._revSubjectGUID = revUserEntityInfoGUID;

    let revPersUserEntityInfoRel_Id =
      RevPersLibCreate_React.revPersRelationshipJSON(
        JSON.stringify(revPersUserEntityInfoRel),
      );

    if (revPersUserEntityInfoRel_Id < 1) {
      return -1;
    }

    const {_revSettings = {}} = revUserEntity;

    if (!revIsEmptyJSONObject(_revSettings)) {
      _revSettings['_revOwnerGUID'] = revUserEntityGUID;
      _revSettings['_revContainerGUID'] = revUserEntityGUID;
      _revSettings['_revResolveStatus'] = 0;

      const {
        _revRemoteGUID: revSettingsremoteGUID = -1,
        _revInfoEntity: _revSettingsInfo,
      } = _revSettings;

      let revSettingsInfo = JSON.parse(JSON.stringify(_revSettingsInfo));

      _revSettings['_revInfoEntity'] = {};

      let revSettingsGUID = RevPersLibCreate_React.revPersInitJSON(
        JSON.stringify(_revSettings),
      );

      revSettingsInfo['_revOwnerGUID'] = revUserEntityGUID;
      revSettingsInfo['_revContainerGUID'] = revSettingsGUID;
      revSettingsInfo['_revResolveStatus'] = 0;

      const {
        _revRemoteGUID: revSettingsInfoRemoteGUID = -1,
        _revMetadataList: revSettingsInfoMetadataList = [],
      } = revSettingsInfo;

      let revSettingsMetadataList = revSettingsInfoMetadataList;

      for (let i = 0; i < revSettingsMetadataList.length; i++) {
        if (revIsEmptyJSONObject(revSettingsMetadataList[i])) {
          continue;
        }

        revSettingsMetadataList[i]['_revResolveStatus'] = 0;
      }

      revSettingsInfo['_revMetadataList'] = revSettingsMetadataList;

      let revSettingsInfoGUID = RevPersLibCreate_React.revPersInitJSON(
        JSON.stringify(revSettingsInfo),
      );

      if (revSettingsInfoGUID < 0) {
        return -1;
      } else {
        let revPersEntitySettingsInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
        revPersEntitySettingsInfoRel._revType = 'rev_entity_info';
        revPersEntitySettingsInfoRel._revResolveStatus = 0;
        revPersEntitySettingsInfoRel._revOwnerGUID = revUserEntityGUID;
        revPersEntitySettingsInfoRel._revTargetGUID = revSettingsGUID;
        revPersEntitySettingsInfoRel._revSubjectGUID = revSettingsInfoGUID;

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
      revSetRemoteRelGUID(revUserEntityGUID, revUserEntity._revRemoteGUID);

      // Set remote user info rel subject and target GUIDS
      revSetRemoteRelGUID(
        revUserEntityInfoGUID,
        revUserEntityInfo._revRemoteGUID,
      );

      // Set remote user settings rel subject and target GUIDS
      revSetRemoteRelGUID(revSettingsGUID, revSettingsremoteGUID);

      // Set remote user settings info rel subject and target GUIDS
      revSetRemoteRelGUID(revSettingsInfoGUID, revSettingsInfoRemoteGUID);
      /** END SET REMOTE REL GUID */
    }

    return revUserEntityGUID;
  };

  return {revCreateNewUserEntity};
};

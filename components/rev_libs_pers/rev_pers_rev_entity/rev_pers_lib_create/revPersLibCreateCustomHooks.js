import React, {useContext} from 'react';
import {NativeModules} from 'react-native';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

import {
  useRevGetRevEntityMetadata_By_MetadataName_MetadataValue,
  useRevGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID,
} from '../../rev_pers_metadata/rev_read/RevPersReadMetadataCustomHooks';

import {REV_ENTITY_STRUCT} from '../../rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../rev_db_struct_models/revEntityRelationship';

import {
  useRevPersGetRevEnty_By_EntityGUID,
  revPersGetSubjectGUID_BY_RelStr_TargetGUID,
  revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID,
} from '../rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {
  revGetFileObjectSubType,
  revIsEmptyJSONObject,
  revIsEmptyVar,
  revGetFileType,
  revGetFileAbsolutePath,
} from '../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revCompareStrings,
  revReplaceWiteSpaces,
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

export const useRevCreateMediaAlbum = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {revCreateNewEntity} = useRevCreateNewEntity();

  const {revSetNewRemoteFile} = usRevSetNewRemoteFile();
  const {revSetFileObject} = useRevSetFileObject();

  const revCreateMediaAlbum = async (
    revEntityContainerGUID,
    revFileObjectsArr,
  ) => {
    let revPicAlbumEntityGUID = revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      'rev_pics_album_of',
      revEntityContainerGUID,
    );

    if (revPicAlbumEntityGUID < 1) {
      let revPicAlbumObject = REV_ENTITY_STRUCT();
      revPicAlbumObject._revEntityResolveStatus = -1;
      revPicAlbumObject._revEntityChildableStatus = 301;
      revPicAlbumObject._revEntityType = 'rev_object';
      revPicAlbumObject._revEntitySubType = 'rev_pics_album';
      revPicAlbumObject._revEntityOwnerGUID = REV_LOGGED_IN_ENTITY_GUID;
      revPicAlbumObject.revEntityContainerGUID = revEntityContainerGUID;
      revPicAlbumObject._revTimeCreated = new Date().getTime();

      revPicAlbumEntityGUID = revCreateNewEntity(revPicAlbumObject);

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

      let revNewFileName = revSetNewRemoteFile(revFile, i);

      if (revIsEmptyVar(revNewFileName)) {
        continue;
      }

      revFile['revNewFileName'] = revNewFileName;

      let revEntityFileObject = revSetFileObject(
        revFileSubtype,
        -1,
        revNewFileName,
      );

      revEntityFileObject._revEntityMetadataList.push(
        REV_METADATA_FILLER(revFileType, revFileType),
      );
      revEntityFileObject._revEntityMetadataList.push(
        REV_METADATA_FILLER('revFileName', revFile.name),
      );
      revEntityFileObject._revEntityMetadataList.push(
        REV_METADATA_FILLER('revFileSize', revFile.size.toString()),
      );

      revEntityFileObject._revEntityGUID = i;
      revEntityGUIDs.push(i);

      // START SAVE FILE OBJECT
      let revPersFileEntityGUID = revCreateNewEntity(revEntityFileObject);

      if (!revIsEmptyVar(revPersFileEntityGUID) && revPersFileEntityGUID > 0) {
        let revPicsAlbumFileRel = REV_ENTITY_RELATIONSHIP_STRUCT();
        revPicsAlbumFileRel._revEntityRelationshipType = 'rev_picture_of';
        revPicsAlbumFileRel._revEntityTargetGUID = revPicAlbumEntityGUID;
        revPicsAlbumFileRel._revEntitySubjectGUID = revPersFileEntityGUID;

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
            revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
              'rev_entity_icon_of',
              revEntityContainerGUID,
            );

          if (revCurrEntityIconGUIDsArr.length) {
            for (let i = 0; i < revCurrEntityIconGUIDsArr.length; i++) {
              let revCurrEntityIconGUID = revCurrEntityIconGUIDsArr[i];

              RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
                -3,
                revCurrEntityIconGUID,
              );
            }
          }

          let revMainEntityIconRel = REV_ENTITY_RELATIONSHIP_STRUCT();
          revMainEntityIconRel._revEntityRelationshipType =
            'rev_entity_icon_of';
          revMainEntityIconRel._revEntityTargetGUID = revEntityContainerGUID;
          revMainEntityIconRel._revEntitySubjectGUID = revPersFileEntityGUID;

          RevPersLibCreate_React.revPersRelationshipJSON(
            JSON.stringify(revMainEntityIconRel),
          );
        }

        if ('revEntityBannerIcon' in revFile) {
          let revEntityBannerIconRel = REV_ENTITY_RELATIONSHIP_STRUCT();
          revEntityBannerIconRel._revEntityRelationshipType =
            'rev_entity_banner_icon_of';
          revEntityBannerIconRel._revEntityTargetGUID = revEntityContainerGUID;
          revEntityBannerIconRel._revEntitySubjectGUID = revPersFileEntityGUID;

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

export const useRevCreateNewTag = () => {
  const {revGetRevEntityMetadata_By_MetadataName_MetadataValue} =
    useRevGetRevEntityMetadata_By_MetadataName_MetadataValue();

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const revCreateNewTag = revVarArgs => {
    const {revEntityNameVal = '', revEntityDescVal = ''} = revVarArgs;
    const {revContainerEntityGUID = -1} = revVarArgs;

    if (revStringEmpty(revEntityNameVal) || revContainerEntityGUID < 0) {
      return -1;
    }

    let revEntityNameValPers = revReplaceWiteSpaces(revEntityNameVal, '_');

    let revSavedTagMetadata =
      revGetRevEntityMetadata_By_MetadataName_MetadataValue(
        'rev_entity_name_val',
        revEntityNameVal,
      );

    if (!revIsEmptyJSONObject(revSavedTagMetadata)) {
      return revSavedTagMetadata._revMetadataEntityGUID;
    }

    revVarArgs['revEntitySubType'] = 'rev_tag';
    revVarArgs['revEntityOwnerGUID'] = REV_LOGGED_IN_ENTITY_GUID;

    let revPersEntityInfoMetadataList = [
      REV_METADATA_FILLER('rev_entity_name_val', revEntityNameValPers),
    ];

    if (!revStringEmpty(revEntityDescVal)) {
      revPersEntityInfoMetadataList.push(
        REV_METADATA_FILLER('rev_entity_desc_val', revEntityDescVal),
      );
    }

    revVarArgs['revPersEntityInfoMetadataList'] = revPersEntityInfoMetadataList;

    let revEntityTagRel = REV_ENTITY_RELATIONSHIP_STRUCT();
    revEntityTagRel._revEntityRelationshipType = 'rev_tag_of';
    revEntityTagRel._revEntityTargetGUID = revContainerEntityGUID;
    revEntityTagRel._revEntitySubjectGUID = -1;

    revVarArgs['revSubjectRelsArr'] = [revEntityTagRel];

    return revVarArgs;
  };

  return {revCreateNewTag};
};

export const useRevSaveNewEntity = () => {
  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();
  const {revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID} =
    useRevGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID();

  const {revCreateNewEntity} = useRevCreateNewEntity();
  const {revCreateMediaAlbum} = useRevCreateMediaAlbum();
  const {revCreateNewTag} = useRevCreateNewTag();

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

    let revPersEntityGUID = -1;
    let revPersinfoEntityGUID = -1;

    if (
      '_revEntityGUID' in revVarArgs &&
      revVarArgs._revEntityGUID &&
      revVarArgs._revEntityGUID > 0
    ) {
      revPersEntityGUID = revVarArgs._revEntityGUID;

      let revSavedEntity = revPersGetRevEnty_By_EntityGUID(
        revVarArgs._revEntityGUID,
      );

      if ('_revInfoEntity' in revSavedEntity) {
        revPersinfoEntityGUID = revSavedEntity._revInfoEntity._revEntityGUID;
      }
    }

    if (revPersinfoEntityGUID && revPersinfoEntityGUID > 0) {
      let revPersEntityInfoMetadataList =
        revVarArgs.revPersEntityInfoMetadataList;

      for (let i = 0; i < revPersEntityInfoMetadataList.length; i++) {
        let revPersEntityInfoMetadata = revPersEntityInfoMetadataList[i];

        let revUpdateMetadataVal = revPersEntityInfoMetadata._revMetadataValue;

        let revMetadata =
          revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(
            revPersEntityInfoMetadata._revMetadataName,
            revPersinfoEntityGUID,
          );

        let _revMetadataId = revMetadata._revMetadataId;
        let revMetadataValue = revMetadata._revMetadataValue;

        if (
          revStringEmpty(revUpdateMetadataVal) ||
          revCompareStrings(
            revMetadataValue,
            revPersEntityInfoMetadata._revMetadataValue,
          ) == 0
        ) {
          continue;
        }

        if (_revMetadataId > 0) {
          let revUpdateStatus =
            RevPersLibUpdate_React.setMetadataValue_BY_MetadataId(
              _revMetadataId,
              revUpdateMetadataVal,
            );

          console.log(_revMetadataId, '>>> revUpdateStatus', revUpdateStatus);
        } else {
          revPersEntityInfoMetadata['_revMetadataEntityGUID'] =
            revPersinfoEntityGUID;

          let revPersMetedataStatus =
            RevPersLibCreate_React.revPersSaveEntityMetadataJSONStr(
              JSON.stringify(revPersEntityInfoMetadata),
            );

          console.log('>>> revPersMetedataStatus', revPersMetedataStatus);
        }
      }
    } else {
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

      revPersEntityGUID = revCreateNewEntity(revPersEntityData);

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

      revPersinfoEntityGUID = revCreateNewEntity(revPersInfoEntityData);

      revPersInfoEntityData['_revEntityGUID'] = revPersinfoEntityGUID;
      revPersEntityData['_revInfoEntity'] = revPersInfoEntityData;

      if (revPersinfoEntityGUID < 0) {
        return -1;
      }

      let revInfoRel = REV_ENTITY_RELATIONSHIP_STRUCT();
      revInfoRel._revEntityRelationshipType = 'rev_entity_info';
      revInfoRel._revOwnerGUID = revEntityOwnerGUID;
      revInfoRel._revEntityTargetGUID = revPersEntityGUID;
      revInfoRel._revEntitySubjectGUID = revPersinfoEntityGUID;

      let revinfoRelId = RevPersLibCreate_React.revPersRelationshipJSON(
        JSON.stringify(revInfoRel),
      );

      if (revinfoRelId < 1) {
        return -1;
      }
    }

    // START Save selected media
    if (
      revVarArgs.hasOwnProperty('revSelectedMedia') &&
      !revIsEmptyVar(revVarArgs.revSelectedMedia)
    ) {
      let revSelectedMedia = revVarArgs.revSelectedMedia;

      try {
        await revCreateMediaAlbum(revPersEntityGUID, revSelectedMedia);
      } catch (error) {
        console.log('*** error -revCreateMediaAlbum', error);
      }
    }
    // END Save selected media

    // START Save Tags
    if (
      revVarArgs.hasOwnProperty('revTagsArr') &&
      Array.isArray(revVarArgs.revTagsArr)
    ) {
      let revTagsArr = revVarArgs.revTagsArr;

      for (let i = 0; i < revTagsArr.length; i++) {
        let revCurrTag = revTagsArr[i];
        revCurrTag['revContainerEntityGUID'] = revPersEntityGUID;

        let revPersTagVarArgs = revCreateNewTag(revCurrTag);

        try {
          await revSaveNewEntity(revPersTagVarArgs);
        } catch (error) {
          console.log('*** error -revCreateNewTag', error);
        }
      }
    }
    // END Save Tags

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

    if (
      revUserEntity.hasOwnProperty('_revRemoteEntityGUID') &&
      revUserEntity._revRemoteEntityGUID
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
    revSetRemoteRelGUID(revUserEntityGUID, revUserEntity._revRemoteEntityGUID);

    // Set remote user info rel subject and target GUIDS
    revSetRemoteRelGUID(
      revUserEntityInfoGUID,
      revUserEntityInfo._revRemoteEntityGUID,
    );

    // Set remote user settings rel subject and target GUIDS
    revSetRemoteRelGUID(
      revUserEntitySettingsGUID,
      revUserEntitySettings._revRemoteEntityGUID,
    );

    // Set remote user settings info rel subject and target GUIDS
    revSetRemoteRelGUID(
      revUserEntitySettingsInfoGUID,
      revUserEntitySettingsInfo._revRemoteEntityGUID,
    );
    /** END SET REMOTE REL GUID */

    return revUserEntityGUID;
  };

  return {revCreateNewUserEntity};
};

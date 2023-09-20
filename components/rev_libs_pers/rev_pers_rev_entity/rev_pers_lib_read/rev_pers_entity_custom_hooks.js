import {NativeModules} from 'react-native';
import React from 'react';

import {
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../rev_db_struct_models/revEntityMetadata';

const rev_settings = require('../../../../rev_res/rev_settings.json');

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevGenLibs_Server_React,
} = NativeModules;

export function useRevPersGetRevEnty_By_EntityGUID() {
  const revPersGetRevEnty_By_EntityGUID = revEntityGUID => {
    if (!revEntityGUID || revEntityGUID < 1) {
      return null;
    }

    let revEntityStr =
      RevPersLibRead_React.revPersGetRevEntityByGUID(revEntityGUID);
    return JSON.parse(revEntityStr);
  };

  return {revPersGetRevEnty_By_EntityGUID};
}

export function useRevPersGet_ALL_RevEntity_By_SiteGUID_SubType() {
  const revPersGet_ALL_RevEntity_By_SiteGUID_SubType = (
    revSiteEntityGUID,
    revEntitySubType,
  ) => {
    let revEntitiesStr =
      RevPersLibRead_React.revPersGet_ALL_RevEntity_By_SiteGUID_SubType(
        revSiteEntityGUID,
        revEntitySubType,
      );
    return JSON.parse(revEntitiesStr);
  };

  return {revPersGet_ALL_RevEntity_By_SiteGUID_SubType};
}

export function useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE() {
  const revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE = (
    revDBTableFieldName,
    revSiteEntityGUID,
    revEntitySubType,
  ) => {
    let revEntitiesStr =
      RevPersLibRead_React.revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(
        revDBTableFieldName,
        revSiteEntityGUID,
        revEntitySubType,
      );
    return JSON.parse(revEntitiesStr);
  };

  return {revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE};
}

export const revPersGetRevEntities_By_EntityGUIDsArr = revEntityGUIDsArr => {
  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  let revEntities = [];

  for (let i = 0; i < revEntityGUIDsArr.length; i++) {
    let revCurrEntityGUID = revEntityGUIDsArr[i];

    let revCurrEntityStr =
      RevPersLibRead_React.revPersGetRevEntityByGUID(revCurrEntityGUID);

    let revCurrEntity = JSON.parse(revCurrEntityStr);

    let revCurrInfoEntityGUIDsStr =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_entity_info',
        revCurrEntityGUID,
      );

    let revCurrInfoEntityGUIDsArr = JSON.parse(revCurrInfoEntityGUIDsStr);

    if (
      Array.isArray(revCurrInfoEntityGUIDsArr) &&
      revCurrInfoEntityGUIDsArr.length > 0
    ) {
      let revCurrInfoEntity = revPersGetRevEnty_By_EntityGUID(
        revCurrInfoEntityGUIDsArr[0],
      );

      revCurrEntity._revInfoEntity = revCurrInfoEntity;
    }

    revEntities.push(revCurrEntity);
  }

  return revEntities;
};

export function revPersGetALLRevEntityGUIDs_By_ResStatus(revResStatus) {
  let revUnresolvedEntityGUIDsStr =
    RevPersLibRead_React.revPersGetALLRevEntityGUIDs_By_ResStatus(revResStatus);

  let revUnresolvedEntityGUIDs;

  try {
    revUnresolvedEntityGUIDs = JSON.parse(revUnresolvedEntityGUIDsStr);
  } catch (error) {
    console.log('>>> error ' + error);
  }

  let revRetEntitiesArr = revPersGetRevEntities_By_EntityGUIDsArr(
    revUnresolvedEntityGUIDs,
  );

  return revRetEntitiesArr;
}

export function useRevPersGetRevEntities_By_ResolveStatus_SubType() {
  const revPersGetRevEntities_By_ResolveStatus_SubType = (
    revResStatus,
    revEntitySubType,
  ) => {
    let revUnresolvedEntityGUIDsStr =
      RevPersLibRead_React.revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(
        revResStatus,
        revEntitySubType,
      );

    return revPersGetRevEntities_By_EntityGUIDsArr(
      JSON.parse(revUnresolvedEntityGUIDsStr),
    );
  };

  return {revPersGetRevEntities_By_ResolveStatus_SubType};
}

export function useRevGetEntityInfo(revEntityGUID) {
  let revInfoEntityGUID =
    RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      'rev_entity_info',
      revEntityGUID,
    );

  if (revInfoEntityGUID < 1) {
    return {};
  }

  let revInfoEntityStr =
    RevPersLibRead_React.revPersGetRevEntityByGUID(revInfoEntityGUID);

  if (revIsEmptyVar(revInfoEntityStr)) {
    return {};
  }

  return JSON.parse(revInfoEntityStr);
}

export const revPersGetALLRevEntityRelationshipsTargetGUIDs_BY_RelStr_SubjectGUID =
  (revEntityRelationship, revEntityTargetGUID) => {
    let revEntityGUIDsString =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsTargetGUIDs_BY_RelStr_SubjectGUID(
        revEntityRelationship,
        revEntityTargetGUID,
      );

    return JSON.parse(revEntityGUIDsString);
  };

export const revPersGetSubjectGUID_BY_RelStr_TargetGUID = (
  revEntityRelationship,
  revEntityTargetGUID,
) => {
  let revEntityGUIDsString =
    RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      revEntityRelationship,
      revEntityTargetGUID,
    );

  return JSON.parse(revEntityGUIDsString);
};

export const revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID =
  (revEntityRelationship, revEntityTargetGUID) => {
    let revEntityGUIDsString =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        revEntityRelationship,
        revEntityTargetGUID,
      );

    return JSON.parse(revEntityGUIDsString);
  };

export const useRevGetEntityPictureAlbumPics = () => {
  const revGetEntityPictureAlbumPics = revEntityGUID => {
    let revPicAlbumPicsGUIDsArr =
      revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_picture_of',
        revEntityGUID,
      );

    if (revPicAlbumPicsGUIDsArr.length < 1) {
      return [];
    }

    let revPicAlbumEntityPicsArr = revPersGetRevEntities_By_EntityGUIDsArr(
      revPicAlbumPicsGUIDsArr,
    );

    return revPicAlbumEntityPicsArr;
  };

  return {revGetEntityPictureAlbumPics};
};

export const useRevGetEntityPictureAlbums = () => {
  const {revGetEntityPictureAlbumPics} = useRevGetEntityPictureAlbumPics();

  const revGetEntityPictureAlbums = revEntityGUID => {
    if (!revEntityGUID || revEntityGUID < 1) {
      return [];
    }

    let revPicAlbumGUIDsArr =
      revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_pics_album_of',
        revEntityGUID,
      );

    if (revPicAlbumGUIDsArr.length < 1) {
      return [];
    }

    let revPicAlbumEntitiesArr =
      revPersGetRevEntities_By_EntityGUIDsArr(revPicAlbumGUIDsArr);

    for (let i = 0; i < revPicAlbumEntitiesArr.length; i++) {
      let revPicAlbumGUID = revPicAlbumEntitiesArr[i]._revEntityGUID;
      let revPicAlbumEntityPicsArr =
        revGetEntityPictureAlbumPics(revPicAlbumGUID);

      revPicAlbumEntitiesArr[i]['revPicsArray'] = revPicAlbumEntityPicsArr;
    }

    return revPicAlbumEntitiesArr;
  };

  return {revGetEntityPictureAlbums};
};

export function revPersGetFilledRevEntity_By_GUID(revEntityGUID) {
  let revEntityStr =
    RevPersLibRead_React.revPersGetRevEntityByGUID(revEntityGUID);

  let revEntity = JSON.parse(revEntityStr);
  revEntity['_revInfoEntity'] = useRevGetEntityInfo(revEntityGUID);

  return revEntity;
}

export function useRevPersGetALLFilledRevEntity_By_SubType(revEntitySubType) {
  let revEntitiesStr =
    RevPersLibRead_React.revPersGetALLRevEntity_By_SubType(revEntitySubType);

  let revEntitiesArr = JSON.parse(revEntitiesStr);

  for (let i = 0; i < revEntitiesArr.length; i++) {
    let revCurrEntity = revEntitiesArr[i];
    let revEntityGUID = revCurrEntity._revEntityGUID;

    revEntitiesArr[i]['_revInfoEntity'] = useRevGetEntityInfo(revEntityGUID);
  }

  return revEntitiesArr;
}

export function useRevPersGetRevEntities_By_RevVarArgs() {
  const revPersGetRevEntities_By_RevVarArgs = revVarArgs => {
    let revEntitiesStr =
      RevPersLibRead_React.revPersGetRevEntities_By_RevVarArgs(revVarArgs);

    let revEntitiesArr = JSON.parse(revEntitiesStr);

    for (let i = 0; i < revEntitiesArr.length; i++) {
      let revCurrEntity = revEntitiesArr[i];
      let revEntityGUID = revCurrEntity._revEntityGUID;

      revEntitiesArr[i]['_revInfoEntity'] = useRevGetEntityInfo(revEntityGUID);
    }

    return revEntitiesArr;
  };

  return {revPersGetRevEntities_By_RevVarArgs};
}

export const useRevGetEntityIcon = () => {
  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const revGetEntityIcon = ({
    revEntityGUID,
    revIconRelType = 'rev_entity_icon_of',
  }) => {
    let revMainEntityIconGUID = revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      revIconRelType,
      revEntityGUID,
    );

    if (revMainEntityIconGUID < 1) {
      return {};
    }

    let revMainEntityIconFileEntity = revPersGetRevEnty_By_EntityGUID(
      revMainEntityIconGUID,
    );

    if (revIsEmptyJSONObject(revMainEntityIconFileEntity)) {
      return {};
    }

    if (
      !('_revEntityMetadataList' in revMainEntityIconFileEntity) ||
      !Array.isArray(revMainEntityIconFileEntity._revEntityMetadataList)
    ) {
      return {};
    }

    let revMainEntityIconVal = revGetMetadataValue(
      revMainEntityIconFileEntity._revEntityMetadataList,
      'rev_remote_file_name',
    );

    let revMainEntityIconValPath =
      'file://' +
      rev_settings.revPublishedMediaDir +
      '/' +
      revMainEntityIconVal;

    return {
      revFileName: revMainEntityIconVal,
      revMainEntityIconLocalPath: revMainEntityIconValPath,
    };
  };

  return {revGetEntityIcon};
};

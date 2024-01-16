import {NativeModules} from 'react-native';
import React from 'react';

import {
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../rev_db_struct_models/revEntityMetadata';

import {useRevSaveNewEntity} from '../rev_pers_lib_create/revPersLibCreateCustomHooks';
import {revIsEmptyInfo} from '../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

const rev_settings = require('../../../../rev_res/rev_settings.json');

const {RevPersLibRead_React} = NativeModules;

export function useRevPersGetLocalEntityGUID_BY_RemoteEntityGUID() {
  const {revSaveNewEntity} = useRevSaveNewEntity();

  const revPersGetLocalEntityGUID_BY_RemoteEntityGUID = async (
    revEntity = {},
    _revPublisherEntity = {},
  ) => {
    const {_revGUID = -1, _revRemoteGUID = -1, _revSiteGUID = -1} = revEntity;

    if (_revGUID > 0) {
      return _revGUID;
    } else if (_revRemoteGUID < 1) {
      return -1;
    }

    let revLocalGUID =
      RevPersLibRead_React.revPersGetLocalEntityGUID_BY_RemoteEntityGUID(
        _revRemoteGUID,
      );

    if (revLocalGUID > 0) {
      return revLocalGUID;
    }

    if (revIsEmptyJSONObject(_revPublisherEntity)) {
      return -1;
    }

    let revLocalSiteGUID =
      RevPersLibRead_React.revPersGetLocalEntityGUID_BY_RemoteEntityGUID(
        _revSiteGUID,
      );

    revEntity['_revSiteGUID'] = revLocalSiteGUID;

    if (!revIsEmptyInfo(revEntity)) {
      revEntity['_revInfoEntity']['_revSiteGUID'] = revLocalSiteGUID;
    }

    return await revSaveNewEntity({...revEntity, _revPublisherEntity});
  };

  return {revPersGetLocalEntityGUID_BY_RemoteEntityGUID};
}

export function useRevPersGetRevEnty_By_EntityGUID() {
  const revPersGetRevEnty_By_EntityGUID = revEntityGUID => {
    if (!revEntityGUID || revEntityGUID < 1) {
      return null;
    }

    let revEntityStr =
      RevPersLibRead_React.revPersGetEntity_By_GUID(revEntityGUID);
    return JSON.parse(revEntityStr);
  };

  return {revPersGetRevEnty_By_EntityGUID};
}

export function userevPersGetEntities_By_SiteGUID_SubType() {
  const revPersGetEntities_By_SiteGUID_SubType = (
    revSiteEntityGUID,
    revSubType,
  ) => {
    let revEntitiesStr =
      RevPersLibRead_React.revPersGetEntities_By_SiteGUID_SubType(
        revSiteEntityGUID,
        revSubType,
      );
    return JSON.parse(revEntitiesStr);
  };

  return {revPersGetEntities_By_SiteGUID_SubType};
}

export function useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE() {
  const revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE = (
    revDBTableFieldName,
    revSiteEntityGUID,
    revSubType,
  ) => {
    let revEntitiesStr =
      RevPersLibRead_React.revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(
        revDBTableFieldName,
        revSiteEntityGUID,
        revSubType,
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
      RevPersLibRead_React.revPersGetEntity_By_GUID(revCurrEntityGUID);

    let revCurrEntity = JSON.parse(revCurrEntityStr);

    let revCurrInfoEntityGUIDsStr =
      RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
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

export function revPersGetEntityGUIDs_By_ResStatus(revResStatus) {
  let revUnresolvedEntityGUIDsStr =
    RevPersLibRead_React.revPersGetEntityGUIDs_By_ResStatus(revResStatus);

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
    revSubType,
  ) => {
    let revUnresolvedEntityGUIDsStr =
      RevPersLibRead_React.revPersGetEntityGUIDs_By_ResolveStatus_SubType(
        revResStatus,
        revSubType,
      );

    return revPersGetRevEntities_By_EntityGUIDsArr(
      JSON.parse(revUnresolvedEntityGUIDsStr),
    );
  };

  return {revPersGetRevEntities_By_ResolveStatus_SubType};
}

export function revGetEntityInfo(revEntityGUID) {
  let revRetDataArrStr =
    RevPersLibRead_React.revPersGetEntities_By_ContainerGUID_SubTYPE(
      revEntityGUID,
      'rev_entity_info',
    );

  if (revIsEmptyVar(revRetDataArrStr)) {
    return {};
  }

  let revInfoEntityArr = JSON.parse(revRetDataArrStr);

  return revInfoEntityArr[0];
}

export const revPersGetTargetGUIDs_BY_RelStr_SubjectGUID = (
  revEntityRelationship,
  revEntityTargetGUID,
) => {
  let revEntityGUIDsString =
    RevPersLibRead_React.revPersGetTargetGUIDs_BY_RelStr_SubjectGUID(
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

export const revPersGetSubjectGUIDs_BY_RelStr_TargetGUID = (
  revEntityRelationship,
  revEntityTargetGUID,
) => {
  let revEntityGUIDsString =
    RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
      revEntityRelationship,
      revEntityTargetGUID,
    );

  return JSON.parse(revEntityGUIDsString);
};

export const revGetPublisherEntity = (
  revPublishersArr = [],
  revPlublisherGUID,
  isRevFromRemote = false,
) => {
  if (!Array.isArray(revPublishersArr)) {
    console.log('*** ERR -> NULL PUBLISHERS!');
    return {};
  }

  let revPublisherEntity = null;

  for (let i = 0; i < revPublishersArr.length; i++) {
    let revPublisher = revPublishersArr[i];

    if (revIsEmptyJSONObject(revPublisher)) {
      continue;
    }

    const {_revGUID = -1, _revRemoteGUID = -1} = revPublisher;

    let revGUID = isRevFromRemote ? _revRemoteGUID : _revGUID;

    if (revGUID == revPlublisherGUID) {
      revPublisherEntity = revPublisher;

      break;
    }
  }

  if (revIsEmptyJSONObject(revPublisherEntity)) {
    let revPublisherEntityStr =
      RevPersLibRead_React.revPersGetEntity_By_GUID(revPlublisherGUID);
    revPublisherEntity = JSON.parse(revPublisherEntityStr);

    if (revIsEmptyJSONObject(revPublisherEntity)) {
      return null;
    }

    revPublishersArr.push(revPublisherEntity);
  }

  return {revPublishersArr, revPublisherEntity};
};

export const useRevGetEntityPictureAlbumPics = () => {
  const revGetEntityPictureAlbumPics = revEntityGUID => {
    let revPicAlbumPicsGUIDsArr = revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
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

    let revPicAlbumGUIDsArr = revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_pics_album_of',
      revEntityGUID,
    );

    if (revPicAlbumGUIDsArr.length < 1) {
      return [];
    }

    let revPicAlbumEntitiesArr =
      revPersGetRevEntities_By_EntityGUIDsArr(revPicAlbumGUIDsArr);

    for (let i = 0; i < revPicAlbumEntitiesArr.length; i++) {
      let revPicAlbumGUID = revPicAlbumEntitiesArr[i]._revGUID;
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
    RevPersLibRead_React.revPersGetEntity_By_GUID(revEntityGUID);

  let revEntity = JSON.parse(revEntityStr);
  revEntity['_revInfoEntity'] = revGetEntityInfo(revEntityGUID);

  return revEntity;
}

export function useRevPersGetALLFilledRevEntity_By_SubType(revSubType) {
  let revEntitiesStr =
    RevPersLibRead_React.revPersGetEntities_By_SubType(revSubType);

  let revEntitiesArr = JSON.parse(revEntitiesStr);

  for (let i = 0; i < revEntitiesArr.length; i++) {
    let revCurrEntity = revEntitiesArr[i];
    let revEntityGUID = revCurrEntity._revGUID;

    revEntitiesArr[i]['_revInfoEntity'] = revGetEntityInfo(revEntityGUID);
  }

  return revEntitiesArr;
}

export function useRevPersQuery_By_RevVarArgs() {
  const revPersQuery_By_RevVarArgs = (
    revVarArgs,
    revTableName = 'REV_ENTITY_TABLE',
  ) => {
    let revDataStr = RevPersLibRead_React.revPersQuery_By_RevVarArgs(
      revTableName,
      JSON.stringify(revVarArgs),
    );

    let revDataArr = JSON.parse(revDataStr);

    return revDataArr;
  };

  const revPersQueryRevEntities_By_RevVarArgs = (
    revVarArgs,
    revTableName = 'REV_ENTITY_TABLE',
  ) => {
    let revDataArr = revPersQuery_By_RevVarArgs(revVarArgs, revTableName);

    for (let i = 0; i < revDataArr.length; i++) {
      let revCurrEntity = revDataArr[i];
      let revEntityGUID = revCurrEntity._revGUID;

      revDataArr[i]['_revInfoEntity'] = revGetEntityInfo(revEntityGUID);
    }

    return revDataArr;
  };

  /* STAR ASYNC **/
  const revPersQuery_By_RevVarArgs_Async = async (
    revVarArgs,
    revTableName = 'REV_ENTITY_TABLE',
  ) => {
    let revDataStr =
      await RevPersLibRead_React.revPersQuery_By_RevVarArgs_Async(
        revTableName,
        JSON.stringify(revVarArgs),
      );

    let revDataArr = JSON.parse(revDataStr);

    return revDataArr;
  };

  const revPersQuery_W_Info_By_RevVarArgs_Async = async (
    revVarArgs,
    revTableName = 'REV_ENTITY_TABLE',
  ) => {
    let revDataArr = await revPersQuery_By_RevVarArgs_Async(
      revVarArgs,
      revTableName,
    );

    for (let i = 0; i < revDataArr.length; i++) {
      let revCurrEntity = revDataArr[i];
      let revEntityGUID = revCurrEntity._revGUID;

      revDataArr[i]['_revInfoEntity'] = revGetEntityInfo(revEntityGUID);
    }

    return revDataArr;
  };
  /* END ASYNC **/

  return {
    revPersQuery_By_RevVarArgs,
    revPersQueryRevEntities_By_RevVarArgs,
    revPersQuery_By_RevVarArgs_Async,
    revPersQuery_W_Info_By_RevVarArgs_Async,
  };
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
      !('_revMetadataList' in revMainEntityIconFileEntity) ||
      !Array.isArray(revMainEntityIconFileEntity._revMetadataList)
    ) {
      return {};
    }

    let revMainEntityIconVal = revGetMetadataValue(
      revMainEntityIconFileEntity._revMetadataList,
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

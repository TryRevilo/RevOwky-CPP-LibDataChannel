import {revIsEmptyJSONObject} from '../rev_gen_helper_functions';

export const revIsEmptyInfo = revEntity => {
  return (
    revIsEmptyJSONObject(revEntity) ||
    !revEntity.hasOwnProperty('_revInfoEntity') ||
    !revEntity._revInfoEntity.hasOwnProperty('_revMetadataList') ||
    !Array.isArray(revEntity._revInfoEntity._revMetadataList) ||
    !revEntity._revInfoEntity._revMetadataList.length
  );
};

export const revGetInfoEntity = revEntity => {
  if (revIsEmptyInfo(revEntity)) {
    return null;
  }

  return revEntity._revInfoEntity;
};

export const revIsUserEntity_WithInfo = revEntity => {
  if (revIsEmptyJSONObject(revEntity)) {
    return false;
  }

  if (revIsEmptyJSONObject(revEntity)) {
    return false;
  }

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revEntity);

  if (revEntityGUID < 1) {
    return false;
  }

  if (!revEntity.hasOwnProperty('_revInfoEntity')) {
    return false;
  }

  let revInfoEntity = revEntity._revInfoEntity;
  if (
    !revInfoEntity.hasOwnProperty('_revRemoteGUID') ||
    revInfoEntity._revRemoteGUID < 0
  ) {
    return false;
  }

  return true;
};

export const revGetEntityGUID = revEntity => {
  let revEntityGUID = -1;

  if (revIsEmptyJSONObject(revEntity)) {
    return revEntityGUID;
  }

  if (revEntity.hasOwnProperty('_revGUID') && revEntity._revGUID >= -1) {
    revEntityGUID = revEntity._revGUID;
  }

  return revEntityGUID;
};

export const revGetRemoteEntityGUID = revEntity => {
  let revEntityGUID = -1;

  if (revIsEmptyJSONObject(revEntity)) {
    return revEntityGUID;
  }

  if (
    revEntity.hasOwnProperty('_revRemoteGUID') &&
    revEntity._revRemoteGUID >= -1
  ) {
    revEntityGUID = revEntity._revRemoteGUID;
  }

  return revEntityGUID;
};

export const revGetLocal_OR_RemoteGUID = revEntity => {
  let revEntityGUID = revGetEntityGUID(revEntity);
  return revEntityGUID >= 0 ? revEntityGUID : revGetRemoteEntityGUID(revEntity);
};

export const revGetEntityChildren_By_Subtype = (
  revEntityChildrenArr,
  revSubType,
  limit,
) => {
  if (!Array.isArray(revEntityChildrenArr) || !revSubType) {
    return null;
  }

  let revEntityChildrenSubtypesArr = [];

  for (let i = 0; i < revEntityChildrenArr.length; i++) {
    let revEntityChild = revEntityChildrenArr[i];

    if (!revEntityChild || revEntityChild == undefined) {
      continue;
    }

    if (revEntityChild._revSubType.localeCompare(revSubType) == 0) {
      if (limit && limit > 0) {
        if (limit == 1) {
          revEntityChildrenSubtypesArr = revEntityChild;
        } else {
          revEntityChildrenSubtypesArr.push(revEntityChild);

          if (i + 1 == limit) {
            break;
          }
        }
      } else {
        revEntityChildrenSubtypesArr.push(revEntityChild);
      }
    }
  }

  if (revEntityChildrenSubtypesArr.length < 1) {
    return null;
  }

  return revEntityChildrenSubtypesArr;
};

export const revGetFileType = revFile => {
  let filename = revFile.name;
  let revFileType = filename.slice(
    (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
  );

  return revFileType;
};

export const revGetFileObjectSubType = revFile => {
  let revFileType = revGetFileType(revFile);

  if (!revFileType) {
    return;
  }

  let revSubType;

  switch (revFileType) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      revSubType = 'rev_file';
      break;

    case 'mp4':
    case 'MOV':
    case 'WMV':
    case 'AVI':
    case 'AVCHD':
    case 'FLV':
    case 'F4V':
    case 'SWF':
    case 'MKV':
    case 'mkv':
    case 'WEBM':
    case 'HTML5':
    case 'MPEG-2':
      revSubType = 'rev_video';
      break;

    case 'mp3':
      revSubType = 'rev_audio';
      break;

    default:
      revSubType = 'rev_file';
  }

  console.log('revSubType : ' + revSubType);

  return revSubType;
};

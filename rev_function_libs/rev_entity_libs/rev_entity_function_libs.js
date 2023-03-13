import {revIsEmptyJSONObject} from '../rev_gen_helper_functions';

export const revGetEntityGUID = revEntity => {
  let revEntityGUID = -1;

  if (revIsEmptyJSONObject(revEntity)) {
    return revEntityGUID;
  }

  if (
    revEntity.hasOwnProperty('_revEntityGUID') &&
    revEntity._revEntityGUID >= 0
  ) {
    revEntityGUID = revEntity._revEntityGUID;
  }

  return revEntityGUID;
};

export const revGetRemoteEntityGUID = revEntity => {
  let revEntityGUID = -1;

  if (revIsEmptyJSONObject(revEntity)) {
    return revEntityGUID;
  }

  if (
    revEntity.hasOwnProperty('_remoteRevEntityGUID') &&
    revEntity._remoteRevEntityGUID >= 0
  ) {
    revEntityGUID = revEntity._remoteRevEntityGUID;
  }

  return revEntityGUID;
};

export const revGetLocal_OR_RemoteGUID = revEntity => {
  let revEntityGUID = revGetEntityGUID(revEntity);
  return revEntityGUID >= 0 ? revEntityGUID : revGetRemoteEntityGUID(revEntity);
};

export const revGetPublisherEntity = (revPublishersArr, revEntityGUID) => {
  let revPublisherEntity = null;

  if (!revPublishersArr) {
    console.log('ERR -> NULL PUBLISHERS!');
    return revPublisherEntity;
  }

  for (let i = 0; i < revPublishersArr.length; i++) {
    let revPublisher = revPublishersArr[i];

    let revPublisherGUID = revGetLocal_OR_RemoteGUID(revPublisher);

    if (revIsEmptyJSONObject(revPublisher)) {
      continue;
    }

    if (revPublisherGUID == revEntityGUID) {
      if (revPublisher.revEntity) {
        revPublisherEntity = revPublisher.revEntity;
      } else {
        revPublisherEntity = revPublisher;
      }

      break;
    }
  }

  return revPublisherEntity;
};

export const revGetEntityChildren_By_Subtype = (
  revEntityChildrenArr,
  revEntitySubtype,
  limit,
) => {
  if (!Array.isArray(revEntityChildrenArr) || !revEntitySubtype) {
    return null;
  }

  let revEntityChildrenSubtypesArr = [];

  for (let i = 0; i < revEntityChildrenArr.length; i++) {
    let revEntityChild = revEntityChildrenArr[i];

    if (!revEntityChild || revEntityChild == undefined) {
      continue;
    }

    if (revEntityChild._revEntitySubType.localeCompare(revEntitySubtype) == 0) {
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

  let revEntitySubType;

  switch (revFileType) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      revEntitySubType = 'rev_file';
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
      revEntitySubType = 'rev_video';
      break;

    case 'mp3':
      revEntitySubType = 'rev_audio';
      break;

    default:
      revEntitySubType = 'rev_file';
  }

  console.log('revEntitySubType : ' + revEntitySubType);

  return revEntitySubType;
};

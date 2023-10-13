import {revIsDuplicateInArr} from '../rev_gen_helper_functions';

export var REV_ENTITY_METADATA_STRUCT = () => {
  return {
    _revResolveStatus: -1,
    _revRemoteId: -1,
    _revGUID: -1,
    _revName: '',
    _revValue: '',
    _revTimeCreated: '',
    _revTimePublished: '',
    _revTimePublishedUpdated: '',
  };
};

export var REV_METADATA_FILLER = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revName = revMetadataName;
  revMetadata._revValue = revMetadataVal;

  return revMetadata;
};

export var revGetMetadataValue = (revEntityMetadataList, revMetadataName) => {
  if (!revEntityMetadataList || !revEntityMetadataList.length) return '';

  let revMetadataValue = '';

  for (let i = 0; i < revEntityMetadataList.length; i++) {
    let revCurrMetadata = revEntityMetadataList[i];

    if (!revCurrMetadata || !revCurrMetadata.hasOwnProperty('_revName')) {
      continue;
    }

    let revIsinfo = revCurrMetadata._revName.localeCompare(revMetadataName);

    if (revIsinfo == 0 && revCurrMetadata._revValue) {
      revMetadataValue = revCurrMetadata._revValue;
      break;
    }
  }

  return revMetadataValue;
};

export var revGetMetadataValuesArr = (
  revEntityMetadataList,
  revMetadataName,
) => {
  let revMetadataValuesArr = [];

  if (!revEntityMetadataList || !revEntityMetadataList.length) {
    return revMetadataValuesArr;
  }

  for (let i = 0; i < revEntityMetadataList.length; i++) {
    let revIsinfo =
      revEntityMetadataList[i]._revName.localeCompare(revMetadataName) == 0;

    if (revIsinfo && revEntityMetadataList[i]._revValue) {
      revMetadataValuesArr.push(revEntityMetadataList[i]._revValue);
    }
  }

  return revMetadataValuesArr;
};

export var revGetMetadataContainingMetadataName = (
  revEntityMetadataList,
  revMetadataName,
) => {
  if (!revEntityMetadataList) return;

  let revRetMetadata;

  for (let i = 0; i < revEntityMetadataList.length; i++) {
    let revCurrMetadataName = revEntityMetadataList[i]._revName;

    if (revMetadataName.localeCompare(revCurrMetadataName) == 0) {
      revRetMetadata = revEntityMetadataList[i];
      break;
    }
  }

  return revRetMetadata;
};

export var revGetRevEntityMetadataContainingMetadataName = (
  revEntity,
  revMetadataName,
) => {
  let revRetMetadata;

  let revItRevEntityChild = revChildEntity => {
    for (let i = 0; i < revChildEntity._revChildrenList.length; i++) {
      revRetMetadata = revGetMetadataContainingMetadataName(
        revChildEntity._revChildrenList[i]._revMetadataList,
        revMetadataName,
      );

      if (revRetMetadata) {
        break;
      }
    }
  };

  if (revEntity._revChildrenList.length > 0) {
    for (let i = 0; i < revEntity._revChildrenList.length; i++) {
      let revCurrEntity = revEntity._revChildrenList[i];

      if (revCurrEntity._revChildrenList.length > 0)
        revItRevEntityChild(revCurrEntity);

      if (revRetMetadata) {
        break;
      }

      if (revCurrEntity && revCurrEntity._revMetadataList) {
        revRetMetadata = revGetMetadataContainingMetadataName(
          revCurrEntity._revMetadataList,
          revMetadataName,
        );

        if (revRetMetadata) {
          break;
        }
      }
    }
  } else
    revRetMetadata = revGetMetadataContainingMetadataName(
      revEntity._revMetadataList,
      revMetadataName,
    );

  return revRetMetadata;
};

export var revGetRevEntityContainingMetadataValue = (
  revEntityParent,
  revMetadataValue,
) => {
  let revEntity;

  if (!revEntityParent || !Array.isArray(revEntityParent._revChildrenList))
    return null;

  if (revEntityParent._revChildrenList.length > 0) {
    for (let i = 0; i < revEntityParent._revChildrenList.length; i++) {
      let revCurrEntity = revEntityParent._revChildrenList[i];

      if (!revCurrEntity || revCurrEntity._revMetadataList.length < 0) continue;

      let revEntityMetadataList = revCurrEntity._revMetadataList;

      for (let i = 0; i < revEntityMetadataList.length; i++) {
        let revIsEqStr =
          revEntityMetadataList[i]._revValue.localeCompare(revMetadataValue);

        if (revEntityMetadataList[i]._revValue && revIsEqStr == 0) {
          revEntity = revCurrEntity;
          break;
        }
      }

      if (revEntity) {
        break;
      } else if (revCurrEntity && revCurrEntity._revChildrenList) {
        revEntity = revGetRevEntityContainingMetadataValue(
          revCurrEntity,
          revMetadataValue,
        );

        if (revEntity) {
          break;
        }
      }
    }
  }

  return revEntity;
};

export var revGetRemoteMetadataId = (
  revEntityMetadataList,
  revMetadataName,
) => {
  let _revRemoteId = -1;

  for (let i = 0; i < revEntityMetadataList.length; i++) {
    let revIsinfo =
      revEntityMetadataList[i]._revName.localeCompare(revMetadataName);
    let revMetadataValue = revEntityMetadataList[i]._revValue;

    if (revIsinfo == 0 && revMetadataValue) {
      _revRemoteId = revEntityMetadataList[i]._revRemoteId;
      break;
    }
  }

  return _revRemoteId;
};

export var revMetadataFiller = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revName = revMetadataName;
  revMetadata._revValue = revMetadataVal;

  return revMetadata;
};

export var revRemoveMetadata_By_NameId = (
  revEntityMetadaList,
  revMetadataNamesArr,
) => {
  let revNewMetadataListArr = [];

  for (let i = 0; i < revEntityMetadaList.length; i++) {
    let revMetadataName = revEntityMetadaList[i]._revName;

    if (!revArrIncludesElement(revMetadataNamesArr, revMetadataName)) {
      revNewMetadataListArr.push(revEntityMetadaList[i]);
    }
  }

  return revNewMetadataListArr;
};

export var revGetDuplicateMetadataArr = revMetadataList => {
  let revDuplicatesArr = [];
  let revIteratedIdsArr = [];

  if (!revMetadataList) {
    return revDuplicatesArr;
  }

  for (let i = 0; i < revMetadataList.length; i++) {
    let revCurrMetadata = revMetadataList[i];

    let revMetadataValsArr = revGetMetadataValuesArr(
      revMetadataList,
      revCurrMetadata._revName,
    );

    // If the value appears more than once it's a duplicate == revMetadataValsArr.length > 1
    for (let val = 0; val < revMetadataValsArr.length; val++) {
      if (revIteratedIdsArr.indexOf(revCurrMetadata._revRemoteId) !== -1) {
        continue;
      }

      if (revIsDuplicateInArr(revMetadataValsArr, revCurrMetadata._revValue)) {
        revDuplicatesArr.push(revCurrMetadata);
        revIteratedIdsArr.push(revCurrMetadata._revRemoteId);
      }
    }
  }

  return revDuplicatesArr;
};

export var revArrIncludesElement = (revArr, revVal) => {
  let revIncludesElement = false;

  for (let i = 0; i < revArr.length; i++) {
    if (revArr[i] == revVal) {
      revIncludesElement = true;
      break;
    }
  }

  return revIncludesElement;
};

export var revIsDuplicateMetadata = (revMetadataList, revMetadata) => {
  let revDuplicateMetadataArr = revGetDuplicateMetadataArr(revMetadataList);

  if (revDuplicateMetadataArr.length < 2) {
    return false;
  } else {
    let revDuplicateMetadataValsArr = revGetMetadataValuesArr(
      revMetadataList,
      revMetadata._revName,
    );

    let revDuplicatesCount = 0;

    for (let i = 0; i < revDuplicateMetadataValsArr.length; i++) {
      let revDuplicateMetadataVal = revDuplicateMetadataValsArr[i];

      if (revDuplicateMetadataVal.localeCompare(revMetadata._revValue) == 0) {
        revDuplicatesCount = revDuplicatesCount + 1;
      }

      if (revDuplicatesCount > 1) {
        return true;
      }
    }
  }

  return true;
};

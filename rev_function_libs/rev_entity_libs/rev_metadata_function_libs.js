import {revIsDuplicateInArr} from '../rev_gen_helper_functions';

export var REV_ENTITY_METADATA_STRUCT = () => {
  return {
    _resolveStatus: -1,
    remoteRevMetadataId: -1,
    _revMetadataEntityGUID: -1,
    _revMetadataName: '',
    _metadataValue: '',
    _timeCreated: '',
    _revTimeCreated: '',
    _revPublishedDate: '',
  };
};

export var REV_METADATA_FILLER = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revMetadataName = revMetadataName;
  revMetadata._metadataValue = revMetadataVal;

  return revMetadata;
};

export var revGetMetadataValue = (revEntityMetadataList, revMetadataName) => {
  if (!revEntityMetadataList || !revEntityMetadataList.length) return '';

  let revMetadataValue = '';

  for (let i = 0; i < revEntityMetadataList.length; i++) {
    let revCurrMetadata = revEntityMetadataList[i];

    if (
      !revCurrMetadata ||
      !revCurrMetadata.hasOwnProperty('_revMetadataName')
    ) {
      continue;
    }

    let revIsinfo =
      revCurrMetadata._revMetadataName.localeCompare(revMetadataName);

    if (revIsinfo == 0 && revCurrMetadata._metadataValue) {
      revMetadataValue = revCurrMetadata._metadataValue;
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
      revEntityMetadataList[i]._revMetadataName.localeCompare(
        revMetadataName,
      ) == 0;

    if (revIsinfo && revEntityMetadataList[i]._metadataValue) {
      revMetadataValuesArr.push(revEntityMetadataList[i]._metadataValue);
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
    let revCurrMetadataName = revEntityMetadataList[i]._revMetadataName;

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
    for (let i = 0; i < revChildEntity._revEntityChildrenList.length; i++) {
      revRetMetadata = revGetMetadataContainingMetadataName(
        revChildEntity._revEntityChildrenList[i]._revEntityMetadataList,
        revMetadataName,
      );

      if (revRetMetadata) {
        break;
      }
    }
  };

  if (revEntity._revEntityChildrenList.length > 0) {
    for (let i = 0; i < revEntity._revEntityChildrenList.length; i++) {
      let revCurrEntity = revEntity._revEntityChildrenList[i];

      if (revCurrEntity._revEntityChildrenList.length > 0)
        revItRevEntityChild(revCurrEntity);

      if (revRetMetadata) {
        break;
      }

      if (revCurrEntity && revCurrEntity._revEntityMetadataList) {
        revRetMetadata = revGetMetadataContainingMetadataName(
          revCurrEntity._revEntityMetadataList,
          revMetadataName,
        );

        if (revRetMetadata) {
          break;
        }
      }
    }
  } else
    revRetMetadata = revGetMetadataContainingMetadataName(
      revEntity._revEntityMetadataList,
      revMetadataName,
    );

  return revRetMetadata;
};

export var revGetRevEntityContainingMetadataValue = (
  revEntityParent,
  revMetadataValue,
) => {
  let revEntity;

  if (
    !revEntityParent ||
    !Array.isArray(revEntityParent._revEntityChildrenList)
  )
    return null;

  if (revEntityParent._revEntityChildrenList.length > 0) {
    for (let i = 0; i < revEntityParent._revEntityChildrenList.length; i++) {
      let revCurrEntity = revEntityParent._revEntityChildrenList[i];

      if (!revCurrEntity || revCurrEntity._revEntityMetadataList.length < 0)
        continue;

      let revEntityMetadataList = revCurrEntity._revEntityMetadataList;

      for (let i = 0; i < revEntityMetadataList.length; i++) {
        let revIsEqStr =
          revEntityMetadataList[i]._metadataValue.localeCompare(
            revMetadataValue,
          );

        if (revEntityMetadataList[i]._metadataValue && revIsEqStr == 0) {
          revEntity = revCurrEntity;
          break;
        }
      }

      if (revEntity) {
        break;
      } else if (revCurrEntity && revCurrEntity._revEntityChildrenList) {
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
  let revRemoteMetadataId = -1;

  for (let i = 0; i < revEntityMetadataList.length; i++) {
    let revIsinfo =
      revEntityMetadataList[i]._revMetadataName.localeCompare(revMetadataName);
    let revMetadataValue = revEntityMetadataList[i]._metadataValue;

    if (revIsinfo == 0 && revMetadataValue) {
      revRemoteMetadataId = revEntityMetadataList[i].remoteRevMetadataId;
      break;
    }
  }

  return revRemoteMetadataId;
};

export var revMetadataFiller = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revMetadataName = revMetadataName;
  revMetadata._metadataValue = revMetadataVal;

  return revMetadata;
};

export var revRemoveMetadata_By_NameId = (
  revEntityMetadaList,
  revMetadataNamesArr,
) => {
  let revNewMetadataListArr = [];

  for (let i = 0; i < revEntityMetadaList.length; i++) {
    let revMetadataName = revEntityMetadaList[i]._revMetadataName;

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
      revCurrMetadata._revMetadataName,
    );

    // If the value appears more than once it's a duplicate == revMetadataValsArr.length > 1
    for (let val = 0; val < revMetadataValsArr.length; val++) {
      if (
        revIteratedIdsArr.indexOf(revCurrMetadata.remoteRevMetadataId) !== -1
      ) {
        continue;
      }

      if (
        revIsDuplicateInArr(revMetadataValsArr, revCurrMetadata._metadataValue)
      ) {
        revDuplicatesArr.push(revCurrMetadata);
        revIteratedIdsArr.push(revCurrMetadata.remoteRevMetadataId);
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
      revMetadata._revMetadataName,
    );

    let revDuplicatesCount = 0;

    for (let i = 0; i < revDuplicateMetadataValsArr.length; i++) {
      let revDuplicateMetadataVal = revDuplicateMetadataValsArr[i];

      if (
        revDuplicateMetadataVal.localeCompare(revMetadata._metadataValue) == 0
      ) {
        revDuplicatesCount = revDuplicatesCount + 1;
      }

      if (revDuplicatesCount > 1) {
        return true;
      }
    }
  }

  return true;
};

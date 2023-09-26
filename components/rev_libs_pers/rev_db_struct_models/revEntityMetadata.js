var REV_ENTITY_METADATA_STRUCT = () => {
  return {
    _revResolveStatus: -1,
    _revRemoteMetadataId: -1,
    _revMetadataEntityGUID: -1,
    _revMetadataName: '',
    _revMetadataValue: '',
    _revTimeCreated: '',
    _revTimeCreated: '',
    _revTimePublished: '',
  };
};

var REV_METADATA_FILLER = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revMetadataName = revMetadataName;
  revMetadata._revMetadataValue = revMetadataVal;

  return revMetadata;
};

var revGetMetadataValue = (revEntityMetadataList, revMetadataName) => {
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

    if (revIsinfo == 0 && revCurrMetadata._revMetadataValue) {
      revMetadataValue = revCurrMetadata._revMetadataValue;
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

    if (revIsinfo && revEntityMetadataList[i]._revMetadataValue) {
      revMetadataValuesArr.push(revEntityMetadataList[i]._revMetadataValue);
    }
  }

  return revMetadataValuesArr;
};

export {REV_ENTITY_METADATA_STRUCT, REV_METADATA_FILLER, revGetMetadataValue};

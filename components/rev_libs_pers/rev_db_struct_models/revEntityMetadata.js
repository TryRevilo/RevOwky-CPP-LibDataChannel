var REV_ENTITY_METADATA_STRUCT = () => {
  return {
    _revResolveStatus: -1,
    _revId: -1,
    _revRemoteId: -1,
    _revGUID: -1,
    _revName: '',
    _revValue: '',
    _revTimeCreated: -1,
    _revTimeCreated: -1,
    _revTimePublished: -1,
  };
};

var REV_METADATA_FILLER = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revName = revMetadataName;
  revMetadata._revValue = revMetadataVal;

  return revMetadata;
};

var revGetMetadataValue = (revEntityMetadataList, revMetadataName) => {
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

export {REV_ENTITY_METADATA_STRUCT, REV_METADATA_FILLER, revGetMetadataValue};

var REV_ENTITY_METADATA_STRUCT = () => {
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

var REV_METADATA_FILLER = (revMetadataName, revMetadataVal) => {
  let revMetadata = REV_ENTITY_METADATA_STRUCT();
  revMetadata._revMetadataName = revMetadataName;
  revMetadata._metadataValue = revMetadataVal;

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

    if (revIsinfo == 0 && revCurrMetadata._metadataValue) {
      revMetadataValue = revCurrMetadata._metadataValue;
      break;
    }
  }

  return revMetadataValue;
};

export {REV_ENTITY_METADATA_STRUCT, REV_METADATA_FILLER, revGetMetadataValue};

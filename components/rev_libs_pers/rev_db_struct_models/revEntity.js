var REV_ENTITY_STRUCT = () => {
  return {
    _revType: '',
    _revSubType: '',
    _revGUID: -1,
    _revRemoteGUID: -1,
    _revOwnerGUID: -1,
    _revContainerGUID: -1,
    _revRemoteContainerGUID: -1,
    _revSiteGUID: -1,
    _revAccessPermission: -1,
    _revResolveStatus: -1,
    _revChildableStatus: -1,
    _revMetadataList: [],
    _revAnnotations: [],
    _revChildrenList: [],
    _revInfoEntity: {},
    _revTimeCreated: '',
    _timeUpdated: '',
    _revTimeCreated: new Date().getTime(),
    _revTimePublished: '',
    _revTimePublishedUpdated: -1,
    _revPersContainerChildren: [],
    _revTargetEntityRelationships: [],
    _revSubjectEntityRelationships: [],
  };
};

export {REV_ENTITY_STRUCT};

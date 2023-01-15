var REV_ENTITY_STRUCT = () => {
  return {
    _revEntityType: '',
    _revEntitySubType: '',
    _revEntityGUID: -1,
    _remoteRevEntityGUID: -1,
    _revEntityOwnerGUID: -1,
    _revEntityContainerGUID: -1,
    _revEntityRemoteContainerGUID: -1,
    _revEntitySiteGUID: -1,
    _revEntityAccessPermission: -1,
    _revEntityResolveStatus: -1,
    _revEntityChildableStatus: -1,
    _revEntityMetadataList: [],
    _revEntityAnnotations: [],
    _revEntityChildrenList: [],
    _revInfoEntity: {},
    _timeCreated: '',
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

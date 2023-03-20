package rev.ca.rev_gen_lib_pers.c_libs_core;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;

public class RevPersLibRead {

    static {
        System.loadLibrary("rev-pers-lib-db-read");
    }


    public native String revPersGetRevEntityName(long revEntityGUID);

    public native int revEntityExistsByRemoteEntityGUID(long remoteRevEntityGUID);

    public native long revGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID);

    public native RevEntity[] revPersGet_ALL_RevEntity_By_SiteGUID_SubType(long revSiteEntityGUID, String revEntitySubType);

    public native List<Long> revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(String revDBTableFieldName, long revSiteEntityGUID, String revEntitySubType);

    public native long revGetPublicationDate(long localRevEntityGUID);

    public native RevEntity[] revPersGetALLRevEntityTYPE(String revEntityType);

    public native RevEntity[] revPersGetALLRevEntity_By_SubType(String revEntitySubType);

    public native RevEntity[] revPersGetALLRevEntity_By_SubType_RevVarArgs(String revVarArgs);

    public native RevEntity revPersGetRevEntityByGUID(long revEntityGUID);

    public native RevEntity revPersGetRevEntity_By_RemoteRevEntityGUID(long remoteRevEntityGUID);

    public native long revGetRemoteEntityGUID_BY_LocalEntityGUID(long localRevEntityGUID);

    public native long getLocalRevEntityGUID_By_RemoteRevEntityGUID(long remoteRevEntityGUID);

    public native long getRevEntityGUID_By_RevEntityOwnerGUID_Subtype(long revEntityOwnerGUID, String revEntitySubtype);

    public native RevEntity getRevEntityByRevEntityOwnerGUID_Subtype(long revEntityOwnerGUID, String revEntitySubtype);

    public native RevEntity getRevEntity_By_RevEntityContainerGUID_Subtype(long revEntityContainerGUID, String revEntitySubtype);

    public native List<Long> revPersGetALLRevEntityGUIDs_By_RevEntityType(String revEntityType);

    public native List<Long> revPersGetALLRevEntityGUIDs_By_ContainerGUID(long revEntityContainerGUID);

    public native List<Long> revPersGetALLRevEntityGUIDs_By_ResStatus(int resolveStatus);

    public native List<Long> revPersGetALLRemoteRevEntityGUIDs_By_ResStatus(int resolveStatus);

    public native List<Long> revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(int revResolveStatus, String revEntitySubtype);

    public native List<Long> revPersGetALLRevEntityGUIDs_SQL_IN(String sql_IN);

    public native long getRevEntityGUIDByRevEntityContainerGUID_Subtype(long revEntityContainerGUID, String revEntitySubtype);

    public native int getNumberOfUnreadRevEntites();

    public native RevEntity[] revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(long revEntityContainerGUID, String revEntitySubType);

    public native RevEntity[] revPersGetALLRevEntityUnSyched();

    public native RevEntity[] revPersGetALLRevEntityUnSychedByType(String revEntityType);

    /**
     * REV USER ENTITY
     **/

    public native int totalLocalRevUserEntites();

    public native RevEntity getRevUserEntityByEmail_Phone(String revEmailPhone);

    /** END REV USER ENTITY **/

    /**
     * RELATIONSHIPS
     **/

    public native long revGetLastRelSubjectGUID_By_CreatedDate_RelType(String revRelType);

    public native int revEntityRelationshipExists(String revEntityRelationship, long revEntitySubjectGUID, long revEntityTargetGuid);

    public native int revGetAnyRelExists_By_TypeValueId_LocalGUIDs(String revRelType, long revSubjectGUID, long revTargetGuid);

    public native int revGetAnyRelExists_By_TypeValueId_RemoteGUIDs(String revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid);

    public native int revGetAnyRelExists_By_ResStatus_TypeValueId_RemoteGUIDs(int revResStatus, String revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid);

    public native int revEntityRelationshipExists_BY_RemoteTargetGUID(String revEntityRelationship, long revEntitySubjectGUID, long remoteRevEntityTargetGuid);

    public native List<RevEntityRelationship> revPersGetRevEntityRels_By_ResStatus(int revResStatus);

    public native List<List> revPersGetRemoteRelsGUIDs_By_RelTypeValueId_RevEntityGUID_ResolveStatus(int relTypeValueId, long revEntityGUID, int revEntityResolveStatus);

    public native List<RevEntityRelationship> revPersGetRevEntityRelsSubjects_By_RelTypeValueId_TargetGUID_ResolveStatus(int relTypeValueId, long revEntityTargetGUID, int revEntityResolveStatus);

    public native long getRevRelationshipSubjectGUID_By_RelId(long relationshipId);

    public native long getRevRelationshipTargetGUID_By_RelationshipId(long relationshipId);

    public native List<Long> revPersGetALLRevEntityRelationshipsTargets(String revEntityRelationship, long revEntitySubjectGUID);

    public native List<Long> revPersGetALLRevEntityRelGUIDs_By_RelType_RemoteRevEntityGUID(String revEntityrelationship, long revRemoteEntityGUID);

    public native List<Long> revPersGetALLRevRels_RemoteRelId_By_ResolveStatus(int revRelResolveStatus);

    public native List<Long> revPersGetALLRevRels_RemoteRelId_By_ResolveStatus_RemoteTargetGUID(int revRelResolveStatus, long remoteTargetGUID);

    public native List<Long> revPersGetALLRelSubjectGUIDs_By_TargetGUID(long revEntityTargetGUID);

    public native long revPersGetSubjectGUID_BY_RelStr_TargetGUID(String revEntityRelationship, long revEntityTargetGUID);

    public native List<Long> revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(String revEntityRelationship, long revEntityTargetGUID);

    public native List<Long> revPersGetUnresolvedRemoteTargetGUIDSRelIds();

    public native List<Long> revPersGetUnresolvedRemoteSubjectGUIDSRelIds();

    /**
     * METADATA
     **/

    public native String getMetadataValue_By_MetadataId(long revMetadataId);

    public native RevEntityMetadata revPersGetRevEntityMetadata_By_MetadataId(long revMetadataId);

    public native long revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(String revMetadataName, String revMetadataValue);

    public native long revGetRevEntityMetadataId_By_RevMetadataName_RevEntityGUID(String revMetadataName, long revEntityGUID);

    public native String revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(String revMetadataName, long revEntityGUID);

    public native List<RevEntityMetadata> revPersGetALLRevEntityMetadataByRevEntityGUID(long revEntityGUID);

    public native List<Long> revPersGetALLRevEntityMetadataIds_By_ResStatus(int resolveStatus);

    public native List<RevEntityMetadata> revPersGetALLRevEntityMetadata_BY_ResStatus_MetadataName(int revResolveStatus, String revMetadataName);

    public native List<Long> revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(int resolveStatus, long revEntityGUID);

    public native RevEntityMetadata revGetRevEntityMetadata_By_MetadataName_MetadataValue(String revMetadataName, String revMetadataValue);

    public native RevEntityMetadata revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(String revMetadataName, String revMetadataValue, long revEntityGUID);

    public native List<RevEntityMetadata> revPersGetALLRevEntityMetadataUnsynched();

    public native List<RevEntityMetadata> revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(long revEntityGUID);

    /**
     * REV ENTITY ANNOTATION
     **/

    public native int revEntityAnnotationExists(String revAnnotationName, long revEntityGUID, long ownerEntityGUID);

    public native long getRevEntityAnnoationValueIdBy_revAnnotationName_RevEntityGUID_RevEntityOwnerGUID(String revAnnotationName, long revEntityGUID, long revEntityOwnerGUID);

    public native List<Long> getAllRevEntityAnnoationIds_By_RevEntityGUID(long revEntityGUID);

    public native List<Long> getAllRevEntityAnnoationIds_By_RevEntityContainer_GUID(String revAnnotationName, long revEntityContainerGUID);

    public native long getRevAnnotationOwnerGUID_ByAnnotationId(long annotationId);

    public native List<Long> getAllRevEntityAnnoationIds_By_ResStatus(int revAnnResStatus);

    public native RevAnnotation revPersGetRevEntityAnn_By_LocalAnnId(long revAnnotationId);

    /**
     * END REV ENTITY ANNOTATION
     **/

    public native int revTimelineEntityExists_BY_RevEntityGUID(long revEntityGUID);

    /**
     * REV ENTITY METASTRINGS
     **/

    public native String getRevEntityMetaStringValue_By_metastringId(long metastringId);

    /**
     * ITEMS EXIST
     **/

    public native int revEntitySubtypeExists_BY_OWNER_GUID(long revEntityOwnerGUID, String revEntitySubtype);

    public native long revEntitySubtypeExists_BY_CONTAINER_GUID(long revEntityContainerGUID, String revEntitySubtype);


    public native String revGetConvertedTimeFromMills(long revMillisecsTime);


}
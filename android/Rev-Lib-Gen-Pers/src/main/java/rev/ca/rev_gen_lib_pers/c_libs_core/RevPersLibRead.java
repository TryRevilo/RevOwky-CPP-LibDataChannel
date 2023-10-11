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


    public native long revGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID);

    public native RevEntity[] revPersGet_ALL_RevEntity_By_SiteGUID_SubType(long revSiteEntityGUID, String revEntitySubType);

    public native List<Long> revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(String revDBTableFieldName, long revSiteEntityGUID, String revEntitySubType);

    public native RevEntity[] revPersGetALLRevEntity_By_SubType(String revEntitySubType);

    public native List revPersQuery_By_RevVarArgs(String revTableName, String revVarArgs);

    public native RevEntity revPersGetRevEntityByGUID(long revEntityGUID);

    public native RevEntity revPersGetEntity_By_RemoteEntityGUID(long revRemoteEntityGUID);

    public native long revGetRemoteEntityGUID_BY_LocalEntityGUID(long revLocalEntityGUID);

    public native long revGetLocalEntityGUID_By_RemoteEntityGUID(long revRemoteEntityGUID);

    public native RevEntity revGetEntity_By_RevEntityOwnerGUID_Subtype(long revEntityOwnerGUID, String revEntitySubtype);

    public native List<Long> revPersGetALLRevEntityGUIDs_By_ResStatus(int revResolveStatus);

    public native List<Long> revPersGetALLRevEntityGUIDs_By_revResolveStatus_SubType(int revResolveStatus, String revEntitySubtype);

    public native RevEntity[] revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(long revEntityContainerGUID, String revEntitySubType);

    /**
     * RELATIONSHIPS
     **/

    public native List<RevEntityRelationship> revPersGetRevEntityRels_By_ResStatus(int revResStatus);

    public native List<RevEntityRelationship> revPersGetRevEntityRels_By_ResStatus_RelType(int revResStatus, String revEntityRelationship);

    public native List<Long> revPersGetALLRevEntityRelationshipsTargets(String revEntityRelationship, long revEntitySubjectGUID);

    public native List<Long> revPersGetALLRevEntityRelGUIDs_By_RelType_revRemoteEntityGUID(String revEntityRelationship, long revRemoteEntityGUID);

    public native List<RevEntityRelationship> revGetRels_By_RelType_RevEntityGUID_LocalGUIDs(String revRelType, long revEntityGUID, long revLocalGUID_1, long revLocalGUID_2);

    public native List<RevEntityRelationship> revGetRels_By_RelType_LocalGUIDs(String revRelType, long revLocalGUID_1, long revLocalGUID_2);

    public native List<RevEntityRelationship> revGetRels_By_RelType_RemoteGUIDs(String revRelType, long revRemoteGUID_1, long revRemoteGUID_2);

    public native long revPersGetSubjectGUID_BY_RelStr_TargetGUID(String revEntityRelationship, long revEntityTargetGUID);

    public native List<Long> revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(String revEntityRelationship, long revEntityTargetGUID);

    /**
     * METADATA
     **/

    public native String getMetadataValue_By_MetadataId(long _revMetadataId);

    public native RevEntityMetadata revPersGetRevEntityMetadata_By_MetadataId(long _revMetadataId);

    public native long revGetRevEntityMetadataOwnerGUID_By_revMetadataName_revMetadataValue(String revMetadataName, String revMetadataValue);

    public native String revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(String revMetadataName, long revEntityGUID);

    public native RevEntityMetadata revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(String revMetadataName, long revEntityGUID);

    public native List<RevEntityMetadata> revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName(int revResolveStatus, String revMetadataName);

    public native RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(String revMetadataName, String revMetadataValue);

    public native RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID(String revMetadataName, String revMetadataValue, long revEntityGUID);

    /**
     * REV ENTITY ANNOTATION
     **/

    public native long getRevEntityAnnoationValueIdBy_revAnnotationName_RevEntityGUID_RevEntityOwnerGUID(String revAnnotationName, long revEntityGUID, long revEntityOwnerGUID);

    public native List<Long> revGetAllRevEntityAnnoationIds_By_AnnName_RevEntity_GUID(String revAnnotationName, long revEntityGUID);

    public native RevAnnotation revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(String revAnnotationName, long revEntityGUID, long revOwnerGUID);

    /**
     * END REV ENTITY ANNOTATION
     **/
}
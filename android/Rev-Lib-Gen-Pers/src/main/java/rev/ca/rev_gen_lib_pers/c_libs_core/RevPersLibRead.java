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

    public native long revPersGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID);

    public native RevEntity[] revPersGetEntities_By_SiteGUID_SubType(long revSiteEntityGUID, String revSubType);

    public native List<Long> revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(String revDBTableFieldName, long revSiteEntityGUID, String revSubType);

    public native RevEntity[] revPersGetEntities_By_SubType(String revSubType);

    public native List revPersQuery_By_RevVarArgs(String revTableName, String revVarArgs);

    public native RevEntity revPersGetEntity_By_GUID(long revEntityGUID);

    public native RevEntity revPersGetEntity_By_RemoteEntityGUID(long revRemoteEntityGUID);

    public native long revPersGetRemoteEntityGUID_BY_LocalEntityGUID(long revLocalEntityGUID);

    public native long revPersGetLocalEntityGUID_BY_RemoteEntityGUID(long revRemoteEntityGUID);

    public native RevEntity revPersGetEntity_By_OwnerGUID_Subtype(long revEntityOwnerGUID, String revSubType);

    public native List<Long> revPersGetEntityGUIDs_By_ResStatus(int revResolveStatus);

    public native List<Long> revPersGetEntityGUIDs_By_ResolveStatus_SubType(int revResolveStatus, String revSubType);

    public native RevEntity[] revPersGetEntities_By_ContainerGUID_SubTYPE(long revContainerGUID, String revSubType);

    /**
     * RELATIONSHIPS
     **/

    public native List<RevEntityRelationship> revPersGetRels_By_ResStatus(int revResStatus);

    public native List<RevEntityRelationship> revPersGetRels_By_ResStatus_RelType(int revResStatus, String revEntityRelationship);

    public native List<Long> revPersGetTargetGUIDs_BY_RelStr_SubjectGUID(String revEntityRelationship, long revEntitySubjectGUID);

    public native List<Long> revPersGetRelGUIDs_By_Type_revRemoteGUID(String revEntityRelationship, long revRemoteEntityGUID);

    public native List<RevEntityRelationship> revPersGetRels_By_Type_EntityGUID_LocalEntityGUIDs(String revRelType, long revEntityGUID, long revLocalGUID_1, long revLocalGUID_2);

    public native List<RevEntityRelationship> revPersGetRels_By_Type_LocalEntityGUIDs(String revRelType, long revLocalGUID_1, long revLocalGUID_2);

    public native List<RevEntityRelationship> revPersGetRels_By_Type_RemoteEntityGUIDs(String revRelType, long revRemoteGUID_1, long revRemoteGUID_2);

    public native long revPersGetSubjectGUID_BY_RelStr_TargetGUID(String revEntityRelationship, long revEntityTargetGUID);

    public native List<Long> revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(String revEntityRelationship, long revEntityTargetGUID);

    /**
     * METADATA
     **/

    public native String revPersGetMetadataVal_By_Id(long _revId);

    public native RevEntityMetadata revPersGetRevEntityMetadata_By_MetadataId(long _revId);

    public native long revPersGetMetadataOwnerGUID_By_Name_Value(String revMetadataName, String revMetadataValue);

    public native String revPersGetMetadataValue_By_Name_EntityGUID(String revMetadataName, long revEntityGUID);

    public native RevEntityMetadata revPersGetMetadata_By_Name_EntityGUID(String revMetadataName, long revEntityGUID);

    public native List<RevEntityMetadata> revPersGetMetadata_BY_ResStatus_Name(int revResolveStatus, String revMetadataName);

    public native RevEntityMetadata revPersGetMetadata_By_Name_Value(String revMetadataName, String revMetadataValue);

    public native RevEntityMetadata revPersGetMetadata_By_Name_Value_EntityGUID(String revMetadataName, String revMetadataValue, long revEntityGUID);

    /**
     * REV ENTITY ANNOTATION
     **/

    public native long revPersGetAnnValueId_By_Name_EntityGUID_OwnerGUID(String revAnnotationName, long revEntityGUID, long revEntityOwnerGUID);

    public native List<Long> revPersGetAnnIds_By_Name_EntityGUID(String revAnnotationName, long revEntityGUID);

    public native RevAnnotation revPersGetAnn_By_Name_EntityGUID_OwnerGUID(String revAnnotationName, long revEntityGUID, long revOwnerGUID);

    /**
     * END REV ENTITY ANNOTATION
     **/
}
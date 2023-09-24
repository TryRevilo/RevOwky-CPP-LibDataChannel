package com.owki.rev_react_modules.rev_persistence;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;
import rev.ca.rev_gen_lib_pers.rev_server_client.RevJSONEntityConstructor;

public class RevPersLibRead_React extends ReactContextBaseJavaModule {
    public RevPersLibRead_React(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    RevPersLibRead revPersLibRead = new RevPersLibRead();

    @NonNull
    @Override
    public String getName() {
        return "RevPersLibRead_React";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    String revPersGetRevEntityByGUID(Integer revEntityGUID) {
        String revEntityStr = "{}";

        if (revEntityGUID == null) {
            return revEntityStr;
        }

        RevEntity revEntity = revPersLibRead.revPersGetRevEntityByGUID(revEntityGUID);

        if (revEntity != null) {
            revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);
        }

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    String revPersGetRevEntity_By_RemoteRevEntityGUID(Integer remoteRevEntityGUID) {
        String revEntityStr = "{}";

        RevEntity revEntity = revPersLibRead.revPersGetRevEntity_By_RemoteRevEntityGUID(remoteRevEntityGUID);

        if (revEntity != null) {
            revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);
        }

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revGetLocalEntityGUID_BY_RemoteEntityGUID(Integer revRemoteRevEntityGUID) {
        long revEntityGUID = (revPersLibRead.getLocalRevEntityGUID_By_RemoteRevEntityGUID(revRemoteRevEntityGUID));

        return (int) revEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revGetRemoteEntityGUID_BY_LocalEntityGUID(Integer revLocalEntityGUID) {
        long revEntityGUID = (revPersLibRead.revGetRemoteEntityGUID_BY_LocalEntityGUID(revLocalEntityGUID));

        return (int) revEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGet_ALL_RevEntity_By_SiteGUID_SubType(Integer revSiteEntityGUID, String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGet_ALL_RevEntity_By_SiteGUID_SubType(revSiteEntityGUID, revEntitySubType);

        if (revEntities.length > 0)
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(String revDBTableFieldName, Integer revSiteEntityGUID, String revEntitySubType) {
        List<Long> revEntityGUIDs = revPersLibRead.revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(revDBTableFieldName, revSiteEntityGUID, revEntitySubType);

        return revEntityGUIDs.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(Integer revEntityGUID, String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(revEntityGUID, revEntitySubType);

        if (revEntities.length > 0)
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revGetEntityOwnerGUID_BY_EntityGUID(Integer revEntityGUID) {
        long revOwnerEntityGUID = revPersLibRead.revGetEntityOwnerGUID_BY_EntityGUID(revEntityGUID);

        return (int) revOwnerEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(String revMetadataName, String revMetadataValue) {
        long revEntityGUID = (revPersLibRead.revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(revMetadataName, revMetadataValue));

        return (int) revEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntity_By_SubType(String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGetALLRevEntity_By_SubType(revEntitySubType);

        if (revEntities.length > 0)
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRevEntities_By_RevVarArgs(String revVarArgs) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGetRevEntities_By_RevVarArgs(revVarArgs);

        if (revEntities.length > 0)
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersQuery_By_RevVarArgs(String revTableName, String revVarArgs) {
        String revEntitiesStr = "[]";

        if (revTableName.equals("REV_ENTITY_TABLE")) {
            RevEntity[] revEntities = revPersLibRead.revPersGetRevEntities_By_RevVarArgs(revVarArgs);

            if (revEntities.length > 0)
                revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);
        } else {
            List revdata = revPersLibRead.revPersQuery_By_RevVarArgs(revTableName, revVarArgs);
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revdata);
        }

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getRevEntityByRevEntityOwnerGUID_Subtype(Integer revEntityOwnerGUID, String revEntitySubtype) {
        String revEntityStr = "{}";

        RevEntity revEntity = revPersLibRead.getRevEntityByRevEntityOwnerGUID_Subtype(revEntityOwnerGUID, revEntitySubtype);

        if (revEntity != null)
            revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityGUIDs_By_ResStatus(Integer resolveStatus) {
        List<Long> revEntityGUIDs = revPersLibRead.revPersGetALLRevEntityGUIDs_By_ResStatus(resolveStatus);

        return revEntityGUIDs.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(Integer revResolveStatus, String revEntitySubtype) {
        List<Long> revEntityGUIDs = revPersLibRead.revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(revResolveStatus, revEntitySubtype);

        return revEntityGUIDs.toString();
    }

    /**
     * START RELS
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersGetSubjectGUID_BY_RelStr_TargetGUID(String revEntityRelationship, Integer revEntityTargetGUID) {
        long revSubjectGuid = revPersLibRead.revPersGetSubjectGUID_BY_RelStr_TargetGUID(revEntityRelationship, revEntityTargetGUID);

        return (int) revSubjectGuid;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(String revEntityRelationship, Integer revEntityTargetGUID) {
        List<Long> revRelSubjectGuidsList = revPersLibRead.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(revEntityRelationship, revEntityTargetGUID);

        return revRelSubjectGuidsList.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityRelationshipsTargetGUIDs_BY_RelStr_SubjectGUID(String revEntityRelationship, Integer revEntitySubjectGUID) {
        List<Long> revRelSubjectGuidsList = revPersLibRead.revPersGetALLRevEntityRelationshipsTargets(revEntityRelationship, revEntitySubjectGUID);

        return revRelSubjectGuidsList.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRevEntityRels_By_ResStatus(Integer revResStatus) {
        String revEntityRelationshipsStr = "[]";

        List<RevEntityRelationship> revEntityRelationships = revPersLibRead.revPersGetRevEntityRels_By_ResStatus(revResStatus);

        if (revEntityRelationships.size() > 0)
            revEntityRelationshipsStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityRelationships);

        return revEntityRelationshipsStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRevEntityRels_By_ResStatus_RelType(Integer revResStatus, String revEntityRelationship) {
        String revEntityRelationshipsStr = "[]";

        List<RevEntityRelationship> revEntityRelationships = revPersLibRead.revPersGetRevEntityRels_By_ResStatus_RelType(revResStatus, revEntityRelationship);

        if (revEntityRelationships.size() > 0)
            revEntityRelationshipsStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityRelationships);

        return revEntityRelationshipsStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityRelGUIDs_By_RelType_RemoteRevEntityGUID(String revEntityrelationship, Integer revRemoteEntityGUID) {
        String revRelsString = "[]";

        List<Long> revRelsList = revPersLibRead.revPersGetALLRevEntityRelGUIDs_By_RelType_RemoteRevEntityGUID(revEntityrelationship, revRemoteEntityGUID);

        if (revRelsList.size() > 0)
            revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;

    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRels_By_RelType_RevEntityGUID_LocalGUIDs(String revRelType, Integer revEntityGUID, Integer revLocalGUID_1, Integer revLocalGUID_2) {
        String revRelsString = "[]";

        List<RevEntityRelationship> revRelsList = revPersLibRead.revGetRels_By_RelType_RevEntityGUID_LocalGUIDs(revRelType, revEntityGUID, revLocalGUID_1, revLocalGUID_2);

        if (revRelsList.size() > 0)
            revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRels_By_RelType_LocalGUIDs(String revRelType, Integer revLocalGUID_1, Integer revLocalGUID_2) {
        String revRelsString = "[]";

        List<RevEntityRelationship> revRelsList = revPersLibRead.revGetRels_By_RelType_LocalGUIDs(revRelType, revLocalGUID_1, revLocalGUID_2);

        if (revRelsList.size() > 0)
            revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRels_By_RelType_RemoteGUIDs(String revRelType, Integer revRemoteGUID_1, Integer revRemoteGUID_2) {
        String revRelsString = "[]";

        List<RevEntityRelationship> revRelsList = revPersLibRead.revGetRels_By_RelType_RemoteGUIDs(revRelType, revRemoteGUID_1, revRemoteGUID_2);

        if (revRelsList.size() > 0)
            revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;
    }
    /** END RELS **/

    /**
     * START REV READ METADATA
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(String revMetadataName, Integer revEntityGUID) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(revMetadataName, (long) revEntityGUID);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRevEntityMetadata_By_MetadataName_MetadataValue(String revMetadataName, String revMetadataValue) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revGetRevEntityMetadata_By_MetadataName_MetadataValue(revMetadataName, revMetadataValue);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(String revMetadataName, String revMetadataValue, Integer revEntityGUID) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(revMetadataName, revMetadataValue, (long) revEntityGUID);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityMetadata_BY_ResStatus_MetadataName(Integer revResolveStatus, String revMetadataName) {
        List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetALLRevEntityMetadata_BY_ResStatus_MetadataName((int) revResolveStatus, revMetadataName);
        String revEntityMetadataListStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadataList);

        return revEntityMetadataListStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(String revMetadataName, Integer revEntityGUID) {
        return revPersLibRead.revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(revMetadataName, (long) revEntityGUID);
    }

    /**
     * END REV READ METADATA
     **/


    /**
     * START ANNOTATIONS
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetAllRevEntityAnnoationIds_By_AnnName_RevEntity_GUID(String revAnnotationName, Integer revEntityGUID) {
        List<Long> revAnnIDsList = revPersLibRead.revGetAllRevEntityAnnoationIds_By_AnnName_RevEntity_GUID(revAnnotationName, revEntityGUID);
        String revAnnIDsListStr = new RevJSONEntityConstructor().revObjectSerializer(revAnnIDsList);

        return revAnnIDsListStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revGetRevEntityAnnoationValueIdBy_revAnnotationName_RevEntityGUID_RevEntityOwnerGUID(String revAnnotationName, Integer revEntityGUID, Integer revEntityOwnerGUID) {
        long revAnnID = revPersLibRead.getRevEntityAnnoationValueIdBy_revAnnotationName_RevEntityGUID_RevEntityOwnerGUID(revAnnotationName, (long) revEntityGUID, (long) revEntityOwnerGUID);
        return (int) revAnnID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(String revAnnotationName, Integer revEntityGUID, Integer revOwnerGUID) {
        RevAnnotation revAnnotation = revPersLibRead.revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(revAnnotationName, (long) revEntityGUID, (long) revOwnerGUID);
        String revAnnotationStr = new RevJSONEntityConstructor().revObjectSerializer(revAnnotation);

        return revAnnotationStr;
    }

    /**
     * END ANNOTATIONS
     **/
}

package com.owki.rev_react_modules.rev_persistence;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevAnnotation;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityRelationship;
import rev.ca.rev_gen_lib_pers.RevJSONEntityConstructor;
import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibRead;

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
    String revPersGetEntity_By_GUID(Integer revEntityGUID) {
        String revEntityStr = "{}";

        if (revEntityGUID == null) {
            return revEntityStr;
        }

        RevEntity revEntity = revPersLibRead.revPersGetEntity_By_GUID(revEntityGUID);

        if (revEntity != null) {
            revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);
        }

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    String revPersGetEntity_By_RemoteEntityGUID(Integer revRemoteEntityGUID) {
        String revEntityStr = "{}";

        RevEntity revEntity = revPersLibRead.revPersGetEntity_By_RemoteEntityGUID(revRemoteEntityGUID);

        if (revEntity != null) {
            revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);
        }

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersGetLocalEntityGUID_BY_RemoteEntityGUID(Integer revrevRemoteEntityGUID) {
        long revEntityGUID = (revPersLibRead.revPersGetLocalEntityGUID_BY_RemoteEntityGUID(revrevRemoteEntityGUID));

        return (int) revEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersGetRemoteEntityGUID_BY_LocalEntityGUID(Integer revLocalEntityGUID) {
        long revEntityGUID = (revPersLibRead.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(revLocalEntityGUID));

        return (int) revEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetEntities_By_SiteGUID_SubType(Integer revSiteEntityGUID, String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGetEntities_By_SiteGUID_SubType(revSiteEntityGUID, revEntitySubType);

        if (revEntities.length > 0) revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(String revDBTableFieldName, Integer revSiteEntityGUID, String revEntitySubType) {
        List<Long> revEntityGUIDs = revPersLibRead.revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(revDBTableFieldName, revSiteEntityGUID, revEntitySubType);

        return revEntityGUIDs.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetEntities_By_ContainerGUID_SubTYPE(Integer revEntityGUID, String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGetEntities_By_ContainerGUID_SubTYPE(revEntityGUID, revEntitySubType);

        if (revEntities.length > 0) revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersGetEntityOwnerGUID_BY_EntityGUID(Integer revEntityGUID) {
        long revOwnerEntityGUID = revPersLibRead.revPersGetEntityOwnerGUID_BY_EntityGUID(revEntityGUID);

        return (int) revOwnerEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersGetMetadataOwnerGUID_By_Name_Value(String revMetadataName, String revMetadataValue) {
        long revEntityGUID = (revPersLibRead.revPersGetMetadataOwnerGUID_By_Name_Value(revMetadataName, revMetadataValue));

        return (int) revEntityGUID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetEntities_By_SubType(String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGetEntities_By_SubType(revEntitySubType);

        if (revEntities.length > 0) revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersQuery_By_RevVarArgs(String revTableName, String revVarArgs) {
        String revEntitiesStr = "[]";

        List revResDataList = revPersLibRead.revPersQuery_By_RevVarArgs(revTableName, revVarArgs);

        if (revResDataList.size() > 0) {
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revResDataList);
        }

        return revEntitiesStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    public void revPersQuery_By_RevVarArgs_Async(String revTableName, String revVarArgs, Promise revPromise) {
        String revEntitiesStr = "[]";

        List revResDataList = revPersLibRead.revPersQuery_By_RevVarArgs(revTableName, revVarArgs);

        if (revResDataList.size() > 0) {
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revResDataList);
        }

        revPromise.resolve(revEntitiesStr);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetEntity_By_OwnerGUID_Subtype(Integer revEntityOwnerGUID, String revEntitySubtype) {
        String revEntityStr = "{}";

        RevEntity revEntity = revPersLibRead.revPersGetEntity_By_OwnerGUID_Subtype(revEntityOwnerGUID, revEntitySubtype);

        if (revEntity != null) revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetEntityGUIDs_By_ResStatus(Integer revResolveStatus) {
        List<Long> revEntityGUIDs = revPersLibRead.revPersGetEntityGUIDs_By_ResStatus(revResolveStatus);

        return revEntityGUIDs.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetEntityGUIDs_By_ResolveStatus_SubType(Integer revResolveStatus, String revEntitySubtype) {
        List<Long> revEntityGUIDs = revPersLibRead.revPersGetEntityGUIDs_By_ResolveStatus_SubType(revResolveStatus, revEntitySubtype);

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
    public String revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(String revEntityRelationship, Integer revEntityTargetGUID) {
        List<Long> revRelSubjectGuidsList = revPersLibRead.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(revEntityRelationship, revEntityTargetGUID);

        return revRelSubjectGuidsList.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetTargetGUIDs_BY_RelStr_SubjectGUID(String revEntityRelationship, Integer revEntitySubjectGUID) {
        List<Long> revRelSubjectGuidsList = revPersLibRead.revPersGetTargetGUIDs_BY_RelStr_SubjectGUID(revEntityRelationship, revEntitySubjectGUID);

        return revRelSubjectGuidsList.toString();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRels_By_ResStatus(Integer revResStatus) {
        String revEntityRelationshipsStr = "[]";

        List<RevEntityRelationship> revEntityRelationships = revPersLibRead.revPersGetRels_By_ResStatus(revResStatus);

        if (revEntityRelationships.size() > 0) revEntityRelationshipsStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityRelationships);

        return revEntityRelationshipsStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRels_By_ResStatus_RelType(Integer revResStatus, String revEntityRelationship) {
        String revEntityRelationshipsStr = "[]";

        List<RevEntityRelationship> revEntityRelationships = revPersLibRead.revPersGetRels_By_ResStatus_RelType(revResStatus, revEntityRelationship);

        if (revEntityRelationships.size() > 0) revEntityRelationshipsStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityRelationships);

        return revEntityRelationshipsStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRelGUIDs_By_Type_revRemoteGUID(String revEntityRelationship, Integer revRemoteEntityGUID) {
        String revRelsString = "[]";

        List<Long> revRelsList = revPersLibRead.revPersGetRelGUIDs_By_Type_revRemoteGUID(revEntityRelationship, revRemoteEntityGUID);

        if (revRelsList.size() > 0) revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;

    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRels_By_Type_EntityGUID_LocalEntityGUIDs(String revRelType, Integer revEntityGUID, Integer revLocalGUID_1, Integer revLocalGUID_2) {
        String revRelsString = "[]";

        List<RevEntityRelationship> revRelsList = revPersLibRead.revPersGetRels_By_Type_EntityGUID_LocalEntityGUIDs(revRelType, revEntityGUID, revLocalGUID_1, revLocalGUID_2);

        if (revRelsList.size() > 0) revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRels_By_Type_LocalEntityGUIDs(String revRelType, Integer revLocalGUID_1, Integer revLocalGUID_2) {
        String revRelsString = "[]";

        List<RevEntityRelationship> revRelsList = revPersLibRead.revPersGetRels_By_Type_LocalEntityGUIDs(revRelType, revLocalGUID_1, revLocalGUID_2);

        if (revRelsList.size() > 0) revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetRels_By_Type_RemoteEntityGUIDs(String revRelType, Integer revRemoteGUID_1, Integer revRemoteGUID_2) {
        String revRelsString = "[]";

        List<RevEntityRelationship> revRelsList = revPersLibRead.revPersGetRels_By_Type_RemoteEntityGUIDs(revRelType, revRemoteGUID_1, revRemoteGUID_2);

        if (revRelsList.size() > 0) revRelsString = new RevJSONEntityConstructor().revObjectSerializer(revRelsList);

        return revRelsString;
    }

    /** END RELS **/

    /**
     * START REV READ METADATA
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetMetadata_By_Name_EntityGUID(String revMetadataName, Integer revEntityGUID) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revPersGetMetadata_By_Name_EntityGUID(revMetadataName, (long) revEntityGUID);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetMetadata_By_Name_Value(String revMetadataName, String revMetadataValue) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revPersGetMetadata_By_Name_Value(revMetadataName, revMetadataValue);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetMetadata_By_Name_Value_EntityGUID(String revMetadataName, String revMetadataValue, Integer revEntityGUID) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revPersGetMetadata_By_Name_Value_EntityGUID(revMetadataName, revMetadataValue, (long) revEntityGUID);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetMetadata_BY_ResStatus_Name(Integer revResolveStatus, String revMetadataName) {
        List<RevEntityMetadata> revEntityMetadataList = revPersLibRead.revPersGetMetadata_BY_ResStatus_Name((int) revResolveStatus, revMetadataName);
        String revEntityMetadataListStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadataList);

        return revEntityMetadataListStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetMetadataValue_By_Name_EntityGUID(String revMetadataName, Integer revEntityGUID) {
        return revPersLibRead.revPersGetMetadataValue_By_Name_EntityGUID(revMetadataName, (long) revEntityGUID);
    }

    /**
     * END REV READ METADATA
     **/

    /**
     * START ANNOTATIONS
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetAnnIds_By_Name_EntityGUID(String revAnnotationName, Integer revEntityGUID) {
        List<Long> revAnnIDsList = revPersLibRead.revPersGetAnnIds_By_Name_EntityGUID(revAnnotationName, revEntityGUID);
        String revAnnIDsListStr = new RevJSONEntityConstructor().revObjectSerializer(revAnnIDsList);

        return revAnnIDsListStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersGetAnnValueId_By_Name_EntityGUID_OwnerGUID(String revAnnotationName, Integer revEntityGUID, Integer revEntityOwnerGUID) {
        long revAnnID = revPersLibRead.revPersGetAnnValueId_By_Name_EntityGUID_OwnerGUID(revAnnotationName, (long) revEntityGUID, (long) revEntityOwnerGUID);
        return (int) revAnnID;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetAnn_By_Name_EntityGUID_OwnerGUID(String revAnnotationName, Integer revEntityGUID, Integer revOwnerGUID) {
        RevAnnotation revAnnotation = revPersLibRead.revPersGetAnn_By_Name_EntityGUID_OwnerGUID(revAnnotationName, (long) revEntityGUID, (long) revOwnerGUID);
        String revAnnotationStr = new RevJSONEntityConstructor().revObjectSerializer(revAnnotation);

        return revAnnotationStr;
    }

    /**
     * END ANNOTATIONS
     **/
}

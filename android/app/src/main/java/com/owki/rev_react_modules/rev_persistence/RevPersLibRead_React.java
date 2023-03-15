package com.owki.rev_react_modules.rev_persistence;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

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
    public Integer revGetRemoteEntityGUID_BY_LocalEntityGUID(Integer revLocalEntityGUID) {
        long revEntityGUID = (revPersLibRead.revGetRemoteEntityGUID_BY_LocalEntityGUID(revLocalEntityGUID));

        return (int) revEntityGUID;
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
    public String revPersGetALLRevEntity_By_SubType_RevVarArgs(String revVarArgs) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGetALLRevEntity_By_SubType_RevVarArgs(revVarArgs);

        if (revEntities.length > 0)
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

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
    /** END RELS **/

    /**
     * START REV READ METADATA
     **/
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

    /**
     * END REV READ METADATA
     **/
}

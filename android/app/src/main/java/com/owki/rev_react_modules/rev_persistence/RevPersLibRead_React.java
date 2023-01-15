package com.owki.rev_react_modules.rev_persistence;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
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
    public String revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(Integer revEntityGUID, String revEntitySubType) {
        String revEntitiesStr = "[]";

        RevEntity[] revEntities = revPersLibRead.revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(revEntityGUID, revEntitySubType);

        if (revEntities.length > 0)
            revEntitiesStr = new RevJSONEntityConstructor().revObjectSerializer(revEntities);

        return revEntitiesStr;
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
    public String getRevEntityByRevEntityOwnerGUID_Subtype(Integer revEntityOwnerGUID, String revEntitySubtype) {
        String revEntityStr = "{}";

        RevEntity revEntity = revPersLibRead.getRevEntityByRevEntityOwnerGUID_Subtype(revEntityOwnerGUID, revEntitySubtype);

        if (revEntity != null)
            revEntityStr = new RevJSONEntityConstructor().revObjectSerializer(revEntity);

        return revEntityStr;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(String revEntityRelationship, Integer revEntityTargetGUID) {
        List<Long> revRelSubjectGuidsList = revPersLibRead.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(revEntityRelationship, revEntityTargetGUID);

        return revRelSubjectGuidsList.toString();
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
     * START REV READ METADATA
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(String revMetadataName, String revMetadataValue, Integer revEntityGUID) {
        RevEntityMetadata revEntityMetadata = revPersLibRead.revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(revMetadataName, revMetadataValue, (long) revEntityGUID);
        String revEntityMetadataStr = new RevJSONEntityConstructor().revObjectSerializer(revEntityMetadata);

        return revEntityMetadataStr;
    }

    /**
     * END REV READ METADATA
     **/
}

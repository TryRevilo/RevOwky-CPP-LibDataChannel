package com.owki.rev_react_modules.rev_persistence;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibUpdate;

public class RevPersLibUpdate_React extends ReactContextBaseJavaModule {
    public RevPersLibUpdate_React(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RevPersLibUpdate_React";
    }

    RevPersLibUpdate revPersLibUpdate = new RevPersLibUpdate();

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersResetEntityOwnerGUID(Integer revEntityGUID, Integer revEntityOwnerGUID) {
        return revPersLibUpdate.revPersResetEntityOwnerGUID(revEntityGUID, revEntityOwnerGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetRemoteEntityGUID_By_LocalEntityGUID(Integer revEntityGUID, Integer revRemoteEntityGUID) {
        return revPersLibUpdate.revPersSetRemoteEntityGUID_By_LocalEntityGUID((int) revEntityGUID,
                (int) revRemoteEntityGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetEntityResStatus_By_EntityGUID(Integer revResolveStatus, Integer revEntityGUID) {
        return revPersLibUpdate.revPersSetEntityResStatus_By_EntityGUID((int) revResolveStatus, (int) revEntityGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetPubDate_By_GUID(Integer revEntityGUID, Integer revPublishedDate) {
        return revPersLibUpdate.revPersSetPubDate_By_GUID((int) revEntityGUID, (int) revPublishedDate);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetRemoteSubjectGUID(Integer localSubjectGUID, Integer remoteSubjectGUID) {
        return revPersLibUpdate.revPersSetRemoteSubjectGUID((int) localSubjectGUID, (int) remoteSubjectGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetRemoteTargetGUID(Integer localTargetGUID, Integer remoteTargetGUID) {
        return revPersLibUpdate.revPersSetRemoteTargetGUID((int) localTargetGUID, (int) remoteTargetGUID);
    }

    /**
     * START RELS
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetRemoteRelId(Integer revEntityRelationshipId,
            Integer revEntityRemoteRelationshipId) {
        return revPersLibUpdate.revPersSetRemoteRelId((int) revEntityRelationshipId,
                (int) revEntityRemoteRelationshipId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersUpdateRelResStatus_By_RelId(Integer revEntityRelationshipId, Integer revResolveStatus) {
        return revPersLibUpdate.revPersUpdateRelResStatus_By_RelId((int) revEntityRelationshipId,
                (int) revResolveStatus);
    }

    /**
     * END RELS
     **/

    /**
     * START METADATA
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetRemoteMetadataId(Integer _revId, Integer _revRemoteId) {
        return revPersLibUpdate.revPersSetRemoteMetadataId((long) _revId, (long) _revRemoteId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetMetadataResStatus_BY_Metadata_Id(Integer revResolveStatus, Integer _revId) {
        return revPersLibUpdate.revPersSetMetadataResStatus_BY_Metadata_Id((int) revResolveStatus, (long) _revId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetMetadataVal_BY_Id(Integer _revId, String revMetadataValue) {
        return revPersLibUpdate.revPersSetMetadataVal_BY_Id((long) _revId, revMetadataValue);
    }

    /**
     * END METADATA
     **/

    /**
     * START ANNOTATIONS
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersSetAnnVal_By_Id(Integer revAnnotationId, String revEntityAnnotationValue) {
        return revPersLibUpdate.revPersSetAnnVal_By_Id((long) revAnnotationId, revEntityAnnotationValue);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersSetAnnResStatus_By_Id(Integer revAnnotationId, Integer revAnnotationResStatus) {
        return revPersLibUpdate.revPersSetAnnResStatus_By_Id((long) revAnnotationId, revAnnotationResStatus);
    }

    /**
     * END ANNOTATIONS
     **/
}

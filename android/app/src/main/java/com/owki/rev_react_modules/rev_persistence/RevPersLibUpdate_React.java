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
    public Integer resetRevEntityOwnerGUID(Integer revEntityGUID, Integer revEntityOwnerGUID) {
        return revPersLibUpdate.resetRevEntityOwnerGUID(revEntityGUID, revEntityOwnerGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setrevRemoteEntityGUIDByRevEntityGUID(Integer revEntityGUID, Integer revRemoteEntityGUID) {
        return revPersLibUpdate.setrevRemoteEntityGUIDByRevEntityGUID((int) revEntityGUID, (int) revRemoteEntityGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setRevEntityResolveStatusByRevEntityGUID(Integer revResolveStatus, Integer revEntityGUID) {
        return revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID((int) revResolveStatus, (int) revEntityGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setRevPublishedDate_By_RevEntityGUID(Integer revEntityGUID, Integer revPublishedDate) {
        return revPersLibUpdate.setRevPublishedDate_By_RevEntityGUID((int) revEntityGUID, (int) revPublishedDate);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersUpdateSetRemoteSubjectGUID(Integer localSubjectGUID, Integer remoteSubjectGUID) {
        return revPersLibUpdate.revPersUpdateSetRemoteSubjectGUID((int) localSubjectGUID, (int) remoteSubjectGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersUpdateSetRemoteTargetGUID(Integer localTargetGUID, Integer remoteTargetGUID) {
        return revPersLibUpdate.revPersUpdateSetRemoteTargetGUID((int) localTargetGUID, (int) remoteTargetGUID);
    }

    /**
     * START RELS
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersSetRemoteRelationshipRemoteId(Integer revEntityRelationshipId, Integer revEntityRemoteRelationshipId) {
        return revPersLibUpdate.revPersSetRemoteRelationshipRemoteId((int) revEntityRelationshipId, (int) revEntityRemoteRelationshipId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revPersUpdateRelResStatus_By_RelId(Integer revEntityRelationshipId, Integer revResolveStatus) {
        return revPersLibUpdate.revPersUpdateRelResStatus_By_RelId((int) revEntityRelationshipId, (int) revResolveStatus);
    }

    /**
     * END RELS
     **/

    /**
     * START METADATA
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setRemoteRevEntityMetadataId(Integer revMetadataId, Integer _revRemoteMetadataId) {
        return revPersLibUpdate.setRemoteRevEntityMetadataId((long) revMetadataId, (long) _revRemoteMetadataId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setMetadataResolveStatus_BY_METADATA_ID(Integer revResolveStatus, Integer revMetadataId) {
        return revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID((int) revResolveStatus, (long) revMetadataId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setMetadataValue_BY_MetadataId(Integer revMetadataId, String revMetadataValue) {
        return revPersLibUpdate.setMetadataValue_BY_MetadataId((long) revMetadataId, revMetadataValue);
    }

    /**
     * END METADATA
     **/

    /**
     * START ANNOTATIONS
     **/

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersSetRevAnnVal_By_RevAnnId(Integer revAnnotationId, String revEntityAnnotationValue) {
        return revPersLibUpdate.revPersSetRevAnnVal_By_RevAnnId((long) revAnnotationId, revEntityAnnotationValue);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersSetRevAnnResStatus_By_RevAnnId(Integer revAnnotationId, Integer revAnnotationResStatus) {
        return revPersLibUpdate.revPersSetRevAnnResStatus_By_RevAnnId((long) revAnnotationId, revAnnotationResStatus);
    }

    /**
     * END ANNOTATIONS
     **/
}

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
    public int setRemoteRevEntityGUIDByRevEntityGUID(Integer revEntityGUID, Integer remoteRevEntityGUID) {
        return revPersLibUpdate.setRemoteRevEntityGUIDByRevEntityGUID((int) revEntityGUID, (int) remoteRevEntityGUID);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setRevEntityResolveStatusByRevEntityGUID(Integer resolveStatus, Integer revEntityGUID) {
        return revPersLibUpdate.setRevEntityResolveStatusByRevEntityGUID((int) resolveStatus, (int) revEntityGUID);
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

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setRemoteRevEntityMetadataId(Integer revMetadataId, Integer remoteRevMetadataId) {
        return revPersLibUpdate.setRemoteRevEntityMetadataId((long) revMetadataId, (long) remoteRevMetadataId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int setMetadataResolveStatus_BY_METADATA_ID(Integer revResolveStatus, Integer revMetadatrevPersGetRevEntityByGUIDaId) {
        return revPersLibUpdate.setMetadataResolveStatus_BY_METADATA_ID((int) revResolveStatus, (long) revMetadatrevPersGetRevEntityByGUIDaId);
    }
}

package com.owki.rev_react_modules.rev_persistence;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibDelete;
import rev.ca.rev_lib_interfaces.IRevLibCallBack;

public class RevPersLibDelete_React extends ReactContextBaseJavaModule {
    public RevPersLibDelete_React(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    RevPersLibDelete revPersLibDelete = new RevPersLibDelete();

    @NonNull
    @Override
    public String getName() {
        return "RevPersLibDelete_React";
    }

    /**
     * START ENTITIES
     **/
    @NonNull
    @ReactMethod(isBlockingSynchronousMethod = true)
    Integer revDeleteEntity_By_EntityGUID(@NonNull Integer revEntityGUID) {
        return revPersLibDelete.revDeleteEntity_By_EntityGUID((long) revEntityGUID);
    }

    @NonNull
    @ReactMethod(isBlockingSynchronousMethod = false)
    public void revPersDeleteEntity_And_Children_By_EntityGUID(@NonNull Integer revEntityGUID, final Promise promise) {
        int revDelStatus = revPersLibDelete.revPersDeleteEntity_And_Children_By_EntityGUID((long) revEntityGUID);
        promise.resolve(revDelStatus);
    }

    /**
     * END ENTITIES
     **/

    /**
     * START METADATA
     **/
    @NonNull
    @ReactMethod(isBlockingSynchronousMethod = true)
    Integer revDeleteEntityMetadata_By_ID(@NonNull Integer _revId) {
        return revPersLibDelete.revDeleteEntityMetadata_By_ID((long) _revId);
    }
    /**
     * END METADATA
     **/

    /**
     * START ANNOTATIONS
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    Integer revPersDeleteAnn_By_AnnId(Integer revAnnotationID) {
        return revPersLibDelete.revPersDeleteAnn_By_AnnId((long) revAnnotationID);
    }

    /**
     * END ANNOTATIONS
     **/

    /**
     * START FILES
     **/
    @ReactMethod
    public void revAsyDeleteFilesFromPathsStrArr(String revJsonFilePathsArrStr, final Promise promise) {
        revPersLibDelete.revAsyDeleteFilesFromPathsStrArr(revJsonFilePathsArrStr, revStringRes -> {
            Log.d("MyApp", ">>> revStringRes " + revStringRes);

            promise.resolve(revStringRes);
        });
    }

    /**
     * END FILES
     **/
}

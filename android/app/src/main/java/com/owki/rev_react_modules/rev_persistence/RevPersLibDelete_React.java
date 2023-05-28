package com.owki.rev_react_modules.rev_persistence;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibDelete;

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

    @ReactMethod(isBlockingSynchronousMethod = true)
    Integer revDeleteEntity_By_EntityGUID(Integer revEntityGUID) {
        return revPersLibDelete.revDeleteEntity_By_EntityGUID((long) revEntityGUID);
    }

    /**
     * START ANNOTATIONS
     **/
    @ReactMethod(isBlockingSynchronousMethod = true)
    Integer revDeleteEntityAnnotation_By_AnnotationID(Integer revAnnotationID) {
        return revPersLibDelete.revDeleteEntityAnnotation_By_AnnotationID((long) revAnnotationID);
    }
    /**
     * END ANNOTATIONS
     **/
}

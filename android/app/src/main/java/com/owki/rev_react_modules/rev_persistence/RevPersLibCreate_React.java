package com.owki.rev_react_modules.rev_persistence;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;

public class RevPersLibCreate_React extends ReactContextBaseJavaModule {
    public RevPersLibCreate_React(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    RevPersLibCreate revPersLibCreate = new RevPersLibCreate();

    @NonNull
    @Override
    public String getName() {
        return "RevPersLibCreate_React";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void revPersInitReact(String dbPath) {
        revPersLibCreate.initRevDb(dbPath);
        revPersLibCreate.revTablesInit();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersInitJSON(String revEntityJSON) {
        int revRet = (int) revPersLibCreate.revPersInitJSON(revEntityJSON);

        return revRet;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersRelationshipJSON(String revJSONEntityRelationship) {
        int revret = (int) revPersLibCreate.revPersRelationshipJSON(revJSONEntityRelationship);

        return revret;
    }
}

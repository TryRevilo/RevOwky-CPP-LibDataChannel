package com.owki.rev_react_modules;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Arrays;

// import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
// import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntityMetadata;
// import rev.ca.rev_gen_lib_pers.c_libs_core.RevPersLibCreate;
// import rev.ca.rev_gen_lib_pers.rev_varags_data.REV_SESSION_SETTINGS;
// import rev.ca.revlibpersistence.rev_persistence.FeedReaderContract;

public class RevPersLibCreate_React extends ReactContextBaseJavaModule {
    public RevPersLibCreate_React(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RevPersLibCreate_React";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void revPersInitReact(String dbPath) {
        // new RevPersLibCreate().initRevDb(dbPath);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Integer revPersInitJSON(String revEntityJSON) {
        // int revRet = (int) new RevPersLibCreate().revPersInitJSON(revEntityJSON);

        return 122; //revRet;
    }
}

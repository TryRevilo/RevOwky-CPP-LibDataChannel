package com.owki.rev_react_modules.rev_gen_function_libs;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import rev.ca.rev_lib_gen_functions.RevLibGenFunctions;

public class RevGenLibs_Server_React extends ReactContextBaseJavaModule {
    public RevGenLibs_Server_React(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    RevLibGenFunctions revLibGenFunctions = new RevLibGenFunctions();

    @NonNull
    @Override
    public String getName() {
        return "RevGenLibs_Server_React";
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    public void revPingServer(String revIpAddress) {
        revLibGenFunctions.revPingServer(revIpAddress);
    }
}
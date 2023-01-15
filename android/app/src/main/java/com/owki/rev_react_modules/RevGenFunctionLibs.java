package com.owki.rev_react_modules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.owki.rev_react_modules.rev_gen_function_libs.RevGenLibs_Server_React;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RevGenFunctionLibs implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new RevGenLibs_Server_React(reactApplicationContext));

        return modules;
    }
}

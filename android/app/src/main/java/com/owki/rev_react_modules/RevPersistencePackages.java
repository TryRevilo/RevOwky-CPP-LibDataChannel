package com.owki.rev_react_modules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.owki.rev_react_modules.rev_persistence.RevPersLibCreate_React;
import com.owki.rev_react_modules.rev_persistence.RevPersLibRead_React;
import com.owki.rev_react_modules.rev_persistence.RevPersLibUpdate_React;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RevPersistencePackages implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new RevPersLibCreate_React(reactApplicationContext));
        modules.add(new RevPersLibRead_React(reactApplicationContext));
        modules.add(new RevPersLibUpdate_React(reactApplicationContext));

        return modules;
    }
}

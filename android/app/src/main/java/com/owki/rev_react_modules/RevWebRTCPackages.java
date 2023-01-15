package com.owki.rev_react_modules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.owki.rev_react_modules.rev_persistence.RevPersLibCreate_React;
import com.owki.rev_react_modules.rev_persistence.RevPersLibRead_React;
import com.owki.rev_react_modules.rev_web_rtc.RevWebRTCEventsReactModule;
import com.owki.rev_react_modules.rev_web_rtc.RevWebRTCReactModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RevWebRTCPackages implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new RevWebRTCReactModule(reactApplicationContext));
        modules.add(new RevWebRTCEventsReactModule(reactApplicationContext));

        return modules;
    }
}
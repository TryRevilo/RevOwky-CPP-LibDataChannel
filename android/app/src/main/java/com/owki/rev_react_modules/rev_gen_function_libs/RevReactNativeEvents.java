package com.owki.rev_react_modules.rev_gen_function_libs;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RevReactNativeEvents extends ReactContextBaseJavaModule {
    static ReactApplicationContext reactApplicationContext;

    public RevReactNativeEvents(ReactApplicationContext _reactApplicationContext) {
        super(_reactApplicationContext);
        this.reactApplicationContext = _reactApplicationContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "RevReactNativeEvents";
    }

    private static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap revData) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, revData);
    }

    public static void revInitNativeEvent(String revEventName, String revData) {
        WritableMap params = Arguments.createMap();
        params.putString("eventProperty", revData);

        sendEvent(reactApplicationContext, revEventName, params);
    }
}

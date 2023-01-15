package com.owki.rev_react_modules.rev_web_rtc;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Timer;
import java.util.TimerTask;

public class RevWebRTCEventsReactModule extends ReactContextBaseJavaModule {
    static ReactApplicationContext reactContext;

    static int count = 0;

    public RevWebRTCEventsReactModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "RevWebRTCEventsReactModule";
    }

    private static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap revData) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, revData);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    public static void revNativeEvent() {
        new Timer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                count++;

                WritableMap params = Arguments.createMap();
                params.putString("eventProperty", String.valueOf(count));

                sendEvent(reactContext, "EventReminder", params);
            }
        }, 0, 1000);
    }

    public static void revInitNativeEvent(String revEventName, String revData) {
        WritableMap params = Arguments.createMap();
        params.putString("eventProperty", revData);

        sendEvent(reactContext, revEventName, params);
    }
}

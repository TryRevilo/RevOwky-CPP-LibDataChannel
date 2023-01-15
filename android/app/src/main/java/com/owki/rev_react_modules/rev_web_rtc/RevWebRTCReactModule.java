package com.owki.rev_react_modules.rev_web_rtc;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import rev.ca.rev_lib_webrtc.RevWebRTCInit;

public class RevWebRTCReactModule extends ReactContextBaseJavaModule {
    public RevWebRTCReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    RevWebRTCInit revWebRTCInit = new RevWebRTCInit();

    @NonNull
    @Override
    public String getName() {
        return "RevWebRTCReactModule";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revSetTestStr(String revKey, String revVal) {
        return revWebRTCInit.revSetTestStr(revKey, revVal);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revGetTestStr(String revKey) {
        return revWebRTCInit.revGetTestStr(revKey);
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    public void revInitWS(String revIPAddress, String revLocalId) {
        revWebRTCInit.revInitWS(revIPAddress, revLocalId);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String revInitDataChannel(String revLocalId, String revTargetId) {
        return "revWebRTCInit.revInitDataChannel(revLocalId, revTargetId)";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int revSendMessage(String revTargetId, String revData) {
        int revRet = revWebRTCInit.revSendMessage(revTargetId, revData);

        return revRet;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    int revWebRTCLogIn(String revTargetId, String revMessage) {
        int revRet = revWebRTCInit.revWebRTCLogIn(revTargetId, revMessage);

        return revRet;
    }
}

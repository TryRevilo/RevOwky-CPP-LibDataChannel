package com.owki.rev_react_modules.rev_gen_function_libs;

import android.net.Uri;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class RevMediaFunctionsHelperModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    private static final String TAG = "RevMediaFunctionsHelperModule";

    public RevMediaFunctionsHelperModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public String revPathResolver(String revURIStr) {
        Uri revURI = Uri.parse(revURIStr);
        return RevPathResolver_React.getRealPathFromURI(reactContext, revURI);
    }

    @ReactMethod
    public void revGetVideoThumbnail(ReadableMap options, final Promise promise) {
        new RevThumbnailGeneratorHelperModule().revCreateVideoThumbnail(reactContext, options, promise);
    }
}
//
// Created by rev on 1/25/23.
//

#include "rev_pers_react_native_events.hpp"

#include <jni.h>
#include <android/log.h>
#include <string>

#include "rev-pers-lib-create.hpp"
#include "rev_init_jni_lib.hpp"

void revPersInitReactNativeEvent(JNIEnv *g_env, std::string revEventName, std::string revData) {
    jstring revJEventName = g_env->NewStringUTF(revEventName.c_str());
    jstring revJEventData = g_env->NewStringUTF(revData.c_str());

    const char *revClsPath = "com/owki/rev_react_modules/rev_gen_function_libs/RevReactNativeEvents";
    jclass RevReactNativeEvents = revFindClass(g_env, revClsPath);

    if (RevReactNativeEvents == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> revPersInitReactNativeEvent - Class NOT Found !");
        return;
    }

    jmethodID revInitNativeEvent = g_env->GetStaticMethodID(RevReactNativeEvents, "revInitNativeEvent", "(Ljava/lang/String;Ljava/lang/String;)V");

    if (revInitNativeEvent == NULL) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> METHOD NOT Found!");
        return;
    }

    g_env->CallStaticVoidMethod(RevReactNativeEvents, revInitNativeEvent, revJEventName, revJEventData);

    if (g_env->ExceptionCheck()) {
        g_env->ExceptionDescribe();
    }

    // Crushes if enabled - maybe because RN / Js is single threaded
    // gJvm->DetachCurrentThread();
}
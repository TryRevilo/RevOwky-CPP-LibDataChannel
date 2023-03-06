#include <jni.h>
#include <android/log.h>

#include <malloc.h>
#include <memory>
#include <string>
#include <vector>

extern "C" {
#include "rev_c/rev_ping.h"
}

void revPersInitNativeEvent(std::string revEventName, std::string revData);

void revPingServerCallBack(char *revData) {
    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revPingServerCallBack");
    revPersInitNativeEvent("rev_c_sever_ping", revData);
}

JavaVM *gJvm = nullptr;
static jobject gClassLoader;
static jmethodID gFindClassMethod;

JNIEnv *getEnv() {
    JNIEnv *env;

    int status = gJvm->GetEnv((void **) &env, JNI_VERSION_1_6);
    if (status < 0) {
        status = gJvm->AttachCurrentThread(&env, NULL);
        if (status < 0) {
            return nullptr;
        }
    }

    return env;
}

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *pjvm, void *reserved) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> Rev-Lib-Gen-Functions >>> JNI_OnLoad <<<");

    gJvm = pjvm;  // cache the JavaVM pointer
    auto env = getEnv();

    //replace with one of your classes in the line below
    auto randomClass = env->FindClass("rev/ca/rev_lib_webrtc/RevReactJNIData");

    jclass classClass = env->GetObjectClass(randomClass);

    if (classClass == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> classClass - Class NOT Found!");
        return JNI_VERSION_1_6;
    }

    auto classLoaderClass = env->FindClass("java/lang/ClassLoader");

    if (classLoaderClass == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> classLoaderClass - Class NOT Found!");
        return JNI_VERSION_1_6;
    }

    auto getClassLoaderMethod = env->GetMethodID(classClass, "getClassLoader", "()Ljava/lang/ClassLoader;");

    if (getClassLoaderMethod == NULL) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> getClassLoaderMethod - METHOD NOT Found!");
        return JNI_VERSION_1_6;
    }

    jobject tempGClassLoader = env->CallObjectMethod(randomClass, getClassLoaderMethod);
    gClassLoader = (jclass) env->NewGlobalRef(tempGClassLoader);

    gFindClassMethod = env->GetMethodID(classLoaderClass, "findClass", "(Ljava/lang/String;)Ljava/lang/Class;");

    return JNI_VERSION_1_6;
}

jclass findClass(const char *name) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> Find Class : %s", name);

    return static_cast<jclass>(getEnv()->CallObjectMethod(gClassLoader, gFindClassMethod, getEnv()->NewStringUTF(name)));
}

extern "C"
JNIEXPORT void JNICALL
Java_rev_ca_rev_1lib_1gen_1functions_RevLibGenFunctions_revPingServer(JNIEnv *env, jobject thiz, jstring rev_ip_address) {
    const char *revIPAddress = env->GetStringUTFChars(rev_ip_address, 0);
    rev_ping(revIPAddress, revPingServerCallBack);
}

void revPersInitNativeEvent(std::string revEventName, std::string revData) {
    JNIEnv *g_env = getEnv();

    jstring revJEventName = g_env->NewStringUTF(revEventName.c_str());
    jstring revJEventData = g_env->NewStringUTF(revData.c_str());

    const char *revJEventName_J = g_env->GetStringUTFChars(revJEventName, 0);
    const char *revJEventData_J = g_env->GetStringUTFChars(revJEventData, 0);

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revInitNativeEvent - revJEventName_J : %s - revJEventData_J : %s", revJEventName_J, revJEventData_J);

    jclass RevReactNativeEvents = findClass("com/owki/rev_react_modules/rev_gen_function_libs/RevReactNativeEvents");

    if (RevReactNativeEvents == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> Class NOT Found!");
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

    __android_log_print(ANDROID_LOG_WARN, "MyApp", "->>> %d", 4);

    // gJvm->DetachCurrentThread();

    __android_log_print(ANDROID_LOG_WARN, "MyApp", "->>> %d", 5);
}
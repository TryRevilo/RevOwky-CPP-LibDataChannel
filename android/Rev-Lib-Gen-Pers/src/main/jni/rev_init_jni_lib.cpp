//
// Created by rev on 1/26/23.
//

#include "rev_init_jni_lib.hpp"

#include <jni.h>
#include <android/log.h>

JNIEnv *revGetEnv(JavaVM *gJvm) {
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

jclass revGetClass(JNIEnv *env, char *revClassPath) {
    return env->FindClass(revClassPath);
}

jclass revGetRandClass(JNIEnv *env) {
    //replace with one of your classes in the line below
    auto randomClass = revGetClass(env, "com/owki/RevRandomClass");

    jclass classClass = env->GetObjectClass(randomClass);

    if (classClass == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> classClass - Class NOT Found!");
        return nullptr;
    }

    return classClass;
}

jmethodID revGetClassLoaderMethod(JNIEnv *env) {
    auto classLoaderClass = env->FindClass("java/lang/ClassLoader");

    if (classLoaderClass == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> classLoaderClass - Class NOT Found!");
        return nullptr;
    }

    jmethodID gFindClassMethod = env->GetMethodID(classLoaderClass, "findClass", "(Ljava/lang/String;)Ljava/lang/Class;");

    return gFindClassMethod;
}

jobject revGetClassLoader(JNIEnv *env) {
    //replace with one of your classes in the line below
    auto randomClass = revGetClass(env, "com/owki/RevRandomClass");
    jclass classClass = revGetRandClass(env);

    if (classClass == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> classClass - Class NOT Found!");
        return nullptr;
    }

    auto getClassLoaderMethod = env->GetMethodID(classClass, "getClassLoader", "()Ljava/lang/ClassLoader;");

    if (getClassLoaderMethod == NULL) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> getClassLoaderMethod - METHOD NOT Found!");
        return nullptr;
    }

    jobject tempGClassLoader = env->CallObjectMethod(randomClass, getClassLoaderMethod);
    jobject gClassLoader = (jclass) env->NewGlobalRef(tempGClassLoader);

    return gClassLoader;
}

jclass revFindClass(JNIEnv *env, const char *name) {
    jobject gClassLoader = revGetClassLoader(env);
    if (gClassLoader == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> gClassLoader ERR");
        return nullptr;
    }

    jmethodID gFindClassMethod = revGetClassLoaderMethod(env);
    if (gFindClassMethod == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> gFindClassMethod ERR");
        return nullptr;
    }

    return static_cast<jclass>(env->CallObjectMethod(gClassLoader, gFindClassMethod, env->NewStringUTF(name)));
}
//
// Created by rev on 1/26/23.
//

#ifndef OWKI_REV_INIT_JNI_LIB_HPP
#define OWKI_REV_INIT_JNI_LIB_HPP

#include <jni.h>
#include <android/log.h>

JNIEnv *revGetEnv(JavaVM *gJvm);

jclass revGetRandClass(JNIEnv *env);

jmethodID revGetClassLoaderMethod(JNIEnv *env);

jobject revGetClassLoader(JNIEnv *env);

jclass revFindClass(JNIEnv *env, const char *name);

#endif //OWKI_REV_INIT_JNI_LIB_HPP

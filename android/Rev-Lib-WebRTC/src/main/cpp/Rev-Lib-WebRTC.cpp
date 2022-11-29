#include "rtc/rtc.hpp"

#include <chrono>
#include <iostream>
#include <sstream>
#include <memory>

#include <jni.h>
#include <android/log.h>

#include "rev_client/rev_client_init.hpp"

using namespace std::chrono_literals;
using std::shared_ptr;
using std::weak_ptr;

template<class T>
weak_ptr<T> make_weak_ptr(shared_ptr<T> ptr) { return ptr; }

extern "C"
JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1lib_1webrtc_RevWebRTCInit_revInitWS(JNIEnv *env, jobject thiz, jstring _url, jstring _rev_local_id) {
    const char *url = env->GetStringUTFChars(_url, 0);
    const char *revLocalId = env->GetStringUTFChars(_rev_local_id, 0);

    std::string revInitWSStatus;

    revInitWS(url, revLocalId);

    return env->NewStringUTF("revInitWSStatus.c_str()");
}

extern "C"
JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1lib_1webrtc_RevWebRTCInit_revInitDataChannel(JNIEnv *env, jobject thiz, jstring rev_local_id, jstring rev_target_id) {
    const char *localId = env->GetStringUTFChars(rev_local_id, 0);
    const char *revTargetId = env->GetStringUTFChars(rev_target_id, 0);

    std::shared_ptr<rtc::DataChannel> revDataChannel = revInitDataChannel(localId, revTargetId);

    std::stringstream ss;
    ss << &revDataChannel;
    std::string pStr = ss.str();

    return env->NewStringUTF(pStr.c_str());
}


extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1lib_1webrtc_RevWebRTCInit_revSendMessage(JNIEnv *env, jobject thiz, jstring rev_target_id, jstring rev_data) {
    const char *revTargetId = env->GetStringUTFChars(rev_target_id, 0);
    const char *revData = env->GetStringUTFChars(rev_data, 0);

    return revSendMessage(revTargetId, revData);
}
extern "C"
JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1lib_1webrtc_RevWebRTCInit_revSetTestStr(JNIEnv *env, jobject thiz, jstring rev_key, jstring rev_val) {
    const char *revKey = env->GetStringUTFChars(rev_key, 0);
    const char *revVal = env->GetStringUTFChars(rev_val, 0);

    std::string revRetVal = revSetTestStr(revKey, revVal);

    return env->NewStringUTF(revRetVal.c_str());
}
extern "C"
JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1lib_1webrtc_RevWebRTCInit_revGetTestStr(JNIEnv *env, jobject thiz, jstring rev_key) {
    const char *revKey = env->GetStringUTFChars(rev_key, 0);

    std::string revRet = revGetTestStr(revKey);

    return env->NewStringUTF(revRet.c_str());
}
//
// Created by rev on 3/21/19.
//

#include "rev_metadata_jni_loader.h"

#include <jni.h>

#include <android/log.h>

#include <string.h>

#include <cstdio>

#include <malloc.h>

#include <cstring>

extern "C" {
    #include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"

}

REV_ENTITY_METADATA_JNI_POSREC * LoadRevEntityMetadataJniPosRec(JNIEnv * env) {
    REV_ENTITY_METADATA_JNI_POSREC * revEntityMetadataJniPosRec = new REV_ENTITY_METADATA_JNI_POSREC;

    revEntityMetadataJniPosRec -> cls = env -> FindClass("rev/ca/rev_gen_lib_pers/RevDBModels/RevEntityMetadata");

    if (revEntityMetadataJniPosRec -> cls != NULL) {
        printf("+ sucessfully created class");
    } else {
        printf("! sucessfully created class");
    }

    revEntityMetadataJniPosRec -> constructortor_ID = env -> GetMethodID(revEntityMetadataJniPosRec -> cls, "<init>", "()V");
    if (revEntityMetadataJniPosRec -> constructortor_ID != NULL) {
        printf("+ sucessfully created ctorID");
    } else {
        printf("! sucessfully created ctorID");
    }

    revEntityMetadataJniPosRec -> _revResolveStatus = env->GetFieldID(revEntityMetadataJniPosRec -> cls, "_revResolveStatus", "I");
    revEntityMetadataJniPosRec -> _revId = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revId", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec -> _revRemoteId = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revRemoteId", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec -> _revGUID = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revGUID", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec -> _revName = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revName", "Ljava/lang/String;");
    revEntityMetadataJniPosRec -> _revValue = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revValue", "Ljava/lang/String;");

    revEntityMetadataJniPosRec -> _revTimeCreated_ID = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revTimeCreated", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec -> _revTimePublished_ID = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revTimePublished", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec -> _revTimePublishedUpdated_ID = env -> GetFieldID(revEntityMetadataJniPosRec -> cls, "_revTimePublishedUpdated", "Ljava/lang/Long;");

    return revEntityMetadataJniPosRec;
}

jstring revGetJString(JNIEnv * env, char * cStringValue) {
    jobject bb = env -> NewDirectByteBuffer(cStringValue, strlen(cStringValue));

    jclass cls_Charset = env -> FindClass("java/nio/charset/Charset");
    jmethodID mid_Charset_forName = env -> GetStaticMethodID(cls_Charset, "forName", "(Ljava/lang/String;)Ljava/nio/charset/Charset;");
    jobject charset = env -> CallStaticObjectMethod(cls_Charset, mid_Charset_forName, env -> NewStringUTF("UTF-8"));

    jmethodID mid_Charset_decode = env -> GetMethodID(cls_Charset, "decode", "(Ljava/nio/ByteBuffer;)Ljava/nio/CharBuffer;");
    jobject cb = env -> CallObjectMethod(charset, mid_Charset_decode, bb);

    jclass cls_CharBuffer = env -> FindClass("java/nio/CharBuffer");
    jmethodID mid_CharBuffer_toString = env -> GetMethodID(cls_CharBuffer, "toString", "()Ljava/lang/String;");
    jstring str = static_cast < jstring > (env -> CallObjectMethod(cb, mid_CharBuffer_toString));

    return str;
}

jobject revGetFilledRevMetadataJniObject(JNIEnv * env, RevEntityMetadata revEntityMetadata) {
    REV_ENTITY_METADATA_JNI_POSREC * revEntityMetadataJniPosRec = LoadRevEntityMetadataJniPosRec(env);
    jobject jPosRec = env -> NewObject(revEntityMetadataJniPosRec -> cls, revEntityMetadataJniPosRec -> constructortor_ID);

    if (!revEntityMetadata._revName || !revEntityMetadata._revValue) {
        return jPosRec;
    }

    char * revMetadataName = revEntityMetadata._revName;
    char * revMetadataValue = revEntityMetadata._revValue;

    if (revMetadataName[0] != '\0') {
        jstring revJMetadataName = revGetJString(env, revMetadataName);
        env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revName, revJMetadataName);
        env -> DeleteLocalRef(revJMetadataName);
    }

    if (revMetadataValue[0] != '\0') {
        jstring revJMetadataValue = revGetJString(env, revMetadataValue);
        env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revValue, revJMetadataValue);
        env -> DeleteLocalRef(revJMetadataValue);
    }

    jclass clsLong = (env) -> FindClass("java/lang/Long");
    jmethodID const_MethodId = env -> GetMethodID(clsLong, "<init>", "(J)V");

    // START _revResolveStatus
    if (!revEntityMetadata._revResolveStatus) {
        revEntityMetadata._revResolveStatus = -1;
    }

    jint _revResolveStatus = revEntityMetadata._revResolveStatus;
    env -> SetIntField(jPosRec, revEntityMetadataJniPosRec -> _revResolveStatus, _revResolveStatus);
    // END _revResolveStatus

    if (!revEntityMetadata._revId) {
        revEntityMetadata._revId = -1;
    }

    long _revId = revEntityMetadata._revId;
    jobject _revId_Obj = env -> NewObject(clsLong, const_MethodId, (long long) _revId);
    env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revId, _revId_Obj);
    env -> DeleteLocalRef(_revId_Obj);

    long _revRemoteId = revEntityMetadata._revRemoteId;
    jobject _revRemoteId_Obj = env -> NewObject(clsLong, const_MethodId, (long long) _revRemoteId);
    env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revRemoteId, _revRemoteId_Obj);
    env -> DeleteLocalRef(_revRemoteId_Obj);

    if (!revEntityMetadata._revGUID) {
        revEntityMetadata._revGUID = -1;
    }

    long revMetadataOwnerGUID = revEntityMetadata._revGUID;

    jobject _revGUID_Obj = env -> NewObject(clsLong, const_MethodId, (long long) revMetadataOwnerGUID);
    env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revGUID, _revGUID_Obj);
    env -> DeleteLocalRef(_revGUID_Obj);

    jobject _revTimeCreated_Obj = env -> NewObject(clsLong, const_MethodId, (long long) revEntityMetadata._revTimeCreated);
    env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revTimeCreated_ID, _revTimeCreated_Obj);
    env -> DeleteLocalRef(_revTimeCreated_Obj);

    jobject _revTimePublished_ID_Obj = env -> NewObject(clsLong, const_MethodId, (long long) revEntityMetadata._revTimePublished);
    env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revTimePublished_ID, _revTimePublished_ID_Obj);
    env -> DeleteLocalRef(_revTimePublished_ID_Obj);

    jobject _revTimePublishedUpdated_ID_Obj = env -> NewObject(clsLong, const_MethodId, (long long) revEntityMetadata._revTimePublishedUpdated);
    env -> SetObjectField(jPosRec, revEntityMetadataJniPosRec -> _revTimePublishedUpdated_ID, _revTimePublishedUpdated_ID_Obj);
    env -> DeleteLocalRef(_revTimePublishedUpdated_ID_Obj);

    return jPosRec;
}

jobject revGetFilledRevMetadataJniObjectFromJsonStr(JNIEnv * env,
    const char * revEntityMetadataStr) {
    RevEntityMetadata * revEntityMetadata = revJSONStrMetadataFiller(revEntityMetadataStr);
    jobject jPosRec = revGetFilledRevMetadataJniObject(env, * revEntityMetadata);

    return jPosRec;
}
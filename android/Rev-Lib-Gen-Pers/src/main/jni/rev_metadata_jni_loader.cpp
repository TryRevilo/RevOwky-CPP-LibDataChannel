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

REV_ENTITY_METADATA_JNI_POSREC *LoadRevEntityMetadataJniPosRec(JNIEnv *env) {
    REV_ENTITY_METADATA_JNI_POSREC *revEntityMetadataJniPosRec = new REV_ENTITY_METADATA_JNI_POSREC;

    revEntityMetadataJniPosRec->cls = env->FindClass("rev/ca/rev_gen_lib_pers/RevDBModels/RevEntityMetadata");

    if (revEntityMetadataJniPosRec->cls != NULL) {
        printf("+ sucessfully created class");
    } else {
        printf("! sucessfully created class");
    }

    revEntityMetadataJniPosRec->constructortor_ID = env->GetMethodID(revEntityMetadataJniPosRec->cls, "<init>", "()V");
    if (revEntityMetadataJniPosRec->constructortor_ID != NULL) {
        printf("+ sucessfully created ctorID");
    } else {
        printf("! sucessfully created ctorID");
    }

    revEntityMetadataJniPosRec->revMetadataId = env->GetFieldID(revEntityMetadataJniPosRec->cls, "revMetadataId", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->_revRemoteMetadataId = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revRemoteMetadataId", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->revMetadataOwnerGUID = env->GetFieldID(revEntityMetadataJniPosRec->cls, "revMetadataOwnerGUID", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->_revMetadataName = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revMetadataName", "Ljava/lang/String;");
    revEntityMetadataJniPosRec->_revMetadataValue = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revMetadataValue", "Ljava/lang/String;");

    revEntityMetadataJniPosRec->_revTimeCreated_ID = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revTimeCreated", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->_revTimePublished_ID = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revTimePublished", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->_revTimePublishedUpdated_ID = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revTimePublishedUpdated", "Ljava/lang/Long;");


    return revEntityMetadataJniPosRec;
}

jstring revGetJString(JNIEnv *env, char *cStringValue) {
    jobject bb = env->NewDirectByteBuffer(cStringValue, strlen(cStringValue));

    jclass cls_Charset = env->FindClass("java/nio/charset/Charset");
    jmethodID mid_Charset_forName = env->GetStaticMethodID(cls_Charset, "forName", "(Ljava/lang/String;)Ljava/nio/charset/Charset;");
    jobject charset = env->CallStaticObjectMethod(cls_Charset, mid_Charset_forName, env->NewStringUTF("UTF-8"));

    jmethodID mid_Charset_decode = env->GetMethodID(cls_Charset, "decode", "(Ljava/nio/ByteBuffer;)Ljava/nio/CharBuffer;");
    jobject cb = env->CallObjectMethod(charset, mid_Charset_decode, bb);

    jclass cls_CharBuffer = env->FindClass("java/nio/CharBuffer");
    jmethodID mid_CharBuffer_toString = env->GetMethodID(cls_CharBuffer, "toString", "()Ljava/lang/String;");
    jstring str = static_cast<jstring>(env->CallObjectMethod(cb, mid_CharBuffer_toString));

    return str;
}

jobject revGetFilledRevMetadataJniObject(JNIEnv *env, RevEntityMetadata revEntityMetadata) {
    REV_ENTITY_METADATA_JNI_POSREC *revEntityMetadataJniPosRec = LoadRevEntityMetadataJniPosRec(env);
    jobject jPosRec = env->NewObject(revEntityMetadataJniPosRec->cls, revEntityMetadataJniPosRec->constructortor_ID);

    if (!revEntityMetadata._revMetadataName || !revEntityMetadata._revMetadataValue) {
        return jPosRec;
    }

    char *metadataName = revEntityMetadata._revMetadataName;
    char *metadataValue = revEntityMetadata._revMetadataValue;

    if (metadataName[0] != '\0') {
        jstring revJMetadataName = revGetJString(env, metadataName);
        env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revMetadataName, revJMetadataName);
        env->DeleteLocalRef(revJMetadataName);
    }

    if (metadataValue[0] != '\0') {
        jstring revJMetadataValue = revGetJString(env, metadataValue);
        env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revMetadataValue, revJMetadataValue);
        env->DeleteLocalRef(revJMetadataValue);
    }

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID const_MethodId = env->GetMethodID(clsLong, "<init>", "(J)V");

    if (!revEntityMetadata._revMetadataID) {
        revEntityMetadata._revMetadataID = -1;
    }

    long metadataId = revEntityMetadata._revMetadataID;
    jobject _revEntityMetadataId_Obj = env->NewObject(clsLong, const_MethodId, (long long) metadataId);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataId, _revEntityMetadataId_Obj);
    env->DeleteLocalRef(_revEntityMetadataId_Obj);

    if (!revEntityMetadata._revMetadataID) {
        revEntityMetadata._revMetadataID = -1;
    }

    long _revRemoteMetadataId = revEntityMetadata._revRemoteMetadataId;
    jobject _revRemoteMetadataId_Obj = env->NewObject(clsLong, const_MethodId, (long long) _revRemoteMetadataId);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revRemoteMetadataId, _revRemoteMetadataId_Obj);
    env->DeleteLocalRef(_revRemoteMetadataId_Obj);

    if (!revEntityMetadata._revMetadataEntityGUID) {
        revEntityMetadata._revMetadataEntityGUID = -1;
    }

    long metadataOwnerGUID = revEntityMetadata._revMetadataEntityGUID;

    jobject _revEntityMetadataEntityGUID_Obj = env->NewObject(clsLong, const_MethodId, (long long) metadataOwnerGUID);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataOwnerGUID, _revEntityMetadataEntityGUID_Obj);
    env->DeleteLocalRef(_revEntityMetadataEntityGUID_Obj);

    jobject _revTimeCreated_Obj = env->NewObject(clsLong, const_MethodId, (long long) revEntityMetadata._revTimeCreated);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revTimeCreated_ID, _revTimeCreated_Obj);
    env->DeleteLocalRef(_revTimeCreated_Obj);

    jobject _revTimePublished_ID_Obj = env->NewObject(clsLong, const_MethodId, (long long) revEntityMetadata._revTimePublished);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revTimePublished_ID, _revTimePublished_ID_Obj);
    env->DeleteLocalRef(_revTimePublished_ID_Obj);

    jobject _revTimePublishedUpdated_ID_Obj = env->NewObject(clsLong, const_MethodId, (long long) revEntityMetadata._revTimePublishedUpdated);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revTimePublishedUpdated_ID, _revTimePublishedUpdated_ID_Obj);
    env->DeleteLocalRef(_revTimePublishedUpdated_ID_Obj);

    return jPosRec;
}

jobject revGetFilledRevMetadataJniObjectFromJsonStr(JNIEnv *env, const char *revEntityMetadataStr) {
    RevEntityMetadata *revEntityMetadata = revJSONStrMetadataFiller(revEntityMetadataStr);
    jobject jPosRec = revGetFilledRevMetadataJniObject(env, *revEntityMetadata);

    return jPosRec;
}
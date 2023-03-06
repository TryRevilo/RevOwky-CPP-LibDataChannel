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
    revEntityMetadataJniPosRec->remoteRevMetadataId = env->GetFieldID(revEntityMetadataJniPosRec->cls, "remoteRevMetadataId", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->revMetadataOwnerGUID = env->GetFieldID(revEntityMetadataJniPosRec->cls, "revMetadataOwnerGUID", "Ljava/lang/Long;");
    revEntityMetadataJniPosRec->_revMetadataName = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revMetadataName", "Ljava/lang/String;");
    revEntityMetadataJniPosRec->_metadataValue = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_metadataValue", "Ljava/lang/String;");

    revEntityMetadataJniPosRec->_revTimeCreated = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revTimeCreated", "J");
    revEntityMetadataJniPosRec->_revTimePublished = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revTimePublished", "J");
    revEntityMetadataJniPosRec->_revTimePublishedUpdated = env->GetFieldID(revEntityMetadataJniPosRec->cls, "_revTimePublishedUpdated", "J");


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

    if (!revEntityMetadata._metadataName || !revEntityMetadata._metadataValue) {
        return jPosRec;
    }

    char *metadataName = revEntityMetadata._metadataName;
    char *metadataValue = revEntityMetadata._metadataValue;

    if (metadataName[0] == '\0' || metadataValue[0] == '\0') {
        return jPosRec;
    }

    jstring revJMetadataName = revGetJString(env, metadataName);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revMetadataName, revJMetadataName);
    env->DeleteLocalRef(revJMetadataName);

    jstring revJMetadataValue = revGetJString(env, metadataValue);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_metadataValue, revJMetadataValue);
    env->DeleteLocalRef(revJMetadataValue);

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID const_ethodId = env->GetMethodID(clsLong, "<init>", "(J)V");

    if (!revEntityMetadata._metadataId) {
        revEntityMetadata._metadataId = -1;
    }

    long metadataId = revEntityMetadata._metadataId;
    jobject _revEntityMetadataId_Obj = env->NewObject(clsLong, const_ethodId, metadataId);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataId, _revEntityMetadataId_Obj);
    env->DeleteLocalRef(_revEntityMetadataId_Obj);

    if (!revEntityMetadata._metadataId) {
        revEntityMetadata._metadataId = -1;
    }

    long revRemoteMetadataId = revEntityMetadata._remoteRevMetadataId;
    jobject remoteRevMetadataId_Obj = env->NewObject(clsLong, const_ethodId, revRemoteMetadataId);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->remoteRevMetadataId, remoteRevMetadataId_Obj);
    env->DeleteLocalRef(remoteRevMetadataId_Obj);

    if (!revEntityMetadata._metadataOwnerGUID) {
        revEntityMetadata._metadataOwnerGUID = -1;
    }

    long metadataOwnerGUID = revEntityMetadata._metadataOwnerGUID;

    jobject _revEntityMetadataEntityGUID_Obj = env->NewObject(clsLong, const_ethodId, metadataOwnerGUID);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataOwnerGUID, _revEntityMetadataEntityGUID_Obj);
    env->DeleteLocalRef(_revEntityMetadataEntityGUID_Obj);

    if (!revEntityMetadata._revTimeCreated) {
        revEntityMetadata._revTimeCreated = -1;
    }

    long revTimeCreated = revEntityMetadata._revTimeCreated;

    jlong _revTimeCreated = revEntityMetadata._revTimeCreated;
    env->SetLongField(jPosRec, revEntityMetadataJniPosRec->_revTimeCreated, (jlong) _revTimeCreated);

    return jPosRec;
}

//
// Created by rev on 3/21/19.
//

#include <jni.h>
#include <string.h>
#include <cstdio>
#include <android/log.h>
#include "rev_metadata_jni_loader.h"

REV_ENTITY_METADATA_JNI_POSREC *revEntityMetadataJniPosRec = NULL;

REV_ENTITY_METADATA_JNI_POSREC *LoadRevEntityMetadataJniPosRec(JNIEnv *env) {
    revEntityMetadataJniPosRec = new REV_ENTITY_METADATA_JNI_POSREC;

    revEntityMetadataJniPosRec->cls = env->FindClass(
            "rev/ca/rev_gen_lib_pers/RevDBModels/RevEntityMetadata");

    if (revEntityMetadataJniPosRec->cls != NULL) {
        printf("sucessfully created class");
    }

    revEntityMetadataJniPosRec->constructortor_ID = env->GetMethodID(revEntityMetadataJniPosRec->cls, "<init>", "()V");
    if (revEntityMetadataJniPosRec->constructortor_ID != NULL) {
        printf("sucessfully created ctorID");
    }

    revEntityMetadataJniPosRec->revMetadataId = env->GetFieldID(revEntityMetadataJniPosRec->cls, "revMetadataId", "Ljava/lang/Long;");
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

void FillDataRecValuesToRevMetadataJni(JNIEnv *env, jobject jPosRec, RevEntityMetadata entityMetadata) {
    if (!entityMetadata._metadataName || !entityMetadata._metadataValue) {
        return;
    }

    char *metadataName = entityMetadata._metadataName;
    char *metadataValue = entityMetadata._metadataValue;

    if (metadataName[0] == '\0' || metadataValue[0] == '\0') {
        return;
    }

    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revMetadataName, env->NewStringUTF(metadataName));
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_metadataValue, env->NewStringUTF(metadataValue));

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID const_ethodId = env->GetMethodID(clsLong, "<init>", "(J)V");

    if (!entityMetadata._metadataId) {
        entityMetadata._metadataId = -1;
    }

    long metadataId = entityMetadata._metadataId;
    jobject _revEntityMetadataId_Obj = env->NewObject(clsLong, const_ethodId, metadataId);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataId, _revEntityMetadataId_Obj);
    env->DeleteLocalRef(_revEntityMetadataId_Obj);

    if (!entityMetadata._metadataOwnerGUID) {
        entityMetadata._metadataOwnerGUID = -1;
    }

    long metadataOwnerGUID = entityMetadata._metadataOwnerGUID;

    jobject _revEntityMetadataEntityGUID_Obj = env->NewObject(clsLong, const_ethodId, metadataOwnerGUID);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataOwnerGUID, _revEntityMetadataEntityGUID_Obj);
    env->DeleteLocalRef(_revEntityMetadataEntityGUID_Obj);

    if (!entityMetadata._revTimeCreated) {
        entityMetadata._revTimeCreated = -1;
    }

    jlong _revTimeCreated = entityMetadata._revTimeCreated;
    env->SetLongField(jPosRec, revEntityMetadataJniPosRec->_revTimeCreated, _revTimeCreated);

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> FillDataRecValuesToRevMetadataJni %d", 7);
}

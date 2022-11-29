//
// Created by rev on 3/21/19.
//

#include <jni.h>
#include <cstdio>
#include <android/log.h>
#include "rev_metadata_jni_loader.h"

REV_ENTITY_METADATA_JNI_POSREC *revEntityMetadataJniPosRec = NULL;

REV_ENTITY_METADATA_JNI_POSREC *LoadRevEntityMetadataJniPosRec(JNIEnv *env) {
    revEntityMetadataJniPosRec = new REV_ENTITY_METADATA_JNI_POSREC;

    revEntityMetadataJniPosRec->cls = env->FindClass(
            "rev/ca/rev_gen_lib_pers/RevDBModels$RevEntityMetadata");

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

void FillDataRecValuesToRevMetadataJni(JNIEnv *env, jobject jPosRec, RevEntityMetadata entityMetadata) {
    long metadataId = entityMetadata._metadataId;
    long metadataEntityGUID = entityMetadata._metadataOwnerGUID;
    char *metadataName = entityMetadata._metadataName;
    char *metadataValue = entityMetadata._metadataValue;

    if (metadataName[0] == '\0' || metadataValue[0] == '\0') return;

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID const_ethodId = env->GetMethodID(clsLong, "<init>", "(J)V");

    jobject _revEntityMetadataId_Obj = env->NewObject(clsLong, const_ethodId, metadataId);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataId, _revEntityMetadataId_Obj);
    env->DeleteLocalRef(_revEntityMetadataId_Obj);

    jobject _revEntityMetadataEntityGUID_Obj = env->NewObject(clsLong, const_ethodId, metadataEntityGUID);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->revMetadataOwnerGUID, _revEntityMetadataEntityGUID_Obj);
    env->DeleteLocalRef(_revEntityMetadataEntityGUID_Obj);
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_revMetadataName, env->NewStringUTF(metadataName));
    env->SetObjectField(jPosRec, revEntityMetadataJniPosRec->_metadataValue, env->NewStringUTF(metadataValue));

    jlong _revTimeCreated = entityMetadata._revTimeCreated;
    env->SetLongField(jPosRec, revEntityMetadataJniPosRec->_revTimeCreated, _revTimeCreated);
}

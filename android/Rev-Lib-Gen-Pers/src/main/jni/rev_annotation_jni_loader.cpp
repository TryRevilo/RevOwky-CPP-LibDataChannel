//
// Created by home on 2019-09-12.
//

#include <cstdio>
#include "rev_annotation_jni_loader.h"

REV_ENTITY_ANNOTATION_JNI_POSREC *rev_entity_annotation_jni_posrec;

REV_ENTITY_ANNOTATION_JNI_POSREC *LoadRevEntityAnnotationJniPosRec(JNIEnv *env) {
    rev_entity_annotation_jni_posrec = new REV_ENTITY_ANNOTATION_JNI_POSREC;

    rev_entity_annotation_jni_posrec->cls = env->FindClass("rev/ca/rev_gen_lib_pers/RevDBModels$RevAnnotation");

    if (rev_entity_annotation_jni_posrec->cls != NULL) {
        printf("sucessfully rev_entity_annotation_jni_posrec created class");
    }

    rev_entity_annotation_jni_posrec->constructortor_ID = env->GetMethodID(rev_entity_annotation_jni_posrec->cls, "<init>", "()V");
    if (rev_entity_annotation_jni_posrec->constructortor_ID != NULL) {
        printf("sucessfully created rev_entity_annotation_jni_posrec ctorID");
    }

    rev_entity_annotation_jni_posrec->_revAnnotationResStatus = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationResStatus", "I");

    rev_entity_annotation_jni_posrec->_revAnnotationNameId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationNameId", "I");
    rev_entity_annotation_jni_posrec->_revAnnotationName = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationName", "Ljava/lang/String;");
    rev_entity_annotation_jni_posrec->_revAnnotationValue = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationValue", "Ljava/lang/String;");

    rev_entity_annotation_jni_posrec->_revAnnotationId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationId", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revAnnotationRemoteId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationRemoteId", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revAnnotationEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationEntityGUID", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revAnnotationRemoteEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationRemoteEntityGUID", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revAnnOwnerEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnOwnerEntityGUID", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revAnnRemoteOwnerEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnRemoteOwnerEntityGUID", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revAnnotationTimeCreated = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationTimeCreated", "Ljava/lang/String;");
    rev_entity_annotation_jni_posrec->_revAnnotationTimeUpdated = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationTimeUpdated", "Ljava/lang/String;");

    rev_entity_annotation_jni_posrec->_revTimeCreated = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimeCreated", "J");
    rev_entity_annotation_jni_posrec->_revTimePublished = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimePublished", "J");
    rev_entity_annotation_jni_posrec->_revTimePublishedUpdated = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimePublishedUpdated", "J");

    return rev_entity_annotation_jni_posrec;

}

void FillDataRecValuesToRevAnnotationJni(JNIEnv *env, jobject jPosRec, RevEntityAnnotation revEntityAnnotation) {
    rev_entity_annotation_jni_posrec = LoadRevEntityAnnotationJniPosRec(env);

    jint _revAnnotationResStatus = revEntityAnnotation._revAnnotationResStatus;
    env->SetIntField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnotationResStatus, _revAnnotationResStatus);

    jint _revAnnotationNameId = revEntityAnnotation._revAnnotationNameId;
    env->SetIntField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnotationNameId, _revAnnotationNameId);

    char *_revAnnotationValue = revEntityAnnotation._revAnnotationValue;

    long _revAnnotationId = revEntityAnnotation._revAnnotationId;

    long _revAnnotationEntityGUID = revEntityAnnotation._revAnnotationEntityGUID;
    long _revAnnotationRemoteEntityGUID = revEntityAnnotation._revAnnotationRemoteEntityGUID;

    long _revAnnOwnerEntityGUID = revEntityAnnotation._revAnnOwnerEntityGUID;
    long _revAnnRemoteOwnerEntityGUID = revEntityAnnotation._revAnnRemoteOwnerEntityGUID;

    env->SetObjectField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnotationValue, env->NewStringUTF(_revAnnotationValue));

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID const_MethodId = env->GetMethodID(clsLong, "<init>", "(J)V");

    jobject _revAnnotationId_Obj = env->NewObject(clsLong, const_MethodId, _revAnnotationId);
    env->SetObjectField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnotationId, _revAnnotationId_Obj);
    env->DeleteLocalRef(_revAnnotationId_Obj);

    jobject _revAnnotationEntityGUID_Obj = env->NewObject(clsLong, const_MethodId, _revAnnotationEntityGUID);
    env->SetObjectField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnotationEntityGUID, _revAnnotationEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnotationEntityGUID_Obj);

    jobject _revAnnotationRemoteEntityGUID_Obj = env->NewObject(clsLong, const_MethodId, _revAnnotationRemoteEntityGUID);
    env->SetObjectField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnotationRemoteEntityGUID, _revAnnotationRemoteEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnotationRemoteEntityGUID_Obj);

    jobject _revAnnOwnerEntityGUID_Obj = env->NewObject(clsLong, const_MethodId, _revAnnOwnerEntityGUID);
    env->SetObjectField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnOwnerEntityGUID, _revAnnOwnerEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnOwnerEntityGUID_Obj);

    jobject _revAnnRemoteOwnerEntityGUID_Obj = env->NewObject(clsLong, const_MethodId, _revAnnRemoteOwnerEntityGUID);
    env->SetObjectField(jPosRec, rev_entity_annotation_jni_posrec->_revAnnRemoteOwnerEntityGUID, _revAnnRemoteOwnerEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnRemoteOwnerEntityGUID_Obj);

    jlong _revTimeCreated = revEntityAnnotation._revTimeCreated;
    env->SetLongField(jPosRec, rev_entity_annotation_jni_posrec->_revTimeCreated, _revTimeCreated);
}

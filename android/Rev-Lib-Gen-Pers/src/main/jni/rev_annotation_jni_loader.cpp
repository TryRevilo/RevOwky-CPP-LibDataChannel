//
// Created by home on 2019-09-12.
//

#include "rev_annotation_jni_loader.h"

#include <cstdio>
#include <android/log.h>

REV_ENTITY_ANNOTATION_JNI_POSREC *rev_entity_annotation_jni_posrec;

REV_ENTITY_ANNOTATION_JNI_POSREC *LoadRevEntityAnnotationJniPosRec(JNIEnv *env) {
    rev_entity_annotation_jni_posrec = new REV_ENTITY_ANNOTATION_JNI_POSREC;

    rev_entity_annotation_jni_posrec->cls = env->FindClass("rev/ca/rev_gen_lib_pers/RevDBModels/RevAnnotation");

    if (rev_entity_annotation_jni_posrec->cls != NULL) {
        printf("sucessfully rev_entity_annotation_jni_posrec created class");
    }

    rev_entity_annotation_jni_posrec->constructortor_ID = env->GetMethodID(rev_entity_annotation_jni_posrec->cls, "<init>", "()V");
    if (rev_entity_annotation_jni_posrec->constructortor_ID != NULL) {
        printf("sucessfully created rev_entity_annotation_jni_posrec ctorID");
    }

    rev_entity_annotation_jni_posrec->_revResolveStatus = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revResolveStatus", "I");

    rev_entity_annotation_jni_posrec->_revName = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revName", "Ljava/lang/String;");
    rev_entity_annotation_jni_posrec->_revValue = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revValue", "Ljava/lang/String;");

    rev_entity_annotation_jni_posrec->_revId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revId", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revRemoteId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revRemoteId", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revGUID", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revRemoteGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revRemoteGUID", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revOwnerGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revOwnerGUID", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revRemoteOwnerGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revRemoteOwnerGUID", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revTimeCreated_ID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimeCreated", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revTimePublished_ID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimePublished", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revTimePublishedUpdated_ID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimePublishedUpdated", "Ljava/lang/Long;");

    return rev_entity_annotation_jni_posrec;
}

void FillDataRecValuesToRevAnnotationJni(JNIEnv *env, jobject revJPosRec, RevEntityAnnotation revEntityAnnotation) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> FillDataRecValuesToRevAnnotationJni <<<");

    rev_entity_annotation_jni_posrec = LoadRevEntityAnnotationJniPosRec(env);

    jint _revResolveStatus = revEntityAnnotation._revResolveStatus;
    env->SetIntField(revJPosRec, rev_entity_annotation_jni_posrec->_revResolveStatus, _revResolveStatus);

    char *_revValue = revEntityAnnotation._revValue;

    __android_log_print(ANDROID_LOG_ERROR, "MyApp", "_revValue >>> %s", _revValue);

    long _revId = revEntityAnnotation._revId;

    long _revGUID = revEntityAnnotation._revGUID;
    long _revRemoteGUID = revEntityAnnotation._revRemoteGUID;

    long _revOwnerGUID = revEntityAnnotation._revOwnerGUID;
    long _revRemoteOwnerGUID = revEntityAnnotation._revRemoteOwnerGUID;

    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revValue, env->NewStringUTF(_revValue));

    jclass revJClassLong = (env)->FindClass("java/lang/Long");
    jmethodID revLongMethodId = env->GetMethodID(revJClassLong, "<init>", "(J)V");

    jobject _revId_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revId);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revId, _revId_Obj);
    env->DeleteLocalRef(_revId_Obj);

    jobject _revGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revGUID, _revGUID_Obj);
    env->DeleteLocalRef(_revGUID_Obj);

    jobject _revRemoteGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revRemoteGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revRemoteGUID, _revRemoteGUID_Obj);
    env->DeleteLocalRef(_revRemoteGUID_Obj);

    jobject _revOwnerGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revOwnerGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revOwnerGUID, _revOwnerGUID_Obj);
    env->DeleteLocalRef(_revOwnerGUID_Obj);

    jobject _revRemoteOwnerGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revRemoteOwnerGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revRemoteOwnerGUID, _revRemoteOwnerGUID_Obj);
    env->DeleteLocalRef(_revRemoteOwnerGUID_Obj);

    /** _revTimeCreated **/
    jobject revTimeCreated_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) revEntityAnnotation._revTimeCreated);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revTimeCreated_ID, revTimeCreated_Obj);
    env->DeleteLocalRef(revTimeCreated_Obj);

    /** _revTimePublishedUpdated **/
    jobject _revTimePublished_ID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) revEntityAnnotation._revTimePublished);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revTimePublished_ID, _revTimePublished_ID_Obj);
    env->DeleteLocalRef(_revTimePublished_ID_Obj);

    /** _revTimePublishedUpdated **/
    jobject _revTimePublishedUpdated_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) revEntityAnnotation._revTimePublishedUpdated);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revTimePublishedUpdated_ID, _revTimePublishedUpdated_Obj);
    env->DeleteLocalRef(_revTimePublishedUpdated_Obj);
}

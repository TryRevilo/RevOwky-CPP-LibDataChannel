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

    rev_entity_annotation_jni_posrec->_revAnnotationResStatus = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationResStatus", "I");

    rev_entity_annotation_jni_posrec->_revAnnotationName = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationName", "Ljava/lang/String;");
    rev_entity_annotation_jni_posrec->_revAnnotationValue = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationValue", "Ljava/lang/String;");

    rev_entity_annotation_jni_posrec->_revAnnotationId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationId", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revAnnotationRemoteId = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationRemoteId", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revAnnotationEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationEntityGUID", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revAnnotationRemoteEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnotationRemoteEntityGUID", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revAnnOwnerEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnOwnerEntityGUID", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revAnnRemoteOwnerEntityGUID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revAnnRemoteOwnerEntityGUID", "Ljava/lang/Long;");

    rev_entity_annotation_jni_posrec->_revTimeCreated_ID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimeCreated", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revTimePublished_ID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimePublished", "Ljava/lang/Long;");
    rev_entity_annotation_jni_posrec->_revTimePublishedUpdated_ID = env->GetFieldID(rev_entity_annotation_jni_posrec->cls, "_revTimePublishedUpdated", "Ljava/lang/Long;");

    return rev_entity_annotation_jni_posrec;
}

void FillDataRecValuesToRevAnnotationJni(JNIEnv *env, jobject revJPosRec, RevEntityAnnotation revEntityAnnotation) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> FillDataRecValuesToRevAnnotationJni <<<");

    rev_entity_annotation_jni_posrec = LoadRevEntityAnnotationJniPosRec(env);

    jint _revAnnotationResStatus = revEntityAnnotation._revAnnotationResStatus;
    env->SetIntField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnotationResStatus, _revAnnotationResStatus);

    char *_revAnnotationValue = revEntityAnnotation._revAnnotationValue;

    __android_log_print(ANDROID_LOG_ERROR, "MyApp", "_revAnnotationValue >>> %s", _revAnnotationValue);

    long _revAnnotationId = revEntityAnnotation._revAnnotationId;

    long _revAnnotationEntityGUID = revEntityAnnotation._revAnnotationEntityGUID;
    long _revAnnotationRemoteEntityGUID = revEntityAnnotation._revAnnotationRemoteEntityGUID;

    long _revAnnOwnerEntityGUID = revEntityAnnotation._revAnnOwnerEntityGUID;
    long _revAnnRemoteOwnerEntityGUID = revEntityAnnotation._revAnnRemoteOwnerEntityGUID;

    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnotationValue, env->NewStringUTF(_revAnnotationValue));

    jclass revJClassLong = (env)->FindClass("java/lang/Long");
    jmethodID revLongMethodId = env->GetMethodID(revJClassLong, "<init>", "(J)V");

    jobject _revAnnotationId_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revAnnotationId);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnotationId, _revAnnotationId_Obj);
    env->DeleteLocalRef(_revAnnotationId_Obj);

    jobject _revAnnotationEntityGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revAnnotationEntityGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnotationEntityGUID, _revAnnotationEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnotationEntityGUID_Obj);

    jobject _revAnnotationRemoteEntityGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revAnnotationRemoteEntityGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnotationRemoteEntityGUID, _revAnnotationRemoteEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnotationRemoteEntityGUID_Obj);

    jobject _revAnnOwnerEntityGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revAnnOwnerEntityGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnOwnerEntityGUID, _revAnnOwnerEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnOwnerEntityGUID_Obj);

    jobject _revAnnRemoteOwnerEntityGUID_Obj = env->NewObject(revJClassLong, revLongMethodId, (long long) _revAnnRemoteOwnerEntityGUID);
    env->SetObjectField(revJPosRec, rev_entity_annotation_jni_posrec->_revAnnRemoteOwnerEntityGUID, _revAnnRemoteOwnerEntityGUID_Obj);
    env->DeleteLocalRef(_revAnnRemoteOwnerEntityGUID_Obj);

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

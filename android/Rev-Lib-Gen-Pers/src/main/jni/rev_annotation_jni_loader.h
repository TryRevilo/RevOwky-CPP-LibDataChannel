//
// Created by home on 2019-09-12.
//

#ifndef REVCAMPANN_REV_ANNOTATION_JNI_LOADER_H
#define REVCAMPANN_REV_ANNOTATION_JNI_LOADER_H

#include "rev_pers_jni_structs.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_db_models/rev_entity_annotation.h"

extern REV_ENTITY_ANNOTATION_JNI_POSREC *rev_entity_annotation_jni_posrec;

REV_ENTITY_ANNOTATION_JNI_POSREC *LoadRevEntityAnnotationJniPosRec(JNIEnv *env);

void FillDataRecValuesToRevAnnotationJni(JNIEnv *env, jobject jPosRec, RevEntityAnnotation revEntityAnnotation);

#endif //REVCAMPANN_REV_ANNOTATION_JNI_LOADER_H

//
// Created by rev on 10/2/18.
//

#ifndef REVCAMPANN_REV_PERS_LIB_READ_H
#define REVCAMPANN_REV_PERS_LIB_READ_H

#include <jni.h>
#include "rev_pers_jni_structs.h"

extern "C" {
#include "../cpp/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
}

bool revPersGetRevEntityAnnotation(void *data);

REV_ENTITY_JNI_POSREC *revLoadRevEntityJniPosRec(JNIEnv *env);

void revFillDataRecValuesToJni(JNIEnv *env, jobject jPosRec, RevEntity *cPosRec, REV_ENTITY_JNI_POSREC *revEntityJniPosRec);

#endif //REVCAMPANN_REV_PERS_LIB_READ_H
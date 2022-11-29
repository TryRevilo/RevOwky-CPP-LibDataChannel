//
// Created by rev on 10/2/18.
//

#ifndef REVCAMPANN_REV_PERS_LIB_READ_H
#define REVCAMPANN_REV_PERS_LIB_READ_H

#include <jni.h>
#include "rev_pers_jni_structs.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"

bool revPersGetRevEntityAnnotation(void *data);

extern REV_ENTITY_JNI_POSREC *revEntityJniPosRec;

void LoadRevEntityJniPosRec(JNIEnv *env);

extern  void FillDataRecValuesToJni(JNIEnv *env, jobject jPosRec, RevEntity *cPosRec);

#endif //REVCAMPANN_REV_PERS_LIB_READ_H
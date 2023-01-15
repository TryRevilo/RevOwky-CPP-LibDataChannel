//
// Created by rev on 3/21/19.
//

#ifndef REVCAMPANN_REV_METADATA_JNI_LOADER_H
#define REVCAMPANN_REV_METADATA_JNI_LOADER_H

#include <jni.h>
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "rev_pers_jni_structs.h"

extern REV_ENTITY_METADATA_JNI_POSREC *revEntityMetadataJniPosRec;

REV_ENTITY_METADATA_JNI_POSREC *LoadRevEntityMetadataJniPosRec(JNIEnv *env);

void FillDataRecValuesToRevMetadataJni(JNIEnv *env, jobject jPosRec, RevEntityMetadata entityMetadata);

#endif //REVCAMPANN_REV_METADATA_JNI_LOADER_H

//
// Created by rev on 3/21/19.
//

#ifndef REVCAMPANN_REV_METADATA_JNI_LOADER_H
#define REVCAMPANN_REV_METADATA_JNI_LOADER_H

#include <jni.h>
#include "rev_pers_jni_structs.h"

extern "C" {
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
}

REV_ENTITY_METADATA_JNI_POSREC *LoadRevEntityMetadataJniPosRec(JNIEnv *env);

jobject revGetFilledRevMetadataJniObject(JNIEnv *env, RevEntityMetadata revEntityMetadata);

jobject revGetFilledRevMetadataJniObjectFromJsonStr(JNIEnv *env, const char *revEntityMetadataStr);

#endif //REVCAMPANN_REV_METADATA_JNI_LOADER_H

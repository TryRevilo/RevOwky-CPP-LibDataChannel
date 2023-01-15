//
// Created by home on 2019-08-17.
//

#include <jni.h>
#include "../../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"

#ifndef REVCAMPANN_REV_PERS_OBJECT_INIT_H
#define REVCAMPANN_REV_PERS_OBJECT_INIT_H

void revPersSetRevObjectEntityBaseMetadata(JNIEnv *env, jobject revEntity, RevEntity *c_revEntity);

#endif //REVCAMPANN_REV_PERS_OBJECT_INIT_H

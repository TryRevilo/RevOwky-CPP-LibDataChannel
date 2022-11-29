//
// Created by rev on 1/1/19.
//



#include <jni.h>
#include <android/log.h>

extern "C" {
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_pers_delete/rev_pers_delete.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_delete/rev_pers_rel_delete.h"
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_deleteRevEntityByEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {

    return deleteRevEntityByEntityGUID(revEntityGUID);

}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_deleteRevRel_1By_1Unset_1Subject_1Target_1GUID(
        JNIEnv *env, jobject instance, jlong revUnsetRelEntityGUID, jlong revUnsetRelEntityRemoteGUID) {

    return deleteRevRel_By_Unset_Subject_Target_GUID((long) revUnsetRelEntityGUID, (long) revUnsetRelEntityRemoteGUID);
}

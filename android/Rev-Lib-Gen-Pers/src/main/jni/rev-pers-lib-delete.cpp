//
// Created by rev on 1/1/19.
//



#include <jni.h>
#include <android/log.h>

extern "C" {
#include "../cpp/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_pers_delete/rev_pers_delete.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_delete/rev_pers_rel_delete.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_lib_delete/rev_pers_delete_rev_entity_annotations.h"
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_deleteRevRel_1By_1Unset_1Subject_1Target_1GUID(
        JNIEnv *env, jobject instance, jlong revUnsetRelEntityGUID, jlong revUnsetRelEntityRemoteGUID) {

    return deleteRevRel_By_Unset_Subject_Target_GUID((long) revUnsetRelEntityGUID, (long) revUnsetRelEntityRemoteGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revDeleteEntity_1By_1EntityGUID(JNIEnv *env, jobject thiz, jlong rev_entity_guid) {
    return revDeleteEntity_By_EntityGUID(rev_entity_guid);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revDeleteEntityAnnotation_1By_1AnnotationID(JNIEnv *env, jobject thiz, jlong rev_annotation_id) {
    return revDeleteEntityAnnotation_By_AnnotationID(rev_annotation_id);
}
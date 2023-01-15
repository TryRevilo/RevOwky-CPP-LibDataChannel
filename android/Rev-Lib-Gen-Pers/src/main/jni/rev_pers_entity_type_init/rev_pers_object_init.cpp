//
// Created by home on 2019-08-17.
//

#include <jni.h>
#include <string.h>
#include <android/log.h>
#include "rev_pers_object_init.h"
#include "../../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"

extern "C" {
#include <rev_linked_list.h>
};

void revPersSetRevObjectEntityBaseMetadata(JNIEnv *env, jobject revEntity, RevEntity *c_revEntity) {
    jclass revEntityClazz = env->GetObjectClass(revEntity);


    RevObjectEntity revObjectEntity;

    revObjectEntity._revOwnerEntityGUID = c_revEntity->_revOwnerEntityGUID;
    revObjectEntity._revContainerEntityGUID = c_revEntity->_revContainerEntityGUID;

    jmethodID getRevObjectEntity_MId = env->GetMethodID(revEntityClazz, "getRevObjectEntity",
                                                        "()Lrev/ca/rev_gen_lib_pers/RevDBModels/rev_entity_subtypes/RevObjectEntity;");
    jobject obj_RevObjectEntity = env->CallObjectMethod(revEntity, getRevObjectEntity_MId);

    jclass cls_RevObjectEntity = (env)->FindClass(
            "rev/ca/rev_gen_lib_pers/RevDBModels$rev_entity_subtypes$RevObjectEntity");

    /** ------------------------------------------------------------------------- **/

    jmethodID methodId_getName = (env)->GetMethodID(cls_RevObjectEntity, "get_revObjectName",
                                                    "()Ljava/lang/String;");

    jstring s_name = (jstring) env->CallObjectMethod(obj_RevObjectEntity, methodId_getName);

    if (s_name != NULL) {
        RevEntityMetadata revEntityMetadata;

        const char *char_name;
        char_name = env->GetStringUTFChars(s_name, 0);

        revEntityMetadata._metadataName = strdup("rev_object_name");
        revEntityMetadata._metadataValue = strdup(char_name);

        __android_log_print(ANDROID_LOG_ERROR, "RevApp", "DDDDD >>>> >> %s",
                            c_revEntity->_revEntitySubType);

        // list_append(&(c_revEntity->_revEntityMetadataList), &revEntityMetadata);

        env->ReleaseStringUTFChars(s_name, char_name);
    } else {
        __android_log_print(ANDROID_LOG_INFO, "MyApp", "objEntity char_desc :  %s\n", "no_call");
    }

    /** ------------------------------------------------------------------------- **/

    jmethodID methodId_get_revObjectDescription = (env)->GetMethodID(cls_RevObjectEntity,
                                                                     "get_revObjectDescription",
                                                                     "()Ljava/lang/String;");

    jstring s_desc = (jstring) env->CallObjectMethod(obj_RevObjectEntity,
                                                     methodId_get_revObjectDescription);

    if (s_desc != NULL) {
        const char *char_desc;

        RevEntityMetadata revEntityMetadata;

        char_desc = env->GetStringUTFChars(s_desc, 0);
        revObjectEntity._description = strdup(char_desc);

        revEntityMetadata._metadataName = strdup("rev_object_description");
        revEntityMetadata._metadataValue = strdup(char_desc);

        // list_append(&(c_revEntity->_revEntityMetadataList), &revEntityMetadata);

        __android_log_print(ANDROID_LOG_ERROR, "RevApp", "DDDDD >>>> >> %s",
                            c_revEntity->_revEntitySubType);

        env->ReleaseStringUTFChars(s_desc, char_desc);
    } else {
        __android_log_print(ANDROID_LOG_INFO, "MyApp", "char_desc :  %s\n", "no_call");
    }

    /** ------------------------------------------------------------------------- **/

    __android_log_print(ANDROID_LOG_ERROR, "RevApp", "AFTER >>>> >> %s",
                        c_revEntity->_revEntitySubType);

    // c_revEntity->_revObjectEntity = revObjectEntity;
}

//
// Created by rev on 5/16/18.
//

#include "rev-pers-lib-create.hpp"

#include <jni.h>
#include <android/log.h>

#include <string.h>
#include <vector>
#include <memory>

#include "../cpp/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_table_create.h"
#include "rev_pers_jni_structs.h"
#include "rev_metadata_jni_loader.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_db_models/rev_entity_annotation.h"
#include "rev_init_jni_lib.hpp"
#include "rev_pers_react_native_events.hpp"

using namespace std;

extern "C"
{
#include "../../../libs/rev_list/rev_linked_list.h"
#include "../cpp/rev_pers_lib/rev_db_init/rev_db_init.h"
#include "../cpp/rev_pers_lib/rev_pers_lib_connectors/rev_perslib_create_init.h"
#include "../cpp/rev_pers_lib/rev_entity/rev_pers_rev_entity/init_rev_pers_rev_entity.h"
#include "../cpp/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_pers_update/rev_pers_update.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_lib_create/rev_pers_create/rev_pers_annotation.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h"
#include "../cpp/rev_files/rev_curl_upload_file.h"
#include "../cpp/rev_gen_functions/rev_gen_functions.h"
#include "../cpp/rev_files/rev_gen_file_functions.h"
}

JavaVM *gJvm = nullptr;
static jobject gClassLoader;
static jmethodID gFindClassMethod;

using namespace std;

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *pjvm, void *reserved) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> Rev-Pers-Lib-Create >>> JNI_OnLoad <<<");

    gJvm = pjvm;  // cache the JavaVM pointer

    return JNI_VERSION_1_6;
}

JavaVM *revGetJVM() {
    return gJvm;
}

extern "C"
JNIEXPORT void JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_initRevDb(JNIEnv *env, jobject instance, jstring dirPath_) {
    const char *dirPath = env->GetStringUTFChars(dirPath_, 0);

    initRevDb(strdup(dirPath));

    env->ReleaseStringUTFChars(dirPath_, dirPath);
}

extern "C" JNIEXPORT void JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revTablesInit(JNIEnv *env, jobject instance) {
    revTablesInit();
}

list *revPersSetRevObjectEntityDescBaseMetadata(JNIEnv *env, jobject revEntity) {

    list revEntityMetadataList;
    list_new(&revEntityMetadataList, sizeof(RevEntityMetadata), NULL);

    jclass revEntityClazz = env->GetObjectClass(revEntity);

    // and the get_revEntityType() method
    jmethodID get_revEntityTypeMethodID = env->GetMethodID(revEntityClazz, "get_revEntityType", "()Ljava/lang/String;");

    // call the get_revEntityType() method
    jstring s_revEntityType = (jstring) env->CallObjectMethod(revEntity, get_revEntityTypeMethodID);

    if (s_revEntityType != NULL) {
        const char *char_revEntityType;
        char_revEntityType = env->GetStringUTFChars(s_revEntityType, 0);

        if (strcmp(char_revEntityType, "rev_object") == 0) {
        }
    }

    /** START GET REV ENTITY METADATA LISTS **/

    // initialize the Get Parameter Map method of the Container class
    jmethodID m_GetParameterMap = (env)->GetMethodID(revEntityClazz, "get_revEntityMetadataList", "()Ljava/util/List;");

    // call said method to store the parameter map in jParameterMap
    jobject jParameterMap = (env)->CallObjectMethod(revEntity, m_GetParameterMap);

    // retrieve the java.util.List interface class
    jclass cList = env->FindClass("java/util/List");

    // retrieve the size and the get method
    jmethodID mSize = env->GetMethodID(cList, "size", "()I");
    jmethodID mGet = env->GetMethodID(cList, "get", "(I)Ljava/lang/Object;");

    // get the size of the list
    jint size = env->CallIntMethod(jParameterMap, mSize);

    // walk through and fill the vector
    for (jint i = 0; i < size; i++) {
        jobject obj_RevEntityMetadata = (jstring) env->CallObjectMethod(jParameterMap, mGet, i);

        if (obj_RevEntityMetadata == NULL) {
            continue;
        }

        RevEntityMetadata revEntityMetadata;

        /** SET METADATA RESOLVE STATUS **/
        jmethodID get_resolveStatus_MID = env->GetMethodID(env->GetObjectClass(obj_RevEntityMetadata), "get_resolveStatus", "()I");
        long _resolveStatus = env->CallIntMethod(obj_RevEntityMetadata, get_resolveStatus_MID);
        revEntityMetadata._resolveStatus = _resolveStatus;

        /** End METADATA RESOLVE STATUS **/

        /** Start METADATA Name **/
        jmethodID methodId_get_revMetadataName = env->GetMethodID(env->GetObjectClass(obj_RevEntityMetadata), "get_revMetadataName", "()Ljava/lang/String;");
        jstring s_revMetadataName = (jstring) env->CallObjectMethod(obj_RevEntityMetadata, methodId_get_revMetadataName);

        if (s_revMetadataName != NULL) {
            const char *char_revMetadataName = env->GetStringUTFChars(s_revMetadataName, 0);
            revEntityMetadata._metadataName = strdup(char_revMetadataName);
            env->ReleaseStringUTFChars(s_revMetadataName, char_revMetadataName);
        }

        /** End METADATA Name **/

        /** Start METADATA Value **/
        jmethodID methodId_get_metadataValue = env->GetMethodID(env->GetObjectClass(obj_RevEntityMetadata), "get_metadataValue", "()Ljava/lang/String;");
        jstring s_metadataValue = (jstring) env->CallObjectMethod(obj_RevEntityMetadata, methodId_get_metadataValue);

        if (s_metadataValue != NULL) {
            const char *char_metadataValue = env->GetStringUTFChars(s_metadataValue, 0);
            revEntityMetadata._metadataValue = strdup(char_metadataValue);
            env->ReleaseStringUTFChars(s_metadataValue, char_metadataValue);
        }

        /** End METADATA Value **/

        /** SET REMOTE METADATA ID **/

        jclass clsLong = (env)->FindClass("java/lang/Long");
        jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

        jmethodID methodId_getRemoteRevMetadataId = env->GetMethodID(env->GetObjectClass(obj_RevEntityMetadata), "getRemoteRevMetadataId", "()Ljava/lang/Long;");
        jobject revRemoteRevMetadataId_JOB = env->CallObjectMethod(obj_RevEntityMetadata, methodId_getRemoteRevMetadataId);
        long remoteRevMetadataId = (env)->CallLongMethod(revRemoteRevMetadataId_JOB, longGetLongValue);

        if (remoteRevMetadataId > 0) {
            revEntityMetadata._remoteRevMetadataId = remoteRevMetadataId;
        } else {
            revEntityMetadata._remoteRevMetadataId = -1l;
        }

        /** SET REV CREATED DATE TIME **/
        jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityClazz, "get_revTimeCreated", "()J");
        long _revTimeCreated = (env)->CallLongMethod(revEntity, get_revTimeCreated_MID);
        revEntityMetadata._revTimeCreated = _revTimeCreated;

        /** SET REV TIME PUBLISHED TIME **/
        jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityClazz, "get_revTimePublished", "()J");
        long _revTimePublished = (env)->CallLongMethod(revEntity, get_revTimePublished_MID);
        revEntityMetadata._revTimePublished = _revTimePublished;

        /** SET PUBLISHED UPDATED TIME **/
        jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityClazz, "get_revTimePublishedUpdated", "()J");
        long _revTimePublishedUpdated = (env)->CallLongMethod(revEntity, get_revTimePublishedUpdated_MID);
        revEntityMetadata._revTimePublishedUpdated = _revTimePublishedUpdated;

        /** END REV SETS**/

        list_append(&revEntityMetadataList, &revEntityMetadata);

        env->DeleteLocalRef(obj_RevEntityMetadata);
    }

    return &revEntityMetadataList;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersInit(JNIEnv *env, jobject instance, jobject revEntity) {

    init_rev_pers_rev_entity();

    long lastDbEntry;

    jclass revEntityClazz = env->GetObjectClass(revEntity);

    RevEntity c_revEntity;

    /** Longs Class **/

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    /** SET REMOTE ENTITY GUID **/
    jmethodID get_remoteRevEntityGUID_MID = env->GetMethodID(revEntityClazz, "get_remoteRevEntityGUID", "()Ljava/lang/Long;");
    jobject remoteRevEntityGUID_JOB = env->CallObjectMethod(revEntity, get_remoteRevEntityGUID_MID);
    long remoteRevEntityGUID = (env)->CallLongMethod(remoteRevEntityGUID_JOB, longGetLongValue);

    c_revEntity._remoteRevEntityGUID = remoteRevEntityGUID;

    /** SET ENTITY RESOLVE STATUS **/
    jmethodID get_revEntityResolveStatus_MID = env->GetMethodID(revEntityClazz, "get_revEntityResolveStatus", "()I");
    int revEntityResolveStatus = env->CallIntMethod(revEntity, get_revEntityResolveStatus_MID);

    c_revEntity._revEntityResolveStatus = revEntityResolveStatus;

    /** SET ENTITY CHILDABLE STATUS **/
    jmethodID get_revEntityChildableStatus_MID = env->GetMethodID(revEntityClazz, "get_revEntityChildableStatus", "()I");
    int revEntityChildableStatus = env->CallIntMethod(revEntity, get_revEntityChildableStatus_MID);

    c_revEntity._revEntityChildableStatus = revEntityChildableStatus;

    /** SET OWNER ENTITY GUID **/
    jmethodID get_revEntityOwnerGUID__MID = env->GetMethodID(revEntityClazz, "get_revEntityOwnerGUID", "()Ljava/lang/Long;");
    jobject revEntityOwnerGUID_JOB = env->CallObjectMethod(revEntity, get_revEntityOwnerGUID__MID);
    long revEntityOwnerGUID = (env)->CallLongMethod(revEntityOwnerGUID_JOB, longGetLongValue);

    c_revEntity._revOwnerEntityGUID = revEntityOwnerGUID;

    /** SET REV CONTAINER ENTITY GUID **/
    jmethodID get_revEntityContainerGUID_MID = env->GetMethodID(revEntityClazz, "get_revEntityContainerGUID", "()Ljava/lang/Long;");
    jobject revEntityContainerGUID_JOB = env->CallObjectMethod(revEntity, get_revEntityContainerGUID_MID);
    long revEntityContainerGUID = (env)->CallLongMethod(revEntityContainerGUID_JOB, longGetLongValue);

    c_revEntity._revContainerEntityGUID = revEntityContainerGUID;

    /** SET REV SITE ENTITY GUID **/
    jmethodID get_revEntitySiteGUID_MID = env->GetMethodID(revEntityClazz, "get_revEntitySiteGUID",
                                                           "()Ljava/lang/Long;");
    jobject revEntitySiteGUID_JOB = env->CallObjectMethod(revEntity, get_revEntitySiteGUID_MID);
    long revEntitySiteGUID = (env)->CallLongMethod(revEntitySiteGUID_JOB, longGetLongValue);

    c_revEntity._revEntitySiteGUID = revEntitySiteGUID;

    /** SET REV ACCESS PERMISSION **/
    jmethodID get_revEntityAccessPermission_MID = env->GetMethodID(revEntityClazz, "get_revEntityAccessPermission", "()I");
    long revEntityAccessPermission = env->CallIntMethod(revEntity, get_revEntityAccessPermission_MID);

    c_revEntity._revEntityAccessPermission = revEntityAccessPermission;

    /** START Set Rev Entity Struct Type / Sub **/

    const char *char_revEntityType;
    const char *char_revEntitySubType;

    // and the get_revEntityType() method
    jmethodID get_revEntityTypeMethodID = env->GetMethodID(revEntityClazz, "get_revEntityType", "()Ljava/lang/String;");

    // and the get_revEntitySubType() method
    jmethodID get_revEntitySubTypeMethodID = env->GetMethodID(revEntityClazz, "get_revEntitySubType", "()Ljava/lang/String;");

    if ((env)->ExceptionCheck()) {
        __android_log_print(ANDROID_LOG_INFO, "MyApp", "EMPTY SUB-TYPE EXCEPTION CHECK");
    }

    // call the get_revEntityType() method
    jstring s_revEntityType = (jstring) env->CallObjectMethod(revEntity, get_revEntityTypeMethodID);

    // call the get_revEntitySubType() method
    jstring s_revEntitySubType = (jstring) env->CallObjectMethod(revEntity, get_revEntitySubTypeMethodID);

    jclass cls_String = (env)->FindClass("java/lang/String");
    jmethodID isEmptyMethodId = (env)->GetMethodID(cls_String, "isEmpty", "()Z");

    if (s_revEntityType != NULL) {
        char_revEntityType = env->GetStringUTFChars(s_revEntityType, 0);
        c_revEntity._revEntityType = strdup(char_revEntityType);
    }

    if (s_revEntitySubType != NULL) {
        jboolean isSubTypeEmpty = (env)->CallBooleanMethod(s_revEntitySubType, isEmptyMethodId);
        if (!isSubTypeEmpty) {
            char_revEntitySubType = env->GetStringUTFChars(s_revEntitySubType, 0);
            c_revEntity._revEntitySubType = strdup(char_revEntitySubType);
        }
    }

    /** SET REV CREATED DATE TIME **/
    jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityClazz, "get_revTimeCreated", "()J");
    long _revTimeCreated = (env)->CallLongMethod(revEntity, get_revTimeCreated_MID);
    c_revEntity._revTimeCreated = _revTimeCreated;

    /** SET REV TIME PUBLISHED TIME **/
    jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityClazz, "get_revTimePublished", "()J");
    long _revTimePublished = (env)->CallLongMethod(revEntity, get_revTimePublished_MID);
    c_revEntity._revTimePublished = _revTimePublished;

    /** SET PUBLISHED UPDATED TIME **/
    jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityClazz, "get_revTimePublishedUpdated", "()J");
    long _revTimePublishedUpdated = (env)->CallLongMethod(revEntity, get_revTimePublishedUpdated_MID);
    c_revEntity._revTimePublishedUpdated = _revTimePublishedUpdated;

    /** END REV SETS**/

    c_revEntity._revEntityMetadataList = *(revPersSetRevObjectEntityDescBaseMetadata(env, revEntity));

    lastDbEntry = revPersInit(&c_revEntity);

    return lastDbEntry;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersInitJSON(JNIEnv *env, jobject instance, jstring revJSONEntity_) {
    const char *revJSONEntity = env->GetStringUTFChars(revJSONEntity_, 0);

    RevEntity *revEntity = revJSONEntityFiller(revJSONEntity);

    long lastDbEntry = revPersInit(revEntity);

    __android_log_print(ANDROID_LOG_FATAL, "MyApp", ">>> lastDbEntry : %ld", lastDbEntry);

    return lastDbEntry;
}

/** REV ENTITY METADATA **/

std::vector<RevEntityMetadata> searchRecordResultRevEntityMetadata;

bool revPersGetRevEntityMetadata(void *data) {
    searchRecordResultRevEntityMetadata.push_back(*(RevEntityMetadata *) data);
    return true;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revSaveRevEntityMetadataList(JNIEnv *env, jobject instance, jobject revEntityMetadataList) {

    // retrieve the java.util.List interface class
    jclass cList = env->FindClass("java/util/List");

    // retrieve the size and the get method
    jmethodID mSize = env->GetMethodID(cList, "size", "()I");
    jmethodID mGet = env->GetMethodID(cList, "get", "(I)Ljava/lang/Object;");

    if (mSize == NULL || mGet == NULL)
        return NULL;

    // get the size of the list
    jint size = env->CallIntMethod(revEntityMetadataList, mSize);
    std::vector<jobject> searchRecordResultRevEntityMetadataJObject;

    // walk through and fill the vector
    for (jint i = 0; i < size; i++) {
        jobject revEntityMetadata_jobject = env->CallObjectMethod(revEntityMetadataList, mGet, i);
        searchRecordResultRevEntityMetadataJObject.push_back(revEntityMetadata_jobject);
    }

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

    // print the vector
    for (int i = 0; i < searchRecordResultRevEntityMetadataJObject.size(); i++) {
        jobject obj_RevEntityMetadata = searchRecordResultRevEntityMetadataJObject[i];

        if (obj_RevEntityMetadata == NULL) {
            continue;
        }

        jclass revEntityMetadataClazz = env->GetObjectClass(obj_RevEntityMetadata);

        RevEntityMetadata revEntityMetadata;

        /** SET METADATA RESOLVE STATUS **/

        jmethodID get_resolveStatus_MID = env->GetMethodID(revEntityMetadataClazz, "get_resolveStatus", "()I");
        long _resolveStatus = env->CallIntMethod(obj_RevEntityMetadata, get_resolveStatus_MID);

        revEntityMetadata._resolveStatus = _resolveStatus;

        /** End METADATA RESOLVE STATUS **/

        /** Start METADATA Name **/

        jmethodID methodId_get_revMetadataName = env->GetMethodID(revEntityMetadataClazz, "get_revMetadataName", "()Ljava/lang/String;");
        jstring s_revMetadataName = (jstring) env->CallObjectMethod(obj_RevEntityMetadata, methodId_get_revMetadataName);

        if (s_revMetadataName != NULL) {
            const char *char_revMetadataName = env->GetStringUTFChars(s_revMetadataName, 0);
            revEntityMetadata._metadataName = strdup(char_revMetadataName);
            env->ReleaseStringUTFChars(s_revMetadataName, char_revMetadataName);
        }

        /** End METADATA Name **/

        /** Start METADATA Value **/

        jmethodID methodId_get_metadataValue = env->GetMethodID(revEntityMetadataClazz, "get_metadataValue", "()Ljava/lang/String;");
        jstring s_metadataValue = (jstring) env->CallObjectMethod(obj_RevEntityMetadata, methodId_get_metadataValue);

        if (s_metadataValue != NULL) {
            const char *char_metadataValue = env->GetStringUTFChars(s_metadataValue, 0);
            revEntityMetadata._metadataValue = strdup(char_metadataValue);
            env->ReleaseStringUTFChars(s_metadataValue, char_metadataValue);
        }

        /** End METADATA Value **/

        jclass clsLong = (env)->FindClass("java/lang/Long");
        jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

        /** Start METADATA Owner GUID **/

        jmethodID methodId_getRevMetadataOwnerGUID = env->GetMethodID(revEntityMetadataClazz, "getRevMetadataOwnerGUID", "()Ljava/lang/Long;");
        jobject revEntityMetadataOwnerGUID_JOB = env->CallObjectMethod(obj_RevEntityMetadata, methodId_getRevMetadataOwnerGUID);
        long revEntityMetadataOwnerGUID = (env)->CallLongMethod(revEntityMetadataOwnerGUID_JOB, longGetLongValue);

        if (revEntityMetadataOwnerGUID > 0) {
            revEntityMetadata._metadataOwnerGUID = revEntityMetadataOwnerGUID;
        }

        /** End METADATA CONTAINER ENTITY GUID **/

        revEntityMetadata._metadataId = revPersSaveRevEntityMetadata(&revEntityMetadata);

        list_append(&list, &revEntityMetadata);

        env->DeleteLocalRef(obj_RevEntityMetadata);
    }

    /** LOAD RET ARRAY LIST **/

    revPersSaveRevMetadata(&list);

    REV_ENTITY_METADATA_JNI_POSREC *revEntityMetadataJniPosRec = LoadRevEntityMetadataJniPosRec(env);

    list_for_each(&list, revPersGetRevEntityMetadata);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject retRevJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list_for_each(&list, revPersGetRevEntityMetadata);

    for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
        env->CallBooleanMethod(retRevJObjectArrayList, addMethod, jPosRec);
        env->DeleteLocalRef(jPosRec);
    }

    searchRecordResultRevEntityMetadataJObject.clear();

    return retRevJObjectArrayList;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revSaveRevEntityMetadata(JNIEnv *env, jobject instance, jobject revEntityMetadata) {

    jclass revEntityMetadataClazz = env->GetObjectClass(revEntityMetadata);

    RevEntityMetadata c_revEntityMetadata;

    /** SET METADATA RESOLVE STATUS **/
    jmethodID get_resolveStatus_MID = env->GetMethodID(revEntityMetadataClazz, "get_resolveStatus", "()I");
    long _resolveStatus = env->CallIntMethod(revEntityMetadata, get_resolveStatus_MID);
    c_revEntityMetadata._resolveStatus = _resolveStatus;

    /** End METADATA RESOLVE STATUS **/

    /** Start METADATA Name **/
    jmethodID methodId_get_revMetadataName = env->GetMethodID(revEntityMetadataClazz, "get_revMetadataName", "()Ljava/lang/String;");
    jstring s_revMetadataName = (jstring) env->CallObjectMethod(revEntityMetadata, methodId_get_revMetadataName);

    if (s_revMetadataName != NULL) {
        const char *char_revMetadataName = env->GetStringUTFChars(s_revMetadataName, 0);
        c_revEntityMetadata._metadataName = strdup(char_revMetadataName);
        env->ReleaseStringUTFChars(s_revMetadataName, char_revMetadataName);
    }

    /** End METADATA Name **/

    /** Start METADATA Value **/
    jmethodID methodId_get_metadataValue = env->GetMethodID(revEntityMetadataClazz, "get_metadataValue", "()Ljava/lang/String;");
    jstring s_metadataValue = (jstring) env->CallObjectMethod(revEntityMetadata, methodId_get_metadataValue);

    if (s_metadataValue != NULL) {
        const char *char_metadataValue = env->GetStringUTFChars(s_metadataValue, 0);
        c_revEntityMetadata._metadataValue = strdup(char_metadataValue);
        env->ReleaseStringUTFChars(s_metadataValue, char_metadataValue);
    }

    /** End METADATA Value **/

    /** SET REMOTE METADATA ID **/

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    jmethodID methodId_getRemoteRevMetadataId = env->GetMethodID(revEntityMetadataClazz,
                                                                 "getRemoteRevMetadataId",
                                                                 "()Ljava/lang/Long;");
    jobject revRemoteRevMetadataId_JOB = env->CallObjectMethod(revEntityMetadata, methodId_getRemoteRevMetadataId);
    long remoteRevMetadataId = (env)->CallLongMethod(revRemoteRevMetadataId_JOB, longGetLongValue);

    if (remoteRevMetadataId > 0) {
        c_revEntityMetadata._remoteRevMetadataId = remoteRevMetadataId;
    } else {
        c_revEntityMetadata._remoteRevMetadataId = -1l;
    }

    /** End REMOTE METADATA ID **/

    /** Start METADATA Owner GUID **/

    jmethodID methodId_getRevMetadataOwnerGUID = env->GetMethodID(revEntityMetadataClazz,
                                                                  "getRevMetadataOwnerGUID",
                                                                  "()Ljava/lang/Long;");
    jobject revEntityMetadataOwnerGUID_JOB = env->CallObjectMethod(revEntityMetadata,
                                                                   methodId_getRevMetadataOwnerGUID);
    long revEntityMetadataOwnerGUID = (env)->CallLongMethod(revEntityMetadataOwnerGUID_JOB,
                                                            longGetLongValue);

    if (revEntityMetadataOwnerGUID > 0) {
        c_revEntityMetadata._metadataOwnerGUID = revEntityMetadataOwnerGUID;
    }

    /** End METADATA CONTAINER ENTITY GUID **/

    env->DeleteLocalRef(revEntityMetadata);

    return revPersSaveRevEntityMetadata(&c_revEntityMetadata);
}

/** END REV ENTITY METADATA **/

/** REV RELATIONSHIP **/

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRelationship(JNIEnv *env, jobject instance, jobject revEntityRelationship) {

    RevEntityRelationship c_RevEntityRelationship;

    jclass revEntityRelationshipClazz = env->GetObjectClass(revEntityRelationship);

    /** START Set Rev Entity Struct Type / Sub **/

    const char *char_revEntityRelationshipType;

    // and the get_revEntityType() method
    jmethodID get_revEntityRelationshipType_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revEntityRelationshipType", "()Ljava/lang/String;");

    if ((env)->ExceptionCheck()) {
        __android_log_print(ANDROID_LOG_INFO, "MyApp", "EMPTY");
    }

    // call the get_revEntityType() method
    jstring s_revEntityRelationshipType = (jstring) env->CallObjectMethod(revEntityRelationship,
                                                                          get_revEntityRelationshipType_MethodID);

    jclass cls_String = (env)->FindClass("java/lang/String");
    jmethodID isEmptyMethodId = (env)->GetMethodID(cls_String, "isEmpty", "()Z");

    if (s_revEntityRelationshipType != NULL) {
        char_revEntityRelationshipType = env->GetStringUTFChars(s_revEntityRelationshipType, 0);
        c_RevEntityRelationship._revEntityRelationshipType = strdup(char_revEntityRelationshipType);
    }

    /** ------------------------------------------------------------------------- **/

    /** Longs Class **/

    jclass clsLong = (env)->FindClass("java/lang/Long");

    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    /** START GET SUBJECT GUID **/

    jmethodID get_revEntitySubjectGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revEntitySubjectGUID", "()Ljava/lang/Long;");
    jobject subjectGUID = env->CallObjectMethod(revEntityRelationship, get_revEntitySubjectGUID_MethodID);
    long revEntitySubjectGUID = (env)->CallLongMethod(subjectGUID, longGetLongValue);

    c_RevEntityRelationship._revEntitySubjectGUID = revEntitySubjectGUID;

    /** END GET SUBJECT GUID **/

    /** START GET REMOTE SUBJECT GUID **/

    jmethodID get_remoteRevevEntitySubjectGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_remoteRevEntitySubjectGUID", "()Ljava/lang/Long;");
    jobject _remoteRevevEntitySubjectGUID_JOB = env->CallObjectMethod(revEntityRelationship, get_remoteRevevEntitySubjectGUID_MethodID);
    long _remoteRevevEntitySubjectGUID = (env)->CallLongMethod(_remoteRevevEntitySubjectGUID_JOB, longGetLongValue);

    c_RevEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;

    /** END GET REMOTE SUBJECT GUID **/

    /** START GET TARGET GUID **/

    jmethodID get_revEntityTargetGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revEntityTargetGUID", "()Ljava/lang/Long;");
    jobject targetGUID_JOB = env->CallObjectMethod(revEntityRelationship, get_revEntityTargetGUID_MethodID);
    long revEntityTargetGUID = (env)->CallLongMethod(targetGUID_JOB, longGetLongValue);

    c_RevEntityRelationship._revEntityTargetGUID = revEntityTargetGUID;

    /** END GET TARGET GUID **/

    /** START GET REMOTE TARGET GUID **/

    jmethodID get_remoteRevEntityTargetGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_remoteRevEntityTargetGUID", "()Ljava/lang/Long;");
    jobject _remoteRevEntityTargetGUID_JOB = env->CallObjectMethod(revEntityRelationship, get_remoteRevEntityTargetGUID_MethodID);

    long _remoteRevEntityTargetGUID = (env)->CallLongMethod(_remoteRevEntityTargetGUID_JOB, longGetLongValue);

    c_RevEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

    /** END GET REMOTE TARGET GUID **/

    /** START GET RESOLVE STATUS **/

    jmethodID get_revResolveStatus_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revResolveStatus", "()I");

    jint _revResolveStatus = env->CallIntMethod(revEntityRelationship, get_revResolveStatus_MethodID);

    c_RevEntityRelationship._revResolveStatus = _revResolveStatus;

    /** END GET RESOLVE STATUS **/

    /** START GET REMOTE VALUE ID GUID **/

    jmethodID get_remoteRevEntityRelationshipId_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_remoteRevEntityRelationshipId", "()Ljava/lang/Long;");
    jobject remoteRevEntityRelationshipId_Obj = env->CallObjectMethod(revEntityRelationship, get_remoteRevEntityRelationshipId_MethodID);
    long _remoteRevEntityRelationshipId = (env)->CallLongMethod(remoteRevEntityRelationshipId_Obj, longGetLongValue);

    c_RevEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

    /** END GET REMOTE VALUE ID **/

    /** SET REV CREATED DATE TIME **/
    jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityRelationshipClazz, "get_revTimeCreated", "()J");
    long _revTimeCreated = (env)->CallLongMethod(revEntityRelationship, get_revTimeCreated_MID);
    c_RevEntityRelationship._revTimeCreated = _revTimeCreated;

    /** SET REV TIME PUBLISHED TIME **/
    jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityRelationshipClazz, "get_revTimePublished", "()J");
    long _revTimePublished = (env)->CallLongMethod(revEntityRelationship, get_revTimePublished_MID);
    c_RevEntityRelationship._revTimePublished = _revTimePublished;

    /** SET PUBLISHED UPDATED TIME **/
    jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityRelationshipClazz, "get_revTimePublishedUpdated", "()J");
    long _revTimePublishedUpdated = (env)->CallLongMethod(revEntityRelationship, get_revTimePublishedUpdated_MID);
    c_RevEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

    /** END REV SETS**/

    long relationshipId = revPersRelationshipObject(&c_RevEntityRelationship);

    env->ReleaseStringUTFChars(s_revEntityRelationshipType, char_revEntityRelationshipType);

    return relationshipId;
}

extern "C"
JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRelationshipJSON(JNIEnv *env, jobject thiz, jstring rev_jsonentity_relationship) {
    const char *revJSONEntityRelationship = env->GetStringUTFChars(rev_jsonentity_relationship, 0);

    RevEntityRelationship *revEntityRelationship = revJSONEntityRelationshipFiller(revJSONEntityRelationship);

    long relationshipId = revPersRelationshipObject(revEntityRelationship);

    return relationshipId;
}

/** REV ANNOTATION **/

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRevEntityAnnotation(JNIEnv *env, jobject instance, jobject revAnnotation) {

    RevEntityAnnotation c_RevAnnotation;

    jclass revEntityAnnotationClazz = env->GetObjectClass(revAnnotation);

    /** START GET RESOLVE STATUS **/

    jmethodID get_revAnnotationResStatus_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationResStatus", "()I");
    jint _revResolveStatus = env->CallIntMethod(revAnnotation, get_revAnnotationResStatus_MethodID);

    c_RevAnnotation._revAnnotationResStatus = _revResolveStatus;

    /** START GET RESOLVE STATUS **/

    /** END GET REV ANN NAME ID **/

    jmethodID get_revAnnotationNameId_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationNameId", "()I");
    jint _revAnnotationNameId = env->CallIntMethod(revAnnotation, get_revAnnotationNameId_MethodID);

    c_RevAnnotation._revAnnotationNameId = (int) _revAnnotationNameId;

    /** END GET REV ANN NAME ID **/

    /** START Set Rev Entity Annotation Name **/

    const char *char_revAnnotationName;

    jmethodID get_revAnnotationName_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationName", "()Ljava/lang/String;");
    jstring s_revAnnotationName = (jstring) env->CallObjectMethod(revAnnotation, get_revAnnotationName_MethodID);

    if (s_revAnnotationName != NULL) {
        char_revAnnotationName = env->GetStringUTFChars(s_revAnnotationName, 0);
        c_RevAnnotation._revAnnotationName = strdup(char_revAnnotationName);
    }

    /** ------------------------------------------------------------------------- **/

    /** START Set Rev Entity Annotation Value **/

    const char *char_revAnnotationValue;

    jmethodID get_revAnnotationValue_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationValue", "()Ljava/lang/String;");
    jstring s_revAnnotationValue = (jstring) env->CallObjectMethod(revAnnotation, get_revAnnotationValue_MethodID);

    if (s_revAnnotationValue != NULL) {
        char_revAnnotationValue = env->GetStringUTFChars(s_revAnnotationValue, 0);
        c_RevAnnotation._revAnnotationValue = strdup(char_revAnnotationValue);
    }

    /** ------------------------------------------------------------------------- **/

    /** Longs Class **/

    jclass clsLong = (env)->FindClass("java/lang/Long");

    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    /** START GET REMOTE ANN ID **/

    jmethodID get_revAnnotationRemoteId_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationRemoteId", "()Ljava/lang/Long;");
    jobject _revAnnotationRemoteId_JObj = env->CallObjectMethod(revAnnotation, get_revAnnotationRemoteId_MethodID);
    long _revAnnotationRemoteId = (env)->CallLongMethod(_revAnnotationRemoteId_JObj, longGetLongValue);

    c_RevAnnotation._revAnnotationRemoteId = _revAnnotationRemoteId;

    /** END GET REMOTE ANN ID  **/

    /** START GET REV ENTITY GUID **/

    jmethodID get_revAnnotationEntityGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationEntityGUID", "()Ljava/lang/Long;");
    jobject _revAnnotationEntityGUID_JObj = env->CallObjectMethod(revAnnotation, get_revAnnotationEntityGUID_MethodID);
    long _revAnnotationEntityGUID = (env)->CallLongMethod(_revAnnotationEntityGUID_JObj, longGetLongValue);

    c_RevAnnotation._revAnnotationEntityGUID = _revAnnotationEntityGUID;

    /** END GET REV ENTITY GUID **/

    /** START GET REMOTE REV ENTITY GUID **/

    jmethodID get_revAnnotationRemoteEntityGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnotationRemoteEntityGUID", "()Ljava/lang/Long;");
    jobject _revAnnotationRemoteEntityGUID_JObj = env->CallObjectMethod(revAnnotation, get_revAnnotationRemoteEntityGUID_MethodID);
    long _revAnnotationRemoteEntityGUID = (env)->CallLongMethod(_revAnnotationRemoteEntityGUID_JObj, longGetLongValue);

    c_RevAnnotation._revAnnotationRemoteEntityGUID = _revAnnotationRemoteEntityGUID;

    /** END GET REMOTE REV ENTITY GUID **/

    /** START GET ANN OWNER ENTITY GUID **/

    jmethodID get_revAnnOwnerEntityGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnOwnerEntityGUID", "()Ljava/lang/Long;");
    jobject _revAnnOwnerEntityGUID_JObj = env->CallObjectMethod(revAnnotation, get_revAnnOwnerEntityGUID_MethodID);

    long _revAnnOwnerEntityGUID = (env)->CallLongMethod(_revAnnOwnerEntityGUID_JObj, longGetLongValue);

    c_RevAnnotation._revAnnOwnerEntityGUID = _revAnnOwnerEntityGUID;

    /** END GET ANN OWNER ENTITY GUID **/

    /** START GET REMOTE ANN OWNER ENTITY GUID **/

    jmethodID get_revAnnRemoteOwnerEntityGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revAnnRemoteOwnerEntityGUID", "()Ljava/lang/Long;");
    jobject _revAnnRemoteOwnerEntityGUID_JObj = env->CallObjectMethod(revAnnotation, get_revAnnRemoteOwnerEntityGUID_MethodID);

    long _revAnnRemoteOwnerEntityGUID = (env)->CallLongMethod(_revAnnRemoteOwnerEntityGUID_JObj, longGetLongValue);

    c_RevAnnotation._revAnnRemoteOwnerEntityGUID = _revAnnRemoteOwnerEntityGUID;

    /** END GET REMOTE ANN OWNER ENTITY GUID **/

    /** SET REV CREATED DATE TIME **/
    jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityAnnotationClazz, "get_revTimeCreated", "()J");
    long _revTimeCreated = (env)->CallLongMethod(revAnnotation, get_revTimeCreated_MID);
    c_RevAnnotation._revTimeCreated = _revTimeCreated;

    /** SET REV TIME PUBLISHED TIME **/
    jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityAnnotationClazz, "get_revTimePublished", "()J");
    long _revTimePublished = (env)->CallLongMethod(revAnnotation, get_revTimePublished_MID);
    c_RevAnnotation._revTimePublished = _revTimePublished;

    /** SET PUBLISHED UPDATED TIME **/
    jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityAnnotationClazz, "get_revTimePublishedUpdated", "()J");
    long _revTimePublishedUpdated = (env)->CallLongMethod(revAnnotation, get_revTimePublishedUpdated_MID);
    c_RevAnnotation._revTimePublishedUpdated = _revTimePublishedUpdated;

    /** END REV SETS**/

    long revAnnId = revPersAnnotationStruct(&c_RevAnnotation);

    env->ReleaseStringUTFChars(s_revAnnotationName, char_revAnnotationName);
    env->ReleaseStringUTFChars(s_revAnnotationValue, char_revAnnotationValue);

    return revAnnId;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRevEntityAnnotationWithValues(JNIEnv *env, jobject instance, jstring _revAnnotationName_, jstring _revAnnotationValue_, jlong _revEntityGUID, jlong _ownerEntityGUID) {
    const char *_revAnnotationName = env->GetStringUTFChars(_revAnnotationName_, 0);
    const char *_revAnnotationValue = env->GetStringUTFChars(_revAnnotationValue_, 0);

    long revAnnotationId = revPersAnnotation(strdup(_revAnnotationName), strdup(_revAnnotationValue), (long) _revEntityGUID, (long) _ownerEntityGUID);

    env->ReleaseStringUTFChars(_revAnnotationName_, _revAnnotationName);
    env->ReleaseStringUTFChars(_revAnnotationValue_, _revAnnotationValue);

    return revAnnotationId;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revCopyFile(JNIEnv *env, jobject thiz, jstring rev_source_path, jstring rev_dest_path) {
    const char *revSourcePath = env->GetStringUTFChars(rev_source_path, NULL);
    const char *revDestPath = env->GetStringUTFChars(rev_dest_path, NULL);

    int revRetVal = revCopyFile(revSourcePath, revDestPath);

    env->ReleaseStringUTFChars(rev_source_path, revSourcePath);
    env->ReleaseStringUTFChars(rev_dest_path, revDestPath);

    return revRetVal;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revCopyFileAsync(JNIEnv *env, jobject thiz, jstring rev_source_path, jstring rev_dest_path) {
    const char *revSourcePath = env->GetStringUTFChars(rev_source_path, NULL);
    const char *revDestPath = env->GetStringUTFChars(rev_dest_path, NULL);

    revCopyFileAsync(revSourcePath, revDestPath);

    env->ReleaseStringUTFChars(rev_source_path, revSourcePath);
    env->ReleaseStringUTFChars(rev_dest_path, revDestPath);

    return 0;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revCopyFile_1MemoryMapped(JNIEnv *env, jobject thiz, jstring rev_source_path, jstring rev_dest_path) {
    const char *revSourcePath = env->GetStringUTFChars(rev_source_path, NULL);
    const char *revDestPath = env->GetStringUTFChars(rev_dest_path, NULL);

    int revRetVal = revCopyFile_MemoryMapped(revSourcePath, revDestPath);

    env->ReleaseStringUTFChars(rev_source_path, revSourcePath);
    env->ReleaseStringUTFChars(rev_dest_path, revDestPath);

    return revRetVal;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revCopyFileCURL(JNIEnv *env, jobject thiz, jstring rev_source_path, jstring rev_dest_path) {
    const char *revSourcePath = env->GetStringUTFChars(rev_source_path, NULL);
    const char *revDestPath = env->GetStringUTFChars(rev_dest_path, NULL);

    int revRetVal = revCopyFileCURL(revSourcePath, revDestPath);

    env->ReleaseStringUTFChars(rev_source_path, revSourcePath);
    env->ReleaseStringUTFChars(rev_dest_path, revDestPath);

    return revRetVal;
}

extern "C"
JNIEXPORT jbyteArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revReadResizedFileBytes(JNIEnv *env, jobject thiz, jstring rev_path) {
    const char *revPath = env->GetStringUTFChars(rev_path, NULL);

    // Open the file and read its contents into a buffer
    size_t size;
    char *buffer = revReadFileBytes(revPath, &size);

    // Release the string object to avoid memory leaks
    env->ReleaseStringUTFChars(rev_path, revPath);

    // Check if read_file() was successful
    if (buffer == NULL) {
        return NULL;
    }

    // Create a new byte array in Java
    jbyteArray result = env->NewByteArray(size);
    if (result == NULL) {
        return NULL;
    }

    // Copy the contents of the buffer to the byte array
    env->SetByteArrayRegion(result, 0, size, (jbyte *) buffer);

    // Free the buffer
    free(buffer);

    // Return the byte array to Java
    return result;
}

void revCURLReturnDataCB(void *revData) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> CB -revData : %s", (char *) revData);

    JNIEnv *env = revGetEnv(revGetJVM());

    std::string revEventName = "rev_curl_file_upload_ret_data";
    const char *revClsPath = "com/owki/rev_react_modules/rev_gen_function_libs/RevReactNativeEvents";
    jclass RevReactNativeEvents = revFindClass(env, revClsPath);
    revPersInitReactNativeEvent(env, revEventName, (char *) revData);
}

extern "C"
JNIEXPORT void JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revCURLFileUpload(JNIEnv *env, jobject thiz, jstring rev_url, jstring rev_files, jstring rev_data) {
    const char *revURL = env->GetStringUTFChars(rev_url, 0);
    const char *revFiles = env->GetStringUTFChars(rev_files, 0);
    const char *revData = env->GetStringUTFChars(rev_data, 0);

    revCURLFileUpload(strdup(revURL), strdup(revFiles), strdup(revData), revCURLReturnDataCB);

    env->ReleaseStringUTFChars(rev_url, revURL);
    env->ReleaseStringUTFChars(rev_files, revFiles);
    env->ReleaseStringUTFChars(rev_data, revData);
}
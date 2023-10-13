//
// Created by rev on 5/16/18.
//

#include "rev-pers-lib-create.hpp"

#include <jni.h>
#include <android/log.h>

#include <string.h>
#include <vector>
#include <memory>

#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_table_create.h"
#include "rev_pers_jni_structs.h"
#include "rev_metadata_jni_loader.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_db_models/rev_entity_annotation.h"
#include "rev_init_jni_lib.hpp"
#include "rev_pers_react_native_events.hpp"

extern "C"
{
#include "../../../libs/rev_list/rev_linked_list.h"
#include "../cpp/rev_pers_lib/rev_db_init/rev_db_init.h"
#include "../cpp/rev_pers_lib/rev_pers_lib_connectors/rev_perslib_create_init.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/init_rev_pers_rev_entity.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_pers_update/rev_pers_update.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_lib_create/rev_pers_create/rev_pers_annotation.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h"
#include "../cpp/rev_files/rev_curl_upload_file.h"
#include "../cpp/rev_gen_functions/rev_gen_functions.h"
#include "../cpp/rev_files/rev_gen_file_functions.h"
}

using namespace std;

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

std::vector<RevEntityMetadata> searchRecordResultRevEntityMetadata;

bool revPersGetRevEntityMetadata(void *data) {
    searchRecordResultRevEntityMetadata.push_back(*(RevEntityMetadata *) data);
    return true;
}

extern "C" JNIEXPORT void JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_initRevDb(JNIEnv *env, jobject instance, jstring dirPath_) {
    const char *dirPath = env->GetStringUTFChars(dirPath_, 0);

    initRevDb(strdup(dirPath));

    env->ReleaseStringUTFChars(dirPath_, dirPath);
}

extern "C" JNIEXPORT void JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revTablesInit(JNIEnv *env, jobject instance) {
    revTablesInit();
}

void revPersSetRevObjectEntityDescBaseMetadata(list *revList, JNIEnv *env, jobject revEntity) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    jclass revEntityClazz = env->GetObjectClass(revEntity);

    // and the get_revType() method
    jmethodID get_revTypeMethodID = env->GetMethodID(revEntityClazz, "get_revType", "()Ljava/lang/String;");

    // call the get_revType() method
    jstring s_revType = (jstring) env->CallObjectMethod(revEntity, get_revTypeMethodID);

    if (s_revType != NULL) {
        const char *char_revType;
        char_revType = env->GetStringUTFChars(s_revType, 0);

        if (strcmp(char_revType, "rev_object") == 0) {
        }
    }

    /** START GET REV ENTITY METADATA LISTS **/

    // initialize the Get Parameter Map method of the Container class
    jmethodID m_GetParameterMap = (env)->GetMethodID(revEntityClazz, "get_revMetadataList", "()Ljava/util/List;");

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
        jobject obj_revMetadata = (jstring) env->CallObjectMethod(jParameterMap, mGet, i);

        if (obj_revMetadata == NULL) {
            continue;
        }

        RevEntityMetadata revEntityMetadata;

        /** SET METADATA RESOLVE STATUS **/
        jmethodID get_revResolveStatus_MID = env->GetMethodID(env->GetObjectClass(obj_revMetadata), "get_revResolveStatus", "()I");
        long _revResolveStatus = env->CallIntMethod(obj_revMetadata, get_revResolveStatus_MID);
        revEntityMetadata._revResolveStatus = _revResolveStatus;

        /** End METADATA RESOLVE STATUS **/

        /** Start METADATA Name **/
        jmethodID methodId_get_revName = env->GetMethodID(env->GetObjectClass(obj_revMetadata), "get_revName", "()Ljava/lang/String;");
        jstring s_revName = (jstring) env->CallObjectMethod(obj_revMetadata, methodId_get_revName);

        if (s_revName != NULL) {
            const char *char_revName = env->GetStringUTFChars(s_revName, 0);
            revEntityMetadata._revName = strdup(char_revName);
            env->ReleaseStringUTFChars(s_revName, char_revName);
        }

        /** End METADATA Name **/

        /** Start METADATA Value **/
        jmethodID methodId_get_revValue = env->GetMethodID(env->GetObjectClass(obj_revMetadata), "get_revValue", "()Ljava/lang/String;");
        jstring s_revValue = (jstring) env->CallObjectMethod(obj_revMetadata, methodId_get_revValue);

        if (s_revValue != NULL) {
            const char *char_revValue = env->GetStringUTFChars(s_revValue, 0);
            revEntityMetadata._revValue = strdup(char_revValue);
            env->ReleaseStringUTFChars(s_revValue, char_revValue);
        }

        /** End METADATA Value **/

        /** SET REMOTE METADATA ID **/

        jclass clsLong = (env)->FindClass("java/lang/Long");
        jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

        jmethodID methodId_getRemote_revId = env->GetMethodID(env->GetObjectClass(obj_revMetadata), "getRemote_revId", "()Ljava/lang/Long;");
        jobject revRemote_revId_JOB = env->CallObjectMethod(obj_revMetadata, methodId_getRemote_revId);
        long _revRemoteId = (env)->CallLongMethod(revRemote_revId_JOB, longGetLongValue);

        if (_revRemoteId > 0) {
            revEntityMetadata._revRemoteId = _revRemoteId;
        } else {
            revEntityMetadata._revRemoteId = -1l;
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

        list_append(revList, &revEntityMetadata);

        env->DeleteLocalRef(obj_revMetadata);
    }
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersInit(JNIEnv *env, jobject instance, jobject revEntity) {

    init_rev_pers_rev_entity();

    long lastDbEntry;

    jclass revEntityClazz = env->GetObjectClass(revEntity);

    RevEntity c_rev;

    /** Longs Class **/

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    /** SET REMOTE ENTITY GUID **/
    jmethodID get_revRemoteGUID_MID = env->GetMethodID(revEntityClazz, "get_revRemoteGUID", "()Ljava/lang/Long;");
    jobject revRemoteEntityGUID_JOB = env->CallObjectMethod(revEntity, get_revRemoteGUID_MID);
    long revRemoteEntityGUID = (env)->CallLongMethod(revRemoteEntityGUID_JOB, longGetLongValue);

    c_rev._revRemoteGUID = revRemoteEntityGUID;

    /** SET ENTITY RESOLVE STATUS **/
    jmethodID get_revResolveStatus_MID = env->GetMethodID(revEntityClazz, "get_revResolveStatus", "()I");
    int revEntityResolveStatus = env->CallIntMethod(revEntity, get_revResolveStatus_MID);

    c_rev._revResolveStatus = revEntityResolveStatus;

    /** SET ENTITY CHILDABLE STATUS **/
    jmethodID get_revChildableStatus_MID = env->GetMethodID(revEntityClazz, "get_revChildableStatus", "()I");
    int revEntityChildableStatus = env->CallIntMethod(revEntity, get_revChildableStatus_MID);

    c_rev._revChildableStatus = revEntityChildableStatus;

    /** SET OWNER ENTITY GUID **/
    jmethodID get_revOwnerGUID__MID = env->GetMethodID(revEntityClazz, "get_revOwnerGUID", "()Ljava/lang/Long;");
    jobject revEntityOwnerGUID_JOB = env->CallObjectMethod(revEntity, get_revOwnerGUID__MID);
    long revEntityOwnerGUID = (env)->CallLongMethod(revEntityOwnerGUID_JOB, longGetLongValue);

    c_rev._revOwnerGUID = revEntityOwnerGUID;

    /** SET REV CONTAINER ENTITY GUID **/
    jmethodID get_revContainerGUID_MID = env->GetMethodID(revEntityClazz, "get_revContainerGUID", "()Ljava/lang/Long;");
    jobject revEntityContainerGUID_JOB = env->CallObjectMethod(revEntity, get_revContainerGUID_MID);
    long revEntityContainerGUID = (env)->CallLongMethod(revEntityContainerGUID_JOB, longGetLongValue);

    c_rev._revContainerGUID = revEntityContainerGUID;

    /** SET REV SITE ENTITY GUID **/
    jmethodID get_revSiteGUID_MID = env->GetMethodID(revEntityClazz, "get_revSiteGUID", "()Ljava/lang/Long;");
    jobject revEntitySiteGUID_JOB = env->CallObjectMethod(revEntity, get_revSiteGUID_MID);
    long revEntitySiteGUID = (env)->CallLongMethod(revEntitySiteGUID_JOB, longGetLongValue);
    c_rev._revSiteGUID = revEntitySiteGUID;

    /** SET REV ACCESS PERMISSION **/
    jmethodID get_revAccessPermission_MID = env->GetMethodID(revEntityClazz, "get_revAccessPermission", "()I");
    long revEntityAccessPermission = env->CallIntMethod(revEntity, get_revAccessPermission_MID);

    c_rev._revAccessPermission = revEntityAccessPermission;

    /** START Set Rev Entity Struct Type / Sub **/

    const char *char_revType;
    const char *char_revSubType;

    // and the get_revType() method
    jmethodID get_revTypeMethodID = env->GetMethodID(revEntityClazz, "get_revType", "()Ljava/lang/String;");

    // and the get_revSubType() method
    jmethodID get_revSubTypeMethodID = env->GetMethodID(revEntityClazz, "get_revSubType", "()Ljava/lang/String;");

    if ((env)->ExceptionCheck()) {
        __android_log_print(ANDROID_LOG_INFO, "MyApp", "EMPTY SUB-TYPE EXCEPTION CHECK");
    }

    // call the get_revType() method
    jstring s_revType = (jstring) env->CallObjectMethod(revEntity, get_revTypeMethodID);

    // call the get_revSubType() method
    jstring s_revSubType = (jstring) env->CallObjectMethod(revEntity, get_revSubTypeMethodID);

    jclass cls_String = (env)->FindClass("java/lang/String");
    jmethodID isEmptyMethodId = (env)->GetMethodID(cls_String, "isEmpty", "()Z");

    if (s_revType != NULL) {
        char_revType = env->GetStringUTFChars(s_revType, 0);
        c_rev._revType = strdup(char_revType);
    }

    if (s_revSubType != NULL) {
        jboolean isSubTypeEmpty = (env)->CallBooleanMethod(s_revSubType, isEmptyMethodId);
        if (!isSubTypeEmpty) {
            char_revSubType = env->GetStringUTFChars(s_revSubType, 0);
            c_rev._revSubType = strdup(char_revSubType);
        }
    }

    /** SET REV CREATED DATE TIME **/
    jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityClazz, "get_revTimeCreated", "()Ljava/lang/Long;");
    jobject _revTimeCreated_JOB = env->CallObjectMethod(revEntity, get_revTimeCreated_MID);
    long _revTimeCreated = (env)->CallLongMethod(_revTimeCreated_JOB, longGetLongValue);
    c_rev._revTimeCreated = _revTimeCreated;

    /** SET REV TIME PUBLISHED TIME **/
    jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityClazz, "get_revTimePublished", "()Ljava/lang/Long;");
    jobject _revTimePublished_JOB = env->CallObjectMethod(revEntity, get_revTimePublished_MID);
    long _revTimePublished = (env)->CallLongMethod(_revTimePublished_JOB, longGetLongValue);
    c_rev._revTimePublished = _revTimePublished;

    /** SET PUBLISHED UPDATED TIME **/
    jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityClazz, "get_revTimePublishedUpdated", "()Ljava/lang/Long;");
    jobject _revTimePublishedUpdated_JOB = env->CallObjectMethod(revEntity, get_revTimePublishedUpdated_MID);
    long _revTimePublishedUpdated = (env)->CallLongMethod(_revTimePublishedUpdated_JOB, longGetLongValue);
    c_rev._revTimePublishedUpdated = _revTimePublishedUpdated;

    /** END REV SETS**/

    list revEntityMetadataList;
    revPersSetRevObjectEntityDescBaseMetadata(&revEntityMetadataList, env, revEntity);
    c_rev._revMetadataList = revEntityMetadataList;

    lastDbEntry = revPersInit(&c_rev);

    return lastDbEntry;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersInitJSON(JNIEnv *env, jobject instance, jstring revJSONEntity_) {
    const char *revJSONEntity = env->GetStringUTFChars(revJSONEntity_, 0);

    RevEntity *revEntity = revJSONEntityFiller(revJSONEntity);
    long lastDbEntry = revPersInit(revEntity);

    return lastDbEntry;
}

/** REV ENTITY METADATA **/

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
        jobject obj_revMetadata = searchRecordResultRevEntityMetadataJObject[i];

        if (obj_revMetadata == NULL) {
            continue;
        }

        jclass revEntityMetadataClazz = env->GetObjectClass(obj_revMetadata);

        RevEntityMetadata revEntityMetadata;

        /** SET METADATA RESOLVE STATUS **/

        jmethodID get_revResolveStatus_MID = env->GetMethodID(revEntityMetadataClazz, "get_revResolveStatus", "()I");
        long _revResolveStatus = env->CallIntMethod(obj_revMetadata, get_revResolveStatus_MID);

        revEntityMetadata._revResolveStatus = _revResolveStatus;

        /** End METADATA RESOLVE STATUS **/

        /** Start METADATA Name **/

        jmethodID methodId_get_revName = env->GetMethodID(revEntityMetadataClazz, "get_revName", "()Ljava/lang/String;");
        jstring s_revName = (jstring) env->CallObjectMethod(obj_revMetadata, methodId_get_revName);

        if (s_revName != NULL) {
            const char *char_revName = env->GetStringUTFChars(s_revName, 0);
            revEntityMetadata._revName = strdup(char_revName);
            env->ReleaseStringUTFChars(s_revName, char_revName);
        }

        /** End METADATA Name **/

        /** Start METADATA Value **/

        jmethodID methodId_get_revValue = env->GetMethodID(revEntityMetadataClazz, "get_revValue", "()Ljava/lang/String;");
        jstring s_revValue = (jstring) env->CallObjectMethod(obj_revMetadata, methodId_get_revValue);

        if (s_revValue != NULL) {
            const char *char_revValue = env->GetStringUTFChars(s_revValue, 0);
            revEntityMetadata._revValue = strdup(char_revValue);
            env->ReleaseStringUTFChars(s_revValue, char_revValue);
        }

        /** End METADATA Value **/

        jclass clsLong = (env)->FindClass("java/lang/Long");
        jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

        /** Start METADATA Owner GUID **/

        jmethodID methodId_get_revMetadataOwnerGUID = env->GetMethodID(revEntityMetadataClazz, "get_revMetadataOwnerGUID", "()Ljava/lang/Long;");
        jobject revEntityMetadataOwnerGUID_JOB = env->CallObjectMethod(obj_revMetadata, methodId_get_revMetadataOwnerGUID);
        long revEntityMetadataOwnerGUID = (env)->CallLongMethod(revEntityMetadataOwnerGUID_JOB, longGetLongValue);

        if (revEntityMetadataOwnerGUID > 0) {
            revEntityMetadata._revGUID = revEntityMetadataOwnerGUID;
        }

        /** End METADATA CONTAINER ENTITY GUID **/

        revEntityMetadata._revId = revPersSaveRevEntityMetadata(&revEntityMetadata);

        list_append(&list, &revEntityMetadata);

        env->DeleteLocalRef(obj_revMetadata);
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

    RevEntityMetadata c_revMetadata;

    /** SET METADATA RESOLVE STATUS **/
    jmethodID get_revResolveStatus_MID = env->GetMethodID(revEntityMetadataClazz, "get_revResolveStatus", "()I");
    long _revResolveStatus = env->CallIntMethod(revEntityMetadata, get_revResolveStatus_MID);
    c_revMetadata._revResolveStatus = _revResolveStatus;

    /** End METADATA RESOLVE STATUS **/

    /** Start METADATA Name **/
    jmethodID methodId_get_revName = env->GetMethodID(revEntityMetadataClazz, "get_revName", "()Ljava/lang/String;");
    jstring s_revName = (jstring) env->CallObjectMethod(revEntityMetadata, methodId_get_revName);

    if (s_revName != NULL) {
        const char *char_revName = env->GetStringUTFChars(s_revName, 0);
        c_revMetadata._revName = strdup(char_revName);
        env->ReleaseStringUTFChars(s_revName, char_revName);
    }

    /** End METADATA Name **/

    /** Start METADATA Value **/
    jmethodID methodId_get_revValue = env->GetMethodID(revEntityMetadataClazz, "get_revValue", "()Ljava/lang/String;");
    jstring s_revValue = (jstring) env->CallObjectMethod(revEntityMetadata, methodId_get_revValue);

    if (s_revValue != NULL) {
        const char *char_revValue = env->GetStringUTFChars(s_revValue, 0);
        c_revMetadata._revValue = strdup(char_revValue);
        env->ReleaseStringUTFChars(s_revValue, char_revValue);
    }

    /** End METADATA Value **/

    /** SET REMOTE METADATA ID **/

    jclass clsLong = (env)->FindClass("java/lang/Long");
    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    jmethodID methodId_getRemote_revId = env->GetMethodID(revEntityMetadataClazz,
                                                          "getRemote_revId",
                                                          "()Ljava/lang/Long;");
    jobject revRemote_revId_JOB = env->CallObjectMethod(revEntityMetadata, methodId_getRemote_revId);
    long _revRemoteId = (env)->CallLongMethod(revRemote_revId_JOB, longGetLongValue);

    if (_revRemoteId > 0) {
        c_revMetadata._revRemoteId = _revRemoteId;
    } else {
        c_revMetadata._revRemoteId = -1l;
    }

    /** End REMOTE METADATA ID **/

    /** Start METADATA Owner GUID **/

    jmethodID methodId_get_revMetadataOwnerGUID = env->GetMethodID(revEntityMetadataClazz,
                                                                   "get_revMetadataOwnerGUID",
                                                                   "()Ljava/lang/Long;");
    jobject revEntityMetadataOwnerGUID_JOB = env->CallObjectMethod(revEntityMetadata,
                                                                   methodId_get_revMetadataOwnerGUID);
    long revEntityMetadataOwnerGUID = (env)->CallLongMethod(revEntityMetadataOwnerGUID_JOB,
                                                            longGetLongValue);

    if (revEntityMetadataOwnerGUID > 0) {
        c_revMetadata._revGUID = revEntityMetadataOwnerGUID;
    }

    /** End METADATA CONTAINER ENTITY GUID **/

    env->DeleteLocalRef(revEntityMetadata);

    return revPersSaveRevEntityMetadata(&c_revMetadata);
}

extern "C"
JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersSaveEntityMetadataJSONStr(JNIEnv *env, jobject thiz, jstring rev_entity_metadata_jsonstr) {
    const char *revEntityMetadataJSONStr = env->GetStringUTFChars(rev_entity_metadata_jsonstr, 0);

    RevEntityMetadata *revEntityMetadata = revJSONStrMetadataFiller(revEntityMetadataJSONStr);
    long _revId = revPersSaveRevEntityMetadata(revEntityMetadata);

    env->ReleaseStringUTFChars(rev_entity_metadata_jsonstr, revEntityMetadataJSONStr);

    return _revId;
}

/** END REV ENTITY METADATA **/

/** REV RELATIONSHIP **/

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRelationship(JNIEnv *env, jobject instance, jobject revEntityRelationship) {

    RevEntityRelationship c_revRelationship;

    jclass revEntityRelationshipClazz = env->GetObjectClass(revEntityRelationship);

    /** START Set Rev Entity Struct Type / Sub **/

    const char *char_revType;

    // and the get_revType() method
    jmethodID get_revType_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revType", "()Ljava/lang/String;");

    if ((env)->ExceptionCheck()) {
        __android_log_print(ANDROID_LOG_INFO, "MyApp", "EMPTY");
    }

    // call the get_revType() method
    jstring s_revType = (jstring) env->CallObjectMethod(revEntityRelationship,
                                                        get_revType_MethodID);

    jclass cls_String = (env)->FindClass("java/lang/String");
    jmethodID isEmptyMethodId = (env)->GetMethodID(cls_String, "isEmpty", "()Z");

    if (s_revType != NULL) {
        char_revType = env->GetStringUTFChars(s_revType, 0);
        c_revRelationship._revType = strdup(char_revType);
    }

    /** ------------------------------------------------------------------------- **/

    /** Longs Class **/

    jclass clsLong = (env)->FindClass("java/lang/Long");

    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    /** START GET SUBJECT GUID **/

    jmethodID get_revSubjectGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revSubjectGUID", "()Ljava/lang/Long;");
    jobject subjectGUID = env->CallObjectMethod(revEntityRelationship, get_revSubjectGUID_MethodID);
    long revEntitySubjectGUID = (env)->CallLongMethod(subjectGUID, longGetLongValue);

    c_revRelationship._revSubjectGUID = revEntitySubjectGUID;

    /** END GET SUBJECT GUID **/

    /** START GET REMOTE SUBJECT GUID **/

    jmethodID get_remoteRevevEntitySubjectGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revRemoteSubjectGUID", "()Ljava/lang/Long;");
    jobject _remoteRevevEntitySubjectGUID_JOB = env->CallObjectMethod(revEntityRelationship, get_remoteRevevEntitySubjectGUID_MethodID);
    long _remoteRevevEntitySubjectGUID = (env)->CallLongMethod(_remoteRevevEntitySubjectGUID_JOB, longGetLongValue);

    c_revRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;

    /** END GET REMOTE SUBJECT GUID **/

    /** START GET TARGET GUID **/

    jmethodID get_revTargetGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revTargetGUID", "()Ljava/lang/Long;");
    jobject targetGUID_JOB = env->CallObjectMethod(revEntityRelationship, get_revTargetGUID_MethodID);
    long revEntityTargetGUID = (env)->CallLongMethod(targetGUID_JOB, longGetLongValue);

    c_revRelationship._revTargetGUID = revEntityTargetGUID;

    /** END GET TARGET GUID **/

    /** START GET REMOTE TARGET GUID **/

    jmethodID get_revRemoteTargetGUID_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revRemoteTargetGUID", "()Ljava/lang/Long;");
    jobject _revRemoteTargetGUID_JOB = env->CallObjectMethod(revEntityRelationship, get_revRemoteTargetGUID_MethodID);

    long _revRemoteTargetGUID = (env)->CallLongMethod(_revRemoteTargetGUID_JOB, longGetLongValue);

    c_revRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

    /** END GET REMOTE TARGET GUID **/

    /** START GET RESOLVE STATUS **/

    jmethodID get_revResolveStatus_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revResolveStatus", "()I");

    jint _revResolveStatus = env->CallIntMethod(revEntityRelationship, get_revResolveStatus_MethodID);

    c_revRelationship._revResolveStatus = _revResolveStatus;

    /** END GET RESOLVE STATUS **/

    /** START GET REMOTE VALUE ID GUID **/

    jmethodID get_revRemoteId_MethodID = env->GetMethodID(revEntityRelationshipClazz, "get_revRemoteId", "()Ljava/lang/Long;");
    jobject remoteRevEntityRelationshipId_Obj = env->CallObjectMethod(revEntityRelationship, get_revRemoteId_MethodID);
    long _revRemoteId = (env)->CallLongMethod(remoteRevEntityRelationshipId_Obj, longGetLongValue);

    c_revRelationship._revRemoteId = _revRemoteId;

    /** END GET REMOTE VALUE ID **/

    /** SET REV CREATED DATE TIME **/
    jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityRelationshipClazz, "get_revTimeCreated", "()Ljava/lang/Long;");
    jobject _revTimeCreated_Obj = (env)->CallObjectMethod(revEntityRelationship, get_revTimeCreated_MID);
    long _revTimeCreated_Id = (env)->CallLongMethod(_revTimeCreated_Obj, longGetLongValue);
    c_revRelationship._revTimeCreated = _revTimeCreated_Id;

    /** SET REV TIME PUBLISHED TIME **/
    jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityRelationshipClazz, "get_revTimePublished", "()Ljava/lang/Long;");
    jobject _revTimePublished_Obj = (env)->CallObjectMethod(revEntityRelationship, get_revTimePublished_MID);
    long _revTimePublishedId = (env)->CallLongMethod(_revTimePublished_Obj, longGetLongValue);

    c_revRelationship._revTimePublished = _revTimePublishedId;

    /** SET PUBLISHED UPDATED TIME **/
    jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityRelationshipClazz, "get_revTimePublishedUpdated", "()Ljava/lang/Long;");
    jobject _revTimePublishedUpdated_Obj = (env)->CallObjectMethod(revEntityRelationship, get_revTimePublishedUpdated_MID);
    long _revTimePublishedUpdated_Id = (env)->CallLongMethod(_revTimePublishedUpdated_Obj, longGetLongValue);
    c_revRelationship._revTimePublishedUpdated = _revTimePublishedUpdated_Id;

    /** END REV SETS**/

    long relationshipId = revPersRelationshipObject(&c_revRelationship);

    env->ReleaseStringUTFChars(s_revType, char_revType);

    return relationshipId;
}

extern "C"
JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRelationshipJSON(JNIEnv *env, jobject thiz, jstring rev_jsonentity_relationship) {
    const char *revJSONEntityRelationship = env->GetStringUTFChars(rev_jsonentity_relationship, 0);

    RevEntityRelationship *revEntityRelationship = revJSONEntityRelationshipFiller(revJSONEntityRelationship);

    long relationshipId = revPersRelationshipObject(revEntityRelationship);

    env->ReleaseStringUTFChars(rev_jsonentity_relationship, revJSONEntityRelationship);

    return relationshipId;
}

/** REV ANNOTATION **/

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersRevEntityAnnotation(JNIEnv *env, jobject instance, jobject revAnnotation) {

    RevEntityAnnotation c_RevAnnotation;

    jclass revEntityAnnotationClazz = env->GetObjectClass(revAnnotation);

    /** START GET RESOLVE STATUS **/

    jmethodID get_revResolveStatus_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revResolveStatus", "()I");
    jint _revResolveStatus = env->CallIntMethod(revAnnotation, get_revResolveStatus_MethodID);

    c_RevAnnotation._revResolveStatus = _revResolveStatus;

    /** START GET RESOLVE STATUS **/

    /** START Set Rev Entity Annotation Name **/

    const char *char_revName;

    jmethodID get_revName_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revName", "()Ljava/lang/String;");
    jstring s_revName = (jstring) env->CallObjectMethod(revAnnotation, get_revName_MethodID);

    if (s_revName != NULL) {
        char_revName = env->GetStringUTFChars(s_revName, 0);
        c_RevAnnotation._revName = strdup(char_revName);
    }

    /** ------------------------------------------------------------------------- **/

    /** START Set Rev Entity Annotation Value **/

    const char *char_revValue;

    jmethodID get_revValue_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revValue", "()Ljava/lang/String;");
    jstring s_revValue = (jstring) env->CallObjectMethod(revAnnotation, get_revValue_MethodID);

    if (s_revValue != NULL) {
        char_revValue = env->GetStringUTFChars(s_revValue, 0);
        c_RevAnnotation._revValue = strdup(char_revValue);
    }

    /** ------------------------------------------------------------------------- **/

    /** Longs Class **/

    jclass clsLong = (env)->FindClass("java/lang/Long");

    jmethodID longGetLongValue = (env)->GetMethodID(clsLong, "longValue", "()J");

    /** START GET REMOTE ANN ID **/

    jmethodID get_revRemoteId_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revRemoteId", "()Ljava/lang/Long;");
    jobject _revRemoteId_JObj = env->CallObjectMethod(revAnnotation, get_revRemoteId_MethodID);
    long _revRemoteId = (env)->CallLongMethod(_revRemoteId_JObj, longGetLongValue);

    c_RevAnnotation._revRemoteId = _revRemoteId;

    /** END GET REMOTE ANN ID  **/

    /** START GET REV ENTITY GUID **/

    jmethodID get_revGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revGUID", "()Ljava/lang/Long;");
    jobject _revGUID_JObj = env->CallObjectMethod(revAnnotation, get_revGUID_MethodID);
    long _revGUID = (env)->CallLongMethod(_revGUID_JObj, longGetLongValue);

    c_RevAnnotation._revGUID = _revGUID;

    /** END GET REV ENTITY GUID **/

    /** START GET REMOTE REV ENTITY GUID **/

    jmethodID get_revRemoteGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revRemoteGUID", "()Ljava/lang/Long;");
    jobject _revRemoteGUID_JObj = env->CallObjectMethod(revAnnotation, get_revRemoteGUID_MethodID);
    long _revRemoteGUID = (env)->CallLongMethod(_revRemoteGUID_JObj, longGetLongValue);

    c_RevAnnotation._revRemoteGUID = _revRemoteGUID;

    /** END GET REMOTE REV ENTITY GUID **/

    /** START GET ANN OWNER ENTITY GUID **/

    jmethodID get_revOwnerGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revOwnerGUID", "()Ljava/lang/Long;");
    jobject _revOwnerGUID_JObj = env->CallObjectMethod(revAnnotation, get_revOwnerGUID_MethodID);

    long _revOwnerGUID = (env)->CallLongMethod(_revOwnerGUID_JObj, longGetLongValue);

    c_RevAnnotation._revOwnerGUID = _revOwnerGUID;

    /** END GET ANN OWNER ENTITY GUID **/

    /** START GET REMOTE ANN OWNER ENTITY GUID **/

    jmethodID get_revRemoteOwnerGUID_MethodID = env->GetMethodID(revEntityAnnotationClazz, "get_revRemoteOwnerGUID", "()Ljava/lang/Long;");
    jobject _revRemoteOwnerGUID_JObj = env->CallObjectMethod(revAnnotation, get_revRemoteOwnerGUID_MethodID);

    long _revRemoteOwnerGUID = (env)->CallLongMethod(_revRemoteOwnerGUID_JObj, longGetLongValue);

    c_RevAnnotation._revRemoteOwnerGUID = _revRemoteOwnerGUID;

    /** END GET REMOTE ANN OWNER ENTITY GUID **/

    /** SET REV CREATED DATE TIME **/
    jmethodID get_revTimeCreated_MID = env->GetMethodID(revEntityAnnotationClazz, "get_revTimeCreated", "()Ljava/lang/Long;");
    jobject _revTimeCreated_JOB = env->CallObjectMethod(revAnnotation, get_revTimeCreated_MID);
    long _revTimeCreated = (env)->CallLongMethod(_revTimeCreated_JOB, longGetLongValue);
    c_RevAnnotation._revTimeCreated = _revTimeCreated;

    /** SET REV TIME PUBLISHED TIME **/
    jmethodID get_revTimePublished_MID = env->GetMethodID(revEntityAnnotationClazz, "get_revTimePublished", "()Ljava/lang/Long;");
    jobject _revTimePublished_JOB = env->CallObjectMethod(revAnnotation, get_revTimePublished_MID);
    long _revTimePublished = (env)->CallLongMethod(_revTimePublished_JOB, longGetLongValue);
    c_RevAnnotation._revTimePublished = _revTimePublished;

    /** SET PUBLISHED UPDATED TIME **/
    jmethodID get_revTimePublishedUpdated_MID = env->GetMethodID(revEntityAnnotationClazz, "get_revTimePublishedUpdated", "()Ljava/lang/Long;");
    jobject _revTimePublishedUpdated_JOB = env->CallObjectMethod(revAnnotation, get_revTimePublishedUpdated_MID);
    long _revTimePublishedUpdated = (env)->CallLongMethod(_revTimePublishedUpdated_JOB, longGetLongValue);
    c_RevAnnotation._revTimePublishedUpdated = _revTimePublishedUpdated;

    /** END REV SETS**/

    long revAnnId = revPersAnnotationStruct(&c_RevAnnotation);

    env->ReleaseStringUTFChars(s_revName, char_revName);
    env->ReleaseStringUTFChars(s_revValue, char_revValue);

    return revAnnId;
}

extern "C"
JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibCreate_revPersAnn_1With_1Values(JNIEnv *env, jobject thiz, jstring _rev_name, jstring _rev_value, jlong _rev_guid, jlong _owner_entity_guid) {
    // TODO: implement revPersAnn_With_Values()
    const char *_revName = env->GetStringUTFChars(_rev_name, 0);
    const char *_revValue = env->GetStringUTFChars(_rev_value, 0);

    long revAnnotationId = revPersAnnotation(strdup(_revName), strdup(_revValue), (long) _rev_guid, (long) _owner_entity_guid);

    env->ReleaseStringUTFChars(_rev_name, _revName);
    env->ReleaseStringUTFChars(_rev_value, _revValue);

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

    std::string revEventName = "rev_curl_file_upload_ret_data_event";
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
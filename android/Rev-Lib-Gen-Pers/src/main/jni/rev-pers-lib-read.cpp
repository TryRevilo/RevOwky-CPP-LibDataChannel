//
// Created by rev on 7/2/18.
//

#include "rev-pers-lib-read.hpp"

#include <jni.h>
#include <android/log.h>

#include <malloc.h>
#include <vector>
#include <string.h>
#include <cstring>
#include <locale.h>
#include <stdlib.h>
#include <chrono>
#include <thread>
#include <map>

#include "rev_pers_jni_structs.h"
#include "rev_metadata_jni_loader.h"
#include "rev_annotation_jni_loader.h"

extern "C"
{
#include "../../../libs/rev_list/rev_linked_list.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_read.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_read/rev_pers_read_rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "../cpp/rev_gen_functions/rev_gen_functions.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_read/rev_pers_read_rev_entity_annotations.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_read/rev_pers_read_rev_entity_relationships.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_update/rev_pers_update_rev_entity_rel.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_db_models/rev_entity_annotation.h"
}

std::vector<RevEntity *> searchRecordResultRevEntity;
std::vector<RevEntityMetadata> searchRecordResultRevEntityMetadata;
std::vector<RevEntityAnnotation> searchRecordResultRevEntityAnnotation;
std::vector<RevEntityRelationship> searchRecordResultRevEntityRelationship;
std::vector<long> searchRecordResultLong;

bool revIsUTF8(const void *pBuffer, long size) {
    bool revIsUTF8 = true;
    unsigned char *start = (unsigned char *) pBuffer;
    unsigned char *end = (unsigned char *) pBuffer + size;
    while (start < end) {
        if (*start < 0x80) // (10000000): value less then 0x80 ASCII char
        {
            start++;
        } else if (*start < (0xC0)) // (11000000): between 0x80 and 0xC0 UTF-8 char
        {
            revIsUTF8 = false;
            break;
        } else if (*start < (0xE0)) // (11100000): 2 bytes UTF-8 char
        {
            if (start >= end - 1)
                break;
            if ((start[1] & (0xC0)) != 0x80) {
                revIsUTF8 = false;
                break;
            }
            start += 2;
        } else if (*start < (0xF0)) // (11110000): 3 bytes UTF-8 char
        {
            if (start >= end - 2)
                break;
            if ((start[1] & (0xC0)) != 0x80 || (start[2] & (0xC0)) != 0x80) {
                revIsUTF8 = false;
                break;
            }
            start += 3;
        } else {
            revIsUTF8 = false;
            break;
        }
    }
    return revIsUTF8;
}

bool revPersGetRevEntityDataRevEntity(void *data) {
    searchRecordResultRevEntity.push_back((RevEntity *) data);
    return true;
}

bool revPersGetRevEntityMetadata(void *data) {
    searchRecordResultRevEntityMetadata.push_back(*(RevEntityMetadata *) data);
    return true;
}

bool revPersGetRevEntityAnnotation(void *data) {
    searchRecordResultRevEntityAnnotation.push_back(*(RevEntityAnnotation *) data);
    return true;
}

bool revPersGetRevEntityRelationship(void *data) {
    searchRecordResultRevEntityRelationship.push_back(*(RevEntityRelationship *) data);
    return true;
}

bool revPersGetRevEntityDataLong(void *data) {
    searchRecordResultLong.push_back(*(long *) data);
    return true;
}

/**
 *   Fills JNI details.
 */
REV_ENTITY_JNI_POSREC *revLoadRevEntityJniPosRec(JNIEnv *env) {
    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = new REV_ENTITY_JNI_POSREC;

    revEntityJniPosRec->cls = env->FindClass("rev/ca/rev_gen_lib_pers/RevDBModels/RevEntity");

    if (revEntityJniPosRec->cls != NULL) {
        printf("sucessfully created class");
    }

    revEntityJniPosRec->constructortor_ID = env->GetMethodID(revEntityJniPosRec->cls, "<init>", "()V");
    if (revEntityJniPosRec->constructortor_ID != NULL) {
        printf("sucessfully created ctorID");
    }

    revEntityJniPosRec->_revEntityType_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityType", "Ljava/lang/String;");
    revEntityJniPosRec->_revEntitySubType_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntitySubType", "Ljava/lang/String;");

    revEntityJniPosRec->_revEntityResolveStatus = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityResolveStatus", "I");
    revEntityJniPosRec->_revEntityChildableStatus = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityChildableStatus", "I");

    revEntityJniPosRec->_revEntityGUID_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityGUID", "Ljava/lang/Long;");
    revEntityJniPosRec->_revRemoteEntityGUID_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revRemoteEntityGUID", "Ljava/lang/Long;");

    revEntityJniPosRec->_revEntityOwnerGUID_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityOwnerGUID", "Ljava/lang/Long;");
    revEntityJniPosRec->_revEntityContainerGUID_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityContainerGUID", "Ljava/lang/Long;");
    revEntityJniPosRec->_revEntityAccessPermission_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityAccessPermission", "I");

    revEntityJniPosRec->_revEntityMetadataList_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revEntityMetadataList", "Ljava/util/List;");

    revEntityJniPosRec->_revPublisherEntity_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revPublisherEntity", "Lrev/ca/rev_gen_lib_pers/RevDBModels/RevEntity;");
    revEntityJniPosRec->_revInfoEntity_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revInfoEntity", "Lrev/ca/rev_gen_lib_pers/RevDBModels/RevEntity;");

    revEntityJniPosRec->_revTimeCreated_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revTimeCreated", "Ljava/lang/Long;");
    revEntityJniPosRec->_revTimePublished_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revTimePublished", "Ljava/lang/Long;");
    revEntityJniPosRec->_revTimePublishedUpdated_ID = env->GetFieldID(revEntityJniPosRec->cls, "_revTimePublishedUpdated", "Ljava/lang/Long;");

    return revEntityJniPosRec;
}

REV_ENTITY_RELATIONSHIP_JNI_POSREC *revLoadRevEntityRelationshipJniPosRec(JNIEnv *env) {
    REV_ENTITY_RELATIONSHIP_JNI_POSREC *revEntityRelationshipJniPosrec = new REV_ENTITY_RELATIONSHIP_JNI_POSREC;

    revEntityRelationshipJniPosrec->cls = env->FindClass("rev/ca/rev_gen_lib_pers/RevDBModels/RevEntityRelationship");

    if (revEntityRelationshipJniPosrec->cls != NULL) {
        printf("sucessfully created class");
    } else {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR : sucessfully created class");
    }

    revEntityRelationshipJniPosrec->constructortor_ID = env->GetMethodID(revEntityRelationshipJniPosrec->cls, "<init>", "()V");
    if (revEntityRelationshipJniPosrec->constructortor_ID != NULL) {
        printf("sucessfully created ctorID");
    } else {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR : sucessfully created ctorID");
    }

    revEntityRelationshipJniPosrec->_revResolveStatus = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revResolveStatus", "I");
    revEntityRelationshipJniPosrec->_revEntityRelationshipType_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revEntityRelationshipType", "Ljava/lang/String;");

    revEntityRelationshipJniPosrec->_revEntityRelationshipTypeValueId_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revEntityRelationshipTypeValueId", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_revEntityRelationshipId_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revEntityRelationshipId", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_revRemoteEntityRelationshipId = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revRemoteEntityRelationshipId", "Ljava/lang/Long;");

    revEntityRelationshipJniPosrec->_revEntityGUID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revEntityGUID", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_revRemoteEntityGUID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revRemoteEntityGUID", "Ljava/lang/Long;");

    revEntityRelationshipJniPosrec->_revEntitySubjectGUID_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revEntitySubjectGUID", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_remoteRevevEntitySubjectGUID_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revRemoteEntitySubjectGUID", "Ljava/lang/Long;");

    revEntityRelationshipJniPosrec->_revEntityTargetGUID_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revEntityTargetGUID", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_revRemoteEntityTargetGUID_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revRemoteEntityTargetGUID", "Ljava/lang/Long;");

    revEntityRelationshipJniPosrec->_revTimeCreated_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revTimeCreated", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_revTimePublished_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revTimePublished", "Ljava/lang/Long;");
    revEntityRelationshipJniPosrec->_revTimePublishedUpdated_ID = env->GetFieldID(revEntityRelationshipJniPosrec->cls, "_revTimePublishedUpdated", "Ljava/lang/Long;");

    return revEntityRelationshipJniPosrec;
}

jobject revFillDataRecValuesToRevEntityRelationshipJni(JNIEnv *env, RevEntityRelationship revEntityRelationship) {
    REV_ENTITY_RELATIONSHIP_JNI_POSREC *revEntityRelationshipJniPosrec = revLoadRevEntityRelationshipJniPosRec(env);

    jobject jPosRec = env->NewObject(revEntityRelationshipJniPosrec->cls, revEntityRelationshipJniPosrec->constructortor_ID);

    jint _revResolveStatus = revEntityRelationship._revResolveStatus;
    env->SetIntField(jPosRec, revEntityRelationshipJniPosrec->_revResolveStatus, _revResolveStatus);

    if ((revEntityRelationship._revEntityRelationshipType != NULL) && (revEntityRelationship._revEntityRelationshipType[0] != '\0')) {
        char *revEntityRelationshipType = revEntityRelationship._revEntityRelationshipType;
        jstring revEntityRelationshipType_Obj = env->NewStringUTF(revEntityRelationshipType);
        env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revEntityRelationshipType_ID, revEntityRelationshipType_Obj);
        env->DeleteLocalRef(revEntityRelationshipType_Obj);
    }

    jclass revJClassLong = (env)->FindClass("java/lang/Long");
    jmethodID revConstMethodId = env->GetMethodID(revJClassLong, "<init>", "(J)V");

    long revEntityRelationshipId = revEntityRelationship._revEntityRelationshipId;
    jobject _revEntityRelationshipId_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationshipId);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revEntityRelationshipId_ID, _revEntityRelationshipId_Obj);
    env->DeleteLocalRef(_revEntityRelationshipId_Obj);

    jobject _revRemoteEntityRelationshipId_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revRemoteEntityRelationshipId);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revRemoteEntityRelationshipId, _revRemoteEntityRelationshipId_Obj);
    env->DeleteLocalRef(_revRemoteEntityRelationshipId_Obj);

    /** START _revEntityGUID **/
    jobject _revEntityGUID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revEntityGUID);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revEntityGUID, _revEntityGUID_Obj);
    env->DeleteLocalRef(_revEntityGUID_Obj);
    /** END _revEntityGUID **/

    /** START _revRemoteEntityGUID **/
    jobject _revRemoteEntityGUID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revRemoteEntityGUID);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revRemoteEntityGUID, _revRemoteEntityGUID_Obj);
    env->DeleteLocalRef(_revRemoteEntityGUID_Obj);
    /** END _revRemoteEntityGUID **/

    jobject _revEntityRelationshipTypeValueId_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revEntityRelationshipTypeValueId);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revEntityRelationshipTypeValueId_ID, _revEntityRelationshipTypeValueId_Obj);
    env->DeleteLocalRef(_revEntityRelationshipTypeValueId_Obj);

    jobject _revEntitySubjectGUID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revEntitySubjectGUID);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revEntitySubjectGUID_ID, _revEntitySubjectGUID_Obj);
    env->DeleteLocalRef(_revEntitySubjectGUID_Obj);

    /** _revRemoteEntitySubjectGUID **/
    jobject _remoteRevevEntitySubjectGUID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revRemoteEntitySubjectGUID);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_remoteRevevEntitySubjectGUID_ID, _remoteRevevEntitySubjectGUID_Obj);
    env->DeleteLocalRef(_remoteRevevEntitySubjectGUID_Obj);

    jobject _revEntityTargetGUID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revEntityTargetGUID);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revEntityTargetGUID_ID, _revEntityTargetGUID_Obj);
    env->DeleteLocalRef(_revEntityTargetGUID_Obj);

    /** _revRemoteEntityTargetGUID **/
    jobject _revRemoteEntityTargetGUID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revRemoteEntityTargetGUID);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revRemoteEntityTargetGUID_ID, _revRemoteEntityTargetGUID_Obj);
    env->DeleteLocalRef(_revRemoteEntityTargetGUID_Obj);

    /** _revTimeCreated **/
    jobject revTimeCreated_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revTimeCreated);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revTimeCreated_ID, revTimeCreated_Obj);
    env->DeleteLocalRef(revTimeCreated_Obj);

    /** _revTimePublishedUpdated **/
    jobject _revTimePublished_ID_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revTimePublished);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revTimePublished_ID, _revTimePublished_ID_Obj);
    env->DeleteLocalRef(_revTimePublished_ID_Obj);

    /** _revTimePublishedUpdated **/
    jobject _revTimePublishedUpdated_Obj = env->NewObject(revJClassLong, revConstMethodId, (long long) revEntityRelationship._revTimePublishedUpdated);
    env->SetObjectField(jPosRec, revEntityRelationshipJniPosrec->_revTimePublishedUpdated_ID, _revTimePublishedUpdated_Obj);
    env->DeleteLocalRef(_revTimePublishedUpdated_Obj);

    return jPosRec;
}

void revLoadEntityInfo(JNIEnv *env, jobject jPosRec, RevEntity *cPosRec, REV_ENTITY_JNI_POSREC *revEntityJniPosRec) {
    char *revEntitySubType = cPosRec->_revEntitySubType;

    if (strcmp(revEntitySubType, "rev_entity_info") == 0) {
        return;
    }

    char revSubTypeInfoStr[] = "rev_entity_info";
    long revInfoEntityGUID = revPersGetSubjectGUID_BY_RelStr_TargetGUID(revSubTypeInfoStr, cPosRec->_revEntityGUID);

    if (revInfoEntityGUID > 0) {
        RevEntity revEntityInfo = revPersGetRevEntityByGUID(revInfoEntityGUID);

        if (!revEntityInfo._isNull) {
            const char *revEntityType = revEntityInfo._revEntityType;

            if (revIsUTF8(revEntityType, strlen(revEntityType)) && strcmp(revEntityType, "rev_object") == 0) {
                jobject jPosRecRevInfoEntity = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);

                REV_ENTITY_JNI_POSREC *revUserEntityJniPosRec = revLoadRevEntityJniPosRec(env);
                revFillDataRecValuesToJni(env, jPosRecRevInfoEntity, &revEntityInfo, revUserEntityJniPosRec);

                env->SetObjectField(jPosRec, revEntityJniPosRec->_revInfoEntity_ID, jPosRecRevInfoEntity);
                env->DeleteLocalRef(jPosRecRevInfoEntity);
            }
        }
    }
}

void revLoadPublisher(JNIEnv *env, jobject jPosRec, RevEntity *cPosRec, REV_ENTITY_JNI_POSREC *revEntityJniPosRec) {
    char *revEntitySubType = cPosRec->_revEntitySubType;

    if (strcmp(revEntitySubType, "rev_user_entity") == 0 || strcmp(revEntitySubType, "rev_entity_info") == 0) {
        return;
    }

    long revEntityPublisherGUID = cPosRec->_revOwnerEntityGUID;

    if (revEntityPublisherGUID >= 0) {
        RevEntity revEntityPublisher = revPersGetRevEntityByGUID(revEntityPublisherGUID);

        if (!revEntityPublisher._isNull) {
            const char *revEntityPublisherEntType = revEntityPublisher._revEntityType;

            if (revIsUTF8(revEntityPublisherEntType, strlen(revEntityPublisherEntType)) && strcmp(revEntityPublisherEntType, "rev_user_entity") == 0) {
                jobject jPosRecRevPublisherEntity = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);

                REV_ENTITY_JNI_POSREC *revUserEntityJniPosRec = revLoadRevEntityJniPosRec(env);
                revFillDataRecValuesToJni(env, jPosRecRevPublisherEntity, &revEntityPublisher, revUserEntityJniPosRec);

                env->SetObjectField(jPosRec, revEntityJniPosRec->_revPublisherEntity_ID, jPosRecRevPublisherEntity);
                env->DeleteLocalRef(jPosRecRevPublisherEntity);
            }
        }
    }
}

void revFillDataRecValuesToJni(JNIEnv *env, jobject jPosRec, RevEntity *cPosRec, REV_ENTITY_JNI_POSREC *revEntityJniPosRec) {
    char revNullStr[] = "NULL";

    if (cPosRec == NULL) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> RevEntity *cPosRec - The pointer is null.\n");
        return;
    }

    if (cPosRec->_revEntityType == NULL || ((cPosRec->_revEntityType)[0] == '\0')) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "cPosRec->_revEntityType NULL FILL");

        cPosRec->_revEntityType = strdup((revNullStr));
    }

    const char *revEntityTypeValue = cPosRec->_revEntityType;

    if (!revIsUTF8(revEntityTypeValue, strlen(revEntityTypeValue))) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>>> revFillDataRecValuesToJni >>> cPosRec->_revEntityType >>> - NO UTF - value >>> %s : ", cPosRec->_revEntityType);
    }

    jstring revEntityType_Obj = env->NewStringUTF(revEntityTypeValue);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revEntityType_ID, revEntityType_Obj);
    env->DeleteLocalRef(revEntityType_Obj);

    if (cPosRec->_revEntitySubType == NULL || ((cPosRec->_revEntitySubType)[0] == '\0')) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "cPosRec->_revEntitySubType NULL FILL");

        cPosRec->_revEntitySubType = strdup((revNullStr));
    }

    const char *revEntitySubTypeValue = cPosRec->_revEntitySubType;

    jstring revEntitySubType_Obj = env->NewStringUTF(cPosRec->_revEntitySubType);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revEntitySubType_ID, revEntitySubType_Obj);
    env->DeleteLocalRef(revEntitySubType_Obj);

    jint revEntityChildableStatus = (int) cPosRec->_revEntityChildableStatus;
    env->SetIntField(jPosRec, revEntityJniPosRec->_revEntityChildableStatus, revEntityChildableStatus);

    jint revEntityResolveStatus_Obj = (int) cPosRec->_revEntityResolveStatus;
    env->SetIntField(jPosRec, revEntityJniPosRec->_revEntityResolveStatus, revEntityResolveStatus_Obj);

    jclass revJClassLong = (env)->FindClass("java/lang/Long");
    jmethodID const_longMethodId = env->GetMethodID(revJClassLong, "<init>", "(J)V");

    jobject revEntityGUID_Obj = env->NewObject(revJClassLong, const_longMethodId, (jlong) (cPosRec->_revEntityGUID));
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revEntityGUID_ID, revEntityGUID_Obj);
    env->DeleteLocalRef(revEntityGUID_Obj);

    jobject revRemoteEntityGUID_Obj = env->NewObject(revJClassLong, const_longMethodId, (jlong) cPosRec->_revRemoteEntityGUID);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revRemoteEntityGUID_ID, revRemoteEntityGUID_Obj);
    env->DeleteLocalRef(revRemoteEntityGUID_Obj);

    jobject revOwnerEntityGUID_Obj = env->NewObject(revJClassLong, const_longMethodId, (jlong) cPosRec->_revOwnerEntityGUID);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revEntityOwnerGUID_ID, revOwnerEntityGUID_Obj);
    env->DeleteLocalRef(revOwnerEntityGUID_Obj);

    jobject revContainerEntityGUID_Obj = env->NewObject(revJClassLong, const_longMethodId, (jlong) cPosRec->_revContainerEntityGUID);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revEntityContainerGUID_ID, revContainerEntityGUID_Obj);
    env->DeleteLocalRef(revContainerEntityGUID_Obj);

    jint revEntityAccessPermission = cPosRec->_revEntityAccessPermission;
    env->SetIntField(jPosRec, revEntityJniPosRec->_revEntityAccessPermission_ID, revEntityAccessPermission);

    /** _revTimeCreated **/
    jobject revTimeCreated_Obj = env->NewObject(revJClassLong, const_longMethodId, (long long) cPosRec->_revTimeCreated);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revTimeCreated_ID, revTimeCreated_Obj);
    env->DeleteLocalRef(revTimeCreated_Obj);

    /** _revTimePublishedUpdated **/
    jobject _revTimePublished_ID_Obj = env->NewObject(revJClassLong, const_longMethodId, (long long) cPosRec->_revTimePublished);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revTimePublished_ID, _revTimePublished_ID_Obj);
    env->DeleteLocalRef(_revTimePublished_ID_Obj);

    /** _revTimePublishedUpdated **/
    jobject _revTimePublishedUpdated_Obj = env->NewObject(revJClassLong, const_longMethodId, (long long) cPosRec->_revTimePublishedUpdated);
    env->SetObjectField(jPosRec, revEntityJniPosRec->_revTimePublishedUpdated_ID, _revTimePublishedUpdated_Obj);
    env->DeleteLocalRef(_revTimePublishedUpdated_Obj);

    list revList;
    revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(&revList, cPosRec->_revEntityGUID);

    if (list_size(&revList) > 0) {
        list_for_each(&revList, revPersGetRevEntityMetadata);

        // First, get all the methods we need:
        jclass arrayListClass = env->FindClass("java/util/ArrayList");
        jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
        jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

        // The list we're going to return:
        jobject revMetadataJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

        for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
            jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
            env->CallBooleanMethod(revMetadataJObjectArrayList, addMethod, jPosRec);
            env->DeleteLocalRef(jPosRec);
        }

        searchRecordResultRevEntityMetadata.clear();

        env->SetObjectField(jPosRec, revEntityJniPosRec->_revEntityMetadataList_ID, revMetadataJObjectArrayList);
    }

    // LOAD INFO
    revLoadEntityInfo(env, jPosRec, cPosRec, revEntityJniPosRec);
}

/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/

/** REV  ENTITY **/

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revEntityExistsByRemoteEntityGUID(JNIEnv *env, jobject instance, jlong revRemoteEntityGUID) {
    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revEntityExistsByRemoteEntityGUID <<<");
    return revEntityExistsByRemoteEntityGUID((long) revRemoteEntityGUID);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetEntityOwnerGUID_1BY_1EntityGUID(JNIEnv *env, jobject thiz, jlong rev_entity_guid) {
    return revGetEntityOwnerGUID_BY_EntityGUID((long) rev_entity_guid);
}

extern "C" JNIEXPORT jobjectArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGet_1ALL_1RevEntity_1By_1SiteGUID_1SubType(JNIEnv *env, jobject thiz, jlong rev_site_entity_guid, jstring rev_entity_sub_type) {
    const char *revEntitySubType = env->GetStringUTFChars(rev_entity_sub_type, 0);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

    list revList;
    revPersGet_ALL_RevEntity_By_SiteGUID_SubType(&revList, (long) rev_site_entity_guid, strdup(revEntitySubType));
    list_for_each(&revList, revPersGetRevEntityDataRevEntity);

    jobjectArray jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    for (size_t i = 0; i < searchRecordResultRevEntity.size(); i++) {
        if (searchRecordResultRevEntity[i] == NULL || searchRecordResultRevEntity[i]->_revEntityType[0] == '\0') {
            continue;
        }

        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, searchRecordResultRevEntity[i], revEntityJniPosRec);
        env->SetObjectArrayElement(jPosRecArray, i, jPosRec);
    }

    searchRecordResultRevEntity.clear();

    env->ReleaseStringUTFChars(rev_entity_sub_type, revEntitySubType);

    return jPosRecArray;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGet_1ALL_1UNIQUE_1GUIDs_1By_1FieldName_1SiteGUID_1SubTYPE(JNIEnv *env, jobject thiz, jstring rev_dbtable_field_name, jlong rev_site_entity_guid, jstring rev_entity_sub_type) {
    const char *revDBTableFieldName = env->GetStringUTFChars(rev_dbtable_field_name, 0);
    const char *revEntitySubType = env->GetStringUTFChars(rev_entity_sub_type, 0);

    list revList;
    revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(&revList, revDBTableFieldName, rev_site_entity_guid, revEntitySubType);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    if (list_size(&revList) < 1)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityDataLong);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(rev_dbtable_field_name, revDBTableFieldName);
    env->ReleaseStringUTFChars(rev_entity_sub_type, revEntitySubType);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revEntitySubtypeExists_1BY_1OWNER_1GUID(JNIEnv *env, jobject instance, jlong revEntityOwnerGUID, jstring revEntitySubtype_) {
    const char *revEntitySubtype = env->GetStringUTFChars(revEntitySubtype_, 0);

    int exists = revEntitySubtypeExists_BY_OWNER_GUID((long) revEntityOwnerGUID, strdup(revEntitySubtype));

    env->ReleaseStringUTFChars(revEntitySubtype_, revEntitySubtype);

    return exists;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revEntitySubtypeExists_1BY_1CONTAINER_1GUID(JNIEnv *env, jobject instance, jlong revEntityContainerGUID, jstring revEntitySubtype_) {
    const char *revEntitySubtype = env->GetStringUTFChars(revEntitySubtype_, 0);
    long exists = revEntitySubtypeExists_BY_CONTAINER_GUID((long) revEntityContainerGUID, strdup(revEntitySubtype));
    env->ReleaseStringUTFChars(revEntitySubtype_, revEntitySubtype);
    return exists;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetPublicationDate(JNIEnv *env, jobject instance, jlong revLocalEntityGUID) {
    return revGetPublicationDate((long) revLocalEntityGUID);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRemoteEntityGUID_1BY_1LocalEntityGUID(JNIEnv *env, jobject instance, jlong revLocalEntityGUID) {
    return revGetRemoteEntityGUID_BY_LocalEntityGUID((long) revLocalEntityGUID);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetLocalEntityGUID_1By_1RemoteEntityGUID(JNIEnv *env, jobject thiz, jlong rev_remote_entity_guid) {
    return revGetLocalEntityGUID_By_RemoteEntityGUID((long) rev_remote_entity_guid);
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityByGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {
    long c_revEntityGUID = (long) revEntityGUID;

    if (c_revEntityGUID < 1)
        return NULL;

    RevEntity revEntity = revPersGetRevEntityByGUID(c_revEntityGUID);

    if (revEntity._isNull == 0) {
        REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, &revEntity, revEntityJniPosRec);

        return jPosRec;
    }

    return NULL;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetEntity_1By_1RemoteEntityGUID(JNIEnv *env, jobject thiz, jlong rev_remote_entity_guid) {
    long c_revRemoteEntityGUID = (long) rev_remote_entity_guid;

    RevEntity revEntity = revPersGetEntity_By_RemoteEntityGUID(c_revRemoteEntityGUID);

    if (revEntity._isNull == 0) {
        REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, &revEntity, revEntityJniPosRec);

        return jPosRec;
    }

    return NULL;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityTypeGUIDs(JNIEnv *env, jobject instance, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    list revList;
    revPersGetALLRevEntityGUIDs_By_RevEntityType(&revList, strdup(revEntityType));
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityTypes(JNIEnv *env, jobject instance, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetALLRevEntitySubTYPEs(&revList, strdup(revEntityType));

    if (list_size(&revList) < 1)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityDataLong);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1By_1ContainerGUID(JNIEnv *env, jobject instance, jlong revEntityContainerGUID) {
    list revList;
    revPersGetALLRevEntityGUIDs_By_ContainerGUID(&revList, (long) revEntityContainerGUID);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jclass cls = env->FindClass("java/lang/Long");
    jmethodID revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    if (list_size(&revList) < 1)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityDataLong);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        jobject obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1By_1RevEntityType(JNIEnv *env, jobject instance, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    list revList;
    revPersGetALLRevEntityGUIDs_By_RevEntityType(&revList, strdup(revEntityType));

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    if (list_size(&revList) < 1)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityDataLong);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobjectArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityTYPE(JNIEnv *env, jobject instance, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

    list revList;
    revPersGetALLRevEntityTYPE(&revList, strdup(revEntityType));

    jobjectArray jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    if (list_size(&revList) < 1)
        return jPosRecArray;

    list_for_each(&revList, revPersGetRevEntityDataRevEntity);

    jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    for (size_t i = 0; i < searchRecordResultRevEntity.size(); i++) {
        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, searchRecordResultRevEntity[i], revEntityJniPosRec);
        env->SetObjectArrayElement(jPosRecArray, i, jPosRec);

        env->DeleteLocalRef(jPosRec);
    }

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    searchRecordResultRevEntity.clear();

    return jPosRecArray;
}

extern "C" JNIEXPORT jobjectArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntity_1By_1SubType(JNIEnv *env, jobject instance, jstring revEntitySubType_) {
    const char *revEntitySubType = env->GetStringUTFChars(revEntitySubType_, 0);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

    list revList;
    revPersGetALLRevEntity_By_SubType(&revList, strdup(revEntitySubType));

    jobjectArray jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    if (list_size(&revList) < 1)
        return jPosRecArray;

    list_for_each(&revList, revPersGetRevEntityDataRevEntity);

    jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    for (size_t i = 0; i < searchRecordResultRevEntity.size(); i++) {
        REV_ENTITY_JNI_POSREC *revCurrEntityJniPosRec = revLoadRevEntityJniPosRec(env);
        jobject jPosRec = env->NewObject(revCurrEntityJniPosRec->cls, revCurrEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, searchRecordResultRevEntity[i], revCurrEntityJniPosRec);
        env->SetObjectArrayElement(jPosRecArray, i, jPosRec);

        env->DeleteLocalRef(jPosRec);
    }

    searchRecordResultRevEntity.clear();

    env->ReleaseStringUTFChars(revEntitySubType_, revEntitySubType);

    return jPosRecArray;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersQuery_1By_1RevVarArgs(JNIEnv *env, jobject thiz, jstring rev_table_name, jstring rev_var_args) {
    const char *revTableName = env->GetStringUTFChars(rev_table_name, 0);
    const char *revVarArgs = env->GetStringUTFChars(rev_var_args, 0);

    searchRecordResultRevEntityMetadata.clear();

    cJSON *revJsonArr = revPersGetData_By_RevVarArgs(strdup(revTableName), strdup(revVarArgs));

    char revEntityTableName[] = "REV_ENTITY_TABLE";
    char revMetadataTableName[] = "REV_ENTITY_METADATA_TABLE";

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    if (revJsonArr != NULL && cJSON_IsArray(revJsonArr)) {
        cJSON *revEntityMetadataJSON = NULL;

        cJSON_ArrayForEach(revEntityMetadataJSON, revJsonArr) {
            char *revCurrEntityStrVal = cJSON_Print(revEntityMetadataJSON);

            if (strcmp(revEntityTableName, strdup(revTableName)) == 0) {
                RevEntity revEntity = *revJSONEntityFiller(revCurrEntityStrVal);

                REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);
                jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
                revFillDataRecValuesToJni(env, jPosRec, &revEntity, revEntityJniPosRec);

                env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
                env->DeleteLocalRef(jPosRec);
            } else if (strcmp(revMetadataTableName, strdup(revTableName)) == 0) {
                jobject jPosRec = revGetFilledRevMetadataJniObjectFromJsonStr(env, revCurrEntityStrVal);
                env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
                env->DeleteLocalRef(jPosRec);
            }

            free(revCurrEntityStrVal);
        }
    }

    cJSON_Delete(revJsonArr);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getNumberOfUnreadRevEntites(JNIEnv *env, jobject instance) {
    return getNumberOfUnreadRevEntites();
}

extern "C" JNIEXPORT jobjectArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGet_1ALL_1RevEntity_1By_1RevEntityContainerGUID_1SubTYPE(JNIEnv *env, jobject instance, jlong revEntityContainerGUID, jstring revEntitySubType_) {
    const char *revEntitySubType = env->GetStringUTFChars(revEntitySubType_, 0);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

    list revList;
    revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(&revList, (long) revEntityContainerGUID, strdup(revEntitySubType));
    list_for_each(&revList, revPersGetRevEntityDataRevEntity);

    jobjectArray jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    for (size_t i = 0; i < searchRecordResultRevEntity.size(); i++) {
        if (searchRecordResultRevEntity[i] == NULL || searchRecordResultRevEntity[i]->_revEntityType[0] == '\0')
            continue;

        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, searchRecordResultRevEntity[i], revEntityJniPosRec);
        env->SetObjectArrayElement(jPosRecArray, i, jPosRec);
    }

    searchRecordResultRevEntity.clear();

    env->ReleaseStringUTFChars(revEntitySubType_, revEntitySubType);

    return jPosRecArray;
}

extern "C" JNIEXPORT jobjectArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityUnSyched(JNIEnv *env, jobject instance) {
    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

    list revList;
    revPersGetALLRevEntityUnSyched(&revList);
    list_for_each(&revList, revPersGetRevEntityDataRevEntity);

    jobjectArray jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    for (size_t i = 0; i < searchRecordResultRevEntity.size(); i++) {
        if (searchRecordResultRevEntity[i] == NULL || searchRecordResultRevEntity[i]->_revEntityType[0] == '\0')
            continue;

        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, searchRecordResultRevEntity[i], revEntityJniPosRec);
        env->SetObjectArrayElement(jPosRecArray, i, jPosRec);
    }

    searchRecordResultRevEntity.clear();

    return jPosRecArray;
}

extern "C" JNIEXPORT jobjectArray JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityUnSychedByType(JNIEnv *env, jobject instance, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);

    list revList;
    revPersGetALLRevEntityUnSychedByType(&revList, strdup(revEntityType));
    list_for_each(&revList, revPersGetRevEntityDataRevEntity);

    jobjectArray jPosRecArray = env->NewObjectArray(searchRecordResultRevEntity.size(), revEntityJniPosRec->cls, NULL);

    for (size_t i = 0; i < searchRecordResultRevEntity.size(); i++) {
        jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);
        revFillDataRecValuesToJni(env, jPosRec, searchRecordResultRevEntity[i], revEntityJniPosRec);
        env->SetObjectArrayElement(jPosRecArray, i, jPosRec);

        env->DeleteLocalRef(jPosRec);
    }

    searchRecordResultRevEntity.clear();

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    return jPosRecArray;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDsByOwnerGUID(JNIEnv *env, jobject instance, jlong revEntityOwnerGUID) {
    list revList;
    revPersGetALLRevEntityGUIDsByOwnerGUID(&revList, (long) revEntityOwnerGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1By_1ContainerEntityGUID_1RevEntityType(JNIEnv *env, jobject instance, jlong revContainerEntityGUID, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    list revList;
    revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(&revList, (long) revContainerEntityGUID, strdup(revEntityType));
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1By_1OwnerGUID_1RevEntityType(JNIEnv *env, jobject instance, jlong revEntityOwnerGUID, jstring revEntityType_) {
    const char *revEntityType = env->GetStringUTFChars(revEntityType_, 0);

    list revList;
    revPersGetALLRevEntityGUIDsByOwnerGUID_Type(&revList, strdup(revEntityType), (long) revEntityOwnerGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityType_, revEntityType);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLREntitySubtypeByOwnerGUID(JNIEnv *env, jobject instance, jstring revEntitySubtype_, jlong revEntityOwnerGUID) {
    const char *revEntitySubtype = env->GetStringUTFChars(revEntitySubtype_, 0);

    list revList;
    revPersGetALLEntitySubtypeGUIDsByOwnerGUID(&revList, strdup(revEntitySubtype), (long) revEntityOwnerGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntitySubtype_, revEntitySubtype);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1By_1ResStatus(JNIEnv *env, jobject instance, jint revResolveStatus) {
    list revList;
    revPersGetALLRevEntityGUIDs_By_ResStatus(&revList, (int) revResolveStatus);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLrevRemoteEntityGUIDs_1By_1ResStatus(JNIEnv *env, jobject instance, jint revResolveStatus) {
    list revList;
    revPersGetALLrevRemoteEntityGUIDs_By_ResStatus(&revList, (int) revResolveStatus);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1By_1revResolveStatus_1SubType(JNIEnv *env, jobject thiz, jint rev_resolve_status, jstring rev_entity_subtype) {
    // TODO: implement revPersGetALLRevEntityGUIDs_By_revResolveStatus_SubType()
    const char *revEntitySubtype = env->GetStringUTFChars(rev_entity_subtype, 0);

    list revList;
    revPersGetALLRevEntityGUIDs_By_revResolveStatus_SubType(&revList, (int) rev_resolve_status, strdup(revEntitySubtype));
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(rev_entity_subtype, revEntitySubtype);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntityGUID_1By_1RevEntityOwnerGUID_1Subtype(JNIEnv *env, jobject instance, jlong revEntityOwnerGUID, jstring revEntitySubtype_) {
    const char *revEntitySubtype = env->GetStringUTFChars(revEntitySubtype_, 0);

    long revEntityGUID = revGetRevEntityGUID_By_RevEntityOwnerGUID_Subtype((long) revEntityOwnerGUID, strdup(revEntitySubtype));

    env->ReleaseStringUTFChars(revEntitySubtype_, revEntitySubtype);

    return revEntityGUID;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetEntity_1By_1RevEntityOwnerGUID_1Subtype(JNIEnv *env, jobject thiz, jlong rev_entity_owner_guid, jstring rev_entity_subtype) {
    const char *revEntitySubtype = env->GetStringUTFChars(rev_entity_subtype, 0);

    long revEntityGUID = revGetRevEntityGUID_By_RevEntityOwnerGUID_Subtype((long) rev_entity_owner_guid, strdup(revEntitySubtype));

    env->ReleaseStringUTFChars(rev_entity_subtype, revEntitySubtype);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);
    jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);

    if (revEntityGUID > 0) {
        RevEntity revEntity = revPersGetRevEntityByGUID(revEntityGUID);

        if (revEntity._revEntityType[0] != '\0') {
            revFillDataRecValuesToJni(env, jPosRec, &revEntity, revEntityJniPosRec);
            return jPosRec;
        }
    }

    return NULL;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntity_1By_1RevEntityContainerGUID_1Subtype(JNIEnv *env, jobject instance, jlong revEntityContainerGUID, jstring revEntitySubtype_) {
    const char *revEntitySubtype = env->GetStringUTFChars(revEntitySubtype_, 0);

    long revEntityGUID = revGetRevEntityGUID_By_RevEntityContainerEntityGUID_Subtype((long) revEntityContainerGUID, strdup(revEntitySubtype));

    env->ReleaseStringUTFChars(revEntitySubtype_, revEntitySubtype);

    REV_ENTITY_JNI_POSREC *revEntityJniPosRec = revLoadRevEntityJniPosRec(env);
    jobject jPosRec = env->NewObject(revEntityJniPosRec->cls, revEntityJniPosRec->constructortor_ID);

    if (revEntityGUID > 0) {
        RevEntity revEntity = revPersGetRevEntityByGUID(revEntityGUID);

        if (revEntity._revEntityType[0] != '\0') {
            revFillDataRecValuesToJni(env, jPosRec, &revEntity, revEntityJniPosRec);
            return jPosRec;
        }
    }

    return NULL;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntityGUIDByRevEntityContainerGUID_1Subtype(JNIEnv *env, jobject instance, jlong revEntityContainerGUID, jstring revEntitySubtype_) {
    const char *revEntitySubtype = env->GetStringUTFChars(revEntitySubtype_, 0);

    long revEntityGUID = revGetRevEntityGUID_By_RevEntityContainerEntityGUID_Subtype((long) revEntityContainerGUID, strdup(revEntitySubtype));

    env->ReleaseStringUTFChars(revEntitySubtype_, revEntitySubtype);

    return revEntityGUID;
}

extern "C" JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityType_By_RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {
    return env->NewStringUTF(revGetRevEntityType_By_RevEntityGUID(revEntityGUID));
}

extern "C" JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntitySubType_By_RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {
    return env->NewStringUTF(revGetRevEntitySubType_By_RevEntityGUID((long) revEntityGUID));
}

/** END REV  ENTITY **/

/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/

/** REV ENTITY RELATIONSHIPS **/

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityRels_1By_1ResStatus(JNIEnv *env, jobject instance, jint revResStatus) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetRevEntityRels_By_ResStatus(&revList, (int) revResStatus);
    int revItemsListSize = list_size(&revList);

    if (revItemsListSize == 0)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        if (revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntitySubjectGUID) == -1 || revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntityTargetGUID) == -1) {
            revPersUpdateRelResStatus_By_RelId(searchRecordResultRevEntityRelationship[i]._revEntityRelationshipId, -3);
            continue;
        }

        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityRels_1By_1ResStatus_1RelType(JNIEnv *env, jobject thiz, jint rev_res_status, jstring rev_entity_relationship) {
    char *revEntityRelationship = strdup(env->GetStringUTFChars(rev_entity_relationship, 0));

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetRevEntityRels_By_ResStatus_RelType(&revList, (int) rev_res_status, revEntityRelationship);
    int revItemsListSize = list_size(&revList);

    if (revItemsListSize == 0)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        if (revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntitySubjectGUID) == -1 || revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntityTargetGUID) == -1) {
            revPersUpdateRelResStatus_By_RelId(searchRecordResultRevEntityRelationship[i]._revEntityRelationshipId, -3);
            continue;
        }

        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelationshipsAcceptedUnSyched(JNIEnv *env, jobject instance, jlong revEntityTargetGUID, jint revRelResolveStatus) {
    list revList;
    revPersGetALLRevEntityRelationshipsAcceptedUnSyched(&revList, (long) revEntityTargetGUID, (int) revRelResolveStatus);
    int revItemsListSize = list_size(&revList);

    if (revItemsListSize == 0)
        return NULL;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRevEntityRelationshipsByRelTypeValueId(JNIEnv *env, jobject instance, jlong relTypeValueId) {
    list revList;
    revPersGetALLRevEntityRelationships_By_RelTypeValueId(&revList, (long) relTypeValueId);
    list_for_each(&revList, revPersGetRevEntityRelationship);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID(JNIEnv *env, jobject instance, jlong relTypeValueId, jlong revEntitySubjectGUID) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject retJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID(&revList, (long) relTypeValueId, (long) revEntitySubjectGUID);

    if (list_size(&revList) < 1)
        return retJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(retJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return retJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityRelsSubjects_1By_1RelTypeValueId_1TargetGUID_1ResolveStatus(JNIEnv *env, jobject instance, jint relTypeValueId, jlong revEntityTargetGUID, jint revEntityResolveStatus) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_revResolveStatus(&revList, (int) relTypeValueId, (long) revEntityTargetGUID, (int) revEntityResolveStatus);

    if (list_size(&revList) < 1)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        if (searchRecordResultRevEntityRelationship[i]._revEntityRelationshipId < 1)
            continue;

        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRemoteRelsGUIDs_1By_1RelTypeValueId_1RevEntityGUID_1ResolveStatus(JNIEnv *env, jobject instance, jint relTypeValueId, jlong revEntityGUID, jint revEntityResolveStatus) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetContainerJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetRemoteRelsGUIDs_By_RelTypeValueId_RevEntityGUID_revResolveStatus(&revList, (int) relTypeValueId, (long) revEntityGUID, (int) revEntityResolveStatus);
    list_for_each(&revList, revPersGetRevEntityRelationship);

    jclass cls = env->FindClass("java/lang/Long");
    jmethodID revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject revRemoteSubjectGUID_OBJ = env->NewObject(cls, revLongConstructor, (long long) searchRecordResultRevEntityRelationship[i]._revRemoteEntitySubjectGUID);
        jobject revRemoteTargetGUID_OBJ = env->NewObject(cls, revLongConstructor, (long long) searchRecordResultRevEntityRelationship[i]._revRemoteEntityTargetGUID);

        // The list we're going to return:
        jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, revRemoteSubjectGUID_OBJ);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, revRemoteTargetGUID_OBJ);

        env->CallBooleanMethod(revRetContainerJObjectArrayList, addMethod, revRetJObjectArrayList);
    }

    return revRetContainerJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetAllRevEntityRels_1By_1RelType_1ValueId_1ResolveStatus(JNIEnv *env, jobject instance, jint relTypeValueId, jlong revEntityGUID, jint revResolveStatus) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject retJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetAllRevEntityRels_By_RelType_ValueId_revResolveStatus(&revList, (int) relTypeValueId, (long) revEntityGUID, (int) revResolveStatus);

    if (list_size(&revList) < 1)
        return retJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(retJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return retJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID(JNIEnv *env, jobject instance, jlong relTypeValueId, jlong revEntityTargetGUID) {
    list revList;
    revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID(&revList, (long) relTypeValueId, (long) revEntityTargetGUID);
    list_for_each(&revList, revPersGetRevEntityRelationship);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevRelationshipSubjectGUID_1By_1RelId(JNIEnv *env, jobject instance, jlong relationshipId) {
    return getRevRelationshipSubjectGUID_By_RelId((long) relationshipId);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevRelationshipTargetGUID_1By_1RelationshipId(JNIEnv *env, jobject instance, jlong relationshipId) {
    return getRevRelationshipTargetGUID_By_RelationshipId((long) relationshipId);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntityRelationshipTargetGUIDByRelationshipValueId(JNIEnv *env, jobject instance, jlong relationshipValueId) {
    return getRevRelationshipTargetGUIDByRelationshipValueId((long) relationshipValueId);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntityRelationshipId_1By_1RelType_1Subject_1Target(JNIEnv *env, jobject instance, jstring revEntityRelationship_, jlong remoteRevEntitySubjectGuid, jlong remoteRevEntityTargetGuid) {
    const char *revEntityRelationship = env->GetStringUTFChars(revEntityRelationship_, 0);
    long revRelId = getRevEntityRelationshipId_By_RelType_Subject_Target(strdup(revEntityRelationship), (long) remoteRevEntitySubjectGuid, (long) remoteRevEntityTargetGuid);
    env->ReleaseStringUTFChars(revEntityRelationship_, revEntityRelationship);

    return revRelId;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelationshipsTargets(JNIEnv *env, jobject instance, jstring revEntityRelationship_, jlong revEntitySubjectGUID) {
    const char *revEntityRelationship = env->GetStringUTFChars(revEntityRelationship_, 0);

    list revList;
    revPersGetALLRevEntityRelationshipsTargets(&revList, strdup(revEntityRelationship), (long) revEntitySubjectGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityRelationship_, revEntityRelationship);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelGUIDs_1By_1RelType_1revRemoteEntityGUID(JNIEnv *env, jobject instance, jstring revEntityRelationship_, jlong revEntityGUID) {
    const char *revEntityRelationship = env->GetStringUTFChars(revEntityRelationship_, 0);

    list revList;
    revPersGetALLRevEntityRelGUIDs_By_RelType_revRemoteEntityGUID(&revList, strdup(revEntityRelationship), (long) revEntityGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        if (searchRecordResultLong[i] == (long) revEntityGUID)
            continue;

        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revEntityRelationship_, revEntityRelationship);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRels_1By_1RelType_1RevEntityGUID_1LocalGUIDs(JNIEnv *env, jobject thiz, jstring rev_rel_type, jlong rev_entity_guid, jlong rev_local_guid_1, jlong rev_local_guid_2) {
    const char *revEntityRelationship = env->GetStringUTFChars(rev_rel_type, 0);

    long revEntityGUID = (long) rev_entity_guid;
    long revLocalGUID_1 = (long) rev_local_guid_1;
    long revLocalGUID_2 = (long) rev_local_guid_2;

    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revGetRels_By_RelType_RevEntityGUID_LocalGUIDs(&revList, revEntityRelationship, revEntityGUID, revLocalGUID_1, revLocalGUID_2);
    int revItemsListSize = list_size(&revList);

    if (revItemsListSize == 0)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        if (revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntitySubjectGUID) == -1 || revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntityTargetGUID) == -1) {
            revPersUpdateRelResStatus_By_RelId(searchRecordResultRevEntityRelationship[i]._revEntityRelationshipId, -3);
            continue;
        }

        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRels_1By_1RelType_1LocalGUIDs(JNIEnv *env, jobject thiz, jstring rev_rel_type, jlong rev_local_guid_1, jlong rev_local_guid_2) {
    const char *revEntityRelationship = env->GetStringUTFChars(rev_rel_type, 0);
    long revLocalGUID_1 = (long) rev_local_guid_1;
    long revLocalGUID_2 = (long) rev_local_guid_2;

    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revGetRels_By_RelType_LocalGUIDs(&revList, revEntityRelationship, revLocalGUID_1, revLocalGUID_2);
    int revItemsListSize = list_size(&revList);

    if (revItemsListSize == 0)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        if (revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntitySubjectGUID) == -1 || revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntityTargetGUID) == -1) {
            revPersUpdateRelResStatus_By_RelId(searchRecordResultRevEntityRelationship[i]._revEntityRelationshipId, -3);
            continue;
        }

        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRels_1By_1RelType_1RemoteGUIDs(JNIEnv *env, jobject thiz, jstring rev_rel_type, jlong rev_remote_guid_1, jlong rev_remote_guid_2) {
    const char *revEntityRelationship = env->GetStringUTFChars(rev_rel_type, 0);
    long revRemoteGUID_1 = (long) rev_remote_guid_1;
    long revRemoteGUID_2 = (long) rev_remote_guid_2;

    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revGetRels_By_RelType_RemoteGUIDs(&revList, revEntityRelationship, revRemoteGUID_1, revRemoteGUID_2);
    int revItemsListSize = list_size(&revList);

    if (revItemsListSize == 0)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        if (revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntitySubjectGUID) == -1 || revEntityExistsByLocalEntityGUID(searchRecordResultRevEntityRelationship[i]._revEntityTargetGUID) == -1) {
            revPersUpdateRelResStatus_By_RelId(searchRecordResultRevEntityRelationship[i]._revEntityRelationshipId, -3);
            continue;
        }

        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevRels_1RemoteRelId_1By_1ResolveStatus(JNIEnv *env, jobject instance, jint revRelResolveStatus) {
    list revList;
    revPersGetALLRevRels_RemoteRelId_By_revResolveStatus(&revList, (int) revRelResolveStatus);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevRels_1RemoteRelId_1By_1ResolveStatus_1RemoteTargetGUID(JNIEnv *env, jobject instance, jint revRelResolveStatus, jlong remoteTargetGUID) {
    list revList;
    revPersGetALLRevRels_RemoteRelId_By_revResolveStatus_RemoteTargetGUID(&revList, (int) revRelResolveStatus, (long) remoteTargetGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelValIds_1By_1RevResStatus(JNIEnv *env, jobject instance, jint revResStatus) {
    list revList;
    revPersGetALLRevEntityRelValIds_By_RevResStatus(&revList, (int) revResStatus);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetUnresolvedRemoteSubjectGUIDSRelIds(JNIEnv *env, jobject instance) {
    list revList;
    revPersGetUnresolvedRemoteSubjectGUIDsRelIds(&revList);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetUnresolvedRemoteTargetGUIDSRelIds(JNIEnv *env, jobject instance) {
    list revList;
    revPersGetUnresolvedRemoteTargetGUIDSRelIds(&revList);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRelSubjectGUIDs_1By_1TargetGUID(JNIEnv *env, jobject instance, jlong revEntityTargetGUID) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetALLRelSubjectGUIDs_By_TargetGUID(&revList, (long) revEntityTargetGUID);

    if (list_size(&revList) < 1)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityDataLong);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelationshipsSubjectGUIDs_1BY_1RelStr_1TargetGUID(JNIEnv *env, jobject thiz, jstring rev_entity_relationship, jlong rev_entity_target_guid) {
    const char *revEntityRelationship = env->GetStringUTFChars(rev_entity_relationship, 0);

    searchRecordResultLong.clear();

    list revList;
    revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(&revList, strdup(revEntityRelationship), (long) rev_entity_target_guid);

    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
        env->DeleteLocalRef(obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(rev_entity_relationship, revEntityRelationship);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetSubjectGUID_1BY_1RelStr_1TargetGUID(JNIEnv *env, jobject thiz, jstring rev_entity_relationship, jlong rev_entity_target_guid) {
    const char *revEntityRelationship = env->GetStringUTFChars(rev_entity_relationship, 0);
    long revEntityGUID = revPersGetSubjectGUID_BY_RelStr_TargetGUID(strdup(revEntityRelationship), (long) rev_entity_target_guid);

    return (jlong) revEntityGUID;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelationshipsSubjectGUID_1BY_1TARGET_1GUID(JNIEnv *env, jobject instance, jlong targetGUID) {
    list revList;
    revPersGetALLRevEntityRelationshipsSubjectGUID_BY_TARGET_GUID(&revList, (long) targetGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetUnresolvedRemoteGUIDsRelId(JNIEnv *env, jobject instance) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject retJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    revPersGetUnresolvedRemoteGUIDsRelId(&revList);

    if (list_size(&revList) < 1)
        return retJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityRelationship);

    for (int i = 0; i < searchRecordResultRevEntityRelationship.size(); i++) {
        jobject jPosRec = revFillDataRecValuesToRevEntityRelationshipJni(env, searchRecordResultRevEntityRelationship[i]);
        env->CallBooleanMethod(retJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityRelationship.clear();

    return retJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRelationshipsSubjectGUID(JNIEnv *env, jobject instance) {
    list revList;
    revPersGetALLRevEntityRelationshipsSubjectGUID(&revList);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        // Create a object of type Long.
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevRelationshipTimeCreated(JNIEnv *env, jobject instance, jlong relationshipId) {
    char *timeCreated = getRevRelationshipTimeCreated((long) relationshipId);
    return env->NewStringUTF(timeCreated);
}

/** END REV ENTITY RELATIONSHIPS **/

/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/

/** REV ENTITY METADATA **/

extern "C" JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getMetadataValue_1By_1MetadataId(JNIEnv *env, jobject instance, jlong _revMetadataId) {
    char *revMetadataValue = getMetadataValue_By_MetadataId((long) _revMetadataId);
    return env->NewStringUTF(strdup(revMetadataValue));
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadataId_1By_1RevMetadataName_1RevEntityGUID(JNIEnv *env, jobject instance, jstring revMetadataName_, jlong revEntityGUID) {
    const char *revMetadataName = env->GetStringUTFChars(revMetadataName_, 0);

    long _revMetadataId = revGetRevEntityMetadataId_By_RevMetadataName_RevEntityGUID(strdup(revMetadataName), (long) revEntityGUID);

    env->ReleaseStringUTFChars(revMetadataName_, revMetadataName);

    return _revMetadataId;
}

extern "C" JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadataValue_1By_1RevMetadataName_1RevEntityGUID(JNIEnv *env, jobject instance, jstring revMetadataName_, jlong revEntityGUID) {
    const char *revMetadataName = env->GetStringUTFChars(revMetadataName_, 0);

    char *revMetadataValue = revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(strdup(revMetadataName), (long) revEntityGUID);
    env->ReleaseStringUTFChars(revMetadataName_, revMetadataName);

    return env->NewStringUTF(strdup(revMetadataValue));
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadata_1By_1RevMetadataName_1RevEntityGUID(JNIEnv *env, jobject thiz, jstring rev_metadata_name, jlong rev_entity_guid) {
    const char *revMetadataName = env->GetStringUTFChars(rev_metadata_name, 0);

    RevEntityMetadata revEntityMetadata = revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(strdup(revMetadataName), (long) rev_entity_guid);
    jobject jPosRec = revGetFilledRevMetadataJniObject(env, revEntityMetadata);

    env->ReleaseStringUTFChars(rev_metadata_name, revMetadataName);

    return jPosRec;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataByRevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {
    list revList;
    revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(&revList, (long) revEntityGUID);
    list_for_each(&revList, revPersGetRevEntityMetadata);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityMetadata.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataByResolveStatus(JNIEnv *env, jobject instance, jint revResolveStatus) {
    list revList;
    revPersGetALLRevEntityMetadataByResolveStatus(&revList, (int) revResolveStatus);
    list_for_each(&revList, revPersGetRevEntityMetadata);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityMetadata.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadata_1BY_1ResStatus_1revMetadataName(JNIEnv *env, jobject thiz, jint rev_resolve_status, jstring rev_metadata_name) {
    // TODO: implement revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName()
    const char *revMetadataName = env->GetStringUTFChars(rev_metadata_name, 0);

    searchRecordResultRevEntityMetadata.clear();

    list revList;
    revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName(&revList, (int) rev_resolve_status, strdup(revMetadataName));
    list_for_each(&revList, revPersGetRevEntityMetadata);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
        env->DeleteLocalRef(jPosRec);
    }

    searchRecordResultRevEntityMetadata.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataId_1By_1revMetadataName_1ResolveStatus(JNIEnv *env, jobject instance, jstring revMetadataName_, jint revResolveStatus) {
    const char *revMetadataName = env->GetStringUTFChars(revMetadataName_, 0);

    list revList;
    revPersGetALLRevEntityMetadataId_By_revMetadataName_revResolveStatus(&revList, strdup(revMetadataName), (int) revResolveStatus);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // For Long
    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(revMetadataName_, revMetadataName);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataIds_1By_1ResStatus(JNIEnv *env, jobject instance, jint revResolveStatus) {
    list revList;
    revPersGetALLRevEntityMetadataIds_By_ResStatus(&revList, (int) revResolveStatus);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // For Long
    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataIds_1By_1ResStatus_1RevEntityGUID(JNIEnv *env, jobject instance, jint revResolveStatus, jlong revEntityGUID) {
    list revList;
    revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(&revList, (int) revResolveStatus, (long) revEntityGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // For Long
    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadata_1By_1revMetadataName_1revMetadataValue(JNIEnv *env, jobject thiz, jstring rev_metadata_name, jstring rev_metadata_value) {
    // TODO: implement revGetRevEntityMetadata_By_revMetadataName_revMetadataValue()
    const char *revMetadataName = env->GetStringUTFChars(rev_metadata_name, 0);
    const char *revMetadataValue = env->GetStringUTFChars(rev_metadata_value, 0);

    RevEntityMetadata revEntityMetadata = revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(strdup(revMetadataName), strdup(revMetadataValue));

    if (revEntityMetadata._revMetadataId > 0) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, revEntityMetadata);

        return jPosRec;
    }

    return NULL;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadata_1By_1revMetadataName_1revMetadataValue_1EntityGUID(JNIEnv *env, jobject thiz, jstring rev_metadata_name, jstring rev_metadata_value, jlong rev_entity_guid) {
    // TODO: implement revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID()
    const char *revMetadataName = env->GetStringUTFChars(rev_metadata_name, 0);
    const char *revMetadataValue = env->GetStringUTFChars(rev_metadata_value, 0);
    long revEntityGUID = (long) rev_entity_guid;

    RevEntityMetadata revEntityMetadata = revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID(strdup(revMetadataName), strdup(revMetadataValue), revEntityGUID);

    if (revEntityMetadata._revMetadataId > 0) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, revEntityMetadata);

        return jPosRec;
    }

    return NULL;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataUnsynched(JNIEnv *env, jobject instance) {
    list revList;
    revPersGetALLRevEntityMetadataUnsynched(&revList);
    list_for_each(&revList, revPersGetRevEntityMetadata);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityMetadata.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityMetadata_1By_1MetadataId(JNIEnv *env, jobject instance, jlong _revMetadataId) {
    RevEntityMetadata revEntityMetadata = *(revPersGetRevEntityMetadata_By_MetadataId((long long) _revMetadataId));

    if (revEntityMetadata._revMetadataId > 0) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, revEntityMetadata);
        return jPosRec;
    }

    return NULL;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityMetadataUnsynched_1By_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {
    list revList;
    revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(&revList, (long) revEntityGUID);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    if (list_size(&revList) > 0) {
        list_for_each(&revList, revPersGetRevEntityMetadata);

        for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
            jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
            env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
        }

        searchRecordResultRevEntityMetadata.clear();
    }

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityRevEntityMetadataBy_1MetadataName_1OwnerGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jstring revMetadataName_) {
    const char *revMetadataName = env->GetStringUTFChars(revMetadataName_, 0);

    list revList;
    revPersGetALLRevEntityRevEntityMetadataBy_revMetadataName_OwnerGUID(&revList, strdup(revMetadataName), (long) revEntityGUID);
    list_for_each(&revList, revPersGetRevEntityMetadata);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultRevEntityMetadata.size(); i++) {
        jobject jPosRec = revGetFilledRevMetadataJniObject(env, searchRecordResultRevEntityMetadata[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, jPosRec);
    }

    searchRecordResultRevEntityMetadata.clear();

    env->ReleaseStringUTFChars(revMetadataName_, revMetadataName);

    return revRetJObjectArrayList;
}

/** END REV ENTITY METADATA **/

/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/

/** REV ENTITY ANOTATIONS **/

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revEntityAnnotationExists(JNIEnv *env, jobject instance, jstring revAnnotationName_, jlong revEntityGUID, jlong ownerEntityGUID) {
    const char *revAnnotationName = env->GetStringUTFChars(revAnnotationName_, 0);

    int annotationValueId = revEntityAnnotationExists_ByOwnerEntityGUID(strdup(revAnnotationName), (long) revEntityGUID, (long) ownerEntityGUID);

    env->ReleaseStringUTFChars(revAnnotationName_, revAnnotationName);

    return annotationValueId;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntityAnnoationValueIdBy_1revAnnotationName_1RevEntityGUID_1RevEntityOwnerGUID(JNIEnv *env, jobject instance, jstring revAnnotationName_, jlong revEntityGUID, jlong revEntityOwnerGUID) {
    const char *revAnnotationName = env->GetStringUTFChars(revAnnotationName_, 0);

    long annotationValueId = getRevAnnotationValueIdByOwnerEntityGUID(strdup(revAnnotationName), (long) revEntityGUID, (long) revEntityOwnerGUID);

    env->ReleaseStringUTFChars(revAnnotationName_, revAnnotationName);

    return annotationValueId;
}

extern "C" JNIEXPORT jstring JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevEntityAnnoationValueBy_1revAnnotationName_1RevEntityGUID_1RevEntityOwnerGUID(JNIEnv *env, jobject instance, jstring revAnnotationName_, jlong revEntityGUID, jlong revEntityOwnerGUID) {
    const char *revAnnotationName = env->GetStringUTFChars(revAnnotationName_, 0);

    char *revEntityAnnotationValue = getRevEntityAnnotationValue(strdup(revAnnotationName), (long) revEntityGUID, (long) revEntityOwnerGUID);

    env->ReleaseStringUTFChars(revAnnotationName_, revAnnotationName);

    return env->NewStringUTF(revEntityAnnotationValue);
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getAllRevEntityAnnoationIds_1By_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID) {
    list revList;
    getAllRevEntityAnnoationIds_By_RevEntityGUID(&revList, (long) revEntityGUID);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetAllRevEntityAnnoationIds_1By_1AnnName_1RevEntity_1GUID(JNIEnv *env, jobject thiz, jstring rev_annotation_name, jlong rev_entity_guid) {
    const char *revAnnotationName = env->GetStringUTFChars(rev_annotation_name, 0);

    list revList;
    revGetAllRevEntityAnnoationIds_By_AnnName_RevEntity_GUID(&revList, strdup(revAnnotationName), (long) rev_entity_guid);
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(rev_annotation_name, revAnnotationName);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getAllRevEntityAnnoationIds_1By_1ResStatus(JNIEnv *env, jobject instance, jint revAnnResStatus) {
    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    list revList;
    getAllRevEntityAnnoationIds_By_ResStatus(&revList, (int) revAnnResStatus);

    if (list_size(&revList) == 0)
        return revRetJObjectArrayList;

    list_for_each(&revList, revPersGetRevEntityDataLong);

    jclass cls = env->FindClass("java/lang/Long");
    jmethodID revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        jobject obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityAnn_1By_1LocalAnnId(JNIEnv *env, jobject instance, jlong revAnnotationId) {
    RevEntityAnnotation revEntityAnnotation = *(revPersGetRevEntityAnn_By_LocalAnnId((long) revAnnotationId));

    REV_ENTITY_ANNOTATION_JNI_POSREC *rev_entity_annotation_jni_posrec = LoadRevEntityAnnotationJniPosRec(env);
    jobject jPosRec = env->NewObject(rev_entity_annotation_jni_posrec->cls, rev_entity_annotation_jni_posrec->constructortor_ID);
    FillDataRecValuesToRevAnnotationJni(env, jPosRec, revEntityAnnotation);

    return jPosRec;
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetRevEntityAnn_1By_1AnnName_1EntityGUID_1OwnerGUID(JNIEnv *env, jobject thiz, jstring rev_annotation_name, jlong rev_entity_guid, jlong rev_owner_guid) {
    const char *revAnnotationName = env->GetStringUTFChars(rev_annotation_name, 0);

    RevEntityAnnotation revEntityAnnotation = *(revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(strdup(revAnnotationName), (long) rev_entity_guid, (long) rev_owner_guid));

    REV_ENTITY_ANNOTATION_JNI_POSREC *rev_entity_annotation_jni_posrec = LoadRevEntityAnnotationJniPosRec(env);
    jobject jPosRec = env->NewObject(rev_entity_annotation_jni_posrec->cls, rev_entity_annotation_jni_posrec->constructortor_ID);
    FillDataRecValuesToRevAnnotationJni(env, jPosRec, revEntityAnnotation);

    return jPosRec;
}

/** END REV ENTITY ANOTATIONS **/

/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/
/** ######################################################################### **/

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_getRevAnnotationOwnerGUID_1ByAnnotationId(JNIEnv *env, jobject instance, jlong annotationId) {
    return getRevAnnotationOwnerGUID_ByAnnotationId((long) annotationId);
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadataOwnerGUID(JNIEnv *env, jobject instance, jlong _revMetadataId) {
    return revGetRevEntityMetadataOwnerGUID(_revMetadataId);
}

extern "C" JNIEXPORT jobject JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revPersGetALLRevEntityGUIDs_1SQL_1IN(JNIEnv *env, jobject instance, jstring sql_IN_) {
    const char *sql_IN = env->GetStringUTFChars(sql_IN_, 0);

    list revList;
    revPersGetALLRevEntityGUIDs_SQL_IN(&revList, strdup(sql_IN));
    list_for_each(&revList, revPersGetRevEntityDataLong);

    // First, get all the methods we need:
    jclass arrayListClass = env->FindClass("java/util/ArrayList");
    jmethodID arrayListConstructor = env->GetMethodID(arrayListClass, "<init>", "()V");
    jmethodID addMethod = env->GetMethodID(arrayListClass, "add", "(Ljava/lang/Object;)Z");

    jmethodID revLongConstructor;
    jclass cls;
    jobject obj;

    cls = env->FindClass("java/lang/Long");
    revLongConstructor = env->GetMethodID(cls, "<init>", "(J)V");

    // The list we're going to return:
    jobject revRetJObjectArrayList = env->NewObject(arrayListClass, arrayListConstructor);

    for (size_t i = 0; i < searchRecordResultLong.size(); i++) {
        obj = env->NewObject(cls, revLongConstructor, (jlong) searchRecordResultLong[i]);
        env->CallBooleanMethod(revRetJObjectArrayList, addMethod, obj);
    }

    searchRecordResultLong.clear();

    env->ReleaseStringUTFChars(sql_IN_, sql_IN);

    return revRetJObjectArrayList;
}

extern "C" JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetRevEntityMetadataOwnerGUID_1By_1revMetadataName_1revMetadataValue(JNIEnv *env, jobject thiz, jstring rev_metadata_name, jstring rev_metadata_value) {
    // TODO: implement revGetRevEntityMetadataOwnerGUID_By_revMetadataName_revMetadataValue()
    const char *revMetadataName = env->GetStringUTFChars(rev_metadata_name, 0);
    const char *revMetadataValue = env->GetStringUTFChars(rev_metadata_value, 0);

    long revEntityGUID = revGetRevEntityMetadataOwnerGUID_By_revMetadataName_revMetadataValue(strdup(revMetadataName), strdup(revMetadataValue));

    env->ReleaseStringUTFChars(rev_metadata_name, revMetadataName);
    env->ReleaseStringUTFChars(rev_metadata_value, revMetadataValue);

    return revEntityGUID;
}

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetAnyRelExists_1By_1TypeValueId_1LocalGUIDs(JNIEnv *env, jobject instance, jstring revRelType_, jlong revSubjectGUID, jlong revTargetGuid) {
    const char *revRelType = env->GetStringUTFChars(revRelType_, 0);

    int revRelExists = revGetAnyRelExists_By_TypeValueId_LocalGUIDs(strdup(revRelType), (long) revSubjectGUID, (long) revTargetGuid);

    env->ReleaseStringUTFChars(revRelType_, revRelType);

    return revRelExists;
}

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetAnyRelExists_1By_1TypeValueId_1RemoteGUIDs(JNIEnv *env, jobject instance, jstring revRelType_, jlong revRemoteSubjectGUID, jlong revRemoteTargetGuid) {
    const char *revRelType = env->GetStringUTFChars(revRelType_, 0);

    int revRelExists = revGetAnyRelExists_By_TypeValueId_RemoteGUIDs(strdup(revRelType), (long) revRemoteSubjectGUID, (long) revRemoteTargetGuid);

    env->ReleaseStringUTFChars(revRelType_, revRelType);

    return revRelExists;
}

extern "C" JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibRead_revGetAnyRelExists_1By_1ResStatus_1TypeValueId_1RemoteGUIDs(JNIEnv *env, jobject instance, jint revResStatus, jstring revRelType_, jlong revRemoteSubjectGUID, jlong revRemoteTargetGuid) {
    const char *revRelType = env->GetStringUTFChars(revRelType_, 0);

    int revRelExists = revGetAnyRelExists_By_ResStatus_TypeValueId_RemoteGUIDs((int) revResStatus, strdup(revRelType), (long) revRemoteSubjectGUID, (long) revRemoteTargetGuid);

    env->ReleaseStringUTFChars(revRelType_, revRelType);

    return revRelExists;
}
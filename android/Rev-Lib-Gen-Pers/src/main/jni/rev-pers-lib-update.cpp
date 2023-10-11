//
// Created by rev on 10/2/18.
//

#include <jni.h>

#include <malloc.h>
#include <stdlib.h>
#include<string>
#include<vector>
#include <string.h>
#include <cstring>
#include <android/log.h>

#include "rev_pers_jni_structs.h"

#include "rev-pers-lib-read.hpp"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"

extern "C" {
#include "../../../libs/cJSON/cJSON.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_read/rev_pers_read_rev_entity_relationships.h"
#include "../cpp/rev_gen_functions/rev_gen_functions.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_pers_update/rev_pers_update.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_update/rev_pers_update_rev_entity_rel.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_update/rev_pers_update_rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_update/rev_pers_update_rev_entity_ann.h"
}


/** REV ENTITY **/

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setrevRemoteEntityGUIDByRevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revRemoteEntityGUID) {
    return setRemoteRevEntityGUIGByRevEntityGUID((long) revEntityGUID, (long) revRemoteEntityGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRevPublishedDate_1By_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revPublishedDate) {
    return setRevPublishedDate_By_RevEntityGUID((long) revEntityGUID, (long) revPublishedDate);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setrevRemoteEntityGUID_1By_1RevCreationDate(JNIEnv *env, jobject instance, jlong revTimeCreated, jlong revRemoteEntityGUID) {
    return setrevRemoteEntityGUID_By_RevCreationDate((long long) revTimeCreated, (long) revRemoteEntityGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_resetRevEntityOwnerGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revEntityOwnerGUID) {
    return resetRevEntityOwnerGUIG((long) revEntityGUID, (long) revEntityOwnerGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetContainerGUID_1By_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revContainerGUID) {
    return revPersSetContainerGUID_By_RevEntityGUID((long) revEntityGUID, (long) revContainerGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setrevRemoteEntityGUID_1Metadata_1ByRevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revRemoteEntityGUID, jlong _revMetadataId, jlong _revRemoteMetadataId) {
    return setrevRemoteEntityGUID_Metadata_ByRevEntityGUID((long) revEntityGUID, (long) revRemoteEntityGUID, (long) _revMetadataId, (long) _revRemoteMetadataId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setrevRemoteEntityGUID_1RemoteMetadataId_1LIST(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revRemoteEntityGUID, jobject revEntityMetadataList) {
    // retrieve the java.util.List interface class
    jclass cList = env->FindClass("java/util/List");

    // retrieve the size and the get method
    jmethodID mSize = env->GetMethodID(cList, "size", "()I");
    jmethodID mGet = env->GetMethodID(cList, "get", "(I)Ljava/lang/Object;");

    if (mSize == NULL || mGet == NULL)
        return -1;

    // get the size of the list
    jint size = env->CallIntMethod(revEntityMetadataList, mSize);
    std::vector<std::string> sVector;
    std::vector<jobject> searchRecordResultRevEntityMetadata;

    cJSON *elem;
    cJSON *name;

    // walk through and fill the vector
    for (jint i = 0; i < size; i++) {
        jstring strObj = (jstring) env->CallObjectMethod(revEntityMetadataList, mGet, i);
        const char *chr = env->GetStringUTFChars(strObj, NULL);
        sVector.push_back(chr);

        cJSON *json = cJSON_Parse(chr);

        name = cJSON_GetObjectItem(json, "_revMetadataId");

        env->ReleaseStringUTFChars(strObj, chr);
    }

    return 0;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setrevRemoteEntityGUID_1RemoteMetadataId_1Array(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revRemoteEntityGUID,
                                                                                                               jstring revEntityMetadataJSONArray_) {
    const char *revEntityMetadataJSONArray = env->GetStringUTFChars(revEntityMetadataJSONArray_, 0);

    int i;
    cJSON *elem;
    cJSON *name;
    cJSON *root = cJSON_Parse(revEntityMetadataJSONArray);
    int n = cJSON_GetArraySize(root);
    for (i = 0; i < n; i++) {
        elem = cJSON_GetArrayItem(root, i);
        name = cJSON_GetObjectItem(elem, "_revMetadataId");
        printf("%s\n", name->valuestring);
    }

    env->ReleaseStringUTFChars(revEntityMetadataJSONArray_, revEntityMetadataJSONArray);

    return 1;
}


/** REV ENTITY METADATA **/


extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityMetadataId(JNIEnv *env, jobject instance, jlong _revMetadataId, jlong _revRemoteMetadataId) {
    return setRemoteRevEntityMetadataId((long) _revMetadataId, (long) _revRemoteMetadataId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setMetadataResolveStatus_1BY_1MetadataName_1RevEntityGUID(JNIEnv *env, jobject instance, jstring revMetadataName_, jlong revEntityGUID, jint revResolveStatus) {
    const char *revMetadataName = env->GetStringUTFChars(revMetadataName_, 0);

    int revUpdateStatus = setMetadataResolveStatus_BY_revMetadataName_RevEntityGUID(strdup(revMetadataName), (long) revEntityGUID, (int) revResolveStatus);
    env->ReleaseStringUTFChars(revMetadataName_, revMetadataName);

    return revUpdateStatus;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setMetadataResolveStatus_1BY_1METADATA_1ID(JNIEnv *env, jobject instance, jint revResolveStatus, jlong _revMetadataId) {
    return setMetadataResolveStatus_BY_METADATA_ID((int) revResolveStatus, (long) _revMetadataId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setMetadataValue_1BY_1MetadataId(JNIEnv *env, jobject instance, jlong _revMetadataId, jstring revMetadataValue_) {
    const char *revMetadataValue = env->GetStringUTFChars(revMetadataValue_, 0);

    int revUpdateStatus = setMetadataValue_BY_MetadataId((long) _revMetadataId, strdup(revMetadataValue));

    env->ReleaseStringUTFChars(revMetadataValue_, revMetadataValue);

    return revUpdateStatus;
}


/** REV ENTITY RELATIONSHIPS **/


extern "C"
JNIEXPORT jlong JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_updateRevEntityRelationshipTypeValueId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong relationshipValueId) {
    return revPersUpdateRelationshipValueId_By_RelId((long) revEntityRelationshipId, (long) relationshipValueId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRemoteSubjectGUID(JNIEnv *env, jobject instance, jlong localTargetGUID, jlong remoteTargetGUID) {
    return revPersUpdateSetRemoteSubjectGUID((long) localTargetGUID, (long) remoteTargetGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRemoteTargetGUID(JNIEnv *env, jobject instance, jlong localSubjectGUID, jlong remoteSubjectGUID) {
    return revPersUpdateSetRemoteTargetGUID((long) localSubjectGUID, (long) remoteSubjectGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRemoteSubjectGUID_1By_1RelId(JNIEnv *env, jobject instance, jlong revRelId, jlong revRemoteSubjectGUID) {
    return revPersUpdateSetRemoteSubjectGUID_By_RelId((long) revRelId, (long) revRemoteSubjectGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRemoteTarget_1By_1RelId(JNIEnv *env, jobject instance, jlong revRelId, jlong revRemotetargetGUID) {
    return revPersUpdateSetRemoteTarget_By_RelId((long) revRelId, (long) revRemotetargetGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateRelResStatus_1By_1RelId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jint revResolveStatus) {
    return revPersUpdateRelResStatus_By_RelId((long) revEntityRelationshipId, (int) revResolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateRelResStatus_1By_1RemoteRelId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jint revResolveStatus) {
    return revPersUpdateRelResStatus_By_RemoteRelId((long) revEntityRelationshipId, (int) revResolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRelResStatus_1By_1RemoteRelId(JNIEnv *env, jobject instance, jlong revEntityRemoteRelationshipId, jint revResolveStatus) {
    return revPersUpdateSetRelResStatus_By_RemoteRelId((long) revEntityRemoteRelationshipId, (int) revResolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRemoteRelationshipRemoteId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong revEntityRemoteRelationshipId) {
    return revPersSetRemoteRelationshipRemoteId((long) revEntityRelationshipId, (long) revEntityRemoteRelationshipId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateRelationshipResolve_1RemoteRelId_1ResolveStatus_1By_1ValueId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong revEntityRemoteRelationshipId, jint revResolveStatus) {
    return revPersUpdateRelationshipResolve_RemoteRelId_revResolveStatus_By_ValueId((long) revEntityRelationshipId, (long) revEntityRemoteRelationshipId, (int) revResolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRemoteRelationshipResolved(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong revEntityRemoteRelationshipId) {
    return revPersSetRemoteRelationshipResolved((long) revEntityRelationshipId, (long) revEntityRemoteRelationshipId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRevEntityResolveStatusByRevEntityGUID(JNIEnv *env, jobject instance, jint revResolveStatus, jlong revEntityGUID) {
    return setRevEntityResolveStatusByRevEntityGUID((int) revResolveStatus, (long) revEntityGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setResStatus_1By_1RevCreationDate(JNIEnv *env, jobject instance, jlong revTimeCreated, jint revResStatus) {
    return setResStatus_By_RevCreationDate((long long) revTimeCreated, (int) revResStatus);
}


extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRevAnnVal_1By_1RevAnnId(JNIEnv *env, jobject thiz, jlong rev_annotation_id, jstring rev_entity_annotation_value) {
    const char *revEntityAnnotationValue = env->GetStringUTFChars(rev_entity_annotation_value, 0);

    int revUpdateStatus = revPersSetRevAnnVal_By_RevAnnId((long) rev_annotation_id, strdup(revEntityAnnotationValue));

    env->ReleaseStringUTFChars(rev_entity_annotation_value, revEntityAnnotationValue);

    return revUpdateStatus;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRevAnnResStatus_1By_1RevAnnId(JNIEnv *env, jobject instance, jlong revAnnotationId, jint revAnnotationResStatus) {
    return revPersSetRevAnnResStatus_By_RevAnnId((long) revAnnotationId, (int) revAnnotationResStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRemoteRevAnnId(JNIEnv *env, jobject instance, jlong revAnnotationId, jlong revAnnotationRemoteId) {
    return revPersSetRemoteRevAnnId((long) revAnnotationId, (long) revAnnotationRemoteId);
}
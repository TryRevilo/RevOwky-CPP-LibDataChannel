//
// Created by rev on 10/2/18.
//

#include <jni.h>

#include <malloc.h>
#include<string>
#include<vector>
#include <string.h>
#include <cstring>
#include <android/log.h>

#include "rev_pers_jni_structs.h"

#include "rev-pers-lib-read.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"

extern "C" {
#include <cJSON.h>
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_read/rev_pers_read_rev_entity_relationships.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_pers_update/rev_pers_update.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_update/rev_pers_update_rev_entity_rel.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_update/rev_pers_update_rev_entity_metadata.h"
#include "../cpp/rev_clib_sqlite_pers/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_update/rev_pers_update_rev_entity_ann.h"
}


/** REV ENTITY **/

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityGUIDByRevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong remoteRevEntityGUID) {
    return setRemoteRevEntityGUIGByRevEntityGUID((long) revEntityGUID, (long) remoteRevEntityGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRevPublishedDate_1By_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revPublishedDate) {
    return setRevPublishedDate_By_RevEntityGUID((long) revEntityGUID, (long) revPublishedDate);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityGUID_1By_1RevCreationDate(JNIEnv *env, jobject instance, jlong revTimeCreated, jlong remoteRevEntityGUID) {
    return setRemoteRevEntityGUID_By_RevCreationDate((long long) revTimeCreated, (long) remoteRevEntityGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_resetRevEntityOwnerGUIG(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revEntityOwnerGUID) {
    return resetRevEntityOwnerGUIG((long) revEntityGUID, (long) revEntityOwnerGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetContainerGUID_1By_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong revContainerGUID) {
    return revPersSetContainerGUID_By_RevEntityGUID((long) revEntityGUID, (long) revContainerGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityGUID_1Metadata_1ByRevEntityGUID(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong remoteRevEntityGUID, jlong revMetadataId, jlong remoteRevMetadataId) {
    return setRemoteRevEntityGUID_Metadata_ByRevEntityGUID((long) revEntityGUID, (long) remoteRevEntityGUID, (long) revMetadataId, (long) remoteRevMetadataId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityGUID_1RemoteMetadataId_1LIST(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong remoteRevEntityGUID, jobject revEntityMetadataList) {
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

        name = cJSON_GetObjectItem(json, "localMetadataId");

        env->ReleaseStringUTFChars(strObj, chr);
    }

    return 0;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityGUID_1RemoteMetadataId_1Array(JNIEnv *env, jobject instance, jlong revEntityGUID, jlong remoteRevEntityGUID,
                                                                                                               jstring revEntityMetadataJSONArray_) {
    const char *revEntityMetadataJSONArray = env->GetStringUTFChars(revEntityMetadataJSONArray_, 0);

    int i;
    cJSON *elem;
    cJSON *name;
    cJSON *root = cJSON_Parse(revEntityMetadataJSONArray);
    int n = cJSON_GetArraySize(root);
    for (i = 0; i < n; i++) {
        elem = cJSON_GetArrayItem(root, i);
        name = cJSON_GetObjectItem(elem, "localMetadataId");
        printf("%s\n", name->valuestring);
    }

    env->ReleaseStringUTFChars(revEntityMetadataJSONArray_, revEntityMetadataJSONArray);

    return 1;
}


/** REV ENTITY METADATA **/


extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRemoteRevEntityMetadataId(JNIEnv *env, jobject instance, jlong revMetadataId, jlong remoteRevMetadataId) {
    return setRemoteRevEntityMetadataId((long) revMetadataId, (long) remoteRevMetadataId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setMetadataResolveStatus_1BY_1MetadataName_1RevEntityGUID(JNIEnv *env, jobject instance, jstring revMetadataName_, jlong revEntityGUID, jint revResolveStatus) {
    const char *revMetadataName = env->GetStringUTFChars(revMetadataName_, 0);

    int revUpdateStatus = setMetadataResolveStatus_BY_MetadataName_RevEntityGUID(strdup(revMetadataName), (long) revEntityGUID, (int) revResolveStatus);
    env->ReleaseStringUTFChars(revMetadataName_, revMetadataName);

    return revUpdateStatus;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setMetadataResolveStatus_1BY_1METADATA_1ID(JNIEnv *env, jobject instance, jint resolveStatus, jlong revMetadataId) {
    return setMetadataResolveStatus_BY_METADATA_ID((int) resolveStatus, (long) revMetadataId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setMetadataValue_1BY_1MetadataId_1RevEntityGUID(JNIEnv *env, jobject instance, jlong revMetadataId, jstring revMetadataValue_) {
    const char *revMetadataValue = env->GetStringUTFChars(revMetadataValue_, 0);

    int revUpdateStatus = setMetadataValue_BY_MetadataId_RevEntityGUID((long) revMetadataId, strdup(revMetadataValue));

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
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateRelResStatus_1By_1RelId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jint resolveStatus) {
    return revPersUpdateRelResStatus_By_RelId((long) revEntityRelationshipId, (int) resolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateRelResStatus_1By_1RemoteRelId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jint resolveStatus) {
    return revPersUpdateRelResStatus_By_RemoteRelId((long) revEntityRelationshipId, (int) resolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRelResStatus_1By_1RemoteRelId(JNIEnv *env, jobject instance, jlong revEntityRemoteRelationshipId, jint resolveStatus) {
    return revPersUpdateSetRelResStatus_By_RemoteRelId((long) revEntityRemoteRelationshipId, (int) resolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRemoteRelationshipRemoteId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong revEntityRemoteRelationshipId) {
    return revPersSetRemoteRelationshipRemoteId((long) revEntityRelationshipId, (long) revEntityRemoteRelationshipId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateSetRemoteRelationshipRemoteId_1By_1RevRelType_1RemoteSubjectGUID_1RemoteTarhetGUID(
JNIEnv *env, jobject instance, jstring revEntityrelationship_, jlong revRemoteSubjectGUID, jlong revRemoteTargetGUID, jlong revRemoteRelId) {
    const char *revEntityrelationship = env->GetStringUTFChars(revEntityrelationship_, 0);

    int revUpdateRetStatus = revPersUpdateSetRemoteRelationshipRemoteId_By_RevRelType_RemoteSubjectGUID_RemoteTarhetGUID(
        strdup(revEntityrelationship), (long) revRemoteSubjectGUID, (long) revRemoteTargetGUID, (long) revRemoteRelId);

    env->ReleaseStringUTFChars(revEntityrelationship_, revEntityrelationship);

    return revUpdateRetStatus;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersUpdateRelationshipResolve_1RemoteRelId_1ResolveStatus_1By_1ValueId(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong revEntityRemoteRelationshipId, jint resolveStatus) {
    return revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId((long) revEntityRelationshipId, (long) revEntityRemoteRelationshipId, (int) resolveStatus);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_revPersSetRemoteRelationshipResolved(JNIEnv *env, jobject instance, jlong revEntityRelationshipId, jlong revEntityRemoteRelationshipId) {
    return revPersSetRemoteRelationshipResolved((long) revEntityRelationshipId, (long) revEntityRemoteRelationshipId);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setRevEntityResolveStatusByRevEntityGUID(JNIEnv *env, jobject instance, jint resolveStatus, jlong revEntityGUID) {
    return setRevEntityResolveStatusByRevEntityGUID((int) resolveStatus, (long) revEntityGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibUpdate_setResStatus_1By_1RevCreationDate(JNIEnv *env, jobject instance, jlong revTimeCreated, jint revResStatus) {
    return setResStatus_By_RevCreationDate((long long) revTimeCreated, (int) revResStatus);
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
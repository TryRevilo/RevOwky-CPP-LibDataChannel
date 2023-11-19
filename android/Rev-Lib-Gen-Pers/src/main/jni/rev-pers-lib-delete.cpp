//
// Created by rev on 1/1/19.
//


#include "rev-pers-lib-delete.hpp"

#include <jni.h>
#include <android/log.h>

#include <stdio.h>
#include <stdlib.h>

extern "C" {
#include <assert.h>
#include "../../../../Rev-Lib-Gen-Pers/libs/rev_list/rev_linked_list.h"
#include "../../../libs/cJSON/cJSON.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_pers_delete/rev_pers_delete.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_delete/rev_pers_rel_delete.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_lib_delete/rev_pers_delete_rev_entity_annotations.h"

#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_read/rev_pers_read_rev_entity_annotations.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_annotations/rev_pers_update/rev_pers_update_rev_entity_ann.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_read/rev_pers_read_rev_entity_relationships.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_read.h"
#include "../cpp/rev_pers_lib/rev_pers_rev_entity/rev_pers_update/rev_pers_update.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_relationships/rev_pers_update/rev_pers_update_rev_entity_rel.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_read/rev_pers_read_rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_update/rev_pers_update_rev_entity_metadata.h"
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_lib_delete/rev_pers_delete_rev_entity_metadata.h"
}

// Function that receives a callback function
bool revSetDelAnnResStatus(void *revAnnId, int revResStatus) {
    long revPassLong = (long) revAnnId;

    // If res status == -1 -> Delete from DB
    RevEntityAnnotation *revEntityAnnotation = revPersGetRevEntityAnn_By_LocalAnnId(revPassLong);

    if (revEntityAnnotation->_revResolveStatus == -1) {
        return revPersDeleteAnn_By_AnnId(revPassLong);
    } else {
        // If res status !== -1 -> Update Res Status
        return revPersSetAnnResStatus_By_Id(revPassLong, revResStatus);
    }
}

// Function that receives a callback function
bool revSetDelRelResStatus(void *revRelID, int revResStatus) {
    long revPassLong = *(long *) revRelID;

    RevEntityRelationship revEntityRelationship = revPersGetRevEntityRelById(revPassLong);

    if (revEntityRelationship._revResolveStatus == -1) {
        return revDeleteRel_By_RelId(revPassLong);
    } else {
        return revPersUpdateRelResStatus_By_RelId(revPassLong, revResStatus);
    }
}

// Function that receives a callback function
bool revSetDelMetadataResStatus(void *_revId, int revResStatus) {
    long revPassLong = *(long *) _revId;

    RevEntityMetadata *revEntityMetadata = revPersGetRevEntityMetadata_By_MetadataId(revPassLong);

    if (revEntityMetadata->_revResolveStatus == -1) {
        return revDeleteEntityMetadata_By_ID(revPassLong);
    } else {
        return revPersSetMetadataResStatus_BY_Metadata_Id(revResStatus, revPassLong);
    }
}

// Function that receives a callback function
bool revSetDelRevEntityResStatus(void *revEntityGUID, int revResStatus) {
    long revPassLong = *(long *) revEntityGUID;

    RevEntity revEntity = revPersGetEntity_By_GUID(revPassLong);

    if (revEntity._revResolveStatus == revResStatus) {
        return 1;
    } else if (revEntity._revResolveStatus == -1) {
        return revDeleteEntity_By_EntityGUID(revPassLong);
    } else {
        return revPersSetEntityResStatus_By_EntityGUID(revResStatus, revPassLong);
    }
}

void revListForEach(list *list, int revResStatus, revSetResStatusCallBack iterator) {
    assert(iterator != NULL);

    listNode *node = list->head;
    bool result = 1;

    while (node != NULL && result == 1) {
        result = iterator(node->data, revResStatus);
        node = node->next;
    }
}

bool revPersGetRevEntityDataLong(void *data) {
    revPersDeleteEntity_And_Children_By_EntityGUID(*(long *) data);
    return true;
}

int revPersDeleteEntity_And_Children_By_EntityGUID(long revEntityGUID) {
    int revDelStatus = 0;

    // Get Anns
    list revAnnlValIds;
    getAllRevEntityAnnoationIds_By_revGUID(&revAnnlValIds, revEntityGUID);
    int revAnnLen = list_size(&revAnnlValIds);

    if (revAnnLen > 0) {
        revListForEach(&revAnnlValIds, -3, revSetDelAnnResStatus);
    }

    // Get Rels
    list revRelIds;
    revPersGetAllRevEntityRelsIDs_By_EntityGUID(&revRelIds, revEntityGUID);
    int revRelIdsLen = list_size(&revRelIds);

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revRelIdsLen %d", revRelIdsLen);

    if (revRelIdsLen > 0) {
        revListForEach(&revRelIds, -3, revSetDelRelResStatus);
    }

    // Get Metadata
    list revMetadataList;
    revPersGetALLRevEntityMetadataIds_By_revGUID(&revMetadataList, revEntityGUID);
    int revMetadataListLen = list_size(&revMetadataList);

    if (revMetadataListLen > 0) {
        revListForEach(&revMetadataList, -3, revSetDelMetadataResStatus);
    }

    // Get Container childs
    list revContainerChildrenGUIDs;
    revPersGetALLRevEntityGUIDs_By_ContainerGUID(&revContainerChildrenGUIDs, revEntityGUID);
    int revContainerChildrenGUIDsLen = list_size(&revContainerChildrenGUIDs);

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revContainerChildrenGUIDsLen %d", revContainerChildrenGUIDsLen);

    if (revContainerChildrenGUIDsLen > 0) {
        list_for_each(&revContainerChildrenGUIDs, revPersGetRevEntityDataLong);
    }

    revSetDelRevEntityResStatus(&revEntityGUID, -3);

    if (revAnnLen > 0 || revRelIdsLen > 0 || revMetadataListLen > 0 || revContainerChildrenGUIDsLen > 0) {
        revDelStatus = 1;
    }

    return revDelStatus;
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revPersDeleteEntity_1And_1Children_1By_1EntityGUID(JNIEnv *env, jobject thiz, jlong rev_entity_guid) {
    // TODO: implement revPersDeleteEntity_And_Children_By_EntityGUID()
    return revPersDeleteEntity_And_Children_By_EntityGUID((long) rev_entity_guid);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_deleteRevRel_1By_1Unset_1Subject_1Target_1GUID(JNIEnv *env, jobject instance, jlong revUnsetRelEntityGUID, jlong revUnsetRelEntityRemoteGUID) {
    return deleteRevRel_By_Unset_Subject_Target_GUID((long) revUnsetRelEntityGUID, (long) revUnsetRelEntityRemoteGUID);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revDeleteEntity_1By_1EntityGUID(JNIEnv *env, jobject thiz, jlong rev_entity_guid) {
    return revDeleteEntity_By_EntityGUID(rev_entity_guid);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revDeleteEntityMetadata_1By_1ID(JNIEnv *env, jobject thiz, jlong _rev_id) {
    return revDeleteEntityMetadata_By_ID(_rev_id);
}

extern "C"
JNIEXPORT jint JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revPersDeleteAnn_1By_1AnnId(JNIEnv *env, jobject thiz, jlong rev_annotation_id) {
    // TODO: implement revPersDeleteAnn_By_AnnId()
    return revPersDeleteAnn_By_AnnId(rev_annotation_id);
}

extern "C"
JNIEXPORT void JNICALL
Java_rev_ca_rev_1gen_1lib_1pers_c_1libs_1core_RevPersLibDelete_revAsyDeleteFilesFromPathsStrArr(JNIEnv *env, jobject thiz, jstring rev_json_file_paths_arr_str, jobject i_rev_lib_call_back) {
    // Convert the input JSON string to a C string
    const char *revJsonString = (env)->GetStringUTFChars(rev_json_file_paths_arr_str, 0);

    jclass callbackClass = (env)->GetObjectClass(i_rev_lib_call_back);
    jmethodID onResultMethod = (env)->GetMethodID(callbackClass, "onRevLibStringResCallBack", "(Ljava/lang/String;)V");
    jobject callback = (env)->NewGlobalRef(i_rev_lib_call_back);

    // Parse the JSON string and perform image deletion
    // Parse the JSON array,
    // extract image paths, delete the files, and track the deletion status.

    // Parse the JSON string
    cJSON *root = cJSON_Parse(revJsonString);

    // Get the array from the root object
    cJSON *revFilePathsArrRoot = cJSON_GetObjectItem(root, "revRoot");

    // Create a JSON object for the result
    cJSON *revResultJson = cJSON_CreateObject();

    // Iterate over the array
    cJSON *imageItem = NULL;
    cJSON_ArrayForEach(imageItem, revFilePathsArrRoot) {
        // Get the imageGUID and imagePath
        cJSON *revGUIDItem = cJSON_GetObjectItem(imageItem, "revFileGUID");
        cJSON *revPathItem = cJSON_GetObjectItem(imageItem, "revFilePath");
        long revFileGUID = revGUIDItem->valueint;
        const char *revFilePath = cJSON_GetStringValue(revPathItem);

        // Delete the image using the imagePath
        int revFileDelStatus = remove(revFilePath);

        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revFileDelStatus %d", revFileDelStatus);

        int revEntityDelStatus = revPersDeleteEntity_And_Children_By_EntityGUID(revFileGUID);

        // Add the deletion status to the result JSON object
        cJSON_AddItemToObject(revResultJson, "revFileGUID", cJSON_CreateNumber(revFileGUID));
        cJSON_AddItemToObject(revResultJson, "revFileDelStatus", cJSON_CreateBool(revFileDelStatus == 0));
        cJSON_AddItemToObject(revResultJson, "revEntityDelStatus", cJSON_CreateBool(revEntityDelStatus == 1));
    }

    // Convert the result JSON object to a string
    char *result = cJSON_PrintUnformatted(revResultJson);
    cJSON_Delete(revResultJson);
    cJSON_Delete(root);

    (env)->ReleaseStringUTFChars(rev_json_file_paths_arr_str, revJsonString); // Release the input string

    // Call C function and invoke the callback with the result
    (env)->CallVoidMethod(callback, onResultMethod, (env)->NewStringUTF(result));
}
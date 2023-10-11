//
// Created by rev on 6/1/23.
//

#include "rev_entity_metadata.h"

#include <jni.h>
#include <android/log.h>

#include <string.h>
#include <stdlib.h>
#include <stdio.h>

#include "../../../../../../../libs/cJSON/cJSON.h"
#include "../../../../../../../libs/rev_map/rev_map.h"

#include "../../../../rev_gen_functions/rev_gen_functions.h"

void revFreeMetadata(void *data) {
    free(*(RevEntityMetadata **) data);
}

htable_strstr_t *revGetMetadataDB_Keys() {
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "_revResolveStatus", "REV_RESOLVE_STATUS");
    htable_strstr_insert(revMap, "_revMetadataId", "METADATA_ID");
    htable_strstr_insert(revMap, "_revEntityResolveStatus", "REV_RESOLVE_STATUS");
    htable_strstr_insert(revMap, "_revRemoteMetadataId", "REMOTE_METADATA_ID");
    htable_strstr_insert(revMap, "_revMetadataEntityGUID", "METADATA_ENTITY_GUID");
    htable_strstr_insert(revMap, "_revMetadataName", "METADATA_NAME");
    htable_strstr_insert(revMap, "_revMetadataValue", "METADATA_VALUE");

    htable_strstr_insert(revMap, "_revTimeCreated", "CREATED_DATE");
    htable_strstr_insert(revMap, "_revTimePublishedUpdated", "UPDATED_DATE");

    htable_strstr_insert(revMap, "_revTimeCreated", "REV_CREATED_DATE");
    htable_strstr_insert(revMap, "_revTimePublished", "REV_PUBLISHED_DATE");
    htable_strstr_insert(revMap, "_revTimePublishedUpdated", "REV_UPDATED_DATE");

    htable_strstr_insert(revMap, "revLimit", "LIMIT");

    return revMap;
}

htable_strstr_t *revGetMapped_Metadata_Key_DBFieldName() {
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "REV_RESOLVE_STATUS", "_revResolveStatus");
    htable_strstr_insert(revMap, "METADATA_ID", "_revMetadataId");
    htable_strstr_insert(revMap, "REV_RESOLVE_STATUS", "_revEntityResolveStatus");
    htable_strstr_insert(revMap, "REMOTE_METADATA_ID", "_revRemoteMetadataId");
    htable_strstr_insert(revMap, "METADATA_ENTITY_GUID", "_revMetadataEntityGUID");
    htable_strstr_insert(revMap, "METADATA_NAME", "_revMetadataName");
    htable_strstr_insert(revMap, "METADATA_VALUE", "_revMetadataValue");

    htable_strstr_insert(revMap, "REV_CREATED_DATE", "_revTimeCreated");
    htable_strstr_insert(revMap, "REV_PUBLISHED_DATE", "_revTimePublished");

    htable_strstr_insert(revMap, "REV_UPDATED_DATE", "_revTimePublishedUpdated");
    htable_strstr_insert(revMap, "REV_PUBLISHED_DATE", "_revTimePublished");
    htable_strstr_insert(revMap, "REV_UPDATED_DATE", "_revTimePublishedUpdated");

    htable_strstr_insert(revMap, "LIMIT", "revLimit");

    return revMap;
}

RevEntityMetadata *revInitializedMetadata() {
    RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));

    revEntityMetadata->_revResolveStatus = -1;

    revEntityMetadata->_revMetadataId = -1;
    revEntityMetadata->_revRemoteMetadataId = -1;
    revEntityMetadata->_revMetadataEntityGUID = -1;

    revEntityMetadata->_revMetadataName = "";
    revEntityMetadata->_revMetadataValue = "";

    revEntityMetadata->_revTimeCreated = -1;
    revEntityMetadata->_revTimePublished = -1;
    revEntityMetadata->_revTimePublishedUpdated = -1;

    return revEntityMetadata;
}

RevEntityMetadata *revJSONStrMetadataFiller(const char *revEntityMetadataJSONStr) {
    cJSON *rev_entity_metadata_json = cJSON_Parse(revEntityMetadataJSONStr);

    RevEntityMetadata *revEntityMetadata = revInitializedMetadata();

    if (rev_entity_metadata_json == NULL) {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL) {
            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error -revJSONStrMetadataFiller %s\n", error_ptr);
        }

        return revEntityMetadata;
    }

    // _revMetadataName
    const cJSON *_revMetadataName = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revMetadataName");

    if (cJSON_IsString(_revMetadataName) && (_revMetadataName->valuestring != NULL)) {
        char *_revMetadataNameVal = _revMetadataName->valuestring;
        revEntityMetadata->_revMetadataName = _revMetadataNameVal;
    }

    // _revMetadataValue
    const cJSON *_revMetadataValue = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revMetadataValue");

    if (cJSON_IsString(_revMetadataValue) && (_revMetadataValue->valuestring != NULL)) {
        char *_revMetadataValueVal = _revMetadataValue->valuestring;
        revEntityMetadata->_revMetadataValue = _revMetadataValueVal;
    }

    // _revResolveStatus
    const cJSON *_revResolveStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revResolveStatus");

    if (cJSON_IsNumber(_revResolveStatus)) {
        int _revResolveStatusVal = _revResolveStatus->valueint;
        revEntityMetadata->_revResolveStatus = _revResolveStatusVal;
    }

    // _revMetadataEntityGUID
    long _revMetadataEntityGUIDVal = -1;

    const cJSON *_revMetadataEntityGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revMetadataEntityGUID");

    if (cJSON_IsNumber(_revMetadataEntityGUID)) {
        _revMetadataEntityGUIDVal = _revMetadataEntityGUID->valueint;
    }

    revEntityMetadata->_revMetadataEntityGUID = _revMetadataEntityGUIDVal;

    // _revRemoteMetadataId
    const cJSON *_revRemoteMetadataId = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revRemoteMetadataId");

    long _revRemoteMetadataIdVal = -1l;

    if (cJSON_IsNumber(_revRemoteMetadataId)) {
        _revRemoteMetadataIdVal = _revRemoteMetadataId->valueint;
    }

    revEntityMetadata->_revRemoteMetadataId = _revRemoteMetadataIdVal;

    // _revTimeCreated
    long _revTimeCreatedVal = -1;

    const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revTimeCreated");

    if (cJSON_IsNumber(_revTimeCreated)) {
        _revTimeCreatedVal = _revTimeCreated->valueint;
    }

    revEntityMetadata->_revTimeCreated = _revTimeCreatedVal;

    // _revTimePublished
    long _revTimePublishedVal = -1;

    const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revTimePublished");

    if (cJSON_IsNumber(_revTimePublished)) {
        _revTimePublishedVal = _revTimePublished->valueint;
    }

    revEntityMetadata->_revTimePublished = _revTimePublishedVal;

    // _revTimePublishedUpdated
    long _revTimePublishedUpdatedVal = -1;

    const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revTimePublishedUpdated");

    if (cJSON_IsNumber(_revTimePublishedUpdated)) {
        _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
    }

    revEntityMetadata->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;

    return revEntityMetadata;
}

void revMetaDataJSONArrStrFiller(list *revList, const char *const revEntityMetadataJSONArrStr) {
    list_new(revList, sizeof(RevEntityMetadata), revFreeMetadata);

    // _revEntityMetadataList
    const cJSON *_revEntityMetadataList = cJSON_Parse(revEntityMetadataJSONArrStr);

    if (cJSON_IsArray(_revEntityMetadataList)) {
        cJSON *revEntityMetadataJSON = NULL;

        cJSON_ArrayForEach(revEntityMetadataJSON, _revEntityMetadataList) {
            RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));

            // _revMetadataName
            const cJSON *_revMetadataName = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revMetadataName");

            if (cJSON_IsString(_revMetadataName) && (_revMetadataName->valuestring != NULL)) {
                char *_revMetadataNameVal = _revMetadataName->valuestring;
                revEntityMetadata->_revMetadataName = _revMetadataNameVal;
            }

            // _revMetadataValue
            const cJSON *_revMetadataValue = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revMetadataValue");

            if (cJSON_IsString(_revMetadataValue) && (_revMetadataValue->valuestring != NULL)) {
                char *_revMetadataValueVal = _revMetadataValue->valuestring;
                revEntityMetadata->_revMetadataValue = _revMetadataValueVal;
            }

            // _revResolveStatus
            const cJSON *_revResolveStatus = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revResolveStatus");

            if (cJSON_IsNumber(_revResolveStatus)) {
                int _revResolveStatusVal = _revResolveStatus->valueint;
                revEntityMetadata->_revResolveStatus = _revResolveStatusVal;
            }

            // _revMetadataEntityGUID
            revEntityMetadata->_revMetadataEntityGUID = -1;

            // _revRemoteMetadataId
            const cJSON *_revRemoteMetadataId = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revRemoteMetadataId");

            long _revRemoteMetadataIdVal = -1l;

            if (cJSON_IsNumber(_revRemoteMetadataId)) {
                _revRemoteMetadataIdVal = _revRemoteMetadataId->valueint;
            }

            revEntityMetadata->_revRemoteMetadataId = _revRemoteMetadataIdVal;

            // _revTimeCreated
            long _revTimeCreatedVal = -1;

            const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revTimeCreated");

            if (cJSON_IsNumber(_revTimeCreated)) {
                _revTimeCreatedVal = _revTimeCreated->valueint;
            }

            revEntityMetadata->_revTimeCreated = _revTimeCreatedVal;

            // _revTimePublished
            long _revTimePublishedVal = -1;

            const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revTimePublished");

            if (cJSON_IsNumber(_revTimePublished)) {
                _revTimePublishedVal = _revTimePublished->valueint;
            }

            revEntityMetadata->_revTimePublished = _revTimePublishedVal;

            // _revTimePublishedUpdated
            long _revTimePublishedUpdatedVal = -1;

            const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revTimePublishedUpdated");

            if (cJSON_IsNumber(_revTimePublishedUpdated)) {
                _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
            }

            revEntityMetadata->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;

            list_append(revList, revEntityMetadata);
        }
    }
}
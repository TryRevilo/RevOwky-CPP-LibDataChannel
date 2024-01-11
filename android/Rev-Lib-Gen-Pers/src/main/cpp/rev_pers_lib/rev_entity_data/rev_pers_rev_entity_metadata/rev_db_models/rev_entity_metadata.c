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

void revFreeMetadata(void *data)
{
    free(*(RevEntityMetadata **)data);
}

htable_strstr_t *revGetMetadataDB_Keys()
{
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "_revResolveStatus", "REV_RESOLVE_STATUS");
    htable_strstr_insert(revMap, "_revId", "METADATA_ID");
    htable_strstr_insert(revMap, "_revRemoteId", "REMOTE_METADATA_ID");
    htable_strstr_insert(revMap, "_revGUID", "METADATA_ENTITY_GUID");
    htable_strstr_insert(revMap, "_revName", "METADATA_NAME");
    htable_strstr_insert(revMap, "_revValue", "METADATA_VALUE");

    htable_strstr_insert(revMap, "_revTimeCreated", "REV_CREATED_DATE");
    htable_strstr_insert(revMap, "_revTimePublished", "REV_PUBLISHED_DATE");
    htable_strstr_insert(revMap, "_revTimePublishedUpdated", "REV_UPDATED_DATE");

    htable_strstr_insert(revMap, "revLimit", "LIMIT");

    return revMap;
}

htable_strstr_t *revGetMapped_Metadata_Key_DBFieldName()
{
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "REV_RESOLVE_STATUS", "_revResolveStatus");
    htable_strstr_insert(revMap, "METADATA_ID", "_revId");
    htable_strstr_insert(revMap, "REMOTE_METADATA_ID", "_revRemoteId");
    htable_strstr_insert(revMap, "METADATA_ENTITY_GUID", "_revGUID");
    htable_strstr_insert(revMap, "METADATA_NAME", "_revName");
    htable_strstr_insert(revMap, "METADATA_VALUE", "_revValue");

    htable_strstr_insert(revMap, "REV_CREATED_DATE", "_revTimeCreated");
    htable_strstr_insert(revMap, "REV_PUBLISHED_DATE", "_revTimePublished");
    htable_strstr_insert(revMap, "REV_UPDATED_DATE", "_revTimePublishedUpdated");

    htable_strstr_insert(revMap, "LIMIT", "revLimit");

    return revMap;
}

RevEntityMetadata *revInitializedMetadata()
{
    RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *)malloc(sizeof(RevEntityMetadata));

    revEntityMetadata->_revResolveStatus = -1;

    revEntityMetadata->_revId = -1;
    revEntityMetadata->_revRemoteId = -1;
    revEntityMetadata->_revGUID = -1;

    revEntityMetadata->_revName = "";
    revEntityMetadata->_revValue = "";

    revEntityMetadata->_revTimeCreated = -1;
    revEntityMetadata->_revTimePublished = -1;
    revEntityMetadata->_revTimePublishedUpdated = -1;

    return revEntityMetadata;
}

RevEntityMetadata *revJSONStrMetadataFiller(const char *revEntityMetadataJSONStr)
{
    cJSON *rev_entity_metadata_json = cJSON_Parse(revEntityMetadataJSONStr);

    RevEntityMetadata *revEntityMetadata = revInitializedMetadata();

    if (rev_entity_metadata_json == NULL) {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL) {
            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error -revJSONStrMetadataFiller %s\n", error_ptr);
        }

        return revEntityMetadata;
    }

    // _revName
    const cJSON *_revName = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revName");

    if (cJSON_IsString(_revName) && (_revName->valuestring != NULL)) {
        char *_revNameVal = _revName->valuestring;
        revEntityMetadata->_revName = _revNameVal;
    }

    // _revValue
    const cJSON *_revValue = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revValue");

    if (cJSON_IsString(_revValue) && (_revValue->valuestring != NULL)) {
        char *_revValueVal = _revValue->valuestring;
        revEntityMetadata->_revValue = _revValueVal;
    }

    // _revResolveStatus
    int _revResolveStatusVal = -1;

    const cJSON *_revResolveStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revResolveStatus");

    if (cJSON_IsNumber(_revResolveStatus)) {
        _revResolveStatusVal = _revResolveStatus->valueint;
    } else if (cJSON_IsString(_revResolveStatus)) {
        char *revNumberStrVal = _revResolveStatus->valuestring;
        _revResolveStatusVal = strtol(revNumberStrVal, NULL, 10);
    }
    
    revEntityMetadata->_revResolveStatus = _revResolveStatusVal;

    // _revGUID
    long _revGUIDVal = -1;

    const cJSON *_revGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revGUID");

    if (cJSON_IsNumber(_revGUID)) {
        _revGUIDVal = _revGUID->valueint;
    } else if (cJSON_IsString(_revGUID)) {
        char *revNumberStrVal = _revGUID->valuestring;
        _revGUIDVal = strtoll(revNumberStrVal, NULL, 10);
    }

    revEntityMetadata->_revGUID = _revGUIDVal;

    // _revId
    const cJSON *_revId = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revId");

    long _revIdVal = -1l;

    if (cJSON_IsNumber(_revId)) {
        _revIdVal = _revId->valueint;
    } else if (cJSON_IsString(_revId)) {
        char *revNumberStrVal = _revId->valuestring;
        _revIdVal = strtoll(revNumberStrVal, NULL, 10);
    }

    revEntityMetadata->_revId = _revIdVal;

    // _revRemoteId
    const cJSON *_revRemoteId = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revRemoteId");

    long _revRemoteIdVal = -1l;

    if (cJSON_IsNumber(_revRemoteId)) {
        _revRemoteIdVal = _revRemoteId->valueint;
    } else if (cJSON_IsString(_revRemoteId)) {
        char *revNumberStrVal = _revRemoteId->valuestring;
        _revRemoteIdVal = strtoll(revNumberStrVal, NULL, 10);
    }

    revEntityMetadata->_revRemoteId = _revRemoteIdVal;

    // _revTimeCreated
    long _revTimeCreatedVal = -1;

    const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revTimeCreated");

    if (cJSON_IsNumber(_revTimeCreated)) {
        _revTimeCreatedVal = _revTimeCreated->valueint;
    } else if (cJSON_IsString(_revTimeCreated)) {
        char *revNumberStrVal = _revTimeCreated->valuestring;
        _revTimeCreatedVal = strtoll(revNumberStrVal, NULL, 10);
    }

    revEntityMetadata->_revTimeCreated = _revTimeCreatedVal;

    // _revTimePublished
    long _revTimePublishedVal = -1;

    const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revTimePublished");

    if (cJSON_IsNumber(_revTimePublished)) {
        _revTimePublishedVal = _revTimePublished->valueint;
    } else if (cJSON_IsString(_revTimePublished)) {
        char *revNumberStrVal = _revTimePublished->valuestring;
        _revTimePublishedVal = strtoll(revNumberStrVal, NULL, 10);
    }

    revEntityMetadata->_revTimePublished = _revTimePublishedVal;

    // _revTimePublishedUpdated
    long _revTimePublishedUpdatedVal = -1;

    const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revTimePublishedUpdated");

    if (cJSON_IsNumber(_revTimePublishedUpdated)) {
        _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
    } else if (cJSON_IsString(_revTimePublishedUpdated)) {
        char *revNumberStrVal = _revTimePublishedUpdated->valuestring;
        _revTimePublishedUpdatedVal = strtoll(revNumberStrVal, NULL, 10);
    }

    revEntityMetadata->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;

    return revEntityMetadata;
}

void revMetaDataJSONArrStrFiller(list *revList, const char *const revEntityMetadataJSONArrStr) {
    list_new(revList, sizeof(RevEntityMetadata), revFreeMetadata);

    // _revMetadataList
    const cJSON *_revMetadataList = cJSON_Parse(revEntityMetadataJSONArrStr);

    if (cJSON_IsArray(_revMetadataList))
    {
        cJSON *revEntityMetadataJSON = NULL;

        cJSON_ArrayForEach(revEntityMetadataJSON, _revMetadataList)
        {
            RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *)malloc(sizeof(RevEntityMetadata));

            // _revName
            const cJSON *_revName = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revName");

            if (cJSON_IsString(_revName) && (_revName->valuestring != NULL)) {
                char *_revNameVal = _revName->valuestring;
                revEntityMetadata->_revName = _revNameVal;
            }

            // _revValue
            const cJSON *_revValue = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revValue");

            if (cJSON_IsString(_revValue) && (_revValue->valuestring != NULL)) {
                char *_revValueVal = _revValue->valuestring;
                revEntityMetadata->_revValue = _revValueVal;
            }

            // _revResolveStatus
            int _revResolveStatusVal = -1;

            const cJSON *_revResolveStatus = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revResolveStatus");

            if (cJSON_IsNumber(_revResolveStatus)) {
                _revResolveStatusVal = _revResolveStatus->valueint;
            } else if (cJSON_IsString(_revResolveStatus)) {
                char *revNumberStrVal = _revResolveStatus->valuestring;
                _revResolveStatusVal = strtol(revNumberStrVal, NULL, 10);
            }
            
            revEntityMetadata->_revResolveStatus = _revResolveStatusVal;

            // _revGUID
            revEntityMetadata->_revGUID = -1;

            // _revId
            const cJSON *_revId = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revId");

            long _revIdVal = -1l;

            if (cJSON_IsNumber(_revId)) {
                _revIdVal = _revId->valueint;
            } else if (cJSON_IsString(_revId)) {
                char *revNumberStrVal = _revId->valuestring;
                _revIdVal = strtoll(revNumberStrVal, NULL, 10);
            }

            revEntityMetadata->_revId = _revIdVal;

            // _revRemoteId
            const cJSON *_revRemoteId = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revRemoteId");

            long _revRemoteIdVal = -1l;

            if (cJSON_IsNumber(_revRemoteId)) {
                _revRemoteIdVal = _revRemoteId->valueint;
            } else if (cJSON_IsString(_revRemoteId)) {
                char *revNumberStrVal = _revRemoteId->valuestring;
                _revRemoteIdVal = strtoll(revNumberStrVal, NULL, 10);
            }

            revEntityMetadata->_revRemoteId = _revRemoteIdVal;

            // _revTimeCreated
            long _revTimeCreatedVal = -1;

            const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revTimeCreated");

            if (cJSON_IsNumber(_revTimeCreated)) {
                _revTimeCreatedVal = _revTimeCreated->valueint;
            } else if (cJSON_IsString(_revTimeCreated)) {
                char *revNumberStrVal = _revTimeCreated->valuestring;
                _revTimeCreatedVal = strtoll(revNumberStrVal, NULL, 10);
            }

            revEntityMetadata->_revTimeCreated = _revTimeCreatedVal;

            // _revTimePublished
            long _revTimePublishedVal = -1;

            const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revTimePublished");

            if (cJSON_IsNumber(_revTimePublished)) {
                _revTimePublishedVal = _revTimePublished->valueint;
            } else if (cJSON_IsString(_revTimePublished)) {
                char *revNumberStrVal = _revTimePublished->valuestring;
                _revTimePublishedVal = strtoll(revNumberStrVal, NULL, 10);
            }

            revEntityMetadata->_revTimePublished = _revTimePublishedVal;

            // _revTimePublishedUpdated
            long _revTimePublishedUpdatedVal = -1;

            const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revTimePublishedUpdated");

            if (cJSON_IsNumber(_revTimePublishedUpdated)) {
                _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
            } else if (cJSON_IsString(_revTimePublishedUpdated)) {
                char *revNumberStrVal = _revTimePublishedUpdated->valuestring;
                _revTimePublishedUpdatedVal = strtoll(revNumberStrVal, NULL, 10);
            }

            revEntityMetadata->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;

            list_append(revList, revEntityMetadata);
        }
    }
}
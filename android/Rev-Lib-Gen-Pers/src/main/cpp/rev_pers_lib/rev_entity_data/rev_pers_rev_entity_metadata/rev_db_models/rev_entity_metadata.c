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

#include "../../../../rev_gen_functions/rev_gen_functions.h"

void revFreeMetadata(void *data)
{
    free(*(RevEntityMetadata **)data);
}

RevEntityMetadata *revInitializedMetadata()
{
    RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *)malloc(sizeof(RevEntityMetadata));

    revEntityMetadata->_resolveStatus = -1;

    revEntityMetadata->_metadataId = -1;
    revEntityMetadata->_remoteRevMetadataId = -1;
    revEntityMetadata->_metadataOwnerGUID = -1;
    revEntityMetadata->_metadataValueId = -1;

    revEntityMetadata->_metadataName = "";
    revEntityMetadata->_metadataValue = "";

    revEntityMetadata->_timeCreated = "";
    revEntityMetadata->_timeUpdated = "";

    revEntityMetadata->_revTimeCreated = -1;
    revEntityMetadata->_revTimePublished = -1;
    revEntityMetadata->_revTimePublishedUpdated = -1;

    return revEntityMetadata;
}

RevEntityMetadata *revJSONStrMetadataFiller(const char *const revEntityMetadataJSONStr)
{

    cJSON *rev_entity_metadata_json = cJSON_Parse(revEntityMetadataJSONStr);

    RevEntityMetadata *revEntityMetadata = revInitializedMetadata();

    if (rev_entity_metadata_json == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error -revJSONStrMetadataFiller %s\n", error_ptr);
        }

        goto end;
    }

    // _revMetadataName
    const cJSON *_revMetadataName = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revMetadataName");

    if (cJSON_IsString(_revMetadataName) && (_revMetadataName->valuestring != NULL))
    {
        char *_revMetadataNameVal = _revMetadataName->valuestring;
        revEntityMetadata->_metadataName = _revMetadataNameVal;
    }

    // _metadataValue
    const cJSON *_metadataValue = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_metadataValue");

    if (cJSON_IsString(_metadataValue) && (_metadataValue->valuestring != NULL))
    {
        char *_metadataValueVal = _metadataValue->valuestring;
        revEntityMetadata->_metadataValue = _metadataValueVal;
    }

    // _resolveStatus
    const cJSON *_resolveStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_resolveStatus");

    if (cJSON_IsNumber(_resolveStatus))
    {
        int _resolveStatusVal = _resolveStatus->valueint;
        revEntityMetadata->_resolveStatus = _resolveStatusVal;
    }

    // _metadataOwnerGUID
    long _revMetadataEntityGUIDVal = -1;

    const cJSON *_revMetadataEntityGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_revMetadataEntityGUID");

    if (cJSON_IsNumber(_revMetadataEntityGUID) && (_revMetadataEntityGUID->valueint != NULL))
    {
        _revMetadataEntityGUIDVal = _revMetadataEntityGUID->valueint;
    }

    revEntityMetadata->_metadataOwnerGUID = _revMetadataEntityGUIDVal;

    // _remoteRevMetadataId
    const cJSON *_remoteRevMetadataId = cJSON_GetObjectItemCaseSensitive(rev_entity_metadata_json, "_remoteRevMetadataId");

    long _remoteRevMetadataIdVal = -1l;

    if (cJSON_IsNumber(_remoteRevMetadataId) && (_remoteRevMetadataId->valueint != NULL))
    {
        _remoteRevMetadataIdVal = _remoteRevMetadataId->valueint;
    }

    revEntityMetadata->_remoteRevMetadataId = _remoteRevMetadataIdVal;

    // _revTimePublished
    revEntityMetadata->_revTimePublished = revCurrentTimestampMillSecs();

    // _revTimePublishedUpdated
    revEntityMetadata->_revTimePublishedUpdated = revCurrentTimestampMillSecs();

end:

    return revEntityMetadata;
}

list *revMetaDataJSONArrStrFiller(const char *const revEntityMetadataJSONArrStr)
{
    list list;
    list_new(&list, sizeof(RevEntityMetadata), revFreeMetadata);

    // _revEntityMetadataList
    const cJSON *_revEntityMetadataList = cJSON_Parse(revEntityMetadataJSONArrStr);

    if (cJSON_IsArray(_revEntityMetadataList))
    {
        cJSON *revEntityMetadataJSON = NULL;

        cJSON_ArrayForEach(revEntityMetadataJSON, _revEntityMetadataList)
        {
            RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *)malloc(sizeof(RevEntityMetadata));

            // _revMetadataName
            const cJSON *_revMetadataName = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revMetadataName");

            if (cJSON_IsString(_revMetadataName) && (_revMetadataName->valuestring != NULL))
            {
                char *_revMetadataNameVal = _revMetadataName->valuestring;
                revEntityMetadata->_metadataName = _revMetadataNameVal;
            }

            // _metadataValue
            const cJSON *_metadataValue = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_metadataValue");

            if (cJSON_IsString(_metadataValue) && (_metadataValue->valuestring != NULL))
            {
                char *_metadataValueVal = _metadataValue->valuestring;
                revEntityMetadata->_metadataValue = _metadataValueVal;
            }

            // _resolveStatus
            const cJSON *_resolveStatus = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_resolveStatus");

            if (cJSON_IsNumber(_resolveStatus))
            {
                int _resolveStatusVal = _resolveStatus->valueint;
                revEntityMetadata->_resolveStatus = _resolveStatusVal;
            }

            // _metadataOwnerGUID
            revEntityMetadata->_metadataOwnerGUID = -1;

            // _remoteRevMetadataId
            const cJSON *_remoteRevMetadataId = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_remoteRevMetadataId");

            long _remoteRevMetadataIdVal = -1l;

            if (cJSON_IsNumber(_remoteRevMetadataId) && (_remoteRevMetadataId->valueint != NULL))
            {
                _remoteRevMetadataIdVal = _remoteRevMetadataId->valueint;
            }

            revEntityMetadata->_remoteRevMetadataId = _remoteRevMetadataIdVal;

            // _revTimePublished
            revEntityMetadata->_revTimePublished = revCurrentTimestampMillSecs();

            // _revTimePublishedUpdated
            revEntityMetadata->_revTimePublishedUpdated = revCurrentTimestampMillSecs();

            list_append(&list, revEntityMetadata);
        }
    }

    return &list;
}
//
// Created by rev on 12/20/22.
//

#include "rev_entity_relationships.h"

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <android/log.h>

#include "../../../../../../../libs/cJSON/cJSON.h"

RevEntityRelationship *revInitializedEntityRelationship()
{
    RevEntityRelationship *revEntityRelationship = (RevEntityRelationship *)malloc(sizeof(RevEntityRelationship));

    revEntityRelationship->_revResolveStatus = -1;

    revEntityRelationship->_revTypeValueId = -1;
    revEntityRelationship->_revType = "";

    revEntityRelationship->_revId = -1;
    revEntityRelationship->_revRemoteId = -1;

    revEntityRelationship->_revGUID = -1;
    revEntityRelationship->_revRemoteGUID = -1;

    revEntityRelationship->_revSubjectGUID = -1;
    revEntityRelationship->_revRemoteSubjectGUID = -1;
    revEntityRelationship->_revTargetGUID = -1;
    revEntityRelationship->_revRemoteTargetGUID = -1;

    revEntityRelationship->_revTimeCreated = -1;
    revEntityRelationship->_revTimePublished = -1;
    revEntityRelationship->_revTimePublishedUpdated = -1;

    return revEntityRelationship;
}

RevEntityRelationship *revJSONEntityRelationshipFiller(const char *const revJSONStringEntityRelationship)
{
    RevEntityRelationship *revEntityRelationship = revInitializedEntityRelationship();

    cJSON *rev_entity_relationship_json = cJSON_Parse(revJSONStringEntityRelationship);

    if (rev_entity_relationship_json == NULL)
    {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL)
        {
            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    // _revResolveStatus
    const cJSON *_revResolveStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revResolveStatus");

    if (cJSON_IsNumber(_revResolveStatus))
    {
        int _revResolveStatusVal = _revResolveStatus->valueint;
        revEntityRelationship->_revResolveStatus = _revResolveStatusVal;
    }

    // _revTypeValueId
    const cJSON *_revTypeValueId = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revTypeValueId");

    if (cJSON_IsNumber(_revTypeValueId))
    {
        int _revTypeValueIdVal = _revTypeValueId->valueint;
        revEntityRelationship->_revTypeValueId = _revTypeValueIdVal;
    }

    // _revType
    const cJSON *_revType = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revType");

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> cJSON_Print(_revType) : %s", cJSON_Print(_revType));

    if (cJSON_IsString(_revType))
    {
        char *_revTypeVal = _revType->valuestring;

        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> _revTypeVal : %s", _revTypeVal);

        revEntityRelationship->_revType = strdup(_revTypeVal);
    }

    // _revId
    const cJSON *_revId = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revId");

    if (cJSON_IsNumber(_revId))
    {
        int _revIdVal = _revId->valueint;
        revEntityRelationship->_revId = _revIdVal;
    }

    // _revRemoteId
    const cJSON *_revRemoteId = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteId");

    if (cJSON_IsNumber(_revRemoteId))
    {
        long _revRemoteIdVal = _revRemoteId->valueint;
        revEntityRelationship->_revRemoteId = _revRemoteIdVal;
    }

    // _revGUID
    const cJSON *_revGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revGUID");

    if (cJSON_IsNumber(_revGUID))
    {
        long _revGUIDVal = _revGUID->valueint;
        revEntityRelationship->_revGUID = _revGUIDVal;
    }

    // _revRemoteGUID
    const cJSON *_revRemoteGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteGUID");

    if (cJSON_IsNumber(_revRemoteGUID))
    {
        long _revRemoteGUIDVal = _revRemoteGUID->valueint;
        revEntityRelationship->_revRemoteGUID = _revRemoteGUIDVal;
    }

    // _revSubjectGUID
    const cJSON *_revSubjectGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revSubjectGUID");

    if (cJSON_IsNumber(_revSubjectGUID))
    {
        long _revSubjectGUIDVal = _revSubjectGUID->valueint;
        revEntityRelationship->_revSubjectGUID = _revSubjectGUIDVal;
    }

    // _revRemoteSubjectGUID
    const cJSON *_revRemoteSubjectGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteSubjectGUID");

    if (cJSON_IsNumber(_revRemoteSubjectGUID))
    {
        long _revRemoteSubjectGUIDVal = _revRemoteSubjectGUID->valueint;
        revEntityRelationship->_revRemoteSubjectGUID = _revRemoteSubjectGUIDVal;
    }

    // _revTargetGUID
    const cJSON *_revTargetGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revTargetGUID");

    if (cJSON_IsNumber(_revTargetGUID))
    {
        long _revTargetGUIDVal = _revTargetGUID->valueint;
        revEntityRelationship->_revTargetGUID = _revTargetGUIDVal;
    }

    // _revRemoteTargetGUID
    const cJSON *_revRemoteTargetGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteTargetGUID");

    if (cJSON_IsNumber(_revRemoteTargetGUID))
    {
        long _revRemoteTargetGUIDVal = _revRemoteTargetGUID->valueint;
        revEntityRelationship->_revRemoteTargetGUID = _revRemoteTargetGUIDVal;
    }

    // _revTimeCreated
    const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revTimeCreated");

    if (cJSON_IsNumber(_revTimeCreated))
    {
        long _revTimeCreatedVal = _revTimeCreated->valueint;
        revEntityRelationship->_revTimeCreated = _revTimeCreatedVal;
    }

    // _revTimePublished
    const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revTimePublished");

    if (cJSON_IsNumber(_revTimePublished))
    {
        long _revTimePublishedVal = _revTimePublished->valueint;
        revEntityRelationship->_revTimePublished = _revTimePublishedVal;
    }

    // _revTimePublishedUpdated
    const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revTimePublishedUpdated");

    if (cJSON_IsNumber(_revTimePublishedUpdated))
    {
        long _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
        revEntityRelationship->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;
    }

end:

    cJSON_Delete(rev_entity_relationship_json);

    return revEntityRelationship;
}
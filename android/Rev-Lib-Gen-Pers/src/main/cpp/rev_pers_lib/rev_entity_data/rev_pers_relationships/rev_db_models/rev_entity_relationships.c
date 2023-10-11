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

    revEntityRelationship->_revEntityRelationshipTypeValueId = -1;
    revEntityRelationship->_revEntityRelationshipType = "";

    revEntityRelationship->_revEntityRelationshipId = -1;
    revEntityRelationship->_revRemoteEntityRelationshipId = -1;

    revEntityRelationship->_revEntityGUID = -1;
    revEntityRelationship->_revRemoteEntityGUID = -1;

    revEntityRelationship->_revEntitySubjectGUID = -1;
    revEntityRelationship->_revRemoteEntitySubjectGUID = -1;
    revEntityRelationship->_revEntityTargetGUID = -1;
    revEntityRelationship->_revRemoteEntityTargetGUID = -1;

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

    // _revEntityRelationshipTypeValueId
    const cJSON *_revEntityRelationshipTypeValueId = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revEntityRelationshipTypeValueId");

    if (cJSON_IsNumber(_revEntityRelationshipTypeValueId))
    {
        int _revEntityRelationshipTypeValueIdVal = _revEntityRelationshipTypeValueId->valueint;
        revEntityRelationship->_revEntityRelationshipTypeValueId = _revEntityRelationshipTypeValueIdVal;
    }

    // _revEntityRelationshipType
    const cJSON *_revEntityRelationshipType = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revEntityRelationshipType");

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> cJSON_Print(_revEntityRelationshipType) : %s", cJSON_Print(_revEntityRelationshipType));

    if (cJSON_IsString(_revEntityRelationshipType))
    {
        char *_revEntityRelationshipTypeVal = _revEntityRelationshipType->valuestring;

        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> _revEntityRelationshipTypeVal : %s", _revEntityRelationshipTypeVal);

        revEntityRelationship->_revEntityRelationshipType = strdup(_revEntityRelationshipTypeVal);
    }

    // _revEntityRelationshipId
    const cJSON *_revEntityRelationshipId = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revEntityRelationshipId");

    if (cJSON_IsNumber(_revEntityRelationshipId))
    {
        int _revEntityRelationshipIdVal = _revEntityRelationshipId->valueint;
        revEntityRelationship->_revEntityRelationshipId = _revEntityRelationshipIdVal;
    }

    // _revRemoteEntityRelationshipId
    const cJSON *_revRemoteEntityRelationshipId = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteEntityRelationshipId");

    if (cJSON_IsNumber(_revRemoteEntityRelationshipId))
    {
        long _revRemoteEntityRelationshipIdVal = _revRemoteEntityRelationshipId->valueint;
        revEntityRelationship->_revRemoteEntityRelationshipId = _revRemoteEntityRelationshipIdVal;
    }

    // _revEntityGUID
    const cJSON *_revEntityGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revEntityGUID");

    if (cJSON_IsNumber(_revEntityGUID))
    {
        long _revEntityGUIDVal = _revEntityGUID->valueint;
        revEntityRelationship->_revEntityGUID = _revEntityGUIDVal;
    }

    // _revRemoteEntityGUID
    const cJSON *_revRemoteEntityGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteEntityGUID");

    if (cJSON_IsNumber(_revRemoteEntityGUID))
    {
        long _revRemoteEntityGUIDVal = _revRemoteEntityGUID->valueint;
        revEntityRelationship->_revRemoteEntityGUID = _revRemoteEntityGUIDVal;
    }

    // _revEntitySubjectGUID
    const cJSON *_revEntitySubjectGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revEntitySubjectGUID");

    if (cJSON_IsNumber(_revEntitySubjectGUID))
    {
        long _revEntitySubjectGUIDVal = _revEntitySubjectGUID->valueint;
        revEntityRelationship->_revEntitySubjectGUID = _revEntitySubjectGUIDVal;
    }

    // _revRemoteEntitySubjectGUID
    const cJSON *_revRemoteEntitySubjectGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteEntitySubjectGUID");

    if (cJSON_IsNumber(_revRemoteEntitySubjectGUID))
    {
        long _revRemoteEntitySubjectGUIDVal = _revRemoteEntitySubjectGUID->valueint;
        revEntityRelationship->_revRemoteEntitySubjectGUID = _revRemoteEntitySubjectGUIDVal;
    }

    // _revEntityTargetGUID
    const cJSON *_revEntityTargetGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revEntityTargetGUID");

    if (cJSON_IsNumber(_revEntityTargetGUID))
    {
        long _revEntityTargetGUIDVal = _revEntityTargetGUID->valueint;
        revEntityRelationship->_revEntityTargetGUID = _revEntityTargetGUIDVal;
    }

    // _revRemoteEntityTargetGUID
    const cJSON *_revRemoteEntityTargetGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_relationship_json, "_revRemoteEntityTargetGUID");

    if (cJSON_IsNumber(_revRemoteEntityTargetGUID))
    {
        long _revRemoteEntityTargetGUIDVal = _revRemoteEntityTargetGUID->valueint;
        revEntityRelationship->_revRemoteEntityTargetGUID = _revRemoteEntityTargetGUIDVal;
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
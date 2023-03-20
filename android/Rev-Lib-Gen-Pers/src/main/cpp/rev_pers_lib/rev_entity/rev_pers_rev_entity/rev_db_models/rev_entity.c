//
// Created by rev on 12/5/22.
//

#include "rev_entity.h"

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>
#include <string.h>

#include "../../../rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "../../../../../../../libs/cJSON/cJSON.h"

RevEntityKeyValuePair *revGetEntityKeyValuePairMapping(RevEntity *revEntity) {
    RevEntityKeyValuePair *revEntityKeyValuePairMapping[] = {
            {"_isNull",                       revEntity->_isNull},
            {"_id",                           revEntity->_id},
            {"_revEntityType",                revEntity->_revEntityType},
            {"_revEntitySubType",             revEntity->_revEntitySubType},
            {"_revEntityResolveStatus",       revEntity->_revEntityResolveStatus},
            {"_revEntityAccessPermission",    revEntity->_revEntityAccessPermission},
            {"_revEntityGUID",                revEntity->_revEntityGUID},
            {"_remoteRevEntityGUID",          revEntity->_remoteRevEntityGUID},
            {"_revOwnerEntityGUID",           revEntity->_revOwnerEntityGUID},
            {"_revContainerEntityGUID",       revEntity->_revContainerEntityGUID},
            {"_remoteRevEntityContainerGUID", revEntity->_remoteRevEntityContainerGUID},
            {"_revEntitySiteGUID",            revEntity->_revEntitySiteGUID},
            {"_timeCreated",                  revEntity->_timeCreated},
            {"_timeUpdated",                  revEntity->_timeUpdated},
            {"_revTimeCreated",               revEntity->_revTimeCreated},
            {"_revTimePublished",             revEntity->_revTimePublished},
            {"_revTimePublishedUpdated",      revEntity->_revTimePublishedUpdated},
            {"childRevEntity",                revEntity->childRevEntity},
            {"_revInfoEntity",                revEntity->_revInfoEntity},
            {NULL, NULL} // Sentinel value to mark the end of the array
    };

    return revEntityKeyValuePairMapping;
}

RevEntity *revInitializedEntity() {
    RevEntity *revEntity = malloc(sizeof(RevEntity));

    revEntity->_isNull = FALSE;

    revEntity->_id = -1;
    revEntity->_revEntityType = "";
    revEntity->_revEntitySubType = "";

    revEntity->_revEntityResolveStatus = -1;
    revEntity->_revEntityChildableStatus = -1;
    revEntity->_revEntityAccessPermission = -1;

    revEntity->_revEntityGUID = -1;
    revEntity->_remoteRevEntityGUID = -1;
    revEntity->_revOwnerEntityGUID = -1;
    revEntity->_revContainerEntityGUID = -1;
    revEntity->_remoteRevEntityContainerGUID = -1;
    revEntity->_revEntitySiteGUID = -1;

    revEntity->_timeCreated = "";
    revEntity->_timeUpdated = "";

    revEntity->_revTimeCreated = -1;
    revEntity->_revTimePublished = -1;
    revEntity->_revTimePublishedUpdated = -1;

    revEntity->_revInfoEntity = (RevEntity *) malloc(sizeof(RevEntity));

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

    revEntity->_revEntityMetadataList = list;

    return revEntity;
}

RevEntity *revJSONEntityFiller(const char *const revJSONStringEntity) {
    RevEntity *revEntity = revInitializedEntity();

    cJSON *rev_entity_json = cJSON_Parse(revJSONStringEntity);

    if (rev_entity_json == NULL) {
        const char *error_ptr = cJSON_GetErrorPtr();
        if (error_ptr != NULL) {
            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error before: %s\n", error_ptr);
        }
        goto end;
    }

    // Type
    const cJSON *_revEntityType = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityType");
    if (cJSON_IsString(_revEntityType) && (_revEntityType->valuestring != NULL)) {
        char *_revEntityTypeVal = _revEntityType->valuestring;
        revEntity->_revEntityType = strdup(_revEntityTypeVal);
    }

    // _revEntitySubType
    const cJSON *_revEntitySubType = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntitySubType");
    if (cJSON_IsString(_revEntitySubType) && (_revEntitySubType->valuestring != NULL)) {
        char *_revEntitySubTypeVal = _revEntitySubType->valuestring;
        revEntity->_revEntitySubType = strdup(_revEntitySubTypeVal);
    }

    // _revEntityResolveStatus
    const cJSON *_revEntityResolveStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityResolveStatus");

    if (cJSON_IsNumber(_revEntityResolveStatus)) {
        int _revEntityResolveStatusVal = _revEntityResolveStatus->valueint;
        revEntity->_revEntityResolveStatus = _revEntityResolveStatusVal;
    }

    // _revEntityChildableStatus
    const cJSON *_revEntityChildableStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityChildableStatus");

    if (cJSON_IsNumber(_revEntityChildableStatus)) {
        int _revEntityChildableStatusVal = _revEntityChildableStatus->valueint;
        revEntity->_revEntityChildableStatus = _revEntityChildableStatusVal;
    }

    // _revEntityAccessPermission
    const cJSON *_revEntityAccessPermission = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityAccessPermission");

    if (cJSON_IsNumber(_revEntityAccessPermission)) {
        int _revEntityAccessPermissionVal = _revEntityAccessPermission->valueint;
        revEntity->_revEntityAccessPermission = _revEntityAccessPermissionVal;
    }

    // _revEntityGUID
    const cJSON *_revEntityGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityGUID");

    if (cJSON_IsNumber(_revEntityGUID) && (_revEntityGUID->valueint != NULL)) {
        long _revEntityGUIDVal = _revEntityGUID->valueint;
        revEntity->_revEntityGUID = _revEntityGUIDVal;
    }

    // _remoteRevEntityGUID
    const cJSON *_remoteRevEntityGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_remoteRevEntityGUID");

    if (cJSON_IsNumber(_remoteRevEntityGUID) && (_remoteRevEntityGUID->valueint != NULL)) {
        long _remoteRevEntityGUIDVal = _remoteRevEntityGUID->valueint;
        revEntity->_remoteRevEntityGUID = _remoteRevEntityGUIDVal;
    }

    // _revOwnerEntityGUID
    const cJSON *_revEntityOwnerGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityOwnerGUID");

    if (cJSON_IsNumber(_revEntityOwnerGUID) && (_revEntityOwnerGUID->valueint != NULL)) {
        long _revEntityOwnerGUIDVal = _revEntityOwnerGUID->valueint;
        revEntity->_revOwnerEntityGUID = _revEntityOwnerGUIDVal;
    }

    // _revEntityContainerGUID
    const cJSON *_revEntityContainerGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityContainerGUID");

    if (cJSON_IsNumber(_revEntityContainerGUID) && (_revEntityContainerGUID->valueint != NULL)) {
        long _revEntityContainerGUIDVal = _revEntityContainerGUID->valueint;
        revEntity->_revContainerEntityGUID = _revEntityContainerGUIDVal;
    }

    // _remoteRevEntityContainerGUID
    const cJSON *_remoteRevEntityContainerGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_remoteRevEntityContainerGUID");

    if (cJSON_IsNumber(_remoteRevEntityContainerGUID) && (_remoteRevEntityContainerGUID->valueint != NULL)) {
        long _remoteRevEntityContainerGUIDVal = _remoteRevEntityContainerGUID->valueint;
        revEntity->_remoteRevEntityContainerGUID = _remoteRevEntityContainerGUIDVal;
    }

    // _revEntitySiteGUID
    const cJSON *_revEntitySiteGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntitySiteGUID");

    if (cJSON_IsNumber(_revEntitySiteGUID) && (_revEntitySiteGUID->valueint != NULL)) {
        long _revEntitySiteGUIDVal = _revEntitySiteGUID->valueint;
        revEntity->_revEntitySiteGUID = _revEntitySiteGUIDVal;
    }

    // _revInfoEntity
    const cJSON *_revInfoEntity = cJSON_GetObjectItem(rev_entity_json, "_revInfoEntity");

    if (_revInfoEntity) {
        char *_revInfoEntityStrVal = cJSON_Print(_revInfoEntity);

        RevEntity *revInfoEntity = revJSONEntityFiller(_revInfoEntityStrVal);
        revEntity->_revInfoEntity = revInfoEntity;
    }

    // _timeCreated
    const cJSON *_timeCreated = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_timeCreated");

    if (cJSON_IsString(_timeCreated) && (_timeCreated->valuestring != NULL)) {
        char *_timeCreatedVal = _timeCreated->valuestring;
        revEntity->_timeCreated = _timeCreatedVal;
    }

    // _timeUpdated
    const cJSON *_timeUpdated = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_timeUpdated");

    if (cJSON_IsString(_timeUpdated) && (_timeUpdated->valuestring != NULL)) {
        char *_timeUpdatedVal = _timeUpdated->valuestring;
        revEntity->_timeUpdated = _timeUpdatedVal;
    }

    // _revTimeCreated
    const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revTimeCreated");

    if (cJSON_IsNumber(_revTimeCreated) && (_revTimeCreated->valueint != NULL)) {
        long _revTimeCreatedVal = _revTimeCreated->valueint;
        revEntity->_revTimeCreated = _revTimeCreatedVal;
    }

    // _revTimePublished
    const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revTimePublished");

    if (cJSON_IsNumber(_revTimePublished) && (_revTimePublished->valueint != NULL)) {
        long _revTimePublishedVal = _revTimePublished->valueint;
        revEntity->_revTimePublished = _revTimePublishedVal;
    }

    // _revTimePublishedUpdated
    const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revTimePublishedUpdated");

    if (cJSON_IsNumber(_revTimePublishedUpdated) && (_revTimePublishedUpdated->valueint != NULL)) {
        long _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
        revEntity->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;
    }

    // _revEntityMetadataList
    const cJSON *_revEntityMetadataList = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revEntityMetadataList");

    revEntity->_revEntityMetadataList = *(revJSONMetadataFiller(cJSON_Print(_revEntityMetadataList)));

    end:

    cJSON_Delete(rev_entity_json);

    return revEntity;
}

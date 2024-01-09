//
// Created by rev on 12/5/22.
//

#include "rev_entity.h"

#include <android/log.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../../rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "../../../../../../libs/cJSON/cJSON.h"
#include "../../../../../../libs/rev_map/rev_map.h"
#include "../../rev_db_init/rev_db_init.h"

htable_strstr_t *revGetEntityDB_Keys() {
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "_revType", "REV_ENTITY_TYPE");
    htable_strstr_insert(revMap, "_revSubType", "REV_ENTITY_SUB_TYPE");
    htable_strstr_insert(revMap, "_revResolveStatus", "REV_RESOLVE_STATUS");
    htable_strstr_insert(revMap, "_revChildableStatus", "REV_CHILDABLE_STATUS");
    htable_strstr_insert(revMap, "_revAccessPermission", "REV_ENTITY_ACCESS_PERMISSION");
    htable_strstr_insert(revMap, "_revSiteGUID", "REV_ENTITY_SITE_GUID");
    htable_strstr_insert(revMap, "_revGUID", "REV_ENTITY_GUID");
    htable_strstr_insert(revMap, "_revRemoteGUID", "REMOTE_REV_ENTITY_GUID");
    htable_strstr_insert(revMap, "_revOwnerGUID", "REV_ENTITY_OWNER_GUID");
    htable_strstr_insert(revMap, "_revContainerGUID", "REV_ENTITY_CONTAINER_GUID");
    htable_strstr_insert(revMap, "_revTimeCreated", "REV_CREATED_DATE");
    htable_strstr_insert(revMap, "_revTimePublishedUpdated", "REV_UPDATED_DATE");
    htable_strstr_insert(revMap, "_revTimePublished", "REV_PUBLISHED_DATE");
    htable_strstr_insert(revMap, "revLimit", "LIMIT");

    return revMap;
}

htable_strstr_t *revGetMapped_Entity_Key_DBFieldName() {
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "REV_ENTITY_TYPE", "_revType");
    htable_strstr_insert(revMap, "REV_ENTITY_SUB_TYPE", "_revSubType");
    htable_strstr_insert(revMap, "REV_RESOLVE_STATUS", "_revResolveStatus");
    htable_strstr_insert(revMap, "REV_CHILDABLE_STATUS", "_revChildableStatus");
    htable_strstr_insert(revMap, "REV_ENTITY_ACCESS_PERMISSION", "_revAccessPermission");
    htable_strstr_insert(revMap, "REV_ENTITY_SITE_GUID", "_revSiteGUID");
    htable_strstr_insert(revMap, "REV_ENTITY_GUID", "_revGUID");
    htable_strstr_insert(revMap, "REMOTE_REV_ENTITY_GUID", "_revRemoteGUID");
    htable_strstr_insert(revMap, "REV_ENTITY_OWNER_GUID", "_revOwnerGUID");
    htable_strstr_insert(revMap, "REV_ENTITY_CONTAINER_GUID", "_revContainerGUID");
    htable_strstr_insert(revMap, "REV_CREATED_DATE", "_revTimeCreated");
    htable_strstr_insert(revMap, "REV_UPDATED_DATE", "_revTimePublishedUpdated");
    htable_strstr_insert(revMap, "REV_PUBLISHED_DATE", "_revTimePublished");

    return revMap;
}

RevEntity *revInitializedEntity() {
    RevEntity *revEntity = malloc(sizeof(RevEntity));

    revEntity->_isNull = FALSE;

    revEntity->_id = -1;
    revEntity->_revType = "";
    revEntity->_revSubType = "";

    revEntity->_revResolveStatus = -1;
    revEntity->_revChildableStatus = -1;
    revEntity->_revAccessPermission = -1;

    revEntity->_revGUID = -1;
    revEntity->_revRemoteGUID = -1;
    revEntity->_revOwnerGUID = -1;
    revEntity->_revContainerGUID = -1;
    revEntity->_revRemoteContainerGUID = -1;
    revEntity->_revSiteGUID = -1;

    revEntity->_revTimeCreated = -1;
    revEntity->_revTimePublished = -1;
    revEntity->_revTimePublishedUpdated = -1;

    revEntity->_revInfoEntity = (RevEntity *) malloc(sizeof(RevEntity));

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

    revEntity->_revMetadataList = list;

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
    const cJSON *_revType = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revType");
    if (cJSON_IsString(_revType)) {
        char *_revTypeVal = _revType->valuestring;
        revEntity->_revType = strdup(_revTypeVal);
    }

    // _revSubType
    const cJSON *_revSubType = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revSubType");
    if (cJSON_IsString(_revSubType)) {
        char *_revSubTypeVal = _revSubType->valuestring;
        revEntity->_revSubType = strdup(_revSubTypeVal);
    }

    // _revResolveStatus
    const cJSON *_revResolveStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revResolveStatus");

    if (cJSON_IsNumber(_revResolveStatus)) {
        int _revResolveStatusVal = _revResolveStatus->valueint;
        revEntity->_revResolveStatus = _revResolveStatusVal;
    } else if (cJSON_IsString(_revResolveStatus)) {
        char *revNumberStrVal = _revResolveStatus->valuestring;
        revEntity->_revResolveStatus = strtol(revNumberStrVal, NULL, 10);
    }

    // _revChildableStatus
    const cJSON *_revChildableStatus = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revChildableStatus");

    if (cJSON_IsNumber(_revChildableStatus)) {
        int _revChildableStatusVal = _revChildableStatus->valueint;
        revEntity->_revChildableStatus = _revChildableStatusVal;
    } else if (cJSON_IsString(_revChildableStatus)) {
        char *revNumberStrVal = _revChildableStatus->valuestring;
        revEntity->_revChildableStatus = strtol(revNumberStrVal, NULL, 10);
    }

    // _revAccessPermission
    const cJSON *_revAccessPermission = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revAccessPermission");

    if (cJSON_IsNumber(_revAccessPermission)) {
        int _revAccessPermissionVal = _revAccessPermission->valueint;
        revEntity->_revAccessPermission = _revAccessPermissionVal;
    } else if (cJSON_IsString(_revAccessPermission)) {
        char *revNumberStrVal = _revAccessPermission->valuestring;
        revEntity->_revAccessPermission = strtol(revNumberStrVal, NULL, 10);
    }

    // _revGUID
    const cJSON *_revGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revGUID");

    if (cJSON_IsNumber(_revGUID)) {
        long _revGUIDVal = _revGUID->valueint;
        revEntity->_revGUID = _revGUIDVal;
    } else if (cJSON_IsString(_revGUID)) {
        char *revNumberStrVal = _revGUID->valuestring;
        revEntity->_revGUID = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revRemoteGUID
    const cJSON *_revRemoteGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revRemoteGUID");

    if (cJSON_IsNumber(_revRemoteGUID)) {
        long _revRemoteGUIDVal = _revRemoteGUID->valueint;
        revEntity->_revRemoteGUID = _revRemoteGUIDVal;
    } else if (cJSON_IsString(_revRemoteGUID)) {
        char *revNumberStrVal = _revRemoteGUID->valuestring;
        revEntity->_revRemoteGUID = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revOwnerGUID
    const cJSON *_revOwnerGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revOwnerGUID");

    if (cJSON_IsNumber(_revOwnerGUID)) {
        long _revOwnerGUIDVal = _revOwnerGUID->valueint;
        revEntity->_revOwnerGUID = _revOwnerGUIDVal;
    } else if (cJSON_IsString(_revOwnerGUID)) {
        char *revNumberStrVal = _revOwnerGUID->valuestring;
        revEntity->_revOwnerGUID = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revContainerGUID
    const cJSON *_revContainerGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revContainerGUID");

    if (cJSON_IsNumber(_revContainerGUID)) {
        long _revContainerGUIDVal = _revContainerGUID->valueint;
        revEntity->_revContainerGUID = _revContainerGUIDVal;
    } else if (cJSON_IsString(_revContainerGUID)) {
        char *revNumberStrVal = _revContainerGUID->valuestring;
        revEntity->_revContainerGUID = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revRemoteContainerGUID
    const cJSON *_revRemoteContainerGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revRemoteContainerGUID");

    if (cJSON_IsNumber(_revRemoteContainerGUID)) {
        long _revRemoteContainerGUIDVal = _revRemoteContainerGUID->valueint;
        revEntity->_revRemoteContainerGUID = _revRemoteContainerGUIDVal;
    } else if (cJSON_IsString(_revRemoteContainerGUID)) {
        char *revNumberStrVal = _revRemoteContainerGUID->valuestring;
        revEntity->_revRemoteContainerGUID = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revSiteGUID
    const cJSON *_revSiteGUID = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revSiteGUID");

    if (cJSON_IsNumber(_revSiteGUID)) {
        long _revSiteGUIDVal = _revSiteGUID->valueint;
        revEntity->_revSiteGUID = _revSiteGUIDVal;
    } else if (cJSON_IsString(_revSiteGUID)) {
        char *revNumberStrVal = _revSiteGUID->valuestring;
        revEntity->_revSiteGUID = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revInfoEntity
    const cJSON *_revInfoEntity = cJSON_GetObjectItem(rev_entity_json, "_revInfoEntity");

    if (_revInfoEntity) {
        char *_revInfoEntityStrVal = cJSON_Print(_revInfoEntity);

        RevEntity *revInfoEntity = revJSONEntityFiller(_revInfoEntityStrVal);
        revEntity->_revInfoEntity = revInfoEntity;
    }

    // _revTimeCreated
    const cJSON *_revTimeCreated = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revTimeCreated");

    if (cJSON_IsNumber(_revTimeCreated)) {
        long _revTimeCreatedVal = _revTimeCreated->valueint;
        revEntity->_revTimeCreated = _revTimeCreatedVal;
    } else if (cJSON_IsString(_revTimeCreated)) {
        char *revNumberStrVal = _revTimeCreated->valuestring;
        revEntity->_revTimeCreated = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revTimePublished
    const cJSON *_revTimePublished = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revTimePublished");

    if (cJSON_IsNumber(_revTimePublished)) {
        long _revTimePublishedVal = _revTimePublished->valueint;
        revEntity->_revTimePublished = _revTimePublishedVal;
    } else if (cJSON_IsString(_revTimePublished)) {
        char *revNumberStrVal = _revTimePublished->valuestring;
        revEntity->_revTimePublished = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revTimePublishedUpdated
    const cJSON *_revTimePublishedUpdated = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revTimePublishedUpdated");

    if (cJSON_IsNumber(_revTimePublishedUpdated)) {
        long _revTimePublishedUpdatedVal = _revTimePublishedUpdated->valueint;
        revEntity->_revTimePublishedUpdated = _revTimePublishedUpdatedVal;
    } else if (cJSON_IsString(_revTimePublishedUpdated)) {
        char *revNumberStrVal = _revTimePublishedUpdated->valuestring;
        revEntity->_revTimePublishedUpdated = strtoll(revNumberStrVal, NULL, 10);
    }

    // _revMetadataList
    const cJSON *_revMetadataList = cJSON_GetObjectItemCaseSensitive(rev_entity_json, "_revMetadataList");

    list revList;
    revMetaDataJSONArrStrFiller(&revList, cJSON_Print(_revMetadataList));
    revEntity->_revMetadataList = revList;

    end:

    cJSON_Delete(rev_entity_json);

    return revEntity;
}

//
// Created by rev on 7/6/18.
//

#include "rev_pers_read.h"

#include <jni.h>
#include <android/log.h>

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <strings.h>

#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../../libs/cJSON/cJSON.h"
#include "../../../../../../../../libs/rev_map/rev_map.h"
#include "../../../../rev_db_init/rev_pers_db_mappers.h"

list *revPersGetRevEntities_By_RevVarArgs(char *revVarArgs) {
    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    htable_strstr_t *revEntityDB_Keys = revGetEntityDB_Keys();
    htable_strstr_t *revMap = revGetMapped_Entity_Key_DBFieldName();

    cJSON *revJsonArr = revPersGetQuery_By_RevVarArgs(revVarArgs, revEntityDB_Keys, revMap);

    if (revJsonArr != NULL && cJSON_IsArray(revJsonArr)) {
        cJSON *revEntityMetadataJSON = NULL;

        cJSON_ArrayForEach(revEntityMetadataJSON, revJsonArr) {
            char *revCurrEntityStrVal = cJSON_Print(revEntityMetadataJSON);
            RevEntity *revEntity = revJSONEntityFiller(revCurrEntityStrVal);
            list_append(&revList, revEntity);

            free(revCurrEntityStrVal);
        }
    }

    cJSON_Delete(revJsonArr);

    return &revList;
}

int revEntitySubtypeExists_BY_OWNER_GUID(int revEntityOwnerGUID, char *revEntitySubtype) {

    int exists = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            exists = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revEntityExistsByLocalEntityGUID(long localRevEntityGUID) {

    int exists = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revEntityExistsByRemoteEntityGUID(long remoteRevEntityGUID) {
    int exists = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

long revGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID) {
    long revEntityOwnerGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_OWNER_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetEntityOwnerGUID_BY_EntityGUID SQL error: %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityOwnerGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityOwnerGUID;
}

list *revPersGet_ALL_RevEntity_By_SiteGUID_SubType(long revSiteEntityGUID, char *revEntitySubType) {
    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_SITE_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 10";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revSiteEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 3);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 4);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 5));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(const char *revDBTableFieldName_, long revSiteEntityGUID, const char *revEntitySubType) {
    htable_strstr_t *revMap = revGetEntityDB_Keys();

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT ";

    char *revDBTableFieldName = htable_strstr_get_direct(revMap, revDBTableFieldName_);
    sql = revConcatStrings(sql, revDBTableFieldName);

    char *revSelectionSQLPart = " FROM REV_ENTITY_TABLE WHERE REV_ENTITY_SITE_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";
    sql = revConcatStrings(sql, revSelectionSQLPart);

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, (long) revSiteEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    htable_strstr_destroy(revMap);

    return &revList;
}

int totalLocalRevUserEntites() {
    long revTotalUsers = -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "COUNT(REV_ENTITY_GUID)  "
                "FROM REV_USER_ENTITY_TABLE";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        revTotalUsers = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revTotalUsers;
}

long revGetPublicationDate(long localRevEntityGUID) {
    long remoteRevEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_PUBLISHED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetPublicationDate SQL error: %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        remoteRevEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return remoteRevEntityGUID;
}

long revGetRemoteEntityGUID_BY_LocalEntityGUID(long localRevEntityGUID) {
    long remoteRevEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetRemoteEntityGUID_BY_LocalEntityGUID SQL error: %s",
                            sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        remoteRevEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return remoteRevEntityGUID;
}

long getLocalRevEntityGUID_By_RemoteRevEntityGUID(long remoteRevEntityGUID) {
    long localRevEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        localRevEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return localRevEntityGUID;
}

long revEntitySubtypeExists_BY_CONTAINER_GUID(int revEntityContainerGUID, char *revEntitySubtype) {

    long exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            exists = sqlite3_column_int64(stmt, 0);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

RevEntity revPersGetRevEntityByGUID(long revEntityGUID) {

    RevEntity revEntity = *(RevEntity *) malloc(sizeof(RevEntity));

    // Check if the pointer is null
    if (revEntityGUID == NULL) {
        printf("The pointer is null.\n");

        return revEntity;
    }

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CHILDABLE_STATUS, "
                "REV_RESOLVE_STATUS, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? AND REV_RESOLVE_STATUS <> ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_int(stmt, 2, -3);

    revEntity._isNull = TRUE;

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "NULLABLE >>> %s ", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
        long revEntityResolveStatus = sqlite3_column_int64(stmt, 1);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 8));

        long revTimeCreated = sqlite3_column_int64(stmt, 9);
        char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 10));

        revEntity._isNull = FALSE;
        revEntity._revEntityChildableStatus = revEntityChildableStatus;
        revEntity._revEntityResolveStatus = revEntityResolveStatus;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revEntitySiteGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;
        revEntity._revTimeCreated = revTimeCreated;
        revEntity._timeCreated = strdup(revLocalTimer(revTimeCreated));
        revEntity._timeUpdated = timeUpdated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntity;
}

RevEntity revPersGetRevEntity_By_RemoteRevEntityGUID(long remoteRevEntityGUID) {
    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    RevEntity revEntity = *(RevEntity *) malloc(sizeof(RevEntity));

    revEntity._isNull = TRUE;

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "NULLABLE >>> %s ", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 6));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        revEntity._isNull = FALSE;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revEntitySiteGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;

        revEntity._revTimeCreated = _revTimeCreated;
        revEntity._timeCreated = strdup(revLocalTimer(_revTimeCreated));
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntity;
}

list *revPersGetALLRevEntityGUIDs_By_RevEntityType(char *revEntityType) {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_TYPE = ? ORDER BY REV_CREATED_DATE DESC";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDs_By_ContainerGUID(long revEntityContainerGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? ORDER BY REV_CREATED_DATE DESC";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityContainerGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityTYPE(char *revEntityType) {

    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_TYPE = ? LIMIT 22";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int(stmt, 0);
        long _remoteRevEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 6));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_remoteRevEntityGUID = _remoteRevEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;

        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(long revEntityContainerGUID, char *revEntitySubType) {
    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 100";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 3);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 4);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 5));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntity_By_SubType(char *revEntitySubType) {

    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 3);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 4);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 5));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDs_By_ResStatus(int resolveStatus) {
    list revList;
    list_new(&revList, sizeof(long long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRemoteRevEntityGUIDs_By_ResStatus(int resolveStatus) {
    list revList;
    list_new(&revList, sizeof(long long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(int resolveStatus, char *revEntitySubtype) {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_ENTITY_SUB_TYPE = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType %s",
                sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityUnSyched() {
    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CHILDABLE_STATUS, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? LIMIT 20";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);
    sqlite3_bind_int(stmt, 2, 1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "sqlite3_errmsg(db) >>>> %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
            long revEntityGUID = sqlite3_column_int64(stmt, 1);
            long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
            long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
            long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
            long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
            int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

            char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
            char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 8));

            long _revTimeCreated = sqlite3_column_int64(stmt, 9);

            RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

            revEntity->_revEntityChildableStatus = revEntityChildableStatus;
            revEntity->_revEntityGUID = revEntityGUID;
            revEntity->_remoteRevEntityGUID = remoteRevEntityGUID;
            revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
            revEntity->_revContainerEntityGUID = revContainerEntityGUID;
            revEntity->_revEntitySiteGUID = revSiteEntityGUID;
            revEntity->_revEntityAccessPermission = revEntityAccessPermission;
            revEntity->_revEntityType = revEntityType;
            revEntity->_revEntitySubType = revEntitySubType;
            revEntity->_revTimeCreated = _revTimeCreated;

            revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

            list_append(&revList, revEntity);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityUnSychedByType(char *revEntityType) {

    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CHILDABLE_STATUS, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_ENTITY_TYPE = ? LIMIT 20";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);
    sqlite3_bind_text(stmt, 2, (const char *) revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "sqlite3_errmsg(db) >>> %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
        long revEntityGUID = sqlite3_column_int64(stmt, 1);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 8));

        long _revTimeCreated = sqlite3_column_int64(stmt, 9);

        RevEntity revEntity;

        revEntity._revEntityChildableStatus = revEntityChildableStatus;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revEntitySiteGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;
        revEntity._timeCreated = strdup(revLocalTimer(_revTimeCreated));
        revEntity._revTimeCreated = _revTimeCreated;

        list_append(&revList, &revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLEntitySubtypeGUIDsByOwnerGUID(char *revEntitySubtype, long ownerGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntitySubtype, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, ownerGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityByOwnerGUIDType(char *revEntityType, long ownerGUID) {

    list revList;
    list_new(&revList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_TYPE = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntityType, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, ownerGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {

        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 6));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDsByOwnerGUID_Type(char *revEntityType, long ownerGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, ownerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDs_SQL_IN(char *sql_IN) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare(db, sql_IN, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDsByOwnerGUID(long ownerGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, ownerGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(long revContainerEntityGUID,
                                                         char *revEntityType) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revContainerEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

int getNumberOfUnreadRevEntites() {
    int revUnreadEntities = 0;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "COUNT(REV_ENTITY_GUID)  "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_RESOLVE_STATUS < ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, 1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revUnreadEntities = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revUnreadEntities;
}

list *revPersGetALLRevEntitySubTYPEs(char *revEntitySubtype) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

long getRevEntityGUID_By_RevEntityOwnerGUID_Subtype(int revEntityOwnerGUID, char *revEntitySubtype) {
    long revEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

long getRevEntityGUIDByRevEntityContainerEntityGUID_Subtype(int revEntityContainerGUID, char *revEntitySubtype) {
    long revEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

char *getRevEntityTypeByRevEntityGUID(int revEntityGUID) {

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_TYPE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        return 0;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 0));

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return revEntityType;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

char *getRevEntitySubtypeByRevEntityGUID(int revEntityGUID) {

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_SUB_TYPE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 0));

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return revEntityType;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

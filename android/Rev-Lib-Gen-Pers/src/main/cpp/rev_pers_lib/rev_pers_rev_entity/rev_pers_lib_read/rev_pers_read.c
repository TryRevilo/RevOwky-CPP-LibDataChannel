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

#include "../../rev_db_init/rev_db_init.h"
#include "../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../libs/cJSON/cJSON.h"
#include "../../../../../../libs/rev_map/rev_map.h"
#include "../../rev_db_init/rev_pers_db_mappers.h"
#include "../../rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"

cJSON *revPersGetData_By_RevVarArgs(char *revTableName, char *revVarArgs) {
    cJSON *revJsonArr = NULL;

    htable_strstr_t *revEntityDB_Keys;
    htable_strstr_t *revMap;

    char *revEntityTableName = "REV_ENTITY_TABLE";
    char *revMetadataTableName = "REV_ENTITY_METADATA_TABLE";

    if (strcmp(revTableName, revEntityTableName) == 0) {
        revEntityDB_Keys = revGetEntityDB_Keys();
        revMap = revGetMapped_Entity_Key_DBFieldName();
    } else if (strcmp(revTableName, revMetadataTableName) == 0) {
        revEntityDB_Keys = revGetMetadataDB_Keys();
        revMap = revGetMapped_Metadata_Key_DBFieldName();
    } else {
        goto revEnd;
    }

    revJsonArr = revPersGetQuery_By_RevVarArgs(revVarArgs, revEntityDB_Keys, revMap);

    revEnd:

    return revJsonArr;
}

int revSubTypeExists_BY_OWNER_GUID(int revEntityOwnerGUID, char *revSubType) {
    int exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

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

int revEntityExistsByLocalEntityGUID(long revLocalEntityGUID) {
    int exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revLocalEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revEntityExistsByRemoteEntityGUID(long revRemoteEntityGUID) {
    int exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revRemoteEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

long revPersGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID) {
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
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revPersGetEntityOwnerGUID_BY_EntityGUID SQL error: %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityOwnerGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityOwnerGUID;
}

void revPersGetEntities_By_SiteGUID_SubType(list *revList, long revSiteEntityGUID, char *revSubType) {
    list_new(revList, sizeof(RevEntity), NULL);

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
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

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
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revGUID = revEntityGUID;
        revEntity->_revOwnerGUID = revOwnerEntityGUID;
        revEntity->_revContainerGUID = revContainerEntityGUID;
        revEntity->_revSiteGUID = revSiteEntityGUID;
        revEntity->_revAccessPermission = revEntityAccessPermission;
        revEntity->_revType = revEntityType;
        revEntity->_revSubType = revSubType;
        revEntity->_revTimeCreated = _revTimeCreated;

        list_append(revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(list *revList, const char *revDBTableFieldName_, long revSiteEntityGUID, const char *revSubType) {
    htable_strstr_t *revMap = revGetEntityDB_Keys();

    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT ";

    const char *revDBTableFieldName = htable_strstr_get_direct(revMap, revDBTableFieldName_);
    sql = revConcatStrings(sql, revDBTableFieldName);

    char *revSelectionSQLPart = " FROM REV_ENTITY_TABLE WHERE REV_ENTITY_SITE_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";
    sql = revConcatStrings(sql, revSelectionSQLPart);

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, (long) revSiteEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    htable_strstr_destroy(revMap);
}

long revGetPublicationDate(long revLocalEntityGUID) {
    long revRemoteEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_PUBLISHED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revLocalEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetPublicationDate SQL error: %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revRemoteEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRemoteEntityGUID;
}

long revPersGetRemoteEntityGUID_BY_LocalEntityGUID(long revLocalEntityGUID) {
    long revRemoteEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revLocalEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revPersGetRemoteEntityGUID_BY_LocalEntityGUID SQL error: %s",
                            sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revRemoteEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRemoteEntityGUID;
}

long revPersGetLocalEntityGUID_BY_RemoteEntityGUID(long revRemoteEntityGUID) {
    long revLocalEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revRemoteEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        revLocalEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revLocalEntityGUID;
}

long revSubTypeExists_BY_CONTAINER_GUID(int revContainerGUID, char *revSubType) {
    long exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

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

RevEntity revPersGetEntity_By_GUID(long revEntityGUID) {
    RevEntity revEntity = *(RevEntity *) malloc(sizeof(RevEntity));

    // Check if the pointer is null
    if (revEntityGUID < 1) {
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
        long revRemoteEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 8));

        long revTimeCreated = sqlite3_column_int64(stmt, 9);
        long revTimePublishedUpdated = sqlite3_column_int64(stmt, 10);

        revEntity._isNull = FALSE;
        revEntity._revChildableStatus = revEntityChildableStatus;
        revEntity._revResolveStatus = revEntityResolveStatus;
        revEntity._revGUID = revEntityGUID;
        revEntity._revRemoteGUID = revRemoteEntityGUID;
        revEntity._revOwnerGUID = revOwnerEntityGUID;
        revEntity._revContainerGUID = revContainerEntityGUID;
        revEntity._revSiteGUID = revSiteEntityGUID;
        revEntity._revAccessPermission = revEntityAccessPermission;
        revEntity._revType = revEntityType;
        revEntity._revSubType = revSubType;
        revEntity._revTimeCreated = revTimeCreated;
        revEntity._revTimePublishedUpdated = revTimePublishedUpdated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntity;
}

RevEntity revPersGetEntity_By_RemoteEntityGUID(long revRemoteEntityGUID) {
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

    sqlite3_bind_int64(stmt, 1, revRemoteEntityGUID);

    RevEntity revEntity = *(RevEntity *) malloc(sizeof(RevEntity));

    revEntity._isNull = TRUE;

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "NULLABLE >>> %s ", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revRemoteEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 6));
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        revEntity._isNull = FALSE;
        revEntity._revGUID = revEntityGUID;
        revEntity._revRemoteGUID = revRemoteEntityGUID;
        revEntity._revOwnerGUID = revOwnerEntityGUID;
        revEntity._revContainerGUID = revContainerEntityGUID;
        revEntity._revSiteGUID = revSiteEntityGUID;
        revEntity._revAccessPermission = revEntityAccessPermission;
        revEntity._revType = revEntityType;
        revEntity._revSubType = revSubType;

        revEntity._revTimeCreated = _revTimeCreated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntity;
}

void revPersGetALLRevEntityGUIDs_By_revType(list *revList, char *revEntityType) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityGUIDs_By_ContainerGUID(list *revList, long revContainerGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? ORDER BY REV_CREATED_DATE DESC";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revContainerGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityTYPE(list *revList, char *revEntityType) {
    list_new(revList, sizeof(RevEntity), NULL);

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
        long _revRemoteGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 6));
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revGUID = revEntityGUID;
        revEntity->_revRemoteGUID = _revRemoteGUID;
        revEntity->_revOwnerGUID = revOwnerEntityGUID;
        revEntity->_revContainerGUID = revContainerEntityGUID;
        revEntity->_revSiteGUID = revSiteEntityGUID;
        revEntity->_revAccessPermission = revEntityAccessPermission;
        revEntity->_revType = revEntityType;
        revEntity->_revSubType = revSubType;

        revEntity->_revTimeCreated = _revTimeCreated;

        list_append(revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetEntities_By_ContainerGUID_SubTYPE(list *revList, long revContainerGUID, char *revSubType) {
    list_new(revList, sizeof(RevEntity), NULL);

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

    sqlite3_bind_int(stmt, 1, revContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

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
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revGUID = revEntityGUID;
        revEntity->_revOwnerGUID = revOwnerEntityGUID;
        revEntity->_revContainerGUID = revContainerEntityGUID;
        revEntity->_revSiteGUID = revSiteEntityGUID;
        revEntity->_revAccessPermission = revEntityAccessPermission;
        revEntity->_revType = revEntityType;
        revEntity->_revSubType = revSubType;
        revEntity->_revTimeCreated = _revTimeCreated;

        list_append(revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetEntities_By_SubType(list *revList, char *revSubType) {
    list_new(revList, sizeof(RevEntity), NULL);

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

    sqlite3_bind_text(stmt, 1, (const char *) revSubType, -1, SQLITE_STATIC);

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
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

        revEntity->_revGUID = revEntityGUID;
        revEntity->_revOwnerGUID = revOwnerEntityGUID;
        revEntity->_revContainerGUID = revContainerEntityGUID;
        revEntity->_revSiteGUID = revSiteEntityGUID;
        revEntity->_revAccessPermission = revEntityAccessPermission;
        revEntity->_revType = revEntityType;
        revEntity->_revSubType = revSubType;
        revEntity->_revTimeCreated = _revTimeCreated;

        list_append(revList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetEntityGUIDs_By_ResStatus(list *revList, int revResolveStatus) {
    list_new(revList, sizeof(long long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLrevRemoteEntityGUIDs_By_ResStatus(list *revList, int revResolveStatus) {
    list_new(revList, sizeof(long long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetEntityGUIDs_By_ResolveStatus_SubType(list *revList, int revResolveStatus, char *revSubType) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_ENTITY_SUB_TYPE = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetEntityGUIDs_By_ResolveStatus_SubType %s",
                sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityUnSyched(list *revList) {
    list_new(revList, sizeof(RevEntity), NULL);

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
            long revRemoteEntityGUID = sqlite3_column_int64(stmt, 2);
            long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
            long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
            long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
            int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

            char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
            char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 8));

            long _revTimeCreated = sqlite3_column_int64(stmt, 9);

            RevEntity *revEntity = (RevEntity *) malloc(sizeof(RevEntity));

            revEntity->_revChildableStatus = revEntityChildableStatus;
            revEntity->_revGUID = revEntityGUID;
            revEntity->_revRemoteGUID = revRemoteEntityGUID;
            revEntity->_revOwnerGUID = revOwnerEntityGUID;
            revEntity->_revContainerGUID = revContainerEntityGUID;
            revEntity->_revSiteGUID = revSiteEntityGUID;
            revEntity->_revAccessPermission = revEntityAccessPermission;
            revEntity->_revType = revEntityType;
            revEntity->_revSubType = revSubType;
            revEntity->_revTimeCreated = _revTimeCreated;

            list_append(revList, revEntity);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityUnSychedByType(list *revList, char *revEntityType) {
    list_new(revList, sizeof(RevEntity), NULL);

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
        long revRemoteEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
        char *revSubType = strdup((const char *) sqlite3_column_text(stmt, 8));

        long _revTimeCreated = sqlite3_column_int64(stmt, 9);

        RevEntity revEntity;

        revEntity._revChildableStatus = revEntityChildableStatus;
        revEntity._revGUID = revEntityGUID;
        revEntity._revRemoteGUID = revRemoteEntityGUID;
        revEntity._revOwnerGUID = revOwnerEntityGUID;
        revEntity._revContainerGUID = revContainerEntityGUID;
        revEntity._revSiteGUID = revSiteEntityGUID;
        revEntity._revAccessPermission = revEntityAccessPermission;
        revEntity._revType = revEntityType;
        revEntity._revSubType = revSubType;
        revEntity._revTimeCreated = _revTimeCreated;

        list_append(revList, &revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLEntitySubtypeGUIDsByOwnerGUID(list *revList, char *revSubType, long ownerGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revSubType, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, ownerGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityGUIDsByOwnerGUID_Type(list *revList, char *revEntityType, long ownerGUID) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityGUIDs_SQL_IN(list *revList, char *sql_IN) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare(db, sql_IN, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityGUIDsByOwnerGUID(list *revList, long ownerGUID) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(list *revList, long revContainerEntityGUID, char *revEntityType) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
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

void revPersGetALLrevSubTypes(list *revList, char *revSubType) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revSubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

long revGetRevEntityGUID_By_revOwnerGUID_Subtype(int revEntityOwnerGUID, char *revSubType) {
    long revEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

long revGetRevEntityGUID_By_revContainerGUID_Subtype(int revContainerGUID, char *revSubType) {
    long revEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revSubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

char *revGetRevEntityType_By_revGUID(int revEntityGUID) {
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

char *revGetrevSubType_By_revGUID(int revEntityGUID) {
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

//
// Created by rev on 7/6/18.
//

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <strings.h>
#include <android/log.h>
#include <sqlite3.h>
#include <rev_linked_list.h>
#include "../../../../rev_db_init/rev_db_init.h"
#include "rev_pers_read.h"
#include "../../../../../rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"

char *revLocalTimer(long revMills);

int revEntitySubtypeExists_BY_OWNER_GUID(int revEntityOwnerGUID, char *revEntitySubtype) {

    int exists = -1;

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT * "
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

long getRemoteRevEntityGUID(long localRevEntityGUID) {
    long remoteRevEntityGUID = (long) -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "getRemoteRevEntityGUID SQL error: %s",
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
    FILE *fp;

    char *revFilePath = "/storage/emulated/0/Download/rev_win.html";

    fp = fopen(revFilePath, "w+");
    fprintf(fp, "This is testing for fprintf...\n");
    fputs("This is testing for fputs...\n", fp);
    fclose(fp);

    char buff[255];

    fp = fopen(revFilePath, "r");
    fscanf(fp, "%s", buff);
    printf("1 : %s\n", buff );
    // __android_log_print(ANDROID_LOG_ERROR, "MyApp", "> > > 1  %s\n", buff);

    fgets(buff, 255, (FILE*)fp);
    printf("2: %s\n", buff );
    // __android_log_print(ANDROID_LOG_ERROR, "MyApp", "> > > 2  %s\n", buff);

    fgets(buff, 255, (FILE*)fp);
    printf("3: %s\n", buff );
    // __android_log_print(ANDROID_LOG_ERROR, "MyApp", "> > > 3  %s\n", buff);
    fclose(fp);




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
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    RevEntity revEntity;

    revEntity._isNull = TRUE;

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "NULLABLE >>> %s ", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long _revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
        revEntityGUID = sqlite3_column_int(stmt, 1);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *) sqlite3_column_text(stmt, 7));
        char *revEntitySubType = strdup((const char *) sqlite3_column_text(stmt, 8));

        long _revTimeCreated = sqlite3_column_int64(stmt, 9);
        char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 10));

        revEntity._isNull = FALSE;
        revEntity._revEntityChildableStatus = _revEntityChildableStatus;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revSiteEntityGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;
        revEntity._revTimeCreated = _revTimeCreated;
        revEntity._timeCreated = strdup(revLocalTimer(_revTimeCreated));
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
                "REV_CREATED_DAT "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    RevEntity revEntity;

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

        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revSiteEntityGUID = revSiteEntityGUID;
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

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDs_By_ContainerGUID(long revEntityContainerGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityTYPE(char *revEntityType) {

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

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
        revEntity->_revSiteEntityGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;

        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(long revEntityContainerGUID, char *revEntitySubType) {

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

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
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

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
        revEntity->_revSiteEntityGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntity_By_SubType(char *revEntitySubType) {

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

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
        revEntity->_revSiteEntityGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntityGUIDs_By_ResStatus(int resolveStatus) {
    list list;
    list_new(&list, sizeof(long long), NULL);

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
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRemoteRevEntityGUIDs_By_ResStatus(int resolveStatus) {
    list list;
    list_new(&list, sizeof(long long), NULL);

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
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntitySubtypeGUIDs_By_ResolveStatus(char *revEntitySubtype, int resolveStatus) {
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_RESOLVE_STATUS "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);
    sqlite3_bind_text(stmt, 2, (const char *) strdup(revEntitySubtype), -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntitySubtypeGUIDs_By_ResolveStatus %s",
                sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityUnSyched() {
    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

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
            revEntity->_revSiteEntityGUID = revSiteEntityGUID;
            revEntity->_revEntityAccessPermission = revEntityAccessPermission;
            revEntity->_revEntityType = revEntityType;
            revEntity->_revEntitySubType = revEntitySubType;
            revEntity->_revTimeCreated = _revTimeCreated;

            revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

            list_append(&revEntityList, revEntity);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntityUnSychedByType(char *revEntityType) {

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

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
        revEntity._revSiteEntityGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;
        revEntity._timeCreated = strdup(revLocalTimer(_revTimeCreated));
        revEntity._revTimeCreated = _revTimeCreated;

        list_append(&revEntityList, &revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLEntitySubtypeGUIDsByOwnerGUID(char *revEntitySubtype, long ownerGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;

}

list *revPersGetALLRevEntityByOwnerGUIDType(char *revEntityType, long ownerGUID) {

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

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
        revEntity->_revSiteEntityGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntityGUIDsByOwnerGUID_Type(char *revEntityType, long ownerGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDs_SQL_IN(char *sql_IN) {

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare(db, sql_IN, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDsByOwnerGUID(long ownerGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;

}

list *revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(long revContainerEntityGUID,
                                                         char *revEntityType) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;

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

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
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

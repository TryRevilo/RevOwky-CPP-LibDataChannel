#include "rev_pers_rev_entity.h"

#include <stdio.h>
#include <string.h>

#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include <android/log.h>
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"

long revPersSaveRevEntity(RevEntity *revEntity) {
    long revReturnVal;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    long remoteRevEntityGUID = revEntity->_remoteRevEntityGUID;
    long revEntityResolveStatus = revEntity->_revEntityResolveStatus;
    long revEntityChildableStatus = revEntity->_revEntityChildableStatus;
    long revEntityOwnerGUID = revEntity->_revOwnerEntityGUID;
    long revEntityContainerGUID = revEntity->_revContainerEntityGUID;
    long revEntitySiteGUID = revEntity->_revEntitySiteGUID;

    int revEntityAccessPermission = revEntity->_revEntityAccessPermission;

    char *revEntityType = revEntity->_revEntityType;
    char *revEntitySubType = revEntity->_revEntitySubType;

    long _revTimeCreated = revCurrentTimestampMillSecs();
    long _revTimePublished = revEntity->_revTimePublished;
    long _revTimePublishedUpdated = revEntity->_revTimePublishedUpdated;

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_TABLE ("
            "REMOTE_REV_ENTITY_GUID, "
            "REV_RESOLVE_STATUS, "
            "REV_CHILDABLE_STATUS, "
            "REV_ENTITY_OWNER_GUID, "
            "REV_ENTITY_CONTAINER_GUID, "
            "REV_ENTITY_SITE_GUID, "
            "REV_ENTITY_ACCESS_PERMISSION, "
            "REV_ENTITY_TYPE, "
            "REV_ENTITY_SUB_TYPE, "
            "REV_CREATED_DATE, "
            "REV_PUBLISHED_DATE, "
            "REV_UPDATED_DATE"
            " ) "
            " values ("
            "@remoteRevEntityGUID, "
            "@revEntityResolveStatus, "
            "@_revEntityChildableStatus, "
            "@revEntityOwnerGUID, "
            "@revEntityContainerGUID, "
            "@revEntitySiteGUID, "
            "@revEntityAccessPermission, "
            "@revEntityType, "
            "@revEntitySubType, "
            "@_revTimeCreated, "
            "@_revTimePublished, "
            "@_revTimePublishedUpdated);";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        int remoteRevEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@remoteRevEntityGUID");
        sqlite3_bind_int64(stmt, remoteRevEntityGUID_idx, remoteRevEntityGUID);

        int revEntityChildableStatus_idx = sqlite3_bind_parameter_index(stmt, "@_revEntityChildableStatus");
        sqlite3_bind_int64(stmt, revEntityChildableStatus_idx, revEntityChildableStatus);

        int revEntityResolveStatus_idx = sqlite3_bind_parameter_index(stmt, "@revEntityResolveStatus");
        sqlite3_bind_int64(stmt, revEntityResolveStatus_idx, revEntityResolveStatus);

        int revEntityOwnerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityOwnerGUID");
        sqlite3_bind_int64(stmt, revEntityOwnerGUID_idx, revEntityOwnerGUID);

        int revEntityContainerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityContainerGUID");
        sqlite3_bind_int64(stmt, revEntityContainerGUID_idx, revEntityContainerGUID);

        int revEntitySiteGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntitySiteGUID");
        sqlite3_bind_int64(stmt, revEntitySiteGUID_idx, revEntitySiteGUID);

        int revEntityAccessPermission_idx = sqlite3_bind_parameter_index(stmt, "@revEntityAccessPermission");
        sqlite3_bind_int64(stmt, revEntityAccessPermission_idx, revEntityAccessPermission);

        int revEntityType_idx = sqlite3_bind_parameter_index(stmt, "@revEntityType");
        sqlite3_bind_text(stmt, revEntityType_idx, revEntityType, -1, SQLITE_STATIC);

        int revEntitySubType_idx = sqlite3_bind_parameter_index(stmt, "@revEntitySubType");
        sqlite3_bind_text(stmt, revEntitySubType_idx, revEntitySubType, -1, SQLITE_STATIC);

        int _revTimeCreated_idx = sqlite3_bind_parameter_index(stmt, "@_revTimeCreated");
        sqlite3_bind_int64(stmt, _revTimeCreated_idx, _revTimeCreated);

        int _revTimePublished_idx = sqlite3_bind_parameter_index(stmt, "@_revTimePublished");
        sqlite3_bind_int64(stmt, _revTimePublished_idx, _revTimePublished);

        int _revTimePublishedUpdated_idx = sqlite3_bind_parameter_index(stmt, "@_revTimePublishedUpdated");
        sqlite3_bind_int64(stmt, _revTimePublishedUpdated_idx, _revTimePublishedUpdated);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersSaveRevEntity %s", sqlite3_errmsg(db));

        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> SQL error: revPersSaveRevEntity %s\n", sqlite3_errmsg(db));

        revReturnVal = -1;
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}


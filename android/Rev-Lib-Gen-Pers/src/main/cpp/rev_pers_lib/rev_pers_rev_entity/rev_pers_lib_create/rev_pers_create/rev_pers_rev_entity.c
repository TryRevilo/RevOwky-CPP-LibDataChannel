#include "rev_pers_rev_entity.h"

#include <stdio.h>
#include <string.h>

#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include <android/log.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../../../../rev_gen_functions/rev_gen_functions.h"

long revPersSaveRevEntity(RevEntity *revEntity) {
    long revReturnVal;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    long revRemoteEntityGUID = revEntity->_revRemoteGUID;
    long revEntityResolveStatus = revEntity->_revResolveStatus;
    long revEntityChildableStatus = revEntity->_revChildableStatus;
    long revEntityOwnerGUID = revEntity->_revOwnerGUID;
    long revContainerGUID = revEntity->_revContainerGUID;
    long revEntitySiteGUID = revEntity->_revSiteGUID;

    int revEntityAccessPermission = revEntity->_revAccessPermission;

    char *revEntityType = revEntity->_revType;
    char *revSubType = revEntity->_revSubType;

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
            "@revRemoteEntityGUID, "
            "@revEntityResolveStatus, "
            "@_revChildableStatus, "
            "@revEntityOwnerGUID, "
            "@revContainerGUID, "
            "@revEntitySiteGUID, "
            "@revEntityAccessPermission, "
            "@revEntityType, "
            "@revSubType, "
            "@_revTimeCreated, "
            "@_revTimePublished, "
            "@_revTimePublishedUpdated);";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        int revRemoteEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@revRemoteEntityGUID");
        sqlite3_bind_int64(stmt, revRemoteEntityGUID_idx, revRemoteEntityGUID);

        int revEntityChildableStatus_idx = sqlite3_bind_parameter_index(stmt, "@_revChildableStatus");
        sqlite3_bind_int64(stmt, revEntityChildableStatus_idx, revEntityChildableStatus);

        int revEntityResolveStatus_idx = sqlite3_bind_parameter_index(stmt, "@revEntityResolveStatus");
        sqlite3_bind_int64(stmt, revEntityResolveStatus_idx, revEntityResolveStatus);

        int revEntityOwnerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityOwnerGUID");
        sqlite3_bind_int64(stmt, revEntityOwnerGUID_idx, revEntityOwnerGUID);

        int revContainerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revContainerGUID");
        sqlite3_bind_int64(stmt, revContainerGUID_idx, revContainerGUID);

        int revEntitySiteGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntitySiteGUID");
        sqlite3_bind_int64(stmt, revEntitySiteGUID_idx, revEntitySiteGUID);

        int revEntityAccessPermission_idx = sqlite3_bind_parameter_index(stmt, "@revEntityAccessPermission");
        sqlite3_bind_int64(stmt, revEntityAccessPermission_idx, revEntityAccessPermission);

        int revEntityType_idx = sqlite3_bind_parameter_index(stmt, "@revEntityType");
        sqlite3_bind_text(stmt, revEntityType_idx, revEntityType, -1, SQLITE_STATIC);

        int revSubType_idx = sqlite3_bind_parameter_index(stmt, "@revSubType");
        sqlite3_bind_text(stmt, revSubType_idx, revSubType, -1, SQLITE_STATIC);

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


#include <stdio.h>
#include <string.h>
#include <android/log.h>

#include "rev_pers_rev_timeline.h"
#include "../../rev_db_models/rev_timeline.h"
#include <sqlite3.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../../../../rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"

long revPersSaveRevTimeline(RevTimeline *revTimeline) {

    long revEntityGuid;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char *szSQL;

    long revEntityGUID = revTimeline->_revEntityGUID;
    long remoteRevEntityGUID = revTimeline->_remoteRevEntityGUID;
    long revEntityOwnerGUID = revTimeline->_revOwnerEntityGUID;
    long revEntityContainerGUID = revTimeline->_revContainerEntityGUID;
    long revEntitySiteGUID = revTimeline->_revSiteEntityGUID;

    long revEntityAccessPermission = (long) revTimeline->_revEntityAccessPermission;

    long revReadStatus = (long) revTimeline->_revReadStatus;
    long revLocalResolveStatus = (long) revTimeline->_revLocalResolveStatus;
    long revRemoteResolveStatus = (long) revTimeline->_revRemoteResolveStatus;

    char *revEntityType = revTimeline->_revEntityType;
    char *revEntitySubType = revTimeline->_revEntitySubType;

    char *currTime = revGetCurrentTime();

    /* Create SQL statement */
    sqlite3_stmt *stmt;
    const char *pzTest;

    // Insert data item into myTable
    szSQL = "INSERT INTO REV_TIMELINE_TABLE (" \
            "REV_ENTITY_GUID, " \
            "REMOTE_REV_ENTITY_GUID, " \
            "REV_ENTITY_OWNER_GUID, " \
            "REV_ENTITY_CONTAINER_GUID, " \
            "REV_ENTITY_SITE_GUID, " \
            "REV_ENTITY_ACCESS_PERMISSION, " \
            "REV_READ_STATUS, " \
            "REV_LOCAL_RESOLVE_STATUS, " \
            "REV_REMOTE_RESOLVE, " \
            "REV_TIMELINE_ITEM_TYPE, " \
            "REV_TIMELINE_ITEM_SUB_TYPE, " \
            "REV_CREATED_DATE, " \
            "REV_UPDATED_DATE" \
            " ) " \
            " VALUES (" \
            "@revEntityGUID, " \
            "@remoteRevEntityGUID, " \
            "@revEntityOwnerGUID, " \
            "@revEntityContainerGUID, " \
            "@revEntitySiteGUID, " \
            "@revEntityAccessPermission, " \
            "@_revReadStatus, " \
            "@_revLocalResolveStatus, " \
            "@_revRemoteResolveStatus, " \
            "@revEntityType, " \
            "@revEntitySubType, " \
            "@timeCreated, " \
            "@timeUpdated);";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        // bind the value

        int _revEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int64(stmt, _revEntityGUID_idx, revEntityGUID);

        int remoteRevEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@remoteRevEntityGUID");
        sqlite3_bind_int64(stmt, remoteRevEntityGUID_idx, remoteRevEntityGUID);

        int revEntityOwnerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityOwnerGUID");
        sqlite3_bind_int64(stmt, revEntityOwnerGUID_idx, revEntityOwnerGUID);

        int revEntityContainerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityContainerGUID");
        sqlite3_bind_int64(stmt, revEntityContainerGUID_idx, revEntityContainerGUID);

        int revEntitySiteGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntitySiteGUID");
        sqlite3_bind_int64(stmt, revEntitySiteGUID_idx, revEntitySiteGUID);

        int revEntityAccessPermission_idx = sqlite3_bind_parameter_index(stmt, "@revEntityAccessPermission");
        sqlite3_bind_int64(stmt, revEntityAccessPermission_idx, revEntityAccessPermission);

        int revReadStatus_idx = sqlite3_bind_parameter_index(stmt, "@_revReadStatus");
        sqlite3_bind_int64(stmt, revReadStatus_idx, revReadStatus);

        int revLocalResolveStatus_idx = sqlite3_bind_parameter_index(stmt, "@_revLocalResolveStatus");
        sqlite3_bind_int64(stmt, revLocalResolveStatus_idx, revLocalResolveStatus);

        int revRemoteResolveStatus_idx = sqlite3_bind_parameter_index(stmt, "@_revRemoteResolveStatus");
        sqlite3_bind_int64(stmt, revRemoteResolveStatus_idx, revRemoteResolveStatus);

        int revEntityType_idx = sqlite3_bind_parameter_index(stmt, "@revEntityType");
        sqlite3_bind_text(stmt, revEntityType_idx, revEntityType, -1, SQLITE_STATIC);

        int revEntitySubType_idx = sqlite3_bind_parameter_index(stmt, "@revEntitySubType");
        sqlite3_bind_text(stmt, revEntitySubType_idx, revEntitySubType, -1, SQLITE_STATIC);

        int timeCreated_idx = sqlite3_bind_parameter_index(stmt, "@timeCreated");
        sqlite3_bind_text(stmt, timeCreated_idx, currTime, -1, SQLITE_STATIC);

        int timeUpdated_idx = sqlite3_bind_parameter_index(stmt, "@timeUpdated");
        sqlite3_bind_text(stmt, timeUpdated_idx, currTime, -1, SQLITE_STATIC);

        // commit
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);

        revEntityGuid = sqlite3_last_insert_rowid(db);

        sqlite3_close(db);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR TIMELINE :  %s\n", sqlite3_errmsg(db));
        sqlite3_free(zErrMsg);
    } else {
        return revEntityGuid;
    }

    return 0;

}


//
// Created by rev on 1/21/19.
//
#include "rev_pers_update_rev_entity_metadata.h"

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"

int revPersSetRemoteMetadataId(long _revId, long _revRemoteId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_METADATA_TABLE "
                "SET  REMOTE_METADATA_ID = ?, REV_RESOLVE_STATUS = ?"
                "WHERE METADATA_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, _revRemoteId);
    sqlite3_bind_int(stmt, 2, 0);
    sqlite3_bind_int(stmt, 3, _revId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "REV ERR: %s\n", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersSetMetadataResStatus_BY_Metadata_Id(int revResolveStatus, long _revId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_METADATA_TABLE "
                "SET  REV_RESOLVE_STATUS = ?"
                "WHERE METADATA_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, revResolveStatus);
    sqlite3_bind_int(stmt, 2, _revId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int setMetadataResolveStatus_BY_revName_revGUID(char *revMetadataName, long revEntityGUID, int revResolveStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_METADATA_TABLE "
                "SET  REV_RESOLVE_STATUS = ?"
                "WHERE METADATA_NAME = ? AND METADATA_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);
    sqlite3_bind_text(stmt, 2, revMetadataName, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersSetMetadataVal_BY_Id(long _revId, char *revMetadataValue) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_METADATA_TABLE "
                "SET  METADATA_VALUE = ?, REV_RESOLVE_STATUS =?"
                "WHERE METADATA_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, revMetadataValue, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, 101);
    sqlite3_bind_int(stmt, 3, _revId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (SQLITE_DONE != sqlite3_step(stmt)) {
        revReturnVal = -1;
    } else {
        revReturnVal = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}
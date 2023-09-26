//
// Created by rev on 10/2/18.
//

#include <stdio.h>
#include <android/log.h>

#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../rev_db_init/rev_db_init.h"

int setRemoteRevEntityGUIGByRevEntityGUID(long revEntityGUID, long revRemoteEntityGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE " \
                "SET  REMOTE_REV_ENTITY_GUID = ?, REV_RESOLVE_STATUS = ? " \
                "WHERE REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int64(stmt, 1, revRemoteEntityGUID);
    sqlite3_bind_int(stmt, 2, 0);
    sqlite3_bind_int64(stmt, 3, revEntityGUID);

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

int setRevPublishedDate_By_RevEntityGUID(long revEntityGUID, long revPublishedDate) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE "
                "SET  REV_PUBLISHED_DATE = ? "
                "WHERE REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int64(stmt, 1, revPublishedDate);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

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

int setrevRemoteEntityGUID_By_RevCreationDate(long long revTimeCreated, long revRemoteEntityGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE "
                "SET  REMOTE_REV_ENTITY_GUID = ?, REV_RESOLVE_STATUS = ? "
                "WHERE REV_CREATED_DATE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int64(stmt, 1, revRemoteEntityGUID);
    sqlite3_bind_int(stmt, 2, 0);
    sqlite3_bind_int64(stmt, 3, revTimeCreated);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else if (SQLITE_DONE == sqlite3_step(stmt)) {
        revReturnVal = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int setResStatus_By_RevCreationDate(long revTimeCreated, int revResStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE "
                "SET  REV_RESOLVE_STATUS = ?"
                "WHERE REV_CREATED_DATE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, revResStatus);
    sqlite3_bind_int64(stmt, 2, revTimeCreated);

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

int resetRevEntityOwnerGUIG(long revEntityGUID, long revEntityOwnerGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE " \
                "SET  REV_ENTITY_OWNER_GUID = ?" \
                "WHERE REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

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

int revPersSetContainerGUID_By_RevEntityGUID(long revEntityGUID, long revContainerGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE "
                "SET  REV_ENTITY_CONTAINER_GUID = ?"
                "WHERE REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revContainerGUID);
    sqlite3_bind_int(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateSetContainerGUID %s", sqlite3_errmsg(db));
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

int setrevRemoteEntityGUID_Metadata_ByRevEntityGUID(long revEntityGUID, long revRemoteEntityGUID, long revMetadataId, long _revRemoteMetadataId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "BEGIN; " \
    "UPDATE REV_ENTITY_TABLE " \
    "SET  REV_RESOLVE_STATUS = ? " \
    "WHERE REV_ENTITY_GUID = ?; " \
    "UPDATE REV_ENTITY_METADATA_TABLE " \
    "SET  REMOTE_METADATA_ID = ?, REV_RESOLVE_STATUS = ? " \
    "WHERE METADATA_ID = ?; " \
    "COMMIT;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, 0);
    sqlite3_bind_int(stmt, 2, revEntityGUID);

    sqlite3_bind_int64(stmt, 3, _revRemoteMetadataId);
    sqlite3_bind_int(stmt, 4, 0);
    sqlite3_bind_int64(stmt, 5, revMetadataId);

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

int setRevEntityResolveStatusByRevEntityGUID(int revResolveStatus, long revEntityGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_TABLE " \
                "SET  REV_RESOLVE_STATUS = ? " \
                "WHERE REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, revResolveStatus);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

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
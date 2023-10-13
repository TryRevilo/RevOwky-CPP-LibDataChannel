//
// Created by home on 2019-09-13.
//

#include "rev_pers_update_rev_entity_ann.h"

#include <jni.h>
#include <android/log.h>

#include "../../../rev_db_init/rev_db_init.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"

int revPersSetAnnVal_By_Id(long revAnnotationId, char *revEntityAnnotationValue) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_ANNOTATIONS_TABLE "
                "SET  ANNOTATION_VALUE = ? "
                "WHERE ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEntityAnnotationValue, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, revAnnotationId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersSetAnnVal_By_Id %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersSetAnnResStatus_By_Id %s", sqlite3_errmsg(db));
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

int revPersSetAnnResStatus_By_Id(long revAnnotationId, int revAnnotationResStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_ANNOTATIONS_TABLE "
                "SET  REV_RESOLVE_STATUS = ? "
                "WHERE ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revAnnotationResStatus);
    sqlite3_bind_int64(stmt, 2, revAnnotationId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersSetAnnResStatus_By_Id %s", sqlite3_errmsg(db));
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

int revPersSetRemoteRevAnnId(long revAnnotationId, long revAnnotationRemoteId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_ANNOTATIONS_TABLE "
                "SET  REMOTE_ANNOTATION_ID = ? "
                "WHERE ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revAnnotationRemoteId);
    sqlite3_bind_int64(stmt, 2, revAnnotationId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersSetRemoteRevAnnId %s", sqlite3_errmsg(db));
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

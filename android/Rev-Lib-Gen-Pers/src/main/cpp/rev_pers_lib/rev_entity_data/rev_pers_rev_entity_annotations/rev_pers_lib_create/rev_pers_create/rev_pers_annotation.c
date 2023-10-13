//
// Created by rev on 8/21/18.
//
#include "rev_pers_annotation.h"

#include <android/log.h>
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../rev_db_models/rev_entity_annotation.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"

long revPersAnnotation(char *revEntityAnnotationName, char *revEntityAnnotationValue, long _revGUID, long revEntityOwnerGUID) {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    const char *currTime = revGetCurrentTime();

    char *zErrMsg = 0;
    int rc;
    char *szSQL;

    sqlite3_stmt *stmt;
    const char *pzTest;

    szSQL = "INSERT INTO REV_ENTITY_ANNOTATIONS_TABLE ("
            "ANNOTATION_NAME, "
            "ANNOTATION_VALUE, "
            "REV_ENTITY_GUID, "
            "REV_ENTITY_OWNER_GUID, "
            "CREATED_DATE, "
            "UPDATED_DATE) "
            "values (?, ?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, (const char *) revEntityAnnotationName, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, (const char *) revEntityAnnotationValue, -1, SQLITE_STATIC);

        sqlite3_bind_int(stmt, 3, _revGUID);
        sqlite3_bind_int(stmt, 4, revEntityOwnerGUID);
        sqlite3_bind_text(stmt, 5, currTime, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 6, currTime, -1, SQLITE_STATIC);

        // commit
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);

    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);

        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersAnnotation %s", zErrMsg);

    } else {
        long dbId = sqlite3_last_insert_rowid(db);
        return dbId;
    }

    return -1;
}

long revPersAnnotationStruct(RevEntityAnnotation *revEntityAnnotation) {
    long revReturnVal = -1;

    int _revResolveStatus = revEntityAnnotation->_revResolveStatus;

    char *_revName = revEntityAnnotation->_revName;
    char *_revValue = revEntityAnnotation->_revValue;

    long _revRemoteId = revEntityAnnotation->_revRemoteId;

    long _revGUID = revEntityAnnotation->_revGUID;
    long _revRemoteGUID = revEntityAnnotation->_revRemoteGUID;

    long _revOwnerGUID = revEntityAnnotation->_revOwnerGUID;
    long _revRemoteOwnerGUID = revEntityAnnotation->_revRemoteOwnerGUID;

    long _revTimeCreated = revCurrentTimestampMillSecs();
    long _revTimePublished = revEntityAnnotation->_revTimePublished;
    long _revTimePublishedUpdated = revEntityAnnotation->_revTimePublishedUpdated;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    int rc;
    char *szSQL;

    sqlite3_stmt *stmt;
    const char *pzTest;

    szSQL = "INSERT INTO REV_ENTITY_ANNOTATIONS_TABLE ("
            "REV_RESOLVE_STATUS, "
            "REMOTE_ANNOTATION_ID, "
            "ANNOTATION_NAME, "
            "ANNOTATION_VALUE, "
            "REV_ENTITY_GUID, "
            "REMOTE_REV_ENTITY_GUID, "
            "REV_ENTITY_OWNER_GUID, "
            "REMOTE_REV_ENTITY_OWNER_GUID, "
            "REV_CREATED_DATE, "
            "REV_PUBLISHED_DATE, "
            "REV_UPDATED_DATE) "
            "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, _revResolveStatus);
        sqlite3_bind_int(stmt, 2, _revRemoteId);

        sqlite3_bind_text(stmt, 3, (const char *) _revName, -1, SQLITE_STATIC);

        sqlite3_bind_text(stmt, 4, (const char *) _revValue, -1, SQLITE_STATIC);

        sqlite3_bind_int(stmt, 5, _revGUID);
        sqlite3_bind_int(stmt, 6, _revRemoteGUID);

        sqlite3_bind_int(stmt, 7, _revOwnerGUID);
        sqlite3_bind_int(stmt, 8, _revRemoteOwnerGUID);

        sqlite3_bind_int64(stmt, 9, _revTimeCreated);
        sqlite3_bind_int64(stmt, 10, _revTimePublished);
        sqlite3_bind_int64(stmt, 11, _revTimePublishedUpdated);

        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);

    } else if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}
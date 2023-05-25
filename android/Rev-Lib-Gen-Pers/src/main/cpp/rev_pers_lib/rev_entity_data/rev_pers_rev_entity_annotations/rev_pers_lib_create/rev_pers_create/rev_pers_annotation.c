//
// Created by rev on 8/21/18.
//
#include "rev_pers_annotation.h"

#include <android/log.h>
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../rev_pers_rev_entity_metastrings/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metastrings.h"
#include "../../../rev_pers_rev_entity_metastrings/rev_pers_read/rev_pers_read_rev_entity_metastrings.h"
#include "../../rev_db_models/rev_entity_annotation.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"

int revPersGetAnnNameID(char *revEntityAnnotationName) {
    int revAnnNameID = -1;

    if (strcmp(revEntityAnnotationName, "rev_like") == 0) {
        revAnnNameID = 1;
    }

    return revAnnNameID;
}

long revPersAnnotation(char *revEntityAnnotationName, char *revEntityAnnotationValue, long _revEntityGUID, long revEntityOwnerGUID) {

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
            "ANNOTATION_NAME_ID, "
            "ANNOTATION_VALUE, "
            "REV_ENTITY_GUID, "
            "REV_ENTITY_OWNER_GUID, "
            "CREATED_DATE, "
            "UPDATED_DATE) "
            "values (?, ?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, revPersGetAnnNameID(revEntityAnnotationName));
        sqlite3_bind_text(stmt, 2, (const char *) revEntityAnnotationValue, -1, SQLITE_STATIC);

        sqlite3_bind_int(stmt, 3, _revEntityGUID);
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

    int _revAnnotationResStatus = revEntityAnnotation->_revAnnotationResStatus;

    char *_revAnnotationName = revEntityAnnotation->_revAnnotationName;
    char *_revAnnotationValue = revEntityAnnotation->_revAnnotationValue;

    long _revAnnotationRemoteId = revEntityAnnotation->_revAnnotationRemoteId;

    long _revAnnotationEntityGUID = revEntityAnnotation->_revAnnotationEntityGUID;
    long _revAnnotationRemoteEntityGUID = revEntityAnnotation->_revAnnotationRemoteEntityGUID;

    long _revAnnOwnerEntityGUID = revEntityAnnotation->_revAnnOwnerEntityGUID;
    long _revAnnRemoteOwnerEntityGUID = revEntityAnnotation->_revAnnRemoteOwnerEntityGUID;

    long _revTimeCreated = revCurrentTimestampMillSecs();
    long _revTimePublished = revEntityAnnotation->_revTimePublished;
    long _revTimePublishedUpdated = revEntityAnnotation->_revTimePublishedUpdated;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    const char *currTime = revGetCurrentTime();

    int rc;
    char *szSQL;

    sqlite3_stmt *stmt;
    const char *pzTest;

    szSQL = "INSERT INTO REV_ENTITY_ANNOTATIONS_TABLE ("
            "REV_RESOLVE_STATUS, "
            "REMOTE_ANNOTATION_ID, "
            "ANNOTATION_NAME_ID, "
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
        sqlite3_bind_int(stmt, 1, _revAnnotationResStatus);
        sqlite3_bind_int(stmt, 2, _revAnnotationRemoteId);

        if (revEntityMetastringExists(_revAnnotationName) < 0) {
            sqlite3_bind_int(stmt, 3, revPersRevEntityMetastrings(_revAnnotationName));
        } else {
            sqlite3_bind_int(stmt, 3, getRevEntityMetaStringValueId(_revAnnotationName));
        }

        sqlite3_bind_text(stmt, 4, (const char *) _revAnnotationValue, -1, SQLITE_STATIC);

        sqlite3_bind_int(stmt, 5, _revAnnotationEntityGUID);
        sqlite3_bind_int(stmt, 6, _revAnnotationRemoteEntityGUID);

        sqlite3_bind_int(stmt, 7, _revAnnOwnerEntityGUID);
        sqlite3_bind_int(stmt, 8, _revAnnRemoteOwnerEntityGUID);

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
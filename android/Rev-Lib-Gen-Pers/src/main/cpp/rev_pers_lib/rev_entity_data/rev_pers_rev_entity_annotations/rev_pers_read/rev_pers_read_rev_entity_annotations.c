//
// Created by rev on 8/21/18.
//
#include "rev_pers_read_rev_entity_annotations.h"

#include <string.h>
#include <android/log.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_db_models/rev_entity_annotation.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

long revPersGetAnnValueId_By_Name_EntityGUID_OwnerGUID(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID) {
    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "VALUE_ID "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE WHERE "
                "ANNOTATION_NAME = ? AND REV_ENTITY_GUID = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revAnnotationName, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, revEntityGUID);
    sqlite3_bind_int(stmt, 3, ownerEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {

        long annotationValueId = sqlite3_column_int64(stmt, 0);

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return annotationValueId;

    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return -1;
}

long revGetRevAnnotationValueId(char *revAnnotationName, long revEntityGUID) {
    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "VALUE_ID "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE WHERE "
                "ANNOTATION_NAME = ? AND REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revAnnotationName, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {

        long annotationValueId = sqlite3_column_int64(stmt, 0);

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return annotationValueId;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return -1;
}

long getRevAnnotationOwnerGUID_ByAnnotationId(long annotationId) {
    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_OWNER_GUID "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE WHERE "
                "ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, annotationId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        long annotationOwnerGUID = sqlite3_column_int64(stmt, 0);

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return annotationOwnerGUID;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return -1;
}

int revEntityAnnotationExists_ByOwnerEntityGUID(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID) {
    return revPersGetAnnValueId_By_Name_EntityGUID_OwnerGUID(strdup(revAnnotationName), revEntityGUID, ownerEntityGUID);
}

char *getRevEntityAnnotationValue(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID) {
    char *_revValue = "";

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "ANNOTATION_VALUE "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE WHERE "
                "WHERE ANNOTATION_NAME = ? AND REV_ENTITY_GUID = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revAnnotationName, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, revEntityGUID);
    sqlite3_bind_int(stmt, 3, ownerEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "*** getRevEntityAnnotationValue - SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        _revValue = strdup((const char *) sqlite3_column_text(stmt, 0));
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return _revValue;
}

void getAllRevEntityAnnoationIds_By_revGUID(list *revList, long revEntityGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "ID "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: -getAllRevEntityAnnoationIds_By_revGUID %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long long revEntityAnnotationId = sqlite3_column_int64(stmt, 0);
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revEntityAnnotationId %ld", revEntityAnnotationId);

        list_append(revList, &revEntityAnnotationId);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetAnnIds_By_Name_EntityGUID(list *revList, char *revAnnotationName, long revEntityGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT ID "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE WHERE "
                "ANNOTATION_NAME = ? AND REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revAnnotationName);
    sqlite3_bind_int(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long revEntityAnnotationId = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityAnnotationId);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void getAllRevEntityAnnoationIds_By_ResStatus(list *revList, int revAnnResStatus) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT ID "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revAnnResStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityAnnotationId = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityAnnotationId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

RevEntityAnnotation *revPersGetRevEntityAnn_By_LocalAnnId(long revAnnotationId) {
    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RESOLVE_STATUS, "
                "ANNOTATION_NAME, "
                "ANNOTATION_VALUE, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REMOTE_REV_ENTITY_OWNER_GUID, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE "
                "WHERE ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revAnnotationId);

    RevEntityAnnotation *revEntityAnnotation = (RevEntityAnnotation *) malloc(sizeof(RevEntityAnnotation));

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityAnn_By_ResStatus %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revPersGetALLRevEntityAnn_By_ResStatus >>> %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        int _revResolveStatus = sqlite3_column_int(stmt, 0);
        char *_revName = strdup((const char *) sqlite3_column_text(stmt, 1));
        char *_revValue = strdup((const char *) sqlite3_column_text(stmt, 2));

        long _revGUID = sqlite3_column_int64(stmt, 3);
        long _revRemoteGUID = sqlite3_column_int64(stmt, 4);

        long _revOwnerGUID = sqlite3_column_int64(stmt, 5);
        long _revRemoteOwnerGUID = sqlite3_column_int64(stmt, 6);

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        revEntityAnnotation->_revId = revAnnotationId;
        revEntityAnnotation->_revResolveStatus = _revResolveStatus;
        revEntityAnnotation->_revName = _revName;
        revEntityAnnotation->_revValue = _revValue;

        revEntityAnnotation->_revGUID = _revGUID;
        revEntityAnnotation->_revRemoteGUID = _revRemoteGUID;

        revEntityAnnotation->_revOwnerGUID = _revOwnerGUID;
        revEntityAnnotation->_revRemoteOwnerGUID = _revRemoteOwnerGUID;

        revEntityAnnotation->_revTimeCreated = _revTimeCreated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityAnnotation;
}

RevEntityAnnotation *revPersGetAnn_By_Name_EntityGUID_OwnerGUID(char *revAnnotationName, long revEntityGUID, long revOwnerGUID) {
    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "ID, "
                "REV_RESOLVE_STATUS, "
                "ANNOTATION_NAME, "
                "ANNOTATION_VALUE, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REMOTE_REV_ENTITY_OWNER_GUID, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_ANNOTATIONS_TABLE "
                "WHERE ANNOTATION_NAME = ? AND REV_ENTITY_GUID = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revAnnotationName);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);
    sqlite3_bind_int64(stmt, 3, revOwnerGUID);

    RevEntityAnnotation *revEntityAnnotation = revInitializedAnnotation();

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetAnn_By_Name_EntityGUID_OwnerGUID %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revPersGetAnn_By_Name_EntityGUID_OwnerGUID >>> %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        int _revId = sqlite3_column_int64(stmt, 0);
        int _revResolveStatus = sqlite3_column_int(stmt, 1);
        char *_revName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *_revValue = strdup((const char *) sqlite3_column_text(stmt, 3));

        long _revGUID = sqlite3_column_int64(stmt, 4);
        long _revRemoteGUID = sqlite3_column_int64(stmt, 5);

        long _revOwnerGUID = sqlite3_column_int64(stmt, 6);
        long _revRemoteOwnerGUID = sqlite3_column_int64(stmt, 7);

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        revEntityAnnotation->_revId = _revId;
        revEntityAnnotation->_revResolveStatus = _revResolveStatus;
        revEntityAnnotation->_revName = _revName;
        revEntityAnnotation->_revValue = _revValue;

        revEntityAnnotation->_revGUID = _revGUID;
        revEntityAnnotation->_revRemoteGUID = _revRemoteGUID;

        revEntityAnnotation->_revOwnerGUID = _revOwnerGUID;
        revEntityAnnotation->_revRemoteOwnerGUID = _revRemoteOwnerGUID;

        revEntityAnnotation->_revTimeCreated = _revTimeCreated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityAnnotation;
}

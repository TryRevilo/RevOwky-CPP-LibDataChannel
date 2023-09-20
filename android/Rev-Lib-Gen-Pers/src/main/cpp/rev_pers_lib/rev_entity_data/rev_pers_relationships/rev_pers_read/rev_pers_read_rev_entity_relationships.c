//
// Created by rev on 8/2/18.
//

#include "rev_pers_read_rev_entity_relationships.h"

#include <android/log.h>

#include <string.h>

#include "../rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h"
#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_db_models/rev_entity_relationships.h"
#include "../../../rev_entity/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_read/rev_pers_read.h"
#include "../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

int revLimit = 10;

long revGetLastRelSubjectGUID_By_CreatedDate_RelType(char *revRelType) {
    long revRetVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_CREATED_DATE = (SELECT MAX(REV_CREATED_DATE) FROM REV_ENTITY_RELATIONSHIPS_TABLE) AND REV_RELATIONSHIP_TYPE_VALUE_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(revRelType));

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTypeValueId %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revRetVal = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRetVal;
}

long getRevRelationshipTypeValueId(long revEntitySubjectGUID, long revEntityTargetGuid) {
    long revRelTypeValId = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_TYPE_VALUE_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_SUBJECT_GUID = ? AND REV_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntitySubjectGUID);
    sqlite3_bind_int64(stmt, 2, revEntityTargetGuid);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTypeValueId %s", sqlite3_errmsg(db));
    }

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        revRelTypeValId = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRelTypeValId;
}

long getRevRelationshipTypeValueId_BY_RemoteTargetGUID(long revEntitySubjectGUID, long remoteRevEntityTargetGuid) {
    long revRelTypeValId = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_TYPE_VALUE_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_SUBJECT_GUID = ? AND REV_REMOTE_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntitySubjectGUID);
    sqlite3_bind_int64(stmt, 2, remoteRevEntityTargetGuid);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTypeValueId_BY_RemoteTargetGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revRelTypeValId = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRelTypeValId;
}

int revGetAnyRelExists_By_TypeValueId_LocalGUIDs(char *revRelType, long revSubjectGUID, long revTargetGuid) {
    int exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND ((REV_SUBJECT_GUID = ? AND REV_TARGET_GUID = ?) OR (REV_TARGET_GUID = ? AND REV_SUBJECT_GUID = ?)) LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(revRelType));
    sqlite3_bind_int64(stmt, 2, revSubjectGUID);
    sqlite3_bind_int64(stmt, 3, revTargetGuid);
    sqlite3_bind_int64(stmt, 4, revSubjectGUID);
    sqlite3_bind_int64(stmt, 5, revTargetGuid);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTypeValueId_BY_RemoteTargetGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revGetAnyRelExists_By_TypeValueId_RemoteGUIDs(char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid) {
    int exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND (REV_REMOTE_SUBJECT_GUID = ? AND REV_REMOTE_TARGET_GUID = ?) OR (REV_REMOTE_TARGET_GUID = ? AND REV_REMOTE_SUBJECT_GUID = ?) LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(revRelType));
    sqlite3_bind_int64(stmt, 2, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 3, revRemoteTargetGuid);
    sqlite3_bind_int64(stmt, 4, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 5, revRemoteTargetGuid);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTypeValueId_BY_RemoteTargetGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revGetAnyRelExists_By_ResStatus_TypeValueId_RemoteGUIDs(int revResStatus, char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid) {
    int exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND ((REV_REMOTE_SUBJECT_GUID = ? AND REV_REMOTE_TARGET_GUID = ?) OR (REV_REMOTE_TARGET_GUID = ? AND REV_REMOTE_SUBJECT_GUID = ?)) LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResStatus);
    sqlite3_bind_int(stmt, 2, revPersGetRelId(revRelType));
    sqlite3_bind_int64(stmt, 3, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 4, revRemoteTargetGuid);
    sqlite3_bind_int64(stmt, 5, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 6, revRemoteTargetGuid);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTypeValueId_BY_RemoteTargetGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

long getRevRelationshipTargetGUID_By_RelationshipId(long relationshipId) {
    long revEntityTargetGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, relationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTargetGUIDByRelationshipId %s", sqlite3_errmsg(db));
    }

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityTargetGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityTargetGUID;
}

long getRevRelationshipSubjectGUID_By_RelId(long relationshipId) {
    long revSubjectGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, relationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTargetGUIDByRelationshipId %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revSubjectGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revSubjectGUID;
}

long getRevRelationshipTargetGUIDByRelationshipValueId(long relationshipValueId) {
    long revEntityTargetGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_RELATIONSHIP_TYPE_VALUE_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relationshipValueId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTargetGUIDByRelationshipValueId %s", sqlite3_errmsg(db));
    }

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityTargetGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityTargetGUID;
}

long getRevEntityRelationshipId_By_RelType_Subject_Target(char *revEntityRelationship, long remoteRevEntitySubjectGuid, long remoteRevEntityTargetGuid) {
    long revRelId = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_REMOTE_SUBJECT_GUID = ? AND REV_REMOTE_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    long relationshipValueId = revPersGetRelId(strdup(revEntityRelationship));

    sqlite3_bind_int(stmt, 1, relationshipValueId);
    sqlite3_bind_int64(stmt, 2, remoteRevEntitySubjectGuid);
    sqlite3_bind_int64(stmt, 3, remoteRevEntityTargetGuid);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getRevRelationshipTargetGUIDByRelationshipValueId %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revRelId = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRelId;
}

char *getRevRelationshipTimeCreated(long relationshipId) {

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        char *revTimeCreated = strdup((const char *) sqlite3_column_text(stmt, 0));

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return revTimeCreated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

int revEntityRelationshipExists(char *revEntityRelationship, long revEntitySubjectGUID, long revEntityTargetGuid) {
    int exists = -1;

    long revRelValueId = getRevRelationshipTypeValueId(revEntitySubjectGUID, revEntityTargetGuid);

    if (revRelValueId > 0) {
        char *dbRevEntityRelationship = getRevEntityRelValue(revRelValueId);

        if (dbRevEntityRelationship[0] != '\0' &&
            (strcmp(dbRevEntityRelationship, revEntityRelationship) == 0))
            exists = 1;
    }

    return exists;
}

int revEntityRelationshipExists_BY_RemoteTargetGUID(char *revEntityRelationship, long revEntitySubjectGUID, long remoteRevEntityTargetGuid) {
    int exists = -1;

    long revRelValueId = getRevRelationshipTypeValueId_BY_RemoteTargetGUID(revEntitySubjectGUID, remoteRevEntityTargetGuid);

    if (revRelValueId > 0) {
        char *dbRevEntityRelationship = getRevEntityRelValue(revRelValueId);

        if (dbRevEntityRelationship[0] != '\0' &&
            (strcmp(dbRevEntityRelationship, revEntityRelationship) == 0))
            exists = 1;
    }

    return exists;
}

list *revPersGetALLRevEntityRelationshipsSubjectGUID() {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsSubjectGUID %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityRelationshipsSubjectGUID_BY_TARGET_GUID(long targetGUID) {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, targetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr,
                "SQL error: revPersGetALLRevEntityRelationshipsSubjectGUID_BY_TARGET_GUID %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityRelationshipsTargets(char *revEntityrelationship, long subjectGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int revRelValueId = revPersGetRelId(strdup(revEntityrelationship));

    char *sql = "SELECT "
                "REV_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_SUBJECT_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int64(stmt, 2, subjectGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsTargets %s", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityGUID);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetAllRevEntityRelsIDs_By_EntityGUID(long revEntityGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_TARGET_GUID = ? OR  REV_SUBJECT_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetAllRevEntityRels_By_EntityGUID %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: -revPersGetAllRevEntityRelsIDs_By_EntityGUID %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long long revEntityRelationshipId = sqlite3_column_int64(stmt, 0);
        list_append(&revList, &revEntityRelationshipId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityRelGUIDs_By_RelType_RemoteRevEntityGUID(char *revEntityrelationship, long remoteRevEntityGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int revRelValueId = revPersGetRelId(strdup(revEntityrelationship));

    char *sql = "SELECT "
                "REV_REMOTE_SUBJECT_GUID, REV_REMOTE_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND (REV_REMOTE_SUBJECT_GUID = ? OR REV_REMOTE_TARGET_GUID = ?)";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int64(stmt, 2, remoteRevEntityGUID);
    sqlite3_bind_int64(stmt, 3, remoteRevEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelGUIDs_By_RelType_RemoteRevEntityGUID %s", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long _revEntityGUID = sqlite3_column_int64(stmt, 1);
        list_append(&revList, &revEntityGUID);
        list_append(&revList, &_revEntityGUID);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revGetRels_By_RelType_RevEntityGUID_LocalGUIDs(const char *revRelType, long revEntityGUID, long revLocalGUID_1, long revLocalGUID_2) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RELATIONSHIP_ID, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REMOTE_RELATIONSHIP_ID, "
                "REV_SUBJECT_GUID, "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_REMOTE_TARGET_GUID, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_ENTITY_GUID = ? AND ((REV_SUBJECT_GUID = ? AND REV_TARGET_GUID = ?) OR (REV_TARGET_GUID = ? AND REV_SUBJECT_GUID = ?)) LIMIT ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(strdup(revRelType)));
    sqlite3_bind_int64(stmt, 2, revEntityGUID);
    sqlite3_bind_int64(stmt, 3, revLocalGUID_1);
    sqlite3_bind_int64(stmt, 4, revLocalGUID_2);
    sqlite3_bind_int64(stmt, 5, revLocalGUID_1);
    sqlite3_bind_int64(stmt, 6, revLocalGUID_2);

    sqlite3_bind_int(stmt, 7, revLimit);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRels_By_RelType_LocalGUIDs %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revGetRels_By_RelType_LocalGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 2);
            long _remoteRevEntityRelationshipId = sqlite3_column_int64(stmt, 3);

            long _revEntityGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevEntityGUID = sqlite3_column_int64(stmt, 5);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 7);

            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 8);
            long _remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 9);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 10));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 11));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

            revEntityRelationship._revEntityGUID = _revEntityGUID;
            revEntityRelationship._remoteRevEntityGUID = _remoteRevEntityGUID;

            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    return &revList;
}

list *revGetRels_By_RelType_LocalGUIDs(const char *revRelType, long revLocalGUID_1, long revLocalGUID_2) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RELATIONSHIP_ID, "
                "REMOTE_RELATIONSHIP_ID, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_SUBJECT_GUID, "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_REMOTE_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_PUBLISHED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND ((REV_SUBJECT_GUID = ? AND REV_TARGET_GUID = ?) OR (REV_TARGET_GUID = ? AND REV_SUBJECT_GUID = ?)) ORDER BY REV_RELATIONSHIP_ID DESC LIMIT ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(strdup(revRelType)));
    sqlite3_bind_int64(stmt, 2, revLocalGUID_1);
    sqlite3_bind_int64(stmt, 3, revLocalGUID_2);
    sqlite3_bind_int64(stmt, 4, revLocalGUID_1);
    sqlite3_bind_int64(stmt, 5, revLocalGUID_2);

    sqlite3_bind_int(stmt, 6, revLimit);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRels_By_RelType_LocalGUIDs %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revGetRels_By_RelType_LocalGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 2);
            long _remoteRevEntityRelationshipId = sqlite3_column_int64(stmt, 3);

            long _revEntityGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevEntityGUID = sqlite3_column_int64(stmt, 5);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 7);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 8);
            long _remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 9);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 10));

            long _revTimePublished = sqlite3_column_int64(stmt, 11);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 12);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

            revEntityRelationship._revEntityGUID = _revEntityGUID;
            revEntityRelationship._remoteRevEntityGUID = _remoteRevEntityGUID;

            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

            revEntityRelationship._timeCreated = timeCreated;

            revEntityRelationship._revTimePublished = _revTimePublished;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    return &revList;
}

list *revGetRels_By_RelType_RemoteGUIDs(const char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT  "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RELATIONSHIP_ID, "
                "REMOTE_RELATIONSHIP_ID, "
                "REV_SUBJECT_GUID, "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_REMOTE_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE AND REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND ((REV_REMOTE_SUBJECT_GUID = ? AND REV_REMOTE_TARGET_GUID = ?) OR (REV_REMOTE_TARGET_GUID = ? AND REV_REMOTE_SUBJECT_GUID = ?)) LIMIT ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    char *_revRelType = strdup(revRelType);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(_revRelType));

    free(_revRelType);

    sqlite3_bind_int64(stmt, 2, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 3, revRemoteTargetGuid);
    sqlite3_bind_int64(stmt, 4, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 5, revRemoteTargetGuid);

    sqlite3_bind_int(stmt, 6, revLimit);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRels_By_RelType_RemoteGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 2);
            long _remoteRevEntityRelationshipId = sqlite3_column_int64(stmt, 3);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 7);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 8));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 9));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    return &revList;
}

list *revPersGetALLRevEntityRelValIds_By_RevResStatus(int revResolveStatus) {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsTargets %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revRelId = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetUnresolvedRemoteSubjectGUIDsRelIds() {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE  "
                "WHERE REV_REMOTE_SUBJECT_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsTargets %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revRelId = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetUnresolvedRemoteTargetGUIDSRelIds() {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE  "
                "WHERE REV_REMOTE_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsTargets %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int revRelId = sqlite3_column_int(stmt, 0);
            list_append(&revList, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

long revPersGetSubjectGUID_BY_RelStr_TargetGUID(char *revEntityrelationship, long revTargetGUID) {
    long revRetEntityGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID = ? ORDER BY REV_RELATIONSHIP_ID DESC LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    int revRelValueId = revPersGetRelId(strdup(revEntityrelationship));

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int(stmt, 2, revTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: rc != SQLITE_OK %s", sqlite3_errmsg(db));
        goto revEnd;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        revRetEntityGUID = sqlite3_column_int64(stmt, 0);
    } else if (rc == SQLITE_DONE) {
        // no data found
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> no data found");
    } else {
        // an error occurred
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revPersGetSubjectGUID_BY_RelStr_TargetGUID %s", sqlite3_errmsg(db));
    }

    revEnd:

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRetEntityGUID;
}

long revPersGetTargetGUID_BY_RelStr_SubjectGUID(char *revEntityrelationship, long revSubjectGUID) {
    long revRetEntityGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_SUBJECT_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    int revRelValueId = revPersGetRelId(strdup(revEntityrelationship));

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int(stmt, 2, revSubjectGUID);
    // sqlite3_bind_int(stmt, 3, 1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: rc != SQLITE_OK %s", sqlite3_errmsg(db));
        sqlite3_close(db);
        return revRetEntityGUID;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        revRetEntityGUID = sqlite3_column_int64(stmt, 0);
    } else if (rc == SQLITE_DONE) {
        // no data found
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> no data found");
    } else {
        // an error occurred
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revPersGetTargetGUID_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
        sqlite3_close(db);
        return revRetEntityGUID;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRetEntityGUID;
}

list *revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(char *revEntityrelationship, long revTargetGUID) {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID = ? AND REV_RESOLVE_STATUS <> ? ORDER BY REV_RELATIONSHIP_ID DESC LIMIT 10";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    int revRelValueId = revPersGetRelId(strdup(revEntityrelationship));

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int(stmt, 2, revTargetGUID);
    sqlite3_bind_int(stmt, 3, -3);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRelSubjectGUIDs_By_TargetGUID(long revTargetGUID) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRelSubjectGUIDs_By_TargetGUID %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revEntityRelationshipSubject = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &_revEntityRelationshipSubject);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetRevEntityRels_By_ResStatus(int revResStatus) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RELATIONSHIP_ID, "
                "REMOTE_RELATIONSHIP_ID, "
                "REV_SUBJECT_GUID, "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_REMOTE_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsUnSyched %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 2);
            long _remoteRevEntityRelationshipId = sqlite3_column_int64(stmt, 3);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 7);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 8));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 9));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetRevEntityRels_By_ResStatus_RelType(int revResStatus, char *revEntityRelationship) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RELATIONSHIP_ID, "
                "REMOTE_RELATIONSHIP_ID, "
                "REV_SUBJECT_GUID, "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_REMOTE_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_RELATIONSHIP_TYPE_VALUE_ID = ? LIMIT ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResStatus);

    int revRelValueId = revPersGetRelId(strdup(revEntityRelationship));
    sqlite3_bind_int(stmt, 2, revRelValueId);

    sqlite3_bind_int(stmt, 3, revLimit);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsUnSyched %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 2);
            long _remoteRevEntityRelationshipId = sqlite3_column_int64(stmt, 3);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 7);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 8));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 9));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityRelationshipsAcceptedUnSyched(long revEntityTargetGUID, int revRelResolveStatus) {

    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_ID, "
                "REMOTE_RELATIONSHIP_ID, "
                "REV_SUBJECT_GUID, "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_REMOTE_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_REMOTE_TARGET_GUID = ? AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityTargetGUID);
    sqlite3_bind_int(stmt, 2, revRelResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 0);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            int _revResolveStatus = sqlite3_column_int64(stmt, 1);
            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 2);
            long _remoteRevEntityRelationshipId = sqlite3_column_int64(stmt, 3);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 7);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 8));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 9));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._remoteRevEntityRelationshipId = _remoteRevEntityRelationshipId;

            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._remoteRevEntitySubjectGUID = _remoteRevevEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._remoteRevEntityTargetGUID = _remoteRevEntityTargetGUID;

            revEntityRelationship._timeCreated = strdup(timeCreated);
            revEntityRelationship._timeUpdated = strdup(timeUpdated);

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevRels_RemoteRelId_By_ResolveStatus(int revRelResolveStatus) {

    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsTargets %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long remoteRelId = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &remoteRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevRels_RemoteRelId_By_ResolveStatus_RemoteTargetGUID(int revRelResolveStatus, long remoteTargetGUID) {
    list revList;
    list_new(&revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_REMOTE_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelResolveStatus);
    sqlite3_bind_int64(stmt, 2, remoteTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsTargets %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long remoteRelId = sqlite3_column_int64(stmt, 0);
            list_append(&revList, &remoteRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetALLRevEntityRelationships_By_RelTypeValueId(long relTypeValueId) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relTypeValueId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationships_By_RelTypeValueId %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 0);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 1);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 2);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 3));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 4));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID(long relTypeValueId, long revEntitySubjectGUID) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_SUBJECT_GUID =?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relTypeValueId);
    sqlite3_bind_int64(stmt, 2, revEntitySubjectGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {

        long relValueId = sqlite3_column_int(stmt, 0);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 1);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 2);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 3));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 4));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetUnresolvedRemoteGUIDsRelId() {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_RELATIONSHIP_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_REMOTE_SUBJECT_GUID < 0 OR REV_REMOTE_TARGET_GUID < 0";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetUnresolvedRemoteGUIDsRelId %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 0);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 1);
            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 4));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 5));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID(long relTypeValueId, long revEntityTargetGUID) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID =?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relTypeValueId);
    sqlite3_bind_int64(stmt, 2, revEntityTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 0);
            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 4));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 5));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_ResolveStatus(int relTypeValueId, long revEntityTargetGUID, int revEntityResolveStatus) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID = ? AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relTypeValueId);
    sqlite3_bind_int64(stmt, 2, revEntityTargetGUID);
    sqlite3_bind_int(stmt, 3, revEntityResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_ResolveStatus %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 0);

            if (_revEntityRelationshipId < 1)
                continue;

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);
            long timeCreated = sqlite3_column_int64(stmt, 4);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._revTimeCreated = timeCreated;
            revEntityRelationship._timeCreated = revLocalTimer(timeCreated);

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetRemoteRelsGUIDs_By_RelTypeValueId_RevEntityGUID_ResolveStatus(int relTypeValueId, long revEntityGUID, int revEntityResolveStatus) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_REMOTE_SUBJECT_GUID, "
                "REV_REMOTE_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND (REV_REMOTE_SUBJECT_GUID = ? OR REV_REMOTE_TARGET_GUID = ?) AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relTypeValueId);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);
    sqlite3_bind_int64(stmt, 3, revEntityGUID);
    sqlite3_bind_int(stmt, 4, revEntityResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRemoteRelsGUIDs_By_RelTypeValueId_RevEntityGUID_ResolveStatus %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long remoteRevEntitySubjectGUID = sqlite3_column_int64(stmt, 0);
        long remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 1);

        RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();
        revEntityRelationship._remoteRevEntitySubjectGUID = remoteRevEntitySubjectGUID;
        revEntityRelationship._remoteRevEntityTargetGUID = remoteRevEntityTargetGUID;
        list_append(&revList, &revEntityRelationship);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

list *revPersGetAllRevEntityRels_By_RelType_ValueId_ResolveStatus(int relTypeValueId, long revEntityGUID, int revResolveStatus) {
    list revList;
    list_new(&revList, sizeof(RevEntityRelationship), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND (REV_TARGET_GUID = ? OR  REV_SUBJECT_GUID = ?) AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relTypeValueId);
    sqlite3_bind_int(stmt, 2, revEntityGUID);
    sqlite3_bind_int(stmt, 3, revEntityGUID);
    sqlite3_bind_int(stmt, 4, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetAllRevEntityRels_By_RelType_ValueId_ResolveStatus %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 0);
            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 4));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 5));

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revList;
}

RevEntityRelationship revPersGetRevEntityRelById(long revEntityRelationshipId) {
    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RESOLVE_STATUS, "
                "REV_RELATIONSHIP_TYPE_VALUE_ID, "
                "REV_SUBJECT_GUID, "
                "REV_TARGET_GUID, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE "
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntityRelationshipResStatus = sqlite3_column_int64(stmt, 0);
            long _revEntityRelationshipId = revEntityRelationshipId;
            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 4));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 5));

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

            revEntityRelationship._revResolveStatus = _revEntityRelationshipResStatus;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = strdup(timeCreated);
            revEntityRelationship._timeUpdated = strdup(timeUpdated);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityRelationship;
}
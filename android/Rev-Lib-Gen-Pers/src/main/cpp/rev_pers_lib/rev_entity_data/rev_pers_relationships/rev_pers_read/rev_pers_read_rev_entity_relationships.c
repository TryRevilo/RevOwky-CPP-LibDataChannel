//
// Created by rev on 8/2/18.
//

#include "rev_pers_read_rev_entity_relationships.h"

#include <android/log.h>

#include <string.h>

#include "../rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h"
#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_db_models/rev_entity_relationships.h"
#include "../../../rev_pers_rev_entity/rev_pers_lib_read/rev_pers_read.h"
#include "../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

int REV_LIMIT = 10;

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

void revPersGetALLRevEntityRelationshipsSubjectGUID(list *revList) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityRelationshipsSubjectGUID_BY_TARGET_GUID(list *revList, long targetGUID) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetTargetGUIDs_BY_RelStr_SubjectGUID(list *revList, char *revEntityRelationship, long subjectGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int revRelValueId = revPersGetRelId(strdup(revEntityRelationship));

    char *sql = "SELECT "
                "REV_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_SUBJECT_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int64(stmt, 2, subjectGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetTargetGUIDs_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revEntityGUID);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetAllRevEntityRelsIDs_By_EntityGUID(list *revList, long revEntityGUID) {
    list_new(revList, sizeof(long), NULL);

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
        list_append(revList, &revEntityRelationshipId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRelGUIDs_By_Type_revRemoteGUID(list *revList, char *revEntityRelationship, long revRemoteEntityGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int revRelValueId = revPersGetRelId(strdup(revEntityRelationship));

    char *sql = "SELECT "
                "REV_REMOTE_SUBJECT_GUID, REV_REMOTE_TARGET_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND (REV_REMOTE_SUBJECT_GUID = ? OR REV_REMOTE_TARGET_GUID = ?)";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int64(stmt, 2, revRemoteEntityGUID);
    sqlite3_bind_int64(stmt, 3, revRemoteEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRelGUIDs_By_Type_revRemoteGUID %s", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long _revGUID = sqlite3_column_int64(stmt, 1);
        list_append(revList, &revEntityGUID);
        list_append(revList, &_revGUID);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRels_By_Type_EntityGUID_LocalEntityGUIDs(list *revList, const char *revRelType, long revEntityGUID, long revLocalGUID_1, long revLocalGUID_2) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    sqlite3_bind_int(stmt, 7, REV_LIMIT);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRels_By_Type_LocalEntityGUIDs %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revPersGetRels_By_Type_LocalEntityGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revId = sqlite3_column_int64(stmt, 2);
            long _revRemoteId = sqlite3_column_int64(stmt, 3);

            long _revGUID = sqlite3_column_int64(stmt, 4);
            long _revRemoteGUID = sqlite3_column_int64(stmt, 5);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 7);

            long _revTargetGUID = sqlite3_column_int64(stmt, 8);
            long _revRemoteTargetGUID = sqlite3_column_int64(stmt, 9);

            long _revTimeCreated = sqlite3_column_int64(stmt, 10);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 11);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revRemoteId = _revRemoteId;

            revEntityRelationship._revGUID = _revGUID;
            revEntityRelationship._revRemoteGUID = _revRemoteGUID;

            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }
}

void revPersGetRels_By_Type_LocalEntityGUIDs(list *revList, const char *revRelType, long revLocalGUID_1, long revLocalGUID_2) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    sqlite3_bind_int(stmt, 6, REV_LIMIT);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRels_By_Type_LocalEntityGUIDs %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revPersGetRels_By_Type_LocalEntityGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revId = sqlite3_column_int64(stmt, 2);
            long _revRemoteId = sqlite3_column_int64(stmt, 3);

            long _revGUID = sqlite3_column_int64(stmt, 4);
            long _revRemoteGUID = sqlite3_column_int64(stmt, 5);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 6);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 7);
            long _revTargetGUID = sqlite3_column_int64(stmt, 8);
            long _revRemoteTargetGUID = sqlite3_column_int64(stmt, 9);

            long _revTimeCreated = sqlite3_column_int64(stmt, 10);

            long _revTimePublished = sqlite3_column_int64(stmt, 11);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 12);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revType = dbRevEntityRelationship;

            revEntityRelationship._revId = _revId;
            revEntityRelationship._revRemoteId = _revRemoteId;

            revEntityRelationship._revGUID = _revGUID;
            revEntityRelationship._revRemoteGUID = _revRemoteGUID;

            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

            revEntityRelationship._revTimeCreated = _revTimeCreated;

            revEntityRelationship._revTimePublished = _revTimePublished;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }
}

void revPersGetRels_By_Type_RemoteEntityGUIDs(list *revList, const char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    char *_revType = strdup(revRelType);

    sqlite3_bind_int(stmt, 1, revPersGetRelId(_revType));

    free(_revType);

    sqlite3_bind_int64(stmt, 2, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 3, revRemoteTargetGuid);
    sqlite3_bind_int64(stmt, 4, revRemoteSubjectGUID);
    sqlite3_bind_int64(stmt, 5, revRemoteTargetGuid);

    sqlite3_bind_int(stmt, 6, REV_LIMIT);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetRels_By_Type_RemoteEntityGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revId = sqlite3_column_int64(stmt, 2);
            long _revRemoteId = sqlite3_column_int64(stmt, 3);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revTargetGUID = sqlite3_column_int64(stmt, 6);
            long _revRemoteTargetGUID = sqlite3_column_int64(stmt, 7);

            long _revTimeCreated = sqlite3_column_int64(stmt, 8);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 9);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revRemoteId = _revRemoteId;

            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }
}

void revPersGetALLRevEntityRelValIds_By_RevResStatus(list *revList, int revResolveStatus) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetTargetGUIDs_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revRelId = sqlite3_column_int64(stmt, 0);
            list_append(revList, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetUnresolvedRemoteSubjectGUIDsRelIds(list *revList) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE  "
                "WHERE REV_REMOTE_SUBJECT_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetTargetGUIDs_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revRelId = sqlite3_column_int64(stmt, 0);
            list_append(revList, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetUnresolvedRemoteTargetGUIDSRelIds(list *revList) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE  "
                "WHERE REV_REMOTE_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetTargetGUIDs_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int revRelId = sqlite3_column_int(stmt, 0);
            list_append(revList, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

long revPersGetSubjectGUID_BY_RelStr_TargetGUID(char *revEntityRelationship, long revTargetGUID) {
    long revRetEntityGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID = ? ORDER BY REV_RELATIONSHIP_ID DESC LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    int revRelValueId = revPersGetRelId(strdup(revEntityRelationship));

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

void revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(list *revList, char *revEntityRelationship, long revTargetGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID = ? AND REV_RESOLVE_STATUS <> ? ORDER BY REV_RELATIONSHIP_ID DESC LIMIT 10";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    int revRelValueId = revPersGetRelId(strdup(revEntityRelationship));

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int(stmt, 2, revTargetGUID);
    sqlite3_bind_int(stmt, 3, -3);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetSubjectGUIDs_BY_RelStr_TargetGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(revList, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRelSubjectGUIDs_By_TargetGUID(list *revList, long revTargetGUID) {
    list_new(revList, sizeof(long), NULL);

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
            long _revRelationshipSubject = sqlite3_column_int64(stmt, 0);
            list_append(revList, &_revRelationshipSubject);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRels_By_ResStatus(list *revList, int revResStatus) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

            long _revId = sqlite3_column_int64(stmt, 2);
            long _revRemoteId = sqlite3_column_int64(stmt, 3);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revTargetGUID = sqlite3_column_int64(stmt, 6);
            long _revRemoteTargetGUID = sqlite3_column_int64(stmt, 7);

            long _revTimeCreated = sqlite3_column_int64(stmt, 8);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 9);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revRemoteId = _revRemoteId;

            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRels_By_ResStatus_RelType(list *revList, int revResStatus, char *revEntityRelationship) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    sqlite3_bind_int(stmt, 3, REV_LIMIT);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsUnSyched %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long _revResolveStatus = sqlite3_column_int64(stmt, 0);

            int relValueId = sqlite3_column_int(stmt, 1);
            char *dbRevEntityRelationship = strdup(getRevEntityRelValue(relValueId));

            long _revId = sqlite3_column_int64(stmt, 2);
            long _revRemoteId = sqlite3_column_int64(stmt, 3);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revTargetGUID = sqlite3_column_int64(stmt, 6);
            long _revRemoteTargetGUID = sqlite3_column_int64(stmt, 7);

            long _revTimeCreated = sqlite3_column_int64(stmt, 8);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 9);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revRemoteId = _revRemoteId;

            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;

            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityRelationshipsAcceptedUnSyched(list *revList, long revEntityTargetGUID, int revRelResolveStatus) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    while (
            sqlite3_step(stmt)
            == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 0);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            int _revResolveStatus = sqlite3_column_int64(stmt, 1);
            long _revId = sqlite3_column_int64(stmt, 2);
            long _revRemoteId = sqlite3_column_int64(stmt, 3);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 4);
            long _remoteRevevEntitySubjectGUID = sqlite3_column_int64(stmt, 5);

            long _revTargetGUID = sqlite3_column_int64(stmt, 6);
            long _revRemoteTargetGUID = sqlite3_column_int64(stmt, 7);

            long _revTimeCreated = sqlite3_column_int64(stmt, 8);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 9);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revResolveStatus = _revResolveStatus;
            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revRemoteId = _revRemoteId;

            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revRemoteSubjectGUID = _remoteRevevEntitySubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revRemoteTargetGUID = _revRemoteTargetGUID;

            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevRels_RemoteRelId_By_revResolveStatus(list *revList, int revRelResolveStatus) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_RELATIONSHIP_ID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetTargetGUIDs_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long remoteRelId = sqlite3_column_int64(stmt, 0);
            list_append(revList, &remoteRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevRels_RemoteRelId_By_revResolveStatus_RemoteTargetGUID(list *revList, int revRelResolveStatus, long remoteTargetGUID) {
    list_new(revList, sizeof(long), NULL);

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
        fprintf(stderr, "SQL error: revPersGetTargetGUIDs_BY_RelStr_SubjectGUID %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long remoteRelId = sqlite3_column_int64(stmt, 0);
            list_append(revList, &remoteRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityRelationships_By_RelTypeValueId(list *revList, long relTypeValueId) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

            long _revSubjectGUID = sqlite3_column_int64(stmt, 1);
            long _revTargetGUID = sqlite3_column_int64(stmt, 2);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 5);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID(list *revList, long relTypeValueId, long revEntitySubjectGUID) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    while (
            sqlite3_step(stmt)
            == SQLITE_ROW) {

        long relValueId = sqlite3_column_int(stmt, 0);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revSubjectGUID = sqlite3_column_int64(stmt, 1);
            long _revTargetGUID = sqlite3_column_int64(stmt, 2);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 5);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetUnresolvedRemoteGUIDsRelId(list *revList) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

            long _revId = sqlite3_column_int64(stmt, 1);
            long _revSubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revTargetGUID = sqlite3_column_int64(stmt, 3);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 5);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revId = _revId;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID(list *revList, long relTypeValueId, long revEntityTargetGUID) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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

    while (
            sqlite3_step(stmt)
            == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revId = sqlite3_column_int64(stmt, 0);
            long _revSubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revTargetGUID = sqlite3_column_int64(stmt, 3);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 5);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revType = dbRevEntityRelationship;

            revEntityRelationship._revId = _revId;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_revResolveStatus(list *revList, int relTypeValueId, long revEntityTargetGUID, int revEntityResolveStatus) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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
        fprintf(stderr, "SQL error: revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_revResolveStatus %s", sqlite3_errmsg(db));
    }

    while (
            sqlite3_step(stmt)
            == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revId = sqlite3_column_int64(stmt, 0);

            if (_revId < 1)
                continue;

            long _revSubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revTargetGUID = sqlite3_column_int64(stmt, 3);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revType = dbRevEntityRelationship;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetRemoteRelsGUIDs_By_RelTypeValueId_revGUID_revResolveStatus(list *revList, int relTypeValueId, long revEntityGUID, int revEntityResolveStatus) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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
        fprintf(stderr, "SQL error: revPersGetRemoteRelsGUIDs_By_RelTypeValueId_revGUID_revResolveStatus %s", sqlite3_errmsg(db));
    }

    while (
            sqlite3_step(stmt)
            == SQLITE_ROW) {
        long remoteRevEntitySubjectGUID = sqlite3_column_int64(stmt, 0);
        long remoteRevEntityTargetGUID = sqlite3_column_int64(stmt, 1);

        RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();
        revEntityRelationship._revRemoteSubjectGUID = remoteRevEntitySubjectGUID;
        revEntityRelationship._revRemoteTargetGUID = remoteRevEntityTargetGUID;
        list_append(revList, &revEntityRelationship);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetAllRevEntityRels_By_RelType_ValueId_revResolveStatus(list *revList, int relTypeValueId, long revEntityGUID, int revResolveStatus) {
    list_new(revList, sizeof(RevEntityRelationship), NULL);

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
        fprintf(stderr, "SQL error: revPersGetAllRevEntityRels_By_RelType_ValueId_revResolveStatus %s", sqlite3_errmsg(db));
    }

    while (
            sqlite3_step(stmt)
            == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revId = sqlite3_column_int64(stmt, 0);
            long _revSubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revTargetGUID = sqlite3_column_int64(stmt, 3);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 5);

            RevEntityRelationship revEntityRelationship = *revInitializedEntityRelationship();

            revEntityRelationship._revType = dbRevEntityRelationship;

            revEntityRelationship._revId = _revId;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;

            list_append(revList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
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

            long _revRelationshipResStatus = sqlite3_column_int64(stmt, 0);
            long _revId = revEntityRelationshipId;
            long _revSubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revTargetGUID = sqlite3_column_int64(stmt, 3);

            long _revTimeCreated = sqlite3_column_int64(stmt, 4);
            long _revTimePublishedUpdated = sqlite3_column_int64(stmt, 5);

            revEntityRelationship._revType = dbRevEntityRelationship;

            revEntityRelationship._revResolveStatus = _revRelationshipResStatus;
            revEntityRelationship._revId = _revId;
            revEntityRelationship._revTypeValueId = relValueId;
            revEntityRelationship._revSubjectGUID = _revSubjectGUID;
            revEntityRelationship._revTargetGUID = _revTargetGUID;
            revEntityRelationship._revTimeCreated = _revTimeCreated;
            revEntityRelationship._revTimePublishedUpdated = _revTimePublishedUpdated;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityRelationship;
}
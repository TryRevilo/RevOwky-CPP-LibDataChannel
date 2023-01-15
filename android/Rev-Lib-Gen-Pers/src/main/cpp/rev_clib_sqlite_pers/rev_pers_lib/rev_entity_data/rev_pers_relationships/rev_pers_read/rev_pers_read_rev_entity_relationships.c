//
// Created by rev on 8/2/18.
//

#include <string.h>
#include <android/log.h>
#include "rev_pers_read_rev_entity_relationships.h"
#include "../rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h"
#include <sqlite3.h>
#include <rev_linked_list.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_db_models/rev_entity_relationships.h"
#include "../../../rev_entity/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_read/rev_pers_read.h"
#include "../../../../rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"

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

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityRelationshipsSubjectGUID_BY_TARGET_GUID(long targetGUID) {
    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityRelationshipsTargets(char *revEntityrelationship, long subjectGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityRelGUIDs_By_RelType_RemoteRevEntityGUID(char *revEntityrelationship, long remoteRevEntityGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
        list_append(&list, &revEntityGUID);
        list_append(&list, &_revEntityGUID);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityRelValIds_By_RevResStatus(int revResolveStatus) {
    list list;
    list_new(&list, sizeof(long), NULL);

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
            list_append(&list, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetUnresolvedRemoteSubjectGUIDsRelIds() {
    list list;
    list_new(&list, sizeof(long), NULL);

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
            list_append(&list, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetUnresolvedRemoteTargetGUIDSRelIds() {
    list list;
    list_new(&list, sizeof(long), NULL);

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
            list_append(&list, &revRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(char *revEntityrelationship, long revTargetGUID) {
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_SUBJECT_GUID "
                "FROM REV_ENTITY_RELATIONSHIPS_TABLE "
                "WHERE REV_RELATIONSHIP_TYPE_VALUE_ID = ? AND REV_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    int revRelValueId = revPersGetRelId(strdup(revEntityrelationship));

    sqlite3_bind_int(stmt, 1, revRelValueId);
    sqlite3_bind_int(stmt, 2, revTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUIDs %s", sqlite3_errmsg(db));
    } else {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;

}

list *revPersGetALLRelSubjectGUIDs_By_TargetGUID(long revTargetGUID) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
            list_append(&list, &_revEntityRelationshipSubject);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;

}

list *revPersGetRevEntityRels_By_ResStatus(int revResStatus) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

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

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetALLRevEntityRelationshipsAcceptedUnSyched(long revEntityTargetGUID, int revRelResolveStatus) {

    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

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

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetALLRevRels_RemoteRelId_By_ResolveStatus(int revRelResolveStatus) {

    list list;
    list_new(&list, sizeof(long), NULL);

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
            list_append(&list, &remoteRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevRels_RemoteRelId_By_ResolveStatus_RemoteTargetGUID(int revRelResolveStatus, long remoteTargetGUID) {
    list list;
    list_new(&list, sizeof(long), NULL);

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
            list_append(&list, &remoteRelId);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityRelationships_By_RelTypeValueId(long relTypeValueId) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID(long relTypeValueId, long revEntitySubjectGUID) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetUnresolvedRemoteGUIDsRelId() {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID(long relTypeValueId, long revEntityTargetGUID) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_ResolveStatus(int relTypeValueId, long revEntityTargetGUID, int revEntityResolveStatus) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            if (_revEntityRelationshipId < 1) continue;

            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);
            long timeCreated = sqlite3_column_int64(stmt, 4);

            RevEntityRelationship revEntityRelationship;

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;
            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._revTimeCreated = timeCreated;
            revEntityRelationship._timeCreated = revLocalTimer(timeCreated);

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetRemoteRelsGUIDs_By_RelTypeValueId_RevEntityGUID_ResolveStatus(int relTypeValueId, long revEntityGUID, int revEntityResolveStatus) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

        RevEntityRelationship revEntityRelationship;
        revEntityRelationship._remoteRevEntitySubjectGUID = remoteRevEntitySubjectGUID;
        revEntityRelationship._remoteRevEntityTargetGUID = remoteRevEntityTargetGUID;
        list_append(&revEntityRelationshipList, &revEntityRelationship);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

list *revPersGetAllRevEntityRels_By_RelType_ValueId_ResolveStatus(int relTypeValueId, long revEntityGUID, int revResolveStatus) {
    list revEntityRelationshipList;
    list_new(&revEntityRelationshipList, sizeof(RevEntityRelationship), NULL);

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

            RevEntityRelationship revEntityRelationship;

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

            revEntityRelationship._revEntityRelationshipId = _revEntityRelationshipId;
            revEntityRelationship._revEntityRelationshipTypeValueId = relValueId;
            revEntityRelationship._revEntitySubjectGUID = _revEntitySubjectGUID;
            revEntityRelationship._revEntityTargetGUID = _revEntityTargetGUID;
            revEntityRelationship._timeCreated = timeCreated;
            revEntityRelationship._timeUpdated = timeUpdated;

            list_append(&revEntityRelationshipList, &revEntityRelationship);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityRelationshipList;
}

RevEntityRelationship revPersGetRevEntityRelById(long revEntityRelationshipId) {
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
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    RevEntityRelationship revEntityRelationship;

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        long relValueId = sqlite3_column_int(stmt, 1);

        if (relValueId > 0) {
            char *dbRevEntityRelationship = getRevEntityRelValue(relValueId);

            long _revEntityRelationshipId = sqlite3_column_int64(stmt, 0);
            long _revEntitySubjectGUID = sqlite3_column_int64(stmt, 2);
            long _revEntityTargetGUID = sqlite3_column_int64(stmt, 3);

            char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 4));
            char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 5));

            revEntityRelationship._revEntityRelationshipType = dbRevEntityRelationship;

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
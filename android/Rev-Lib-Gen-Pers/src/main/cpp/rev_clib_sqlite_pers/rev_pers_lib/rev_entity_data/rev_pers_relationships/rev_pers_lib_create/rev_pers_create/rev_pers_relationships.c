#include <stdio.h>
#include <string.h>
#include <android/log.h>
#include <sqlite3.h>
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"
#include "../../../rev_pers_rev_entity_metastrings/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metastrings.h"
#include "../../../rev_pers_rev_entity_metastrings/rev_pers_read/rev_pers_read_rev_entity_metastrings.h"
#include "../../rev_db_models/rev_entity_relationships.h"

int revPersGetRelId(char *revEntityrelationship) {
    int revRelId = -1;

    if (strcmp(revEntityrelationship, strdup("rev_entity_info")) == 0) {
        revRelId = 0;
    } else if (strcmp(revEntityrelationship, strdup("rev_timeline_entry")) == 0) {
        revRelId = 1;
    } else if (strcmp(revEntityrelationship, strdup("kiwi_of")) == 0) {
        revRelId = 2;
    } else if (strcmp(revEntityrelationship, strdup("rev_pics_album_of")) == 0) {
        revRelId = 3;
    } else if (strcmp(revEntityrelationship, strdup("rev_picture_of")) == 0) {
        revRelId = 4;
    } else if (strcmp(revEntityrelationship, strdup("rev_entity_connect_members")) == 0) {
        revRelId = 5;
    } else if (strcmp(revEntityrelationship, strdup("rev_comment")) == 0) {
        revRelId = 6;
    } else if (strcmp(revEntityrelationship, strdup("rev_entity_space_member")) == 0) {
        revRelId = 7;
    }

    return revRelId;

}

char *getRevEntityRelValue(int relTypeValId) {
  char *relTypeVal;

  switch (relTypeValId) {
    case 0:
    relTypeVal = "rev_entity_info";
    break;
    case 1:
    relTypeVal = "rev_timeline_entry";
    break;
    case 2:
    relTypeVal = "kiwi_of";
    break;
    case 3:
    relTypeVal = "rev_pics_album_of";
    break;
    case 4:
    relTypeVal = "rev_picture_of";
    break;
    case 5:
    relTypeVal = "rev_entity_connect_members";
    break;
    case 6:
    relTypeVal = "rev_comment";
    break;
    case 7:
    relTypeVal = "rev_entity_space_member";
    break;
    default:
    relTypeVal = "-1";
}

return relTypeVal;
}

long revPersRelationshipObject(RevEntityRelationship *revEntityRelationship) {
    long revReturnVal = -1;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    int _revResolveStatus = revEntityRelationship->_revResolveStatus;
    int _remoteRevEntityRelationshipId = revEntityRelationship->_remoteRevEntityRelationshipId;

    char *_revEntityRelationshipType = revEntityRelationship->_revEntityRelationshipType;

    long _revEntitySubjectGUID = revEntityRelationship->_revEntitySubjectGUID;
    long _remoteRevevEntitySubjectGUID = revEntityRelationship->_remoteRevEntitySubjectGUID;
    long _revEntityTargetGUID = revEntityRelationship->_revEntityTargetGUID;
    long _remoteRevEntityTargetGUID = revEntityRelationship->_remoteRevEntityTargetGUID;

    long _revTimeCreated = revEntityRelationship->_revTimeCreated;

    if (_revTimeCreated < 1)
        _revTimeCreated = revCurrentTimestampMillSecs();

    long _revTimePublished = revEntityRelationship->_revTimePublished;
    long _revTimePublishedUpdated = revEntityRelationship->_revTimePublishedUpdated;

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_RELATIONSHIPS_TABLE ("
    "REV_RESOLVE_STATUS, "
    "REMOTE_RELATIONSHIP_ID, "
    "REV_SUBJECT_GUID, "
    "REV_REMOTE_SUBJECT_GUID, "
    "REV_TARGET_GUID, "
    "REV_REMOTE_TARGET_GUID, "
    "REV_RELATIONSHIP_TYPE_VALUE_ID, "
    "REV_CREATED_DATE, "
    "REV_PUBLISHED_DATE, "
    "REV_UPDATED_DATE "
    ") "
    "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, _revResolveStatus);
        sqlite3_bind_int64(stmt, 2, _remoteRevEntityRelationshipId);
        sqlite3_bind_int64(stmt, 3, _revEntitySubjectGUID);
        sqlite3_bind_int64(stmt, 4, _remoteRevevEntitySubjectGUID);
        sqlite3_bind_int64(stmt, 5, _revEntityTargetGUID);
        sqlite3_bind_int64(stmt, 6, _remoteRevEntityTargetGUID);
        sqlite3_bind_int(stmt, 7, revPersGetRelId(_revEntityRelationshipType));
        sqlite3_bind_int64(stmt, 8, _revTimeCreated);
        sqlite3_bind_int64(stmt, 9, _revTimePublished);
        sqlite3_bind_int64(stmt, 10, _revTimePublishedUpdated);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersRelationshipObject %s", sqlite3_errmsg(db));
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

long revPersRelationships(long revEntitySubjectGUID, char *revEntityRelationshipType, long revEntityTargetGUID) {
    long revReturnVal = -1;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *currTime = revGetCurrentTime();

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_RELATIONSHIPS_TABLE (" \
    "REV_SUBJECT_GUID, " \
    "REV_TARGET_GUID, " \
    "REV_RELATIONSHIP_TYPE_VALUE_ID, " \
    "REV_CREATED_DATE, " \
    "REV_UPDATED_DATE) " \
    "values (?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, revEntitySubjectGUID);
        sqlite3_bind_int(stmt, 2, revEntityTargetGUID);
        sqlite3_bind_int(stmt, 3, revPersGetRelId(revEntityRelationshipType));
        sqlite3_bind_text(stmt, 4, currTime, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 5, currTime, -1, SQLITE_STATIC);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersRelationships %s", sqlite3_errmsg(db));

        revReturnVal = -1;
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

long revPersRelationships_By_SetResolveStatus(long revEntitySubjectGUID, char *revEntityRelationshipType, long revEntityTargetGUID, long remoteRevEntityRelationshipId, int revResolveStatus) {
    long revReturnVal = -1;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *currTime = revGetCurrentTime();

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_RELATIONSHIPS_TABLE (" \
    "REV_SUBJECT_GUID, " \
    "REV_TARGET_GUID, " \
    "REMOTE_RELATIONSHIP_ID, " \
    "REV_RESOLVE_STATUS, " \
    "REV_RELATIONSHIP_TYPE_VALUE_ID, " \
    "REV_CREATED_DATE, " \
    "REV_UPDATED_DATE) " \
    "values (?, ?, ?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, revEntitySubjectGUID);
        sqlite3_bind_int(stmt, 2, revEntityTargetGUID);
        sqlite3_bind_int(stmt, 3, remoteRevEntityRelationshipId);
        sqlite3_bind_int(stmt, 4, revResolveStatus);

        if (revEntityMetastringExists(revEntityRelationshipType) > 0) {
            sqlite3_bind_int(stmt, 5, getRevEntityMetaStringValueId(revEntityRelationshipType));
        } else {
            sqlite3_bind_int(stmt, 5, revPersRevEntityMetastrings(revEntityRelationshipType));
        }

        sqlite3_bind_text(stmt, 6, currTime, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 7, currTime, -1, SQLITE_STATIC);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersRelationships_By_SetResolveStatus %s", sqlite3_errmsg(db));

        revReturnVal = -1;
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

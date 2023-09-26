#include "rev_pers_relationships.h"

#include <stdio.h>
#include <string.h>
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../rev_db_models/rev_entity_relationships.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"

int revPersGetRelId(char *revEntityRelationship) {
    int revRelId = -1;

    if (strcmp(revEntityRelationship, "rev_entity_info") == 0) {
        revRelId = 0;
    } else if (strcmp(revEntityRelationship, "rev_timeline_entry") == 0) {
        revRelId = 1;
    } else if (strcmp(revEntityRelationship, "kiwi_of") == 0) {
        revRelId = 2;
    } else if (strcmp(revEntityRelationship, "rev_pics_album_of") == 0) {
        revRelId = 3;
    } else if (strcmp(revEntityRelationship, "rev_picture_of") == 0) {
        revRelId = 4;
    } else if (strcmp(revEntityRelationship, "rev_entity_connect_members") == 0) {
        revRelId = 5;
    } else if (strcmp(revEntityRelationship, "rev_comment") == 0) {
        revRelId = 6;
    } else if (strcmp(revEntityRelationship, "rev_entity_space_member") == 0) {
        revRelId = 7;
    } else if (strcmp(revEntityRelationship, "rev_file_of") == 0) {
        revRelId = 8;
    } else if (strcmp(revEntityRelationship, "rev_msg_recipient_of") == 0) {
        revRelId = 9;
    } else if (strcmp(revEntityRelationship, "rev_stranger_chat_of") == 0) {
        revRelId = 10;
    } else if (strcmp(revEntityRelationship, "rev_product_line_of") == 0) {
        revRelId = 11;
    } else if (strcmp(revEntityRelationship, "rev_organization_of") == 0) {
        revRelId = 12;
    } else if (strcmp(revEntityRelationship, "rev_check_out_payment_of") == 0) {
        revRelId = 13;
    } else if (strcmp(revEntityRelationship, "rev_tag_of") == 0) {
        revRelId = 14;
    } else if (strcmp(revEntityRelationship, "rev_flag_of") == 0) {
        revRelId = 15;
    } else if (strcmp(revEntityRelationship, "rev_entity_icon_of") == 0) {
        revRelId = 16;
    } else if (strcmp(revEntityRelationship, "rev_entity_banner_icon_of") == 0) {
        revRelId = 17;
    } else {
        revRelId = -1;
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
        case 8:
            relTypeVal = "rev_file_of";
            break;
        case 9:
            relTypeVal = "rev_msg_recipient_of";
            break;
        case 10:
            relTypeVal = "rev_stranger_chat_of";
            break;
        case 11:
            relTypeVal = "rev_product_line_of";
            break;
        case 12:
            relTypeVal = "rev_organization_of";
            break;
        case 13:
            relTypeVal = "rev_check_out_payment_of";
            break;
        case 14:
            relTypeVal = "rev_tag_of";
            break;
        case 15:
            relTypeVal = "rev_flag_of";
            break;
        case 16:
            relTypeVal = "rev_entity_icon_of";
            break;
        case 17:
            relTypeVal = "rev_entity_banner_icon_of";
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
    int _revRemoteEntityRelationshipId = revEntityRelationship->_revRemoteEntityRelationshipId;

    char *_revEntityRelationshipType = revEntityRelationship->_revEntityRelationshipType;

    long _revEntityGUID = revEntityRelationship->_revEntityGUID;
    long _revRemoteEntityGUID = revEntityRelationship->_revRemoteEntityGUID;

    long _revEntitySubjectGUID = revEntityRelationship->_revEntitySubjectGUID;
    long _remoteRevevEntitySubjectGUID = revEntityRelationship->_revRemoteEntitySubjectGUID;
    long _revEntityTargetGUID = revEntityRelationship->_revEntityTargetGUID;
    long _revRemoteEntityTargetGUID = revEntityRelationship->_revRemoteEntityTargetGUID;

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
            "REV_ENTITY_GUID, "
            "REMOTE_REV_ENTITY_GUID, "
            "REV_SUBJECT_GUID, "
            "REV_REMOTE_SUBJECT_GUID, "
            "REV_TARGET_GUID, "
            "REV_REMOTE_TARGET_GUID, "
            "REV_RELATIONSHIP_TYPE_VALUE_ID, "
            "REV_CREATED_DATE, "
            "REV_PUBLISHED_DATE, "
            "REV_UPDATED_DATE "
            ") "
            "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        sqlite3_bind_int(stmt, 1, _revResolveStatus);
        sqlite3_bind_int64(stmt, 2, _revRemoteEntityRelationshipId);

        sqlite3_bind_int64(stmt, 3, _revEntityGUID);
        sqlite3_bind_int64(stmt, 4, _revRemoteEntityGUID);

        sqlite3_bind_int64(stmt, 5, _revEntitySubjectGUID);
        sqlite3_bind_int64(stmt, 6, _remoteRevevEntitySubjectGUID);
        sqlite3_bind_int64(stmt, 7, _revEntityTargetGUID);
        sqlite3_bind_int64(stmt, 8, _revRemoteEntityTargetGUID);
        sqlite3_bind_int(stmt, 9, revPersGetRelId(_revEntityRelationshipType));
        sqlite3_bind_int64(stmt, 10, _revTimeCreated);
        sqlite3_bind_int64(stmt, 11, _revTimePublished);
        sqlite3_bind_int64(stmt, 12, _revTimePublishedUpdated);
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

    const char *currTime = revGetCurrentTime();

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_RELATIONSHIPS_TABLE ("
            "REV_SUBJECT_GUID, "
            "REV_TARGET_GUID, "
            "REV_RELATIONSHIP_TYPE_VALUE_ID, "
            "REV_CREATED_DATE, "
            "REV_UPDATED_DATE) "
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
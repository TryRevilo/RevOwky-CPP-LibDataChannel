#include "rev_pers_rev_entity_metadata.h"

#include <android/log.h>
#include <stdio.h>
#include <string.h>

#include "../../rev_db_models/rev_entity_metadata.h"
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"

bool iterator_revPersSaveRevMetadata(void *data) {
    revPersSaveRevEntityMetadata((RevEntityMetadata *) data);
    return TRUE;
}

long revPersSaveRevMetadata(void *revEntityMetadataList) {
    list_for_each(revEntityMetadataList, iterator_revPersSaveRevMetadata);
    return 0;
}

long revPersSaveRevEntityMetadataJSONStr(const char *revEntityMetadataJSONStr) {
    RevEntityMetadata *revEntityMetadata = revJSONStrMetadataFiller(revEntityMetadataJSONStr);

    long revMetadataID = revPersSaveRevEntityMetadata(revEntityMetadata);

    return  revMetadataID;
}

long revPersSaveRevEntityMetadata(RevEntityMetadata *revEntityMetadata) {
    long revReturnVal;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    int _revResolveStatus = revEntityMetadata->_revResolveStatus;
    long metadataOwnerGUID = revEntityMetadata->_revMetadataEntityGUID;
    long _revRemoteMetadataId = revEntityMetadata->_revRemoteMetadataId;
    char *metadataName = revEntityMetadata->_revMetadataName;
    char *metadataValue = revEntityMetadata->_revMetadataValue;
    char *currTime = (char *) revGetCurrentTime();

    long _revTimeCreated = revCurrentTimestampMillSecs();
    long _revTimePublished = revEntityMetadata->_revTimePublished;
    long _revTimePublishedUpdated = revEntityMetadata->_revTimePublishedUpdated;

    if (metadataOwnerGUID < 1 || (metadataName[0] == '\0') || (metadataValue[0] == '\0')) {
        return -1;
    }

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_METADATA_TABLE"
            "( "
            "REV_RESOLVE_STATUS, "
            "METADATA_ENTITY_GUID, "
            "REMOTE_METADATA_ID, "
            "METADATA_NAME, "
            "METADATA_VALUE, "
            "CREATED_DATE, "
            "UPDATED_DATE,"
            "REV_CREATED_DATE, "
            "REV_PUBLISHED_DATE, "
            "REV_UPDATED_DATE "
            " ) "
            "values"
            " ( "
            "@_revResolveStatus, @revEntityGUID, @_revRemoteMetadataId, @metadataName, @metadataValue, @createdTime, @updatedTime, @_revTimeCreated, @_revTimePublished, @_revTimePublishedUpdated"
            " ) ";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        int _revResolveStatus_idx = sqlite3_bind_parameter_index(stmt, "@_revResolveStatus");
        sqlite3_bind_int(stmt, _revResolveStatus_idx, _revResolveStatus);

        int revEntityOwnerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int64(stmt, revEntityOwnerGUID_idx, metadataOwnerGUID);

        int _revRemoteMetadataId_idx = sqlite3_bind_parameter_index(stmt, "@_revRemoteMetadataId");
        sqlite3_bind_int64(stmt, _revRemoteMetadataId_idx, _revRemoteMetadataId);

        int metadataName_idx = sqlite3_bind_parameter_index(stmt, "@metadataName");
        sqlite3_bind_text(stmt, metadataName_idx, metadataName, -1, SQLITE_STATIC);

        int metadataValue_idx = sqlite3_bind_parameter_index(stmt, "@metadataValue");
        sqlite3_bind_text(stmt, metadataValue_idx, metadataValue, -1, SQLITE_STATIC);

        int createdTime_idx = sqlite3_bind_parameter_index(stmt, "@createdTime");
        sqlite3_bind_text(stmt, createdTime_idx, currTime, -1, SQLITE_STATIC);

        int updatedTime_idx = sqlite3_bind_parameter_index(stmt, "@updatedTime");
        sqlite3_bind_text(stmt, updatedTime_idx, currTime, -1, SQLITE_STATIC);

        int _revTimeCreated_idx = sqlite3_bind_parameter_index(stmt, "@_revTimeCreated");
        sqlite3_bind_int64(stmt, _revTimeCreated_idx, _revTimeCreated);

        int _revTimePublished_idx = sqlite3_bind_parameter_index(stmt, "@_revTimePublished");
        sqlite3_bind_int64(stmt, _revTimePublished_idx, _revTimePublished);

        int _revTimePublishedUpdated_idx = sqlite3_bind_parameter_index(stmt, "@_revTimePublishedUpdated");
        sqlite3_bind_int64(stmt, _revTimePublishedUpdated_idx, _revTimePublishedUpdated);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersSaveRevEntityMetadata %s", sqlite3_errmsg(db));

        revReturnVal = -1;
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

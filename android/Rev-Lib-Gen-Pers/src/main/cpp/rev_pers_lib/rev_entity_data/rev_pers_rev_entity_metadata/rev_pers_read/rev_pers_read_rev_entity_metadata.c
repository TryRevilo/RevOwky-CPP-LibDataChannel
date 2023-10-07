//
// Created by rev on 8/10/18.
//
#include "rev_pers_read_rev_entity_metadata.h"

#include <stddef.h>
#include <string.h>
#include <android/log.h>

#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_db_models/rev_entity_metadata.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"

char *getMetadataValue_By_MetadataId(long metadataId) {
    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, metadataId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: getMetadataValue_By_MetadataId %s", sqlite3_errmsg(db));
    }

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 0));
        return metadataValue;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

long revGetRevEntityMetadataId_By_RevMetadataName_RevEntityGUID(char *revMetadataName, long revEntityGUID) {
    long revMetadataId = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_NAME = ? AND METADATA_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revMetadataName, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadataValueId_By_RevMetadataName_RevEntityGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revMetadataId = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revMetadataId;
}

char *revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(char *revMetadataName, long revEntityGUID) {
    char *metadataValue = "";

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_ENTITY_GUID = ? AND METADATA_NAME = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *) revMetadataName, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        metadataValue = strdup((const char *) sqlite3_column_text(stmt, 0));
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return metadataValue;
}

RevEntityMetadata revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(char *_revMetadataName, long revEntityGUID) {
    RevEntityMetadata revEntityMetadata = *revInitializedMetadata();

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_NAME, "
                "METADATA_VALUE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_ENTITY_GUID = ? AND METADATA_NAME = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *) _revMetadataName, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        char *revMetadataName = strdup((const char *) sqlite3_column_text(stmt, 1));
        char *revMetadataValue = strdup((const char *) sqlite3_column_text(stmt, 2));
        long revTimeCreated = sqlite3_column_int64(stmt, 3);

        revEntityMetadata._revMetadataID = metadataId;
        revEntityMetadata._revMetadataEntityGUID = revEntityGUID;
        revEntityMetadata._revMetadataName = revMetadataName;
        revEntityMetadata._revMetadataValue = revMetadataValue;
        revEntityMetadata._revTimeCreated = revTimeCreated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityMetadata;
}

void revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(list *revList, long revEntityGUID) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_NAME, "
                "METADATA_VALUE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityRevEntityMetadataByOwnerGUID %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 1));
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 2));
        long _revTimeCreated = sqlite3_column_int64(stmt, 3);

        RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));

        revEntityMetadata->_revMetadataID = metadataId;
        revEntityMetadata->_revMetadataName = metadataName;
        revEntityMetadata->_revMetadataValue = metadataValue;
        revEntityMetadata->_revMetadataEntityGUID = revEntityGUID;
        revEntityMetadata->_revTimeCreated = _revTimeCreated;

        list_append(revList, revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityMetadataByResolveStatus(list *revList, int revResolveStatus) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_ENTITY_GUID, "
                "METADATA_NAME, "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataByResolveStatus %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 1);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 3));

        RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));
        revEntityMetadata->_revMetadataID = metadataId;
        revEntityMetadata->_revMetadataEntityGUID = metadataOwnerGUID;
        revEntityMetadata->_revMetadataName = metadataName;
        revEntityMetadata->_revMetadataValue = metadataValue;

        list_append(revList, revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityMetadataId_By_revMetadataName_revResolveStatus(list *revList, char *metadataName, int revResolveStatus) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_NAME = ? AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) metadataName, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadata_By_revMetadataName_revResolveStatus %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityMetadataIds_By_ResStatus(list *revList, int revResolveStatus) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataIds_By_ResStatus %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName(list *revList, int revResolveStatus, char *revMetadataName) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "REMOTE_METADATA_ID, "
                "METADATA_ENTITY_GUID, "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND METADATA_NAME = ? LIMIT 12";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);
    sqlite3_bind_text(stmt, 2, (const char *) revMetadataName, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long revRemoteRevMetadataId = sqlite3_column_int64(stmt, 1);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 2);

        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 3));

        RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));
        revEntityMetadata->_revMetadataID = metadataId;
        revEntityMetadata->_revRemoteMetadataId = revRemoteRevMetadataId;
        revEntityMetadata->_revMetadataEntityGUID = metadataOwnerGUID;

        revEntityMetadata->_revMetadataName = revMetadataName;
        revEntityMetadata->_revMetadataValue = metadataValue;

        list_append(revList, revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityMetadataIds_By_RevEntityGUID(list *revList, long revEntityGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataIds_By_RevEntityGUID %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: -revPersGetALLRevEntityMetadataIds_By_RevEntityGUID %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

void revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(list *revList, int revResolveStatus, long revEntityGUID) {
    list_new(revList, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "REV_RESOLVE_STATUS = ? AND METADATA_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revResolveStatus);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(revList, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(char *revMetadataName, char *revMetadataValue) {
    RevEntityMetadata revEntityMetadata = *revInitializedMetadata();

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_ENTITY_GUID "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_NAME = ? AND METADATA_VALUE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revMetadataName, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, (const char *) revMetadataValue, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadata_By_revMetadataName_revMetadataValue %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long revEntityGUID = sqlite3_column_int64(stmt, 1);

        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> metadataId %ld", metadataId);

        revEntityMetadata._revMetadataID = metadataId;
        revEntityMetadata._revMetadataName = revMetadataName;
        revEntityMetadata._revMetadataValue = revMetadataValue;
        revEntityMetadata._revMetadataEntityGUID = revEntityGUID;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityMetadata;
}

RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID(char *revMetadataName, char *revMetadataValue, long revEntityGUID) {
    RevEntityMetadata revEntityMetadata = *revInitializedMetadata();

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_NAME = ? AND METADATA_VALUE = ? AND METADATA_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revMetadataName, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, (const char *) revMetadataValue, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 3, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);

        revEntityMetadata._revMetadataID = metadataId;
        revEntityMetadata._revMetadataEntityGUID = revEntityGUID;
        revEntityMetadata._revMetadataName = revMetadataName;
        revEntityMetadata._revMetadataValue = revMetadataValue;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityMetadata;
}

long revGetRevEntityMetadataOwnerGUID_By_revMetadataName_revMetadataValue(char *revMetadataName, char *revMetadataValue) {
    long revEntityGUID = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ENTITY_GUID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_NAME = ? AND METADATA_VALUE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revMetadataName, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, (const char *) revMetadataValue, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadataOwnerGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

long revGetRevEntityMetadataOwnerGUID(long metadataId) {
    long revEntityGUID = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ENTITY_GUID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, metadataId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revGetRevEntityMetadataOwnerGUID %s", sqlite3_errmsg(db));
    }

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

void revPersGetALLRevEntityMetadataUnsynched(list *revList) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_ENTITY_GUID, "
                "METADATA_NAME, "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE REV_RESOLVE_STATUS = -1 LIMIT 12";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataUnsynched %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 1);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *metadataValue = malloc(sizeof(strdup((const char *) sqlite3_column_text(stmt, 3))));
        strcpy(metadataValue, strdup((const char *) sqlite3_column_text(stmt, 3)));

        RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));
        revEntityMetadata->_revMetadataID = metadataId;
        revEntityMetadata->_revMetadataEntityGUID = metadataOwnerGUID;
        revEntityMetadata->_revMetadataName = metadataName;

        if (metadataValue[0] == '\0') {
            strcpy(metadataValue, "rev_null_val");
        }
        revEntityMetadata->_revMetadataValue = metadataValue;

        list_append(revList, revEntityMetadata);

        free(metadataValue);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

RevEntityMetadata *revPersGetRevEntityMetadata_By_MetadataId(long long revMetadataId) {
    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_ENTITY_GUID, "
                "METADATA_NAME, "
                "METADATA_VALUE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_ID = ? ";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revMetadataId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataUnsynched %s", sqlite3_errmsg(db));
    }

    RevEntityMetadata revEntityMetadata = *revInitializedMetadata();

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 1);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *metadataValue = malloc(sizeof(strdup((const char *) sqlite3_column_text(stmt, 3))));
        strcpy(metadataValue, strdup((const char *) sqlite3_column_text(stmt, 3)));
        long _revTimeCreated = sqlite3_column_int64(stmt, 4);

        revEntityMetadata._revMetadataID = metadataId;
        revEntityMetadata._revMetadataEntityGUID = metadataOwnerGUID;
        revEntityMetadata._revMetadataName = metadataName;
        revEntityMetadata._revTimeCreated = _revTimeCreated;

        if (metadataValue[0] == '\0') {
            strcpy(metadataValue, "rev_null_val");
        }

        revEntityMetadata._revMetadataValue = metadataValue;

        free(metadataValue);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityMetadata;
}

void revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(list *revList, long revEntityGUID) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_NAME, "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE "
                "WHERE METADATA_ENTITY_GUID = ? AND REV_RESOLVE_STATUS = -1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 1));
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 2));

        RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));
        revEntityMetadata->_revMetadataID = metadataId;
        revEntityMetadata->_revMetadataName = metadataName;
        revEntityMetadata->_revMetadataValue = metadataValue;

        list_append(revList, revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}


void revPersGetALLRevEntityRevEntityMetadataBy_revMetadataName_OwnerGUID(list *revList, char *metadataName, long revEntityGUID) {
    list_new(revList, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_ENTITY_GUID = ? AND METADATA_NAME = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_text(stmt, 2, metadataName, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 0));

        RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));
        revEntityMetadata->_revMetadataName = metadataName;
        revEntityMetadata->_revMetadataValue = metadataValue;

        list_append(revList, revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
}

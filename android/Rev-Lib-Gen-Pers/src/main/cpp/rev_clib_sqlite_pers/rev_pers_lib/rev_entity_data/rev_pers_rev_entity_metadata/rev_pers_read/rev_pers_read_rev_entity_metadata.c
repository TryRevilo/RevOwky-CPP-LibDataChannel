//
// Created by rev on 8/10/18.
//

#include <stddef.h>
#include <string.h>
#include <android/log.h>

#include "rev_pers_read_rev_entity_metadata.h"
#include <rev_linked_list.h>
#include <sqlite3.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_db_models/rev_entity_metadata.h"
#include "../../rev_pers_rev_entity_metastrings/rev_pers_read/rev_pers_read_rev_entity_metastrings.h"

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

list *revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(long revEntityGUID) {

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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

        RevEntityMetadata revEntityMetadata;
        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataName = metadataName;
        revEntityMetadata._metadataValue = metadataValue;
        revEntityMetadata._metadataOwnerGUID = revEntityGUID;
        revEntityMetadata._revTimeCreated = _revTimeCreated;

        list_append(&list, &revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityMetadataByResolveStatus(int resolveStatus) {

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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

    sqlite3_bind_int(stmt, 1, resolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataByResolveStatus %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 1);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 3));

        RevEntityMetadata revEntityMetadata;
        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataOwnerGUID = metadataOwnerGUID;
        revEntityMetadata._metadataName = metadataName;
        revEntityMetadata._metadataValue = metadataValue;

        list_append(&list, &revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityMetadata_By_ResolveStatus_RevEntityGUID(int resolveStatus, long revEntityGUID) {

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID, "
                "METADATA_NAME, "
                "METADATA_VALUE "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_ENTITY_GUID = ? AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_int(stmt, 2, resolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr,
                "SQL error: revPersGetALLRevEntityMetadata_By_ResolveStatus_RevEntityGUID %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 1));
        char *metadataValue = strdup((const char *) sqlite3_column_text(stmt, 2));

        RevEntityMetadata revEntityMetadata;
        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataName = metadataName;
        revEntityMetadata._metadataValue = metadataValue;

        list_append(&list, &revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityMetadataId_By_metadataName_ResolveStatus(char *metadataName, int resolveStatus) {

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "METADATA_NAME = ? AND REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) metadataName, -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, resolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr,
                "SQL error: revPersGetALLRevEntityMetadata_By_metadataName_ResolveStatus %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityMetadataIds_By_ResStatus(int resolveStatus) {
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "REV_RESOLVE_STATUS = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);

    if (rc != SQLITE_OK) {
        fprintf(stderr,
                "SQL error: revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(int resolveStatus, long revEntityGUID) {
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "METADATA_ID "
                "FROM REV_ENTITY_METADATA_TABLE WHERE "
                "REV_RESOLVE_STATUS = ? AND METADATA_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);
    sqlite3_bind_int64(stmt, 2, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr,
                "SQL error: revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long revMetadataId = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revMetadataId);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

RevEntityMetadata revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(char *revMetadataName, char *revMetadataValue, long revEntityGUID) {
    __android_log_print(ANDROID_LOG_WARN, "MyApp", "revEntityGUID = %ld : revMetadataName %s -revMetadataValue %s", revEntityGUID, revMetadataName, revMetadataValue);

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
        fprintf(stderr, "SQL error: revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", "SQL error: revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID %s", sqlite3_errmsg(db));
    } else if (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);

        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataOwnerGUID = revEntityGUID;
        revEntityMetadata._metadataName = revMetadataName;
        revEntityMetadata._metadataValue = revMetadataValue;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityMetadata;
}

long revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(char *revMetadataName, char *revMetadataValue) {
    long revEntityGUID = -1;

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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

list *revPersGetALLRevEntityMetadataUnsynched() {

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataUnsynched %s",
                sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 1);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *metadataValue = malloc(sizeof(strdup((const char *) sqlite3_column_text(stmt, 3))));
        strcpy(metadataValue, strdup((const char *) sqlite3_column_text(stmt, 3)));

        RevEntityMetadata revEntityMetadata;
        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataOwnerGUID = metadataOwnerGUID;
        revEntityMetadata._metadataName = metadataName;

        if (metadataValue[0] == '\0') {
            strcpy(metadataValue, "rev_null_val");
        }
        revEntityMetadata._metadataValue = metadataValue;

        list_append(&list, &revEntityMetadata);

        free(metadataValue);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
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
        fprintf(stderr, "SQL error: revPersGetALLRevEntityMetadataUnsynched %s",
                sqlite3_errmsg(db));
    }

    RevEntityMetadata revEntityMetadata;

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        long metadataId = sqlite3_column_int64(stmt, 0);
        long metadataOwnerGUID = sqlite3_column_int64(stmt, 1);
        char *metadataName = strdup((const char *) sqlite3_column_text(stmt, 2));
        char *metadataValue = malloc(sizeof(strdup((const char *) sqlite3_column_text(stmt, 3))));
        strcpy(metadataValue, strdup((const char *) sqlite3_column_text(stmt, 3)));
        long _revTimeCreated = sqlite3_column_int64(stmt, 4);

        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataOwnerGUID = metadataOwnerGUID;
        revEntityMetadata._metadataName = metadataName;
        revEntityMetadata._revTimeCreated = _revTimeCreated;

        if (metadataValue[0] == '\0') {
            strcpy(metadataValue, "rev_null_val");
        }

        revEntityMetadata._metadataValue = metadataValue;

        free(metadataValue);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityMetadata;
}

list *revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(long revEntityGUID) {
    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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

        RevEntityMetadata revEntityMetadata;
        revEntityMetadata._metadataId = metadataId;
        revEntityMetadata._metadataName = metadataName;
        revEntityMetadata._metadataValue = metadataValue;

        list_append(&list, &revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}


list *revPersGetALLRevEntityRevEntityMetadataBy_MetadataName_OwnerGUID(char *metadataName, long revEntityGUID) {

    list list;
    list_new(&list, sizeof(RevEntityMetadata), NULL);

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

        RevEntityMetadata revEntityMetadata;
        revEntityMetadata._metadataName = metadataName;
        revEntityMetadata._metadataValue = metadataValue;

        list_append(&list, &revEntityMetadata);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

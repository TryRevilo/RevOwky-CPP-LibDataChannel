//
// Created by rev on 8/10/18.
//
#include "rev_pers_read_rev_entity_metastrings.h"

#include <stddef.h>
#include <string.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

char *getRevEntityMetaStringById(long id) {
    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_METASTRING_VALUE " \
            "FROM REV_ENTITY_METASTRINGS_TABLE WHERE " \
            "REV_METASTRING_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, id);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        char *metaStringValue = strdup((const char *) sqlite3_column_text(stmt, 0));

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return metaStringValue;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

long getRevEntityMetaStringValueId(char *revMetastringValue) {
    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_METASTRING_ID "
                "FROM REV_ENTITY_METASTRINGS_TABLE WHERE "
                "REV_METASTRING_VALUE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, revMetastringValue, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        long revMetastringValueId = sqlite3_column_int64(stmt, 0);

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return revMetastringValueId;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return -1;
}

int revEntityMetastringExists(char *revMetastringValue) {
    int exists = -1;

    long revValueId = getRevEntityMetaStringValueId(revMetastringValue);

    if (revValueId > 0) {
        char *revDbValue = getRevEntityMetaStringById(revValueId);

        if (revDbValue[0] != '\0' && (strcmp(revDbValue, revMetastringValue) == 0))
            exists = 1;

    }

    return exists;
}

list *revPersGetALLRevEntityRevEntityMetastringIdByValue(char *metastringValue) {
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_METASTRING_ID " \
            "FROM REV_ENTITY_METASTRINGS_TABLE WHERE " \
            "REV_METASTRING_VALUE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, metastringValue, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long metadataValueId = sqlite3_column_int(stmt, 0);
        list_append(&list, &metadataValueId);

        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

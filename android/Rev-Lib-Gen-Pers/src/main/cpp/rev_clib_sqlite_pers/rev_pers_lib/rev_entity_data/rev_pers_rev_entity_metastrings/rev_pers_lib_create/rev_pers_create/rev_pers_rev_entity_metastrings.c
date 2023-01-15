#include <stdio.h>
#include <string.h>
#include <sqlite3.h>
#include "../../../../rev_db_init/rev_db_init.h"

long revPersRevEntityMetastrings(char *revEntityMetastring) {
    long revReturnVal = -1;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    int rc;
    char *szSQL;

    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_ENTITY_METASTRINGS_TABLE (" \
            "REV_METASTRING_VALUE, " \
            "REV_CREATED_DATE, " \
            "REV_UPDATED_DATE) " \
            "values (?, ?, ?)";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, (const char *) revEntityMetastring, -1, SQLITE_STATIC);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersRevEntityMetastrings %s", sqlite3_errmsg(db));

        revReturnVal = -1;
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

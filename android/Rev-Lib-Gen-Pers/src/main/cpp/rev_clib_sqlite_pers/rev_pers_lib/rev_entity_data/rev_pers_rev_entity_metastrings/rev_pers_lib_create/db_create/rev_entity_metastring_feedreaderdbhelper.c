#include <stdio.h>
#include <stdlib.h>
#include "rev_entity_metastring_feedreaderdbhelper.h"
#include <sqlite3.h>
#include "../../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_ENTITY_METASTRINGS() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_ENTITY_METASTRINGS_TABLE("
          "REV_RESOLVE_STATUS     INT     DEFAULT -1,"
          "REV_METASTRING_ID INTEGER PRIMARY KEY     AUTOINCREMENT,"
          "REV_METASTRING_VALUE            TEXT     NOT NULL,"
          "REV_CREATED_DATE INTEGER NOT NULL,"
          "REV_PUBLISHED_DATE INTEGER NOT NULL,"
          "REV_UPDATED_DATE INTEGER NOT NULL);";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Metadata Table created successfully\n");
    }
    sqlite3_close(db);

    return 0;
}

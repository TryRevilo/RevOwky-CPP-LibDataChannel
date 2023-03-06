#include <stdio.h>
#include <stdlib.h>
#include "rev_user_entity_feedreaderdbhelper.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_USER_ENTITY() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_USER_ENTITY_TABLE("  \
          "REV_RESOLVE_STATUS     INT     DEFAULT -1," \
          "REV_ENTITY_GUID INTEGER PRIMARY KEY     NOT NULL," \
          "REV_OWNER_ENTITY_GUID     INTEGER     NOT NULL," \
          "REV_ENTITY_CONTAINER_GUID     INTEGER     NOT NULL," \
          "REV_REV_USER_EMAIL            TEXT     NOT NULL," \
          "REV_REV_USER_FULL_NAMES           TEXT    NOT NULL," \
          "REV_CREATED_DATE            TEXT     NOT NULL," \
          "REV_UPDATED_DATE           TEXT     NOT NULL);";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "GROUP Table created successfully\n");
    }
    sqlite3_close(db);

    return 0;
}

#include <stdio.h>
#include <stdlib.h>

#include "rev_entity_feedreaderdbhelper.h"
#include <sqlite3.h>
#include "../../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_ENTITY() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_ENTITY_TABLE("
          "REV_RESOLVE_STATUS     INT     DEFAULT -1,"
          "REV_CHILDABLE_STATUS INT DEFAULT -1, "
          "REV_ENTITY_GUID INTEGER PRIMARY KEY     AUTOINCREMENT,"
          "REMOTE_REV_ENTITY_GUID     INTEGER     DEFAULT -1,"
          "REV_ENTITY_OWNER_GUID     INTEGER     NOT NULL,"
          "REV_ENTITY_CONTAINER_GUID     INTEGER     NOT NULL,"
          "REV_ENTITY_SITE_GUID     INTEGER     NOT NULL,"
          "REV_ENTITY_ACCESS_PERMISSION     INT     NOT NULL,"
          "REV_ENTITY_TYPE            TEXT     NOT NULL,"
          "REV_ENTITY_SUB_TYPE           TEXT    NOT NULL,"
          "REV_CREATED_DATE            INTEGER     NOT NULL,"
          "REV_PUBLISHED_DATE            INTEGER     NOT NULL,"
          "REV_UPDATED_DATE           INTEGER     NOT NULL);";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Table created successfully\n");
    }
    sqlite3_close(db);

    return 0;
}

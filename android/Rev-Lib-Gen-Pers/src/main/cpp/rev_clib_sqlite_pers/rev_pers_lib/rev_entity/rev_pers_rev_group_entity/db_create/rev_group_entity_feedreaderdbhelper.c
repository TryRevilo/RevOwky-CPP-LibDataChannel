#include <stdio.h>
#include <stdlib.h>

#include "rev_group_entity_feedreaderdbhelper.h"
#include <sqlite3.h>
#include "../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_GROUP_ENTITY() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_GROUP_ENTITY("  \
          "REV_RESOLVE_STATUS     INT     DEFAULT -1," \
          "COLUMN_REV_GROUP_ENTITY_GUID INTEGER PRIMARY KEY," \
          "COLUMN_REV_GROUP_ENTITY_OWNER_GUID     INTEGER     NOT NULL," \
          "COLUMN_REV_GROUP_ENTITY_CONTAINER_GUID     INTEGER     NOT NULL," \
          "COLUMN_REV_GROUP_ENTITY_NAME            TEXT     NOT NULL," \
          "COLUMN_REV_GROUP_ENTITY_DESCRIPTION           TEXT    NOT NULL," \
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

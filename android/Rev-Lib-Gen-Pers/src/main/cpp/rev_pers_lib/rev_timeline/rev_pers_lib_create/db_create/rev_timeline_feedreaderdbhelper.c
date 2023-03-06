#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>

#include "rev_timeline_feedreaderdbhelper.h"
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_TIMELINE() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_TIMELINE_TABLE("  \
          "ID INTEGER PRIMARY KEY     AUTOINCREMENT," \
          "REV_ENTITY_GUID INTEGER NOT NULL," \
          "REMOTE_REV_ENTITY_GUID INTEGER NOT NULL," \
          "REV_ENTITY_OWNER_GUID     INTEGER     NOT NULL," \
          "REV_ENTITY_CONTAINER_GUID     INTEGER     NOT NULL," \
          "REV_ENTITY_SITE_GUID     INTEGER     NOT NULL," \
          "REV_ENTITY_ACCESS_PERMISSION     INT     NOT NULL," \
          "REV_READ_STATUS     INT     NOT NULL," \
          "REV_LOCAL_RESOLVE_STATUS     INT     NOT NULL," \
          "REV_REMOTE_RESOLVE     INT     NOT NULL," \
          "REV_TIMELINE_ITEM_TYPE            TEXT     NOT NULL," \
          "REV_TIMELINE_ITEM_SUB_TYPE           TEXT    NOT NULL," \
          "REV_CREATED_DATE            TEXT     NOT NULL," \
          "REV_UPDATED_DATE           TEXT     NOT NULL);";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Rev TimelineTable ERR %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Table created successfully\n");
        __android_log_write(ANDROID_LOG_ERROR, "MyApp", "Rev TimelineTable created successfully\n");
    }
    sqlite3_close(db);

    return 0;
}

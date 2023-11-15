#include "rev_entity_metadata_feedreaderdbhelper.h"

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"

int revTableCreate_REV_ENTITY_METADATA() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_ENTITY_METADATA_TABLE("
          "REV_RESOLVE_STATUS     INT     DEFAULT -1,"
          "METADATA_ID   INTEGER PRIMARY     KEY     AUTOINCREMENT,"
          "REMOTE_METADATA_ID     INT     DEFAULT -1,"
          "METADATA_ENTITY_GUID   INTEGER      NOT NULL,"
          "METADATA_NAME     TEXT     NOT NULL,"
          "METADATA_VALUE     TEXT     NOT NULL,"
          "REV_CREATED_DATE INTEGER NOT NULL,"
          "REV_PUBLISHED_DATE INTEGER NOT NULL,"
          "REV_UPDATED_DATE INTEGER NOT NULL);";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);

        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Metadata Table created successfully\n");
    }
    sqlite3_close(db);

    return 0;
}
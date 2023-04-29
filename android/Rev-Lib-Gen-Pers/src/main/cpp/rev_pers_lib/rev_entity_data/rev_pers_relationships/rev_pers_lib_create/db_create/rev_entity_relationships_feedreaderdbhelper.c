#include "rev_entity_relationships_feedreaderdbhelper.h"

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>
#include "rev_entity_relationships_feedreaderdbhelper.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_ENTITY_RELATIONSHIPS()
{

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_ENTITY_RELATIONSHIPS_TABLE("
          "REV_RESOLVE_STATUS     INT     DEFAULT -1,"
          "REMOTE_RELATIONSHIP_ID     INT     DEFAULT -1,"
          "REV_RELATIONSHIP_ID INTEGER PRIMARY KEY     AUTOINCREMENT,"
          "REV_ENTITY_GUID INTEGER      DEFAULT -1,"
          "REMOTE_REV_ENTITY_GUID INTEGER      DEFAULT -1,"
          "REV_SUBJECT_GUID INTEGER      NOT NULL,"
          "REV_REMOTE_SUBJECT_GUID INTEGER      DEFAULT -1,"
          "REV_TARGET_GUID INTEGER      NOT NULL,"
          "REV_REMOTE_TARGET_GUID INTEGER      DEFAULT -1,"
          "REV_RELATIONSHIP_TYPE_VALUE_ID            INTEGER     NOT NULL,"
          "REV_CREATED_DATE INTEGER NOT NULL,"
          "REV_PUBLISHED_DATE INTEGER NOT NULL,"
          "REV_UPDATED_DATE INTEGER NOT NULL);";

    // sql = "ALTER TABLE REV_ENTITY_RELATIONSHIPS_TABLE ADD COLUMN REMOTE_REV_ENTITY_GUID INTEGER      DEFAULT -1;";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> revTableCreate_REV_ENTITY_RELATIONSHIPS -ERR %s", zErrMsg);
        sqlite3_free(zErrMsg);
    }
    else
    {
        fprintf(stdout, "Relationship Table created successfully\n");
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> Relationship Table created successfully");
    }
    sqlite3_close(db);

    return 0;
}

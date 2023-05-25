//
// Created by rev on 8/21/18.
//
#include "rev_entity_annotation_feedreaderdbhelper.h"

#include <android/log.h>
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"

int revTableCreate_REV_ENTITY_ANNOTATIONS() {

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char const *sql;

    /* Create SQL statement */
    sql = "CREATE TABLE IF NOT EXISTS REV_ENTITY_ANNOTATIONS_TABLE("
          "REV_RESOLVE_STATUS     INT     DEFAULT -1,"
          "ID INTEGER PRIMARY KEY     AUTOINCREMENT,"
          "REMOTE_ANNOTATION_ID INTEGER DEFAULT -1,"
          "ANNOTATION_NAME_ID INT NOT NULL,"
          "ANNOTATION_VALUE     TEXT NOT NULL,"
          "REV_ENTITY_GUID     INTEGER  NOT NULL,"
          "REMOTE_REV_ENTITY_GUID     INTEGER  DEFAULT -1,"
          "REV_ENTITY_OWNER_GUID     INTEGER  NOT NULL,"
          "REMOTE_REV_ENTITY_OWNER_GUID     INTEGER  DEFAULT -1,"
          "CREATED_DATE            TEXT,"
          "UPDATED_DATE           TEXT,"
          "REV_CREATED_DATE INTEGER DEFAULT -1,"
          "REV_PUBLISHED_DATE INTEGER DEFAULT -1,"
          "REV_UPDATED_DATE INTEGER DEFAULT -1);";

    /* Execute SQL statement */
    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "RevAnn Table created successfully\n");
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "RevAnn Table created successfully\n");
    }
    sqlite3_close(db);

    return 0;
}
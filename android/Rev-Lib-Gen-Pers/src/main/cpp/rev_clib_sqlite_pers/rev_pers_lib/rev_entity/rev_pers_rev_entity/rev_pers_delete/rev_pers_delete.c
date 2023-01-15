//
// Created by rev on 1/1/19.
//

#include <android/log.h>
#include <sqlite3.h>
#include "../../../rev_db_init/rev_db_init.h"
#include "../rev_pers_update/rev_pers_update.h"

int deleteRevEntityByEntityGUID(long revEntityGUID) {

    setmarkForDeleteByRevEntityGUID(revEntityGUID);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "DELETE from REV_ENTITY_TABLE WHERE REV_ENTITY_GUID = ?; ";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, 83);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));

        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR The value of n is %d", revEntityGUID);
    } else {
        // commit
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
        sqlite3_close(db);

        __android_log_print(ANDROID_LOG_WARN, "MyApp", "The value of n is %d", revEntityGUID);

        return 555;
    }

    return -1;
}

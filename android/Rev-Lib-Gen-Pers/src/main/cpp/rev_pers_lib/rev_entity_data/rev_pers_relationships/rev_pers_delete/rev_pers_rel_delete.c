//
// Created by rev on 1/1/19.
//

#include <android/log.h>
#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../rev_db_init/rev_db_init.h"

int deleteRevRel_By_Unset_Subject_Target_GUID(long revUnsetRelEntityGUID, long revUnsetRelEntityRemoteGUID) {
    int revDelStatus = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "DELETE FROM REV_ENTITY_RELATIONSHIPS_TABLE WHERE REV_TARGET_GUID = ? AND REV_REMOTE_TARGET_GUID = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int(stmt, 1, revUnsetRelEntityGUID);
    sqlite3_bind_int(stmt, 2, revUnsetRelEntityRemoteGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));

        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR deleteRevRel_By_Unset_Subject_Target_GUID %s", sqlite3_errmsg(db));
    } else {
        // commit
        sqlite3_step(stmt);
        revDelStatus = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revDelStatus;
}

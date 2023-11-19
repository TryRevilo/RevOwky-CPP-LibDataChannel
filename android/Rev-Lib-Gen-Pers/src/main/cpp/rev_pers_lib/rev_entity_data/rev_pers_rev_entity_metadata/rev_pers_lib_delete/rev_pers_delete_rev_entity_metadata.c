//
// Created by rev on 5/26/23.
//

#include "rev_pers_delete_rev_entity_metadata.h"

#include <android/log.h>

#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../rev_db_init/rev_db_init.h"

int revDeleteEntityMetadata_By_ID(long _revId) {
    int revRetVal = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "DELETE from REV_ENTITY_METADATA_TABLE WHERE METADATA_ID = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int64(stmt, 1, _revId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR revDeleteEntityMetadata_By_ID %d", _revId);
    } else {
        sqlite3_step(stmt);
        revRetVal = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRetVal;
}
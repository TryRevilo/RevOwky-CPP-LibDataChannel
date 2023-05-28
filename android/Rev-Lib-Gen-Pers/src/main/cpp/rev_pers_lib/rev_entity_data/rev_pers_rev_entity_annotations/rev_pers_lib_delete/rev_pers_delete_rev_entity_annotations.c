//
// Created by rev on 5/26/23.
//

#include "rev_pers_delete_rev_entity_annotations.h"

#include <android/log.h>

#include "../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../rev_db_init/rev_db_init.h"

int revDeleteEntityAnnotation_By_AnnotationID(long revAnnotationID) {
    int revRetVal = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "DELETE from REV_ENTITY_ANNOTATIONS_TABLE WHERE ID = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);
    sqlite3_bind_int64(stmt, 1, revAnnotationID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "ERR revDeleteEntityAnnotation_By_AnnotationID %d", revAnnotationID);
    } else {
        // commit
        sqlite3_step(stmt);

        __android_log_print(ANDROID_LOG_WARN, "MyApp", "revDeleteEntityAnnotation_By_AnnotationID %d", revAnnotationID);

        revRetVal = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revRetVal;
}
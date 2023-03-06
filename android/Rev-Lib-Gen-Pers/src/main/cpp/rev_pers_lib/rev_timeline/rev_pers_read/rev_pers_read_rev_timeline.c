//
// Created by rev on 7/6/18.
//
#include "rev_pers_read_rev_timeline.h"

#include <stdio.h>
#include <string.h>
#include "../../rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../../rev_db_init/rev_db_init.h"
#include "../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../libs/sqlite3/include/sqlite3.h"
#include <unistd.h>
#include <stdlib.h>
#include <strings.h>

int revTimelineEntityExists_BY_RevEntityGUID(int revEntityGUID) {

    int exists = -1;

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT * " \
            "FROM REV_TIMELINE_TABLE WHERE " \
            "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {

        if (sqlite3_step(stmt) == SQLITE_ROW) {
            exists = 1;
        }
    }

    sqlite3_finalize(stmt);

    return exists;

}

list *revPersGetALLRevTimelineEntityUnResolved() {

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID " \
                "FROM REV_TIMELINE_TABLE WHERE " \
                "REV_REMOTE_RESOLVE < ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, 0);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    while (rc == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int(stmt, 0);
        list_append(&list, &revEntityGUID);
        rc = sqlite3_step(stmt);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}


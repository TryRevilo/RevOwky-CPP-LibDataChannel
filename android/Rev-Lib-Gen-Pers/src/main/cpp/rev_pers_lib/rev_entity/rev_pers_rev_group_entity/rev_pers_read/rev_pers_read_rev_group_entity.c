//
// Created by rev on 7/23/18.
//

#include <stdio.h>
#include <string.h>
#include "rev_pers_read_rev_group_entity.h"
#include "../../../rev_db_init/rev_db_init.h"
#include "../../rev_pers_rev_entity/rev_db_models/rev_entity.h"

RevGroupEntity revPersGet_RevEntityGroupByGUID(long revEntityGUID) {

    RevGroupEntity revGroupEntity;

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
            "COLUMN_REV_GROUP_ENTITY_OWNER_GUID, " \
            "COLUMN_REV_GROUP_ENTITY_CONTAINER_GUID, " \
            "COLUMN_REV_GROUP_ENTITY_NAME, " \
            "COLUMN_REV_GROUP_ENTITY_DESCRIPTION, " \
            "REV_CREATED_DATE, " \
            "REV_UPDATED_DATE " \
            "FROM REV_GROUP_ENTITY WHERE " \
            "COLUMN_REV_GROUP_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        return revGroupEntity;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {

        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 0);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 1);

        char *revEntityName = strdup((const char *) sqlite3_column_text(stmt, 2));

        if ((revEntityName != NULL) && (revEntityName[0] == '\0'))
            revEntityName = strdup("NAME UNSET");

        char *revEntityDesc = strdup((const char *) sqlite3_column_text(stmt, 3));

        if ((revEntityDesc != NULL) && (revEntityDesc[0] == '\0'))
            revEntityDesc = strdup("DESC UNSET");

        char *timeCreated = strdup((const char *) sqlite3_column_text(stmt, 4));
        char *timeUpdated = strdup((const char *) sqlite3_column_text(stmt, 5));

        revGroupEntity._revEntityGUID = revEntityGUID;
        revGroupEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revGroupEntity._revContainerEntityGUID = revContainerEntityGUID;
        revGroupEntity._name = revEntityName;
        revGroupEntity._description = revEntityDesc;
        revGroupEntity._timeCreated = timeCreated;
        revGroupEntity._timeUpdated = timeUpdated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revGroupEntity;
}


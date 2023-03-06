//
// Created by rev on 8/5/18.
//

#include <string.h>
#include "../../rev_db_models/rev_entity_object.h"
#include "../../../../rev_db_init/rev_db_init.h"

RevObjectEntity revPersGet_RevObjectEntityByGUID(long revEntityGUID) {

    RevObjectEntity revObjectEntity;

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
            "REV_OWNER_ENTITY_GUID, " \
            "REV_ENTITY_CONTAINER_GUID, " \
            "REV_REV_OBJJECT_NAME, " \
            "REV_REV_OBJJECT_DESCRIPTION, " \
            "REV_CREATED_DATE, " \
            "REV_UPDATED_DATE " \
            "FROM REV_OBJECT_ENTITY_TABLE WHERE " \
            "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        return revObjectEntity;
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

        revObjectEntity._revEntityGUID = revEntityGUID;
        revObjectEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revObjectEntity._revContainerEntityGUID = revContainerEntityGUID;
        revObjectEntity._name = revEntityName;
        revObjectEntity._description = revEntityDesc;
        revObjectEntity._timeCreated = timeCreated;
        revObjectEntity._timeUpdated = timeUpdated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revObjectEntity;
}

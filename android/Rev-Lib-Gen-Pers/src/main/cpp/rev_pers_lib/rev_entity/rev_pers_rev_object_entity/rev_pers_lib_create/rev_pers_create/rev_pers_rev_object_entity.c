#include "rev_pers_rev_object_entity.h"

#include <stdio.h>
#include <string.h>
#include <android/log.h>

#include "../../rev_db_models/rev_entity_object.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"

long revPersSaveRevObjectEntity(RevObjectEntity *revObjectEntity) {
    long revReturnVal = -1;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    const char *currTime = revGetCurrentTime();

    long revEntityOwnerGUID = revObjectEntity->_revOwnerEntityGUID;
    long revEntityContainerGUID = revObjectEntity->_revContainerEntityGUID;

    char *revContainerEntityName;
    char *revContainerEntityDescription;

    if (revObjectEntity->_name[0] != '\0')
        revContainerEntityName = strdup(revObjectEntity->_name);

    if (revObjectEntity->_description[0] != '\0')
        revContainerEntityDescription = strdup(revObjectEntity->_description);

    int rc;
    char *szSQL;
    sqlite3_stmt *stmt;

    szSQL = "INSERT INTO REV_OBJECT_ENTITY_TABLE (" \
            "REV_ENTITY_GUID, " \
            "REV_OWNER_ENTITY_GUID, " \
            "REV_ENTITY_CONTAINER_GUID, " \
            "REV_REV_OBJJECT_NAME, " \
            "REV_REV_OBJJECT_DESCRIPTION, " \
            "REV_CREATED_DATE, " \
            "REV_UPDATED_DATE" \
            " ) " \
            " values (" \
            "@revEntityGUID, " \
            "@revEntityOwnerGUID, " \
            "@revEntityContainerGUID, " \
            "@revContainerEntityName, " \
            "@revContainerEntityDescription, " \
            "@timeCreated, " \
            "@timeUpdated);";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, 0);

    if (rc == SQLITE_OK) {
        int revEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int64(stmt, revEntityGUID_idx, revObjectEntity->_revEntityGUID);

        int revEntityOwnerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityOwnerGUID");
        sqlite3_bind_int64(stmt, revEntityOwnerGUID_idx, revEntityOwnerGUID);

        int revEntityContainerGUID_idx = sqlite3_bind_parameter_index(stmt,
                                                                      "@revEntityContainerGUID");
        sqlite3_bind_int64(stmt, revEntityContainerGUID_idx, revEntityContainerGUID);

        int revContainerEntityName_idx = sqlite3_bind_parameter_index(stmt,
                                                                      "@revContainerEntityName");
        sqlite3_bind_text(stmt, revContainerEntityName_idx, revContainerEntityName, -1,
                          SQLITE_STATIC);

        int revContainerEntityDescription_idx = sqlite3_bind_parameter_index(stmt,
                                                                             "@revContainerEntityDescription");
        sqlite3_bind_text(stmt, revContainerEntityDescription_idx, revContainerEntityDescription,
                          -1, SQLITE_STATIC);

        int timeCreated_idx = sqlite3_bind_parameter_index(stmt, "@timeCreated");
        sqlite3_bind_text(stmt, timeCreated_idx, currTime, -1, SQLITE_STATIC);

        int timeUpdated_idx = sqlite3_bind_parameter_index(stmt, "@timeUpdated");
        sqlite3_bind_text(stmt, timeUpdated_idx, currTime, -1, SQLITE_STATIC);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: revPersSaveRevObjectEntity %s", sqlite3_errmsg(db));

        revReturnVal = -1;
    } else {
        sqlite3_step(stmt);
        revReturnVal = sqlite3_last_insert_rowid(db);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

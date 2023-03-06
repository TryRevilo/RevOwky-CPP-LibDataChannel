#include "rev_pers_rev_user_entity.h"

#include <string.h>

#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../rev_pers_rev_entity/rev_pers_update/rev_pers_update.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"

long revPersSaveRevUserEntity(RevUserEntity *revUserEntity) {

    long revEntityGuid;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char *szSQL;

    const char *currTime = revGetCurrentTime();

    long revEntityOwnerGUID = revUserEntity->_revOwnerEntityGUID;
    long revEntityContainerGUID = revUserEntity->_revContainerEntityGUID;

    char *revUserEmail;
    char *revUserFullNames;

    if (revUserEntity->_email[0] != '\0')
        revUserEmail = strdup(revUserEntity->_email);

    if (revUserEntity->_full_names[0] != '\0')
        revUserFullNames = strdup(revUserEntity->_full_names);

    /* Create SQL statement */

    sqlite3_stmt *stmt;
    const char *pzTest;

    // Insert data item into myTable
    szSQL = "INSERT INTO REV_USER_ENTITY_TABLE (" \
            "REV_ENTITY_GUID, " \
            "REV_OWNER_ENTITY_GUID, " \
            "REV_ENTITY_CONTAINER_GUID, " \
            "REV_REV_USER_EMAIL, " \
            "REV_REV_USER_FULL_NAMES, " \
            "REV_CREATED_DATE, " \
            "REV_UPDATED_DATE" \
            " ) " \
            " values (" \
            "@revEntityGUID, " \
            "@revEntityOwnerGUID, " \
            "@revEntityContainerGUID, " \
            "@revUserEmail, " \
            "@revUserFullNames, " \
            "@timeCreated, " \
            "@timeUpdated);";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        // bind the value

        int revEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int64(stmt, revEntityGUID_idx, revUserEntity->_revEntityGUID);

        int revEntityOwnerGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityOwnerGUID");
        sqlite3_bind_int64(stmt, revEntityOwnerGUID_idx, revEntityOwnerGUID);

        int revEntityContainerGUID_idx = sqlite3_bind_parameter_index(stmt,
                                                                      "@revEntityContainerGUID");
        sqlite3_bind_int64(stmt, revEntityContainerGUID_idx, revEntityContainerGUID);

        int revEntityName = sqlite3_bind_parameter_index(stmt,
                                                         "@revUserEmail");
        sqlite3_bind_text(stmt, revEntityName, revUserEmail, -1,
                          SQLITE_STATIC);

        int revContainerEntityDescription_idx = sqlite3_bind_parameter_index(stmt,
                                                                             "@revUserFullNames");
        sqlite3_bind_text(stmt, revContainerEntityDescription_idx, revUserFullNames,
                          -1, SQLITE_STATIC);

        int timeCreated_idx = sqlite3_bind_parameter_index(stmt, "@timeCreated");
        sqlite3_bind_text(stmt, timeCreated_idx, currTime, -1, SQLITE_STATIC);

        int timeUpdated_idx = sqlite3_bind_parameter_index(stmt, "@timeUpdated");
        sqlite3_bind_text(stmt, timeUpdated_idx, currTime, -1, SQLITE_STATIC);

        // commit
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);

        revEntityGuid = sqlite3_last_insert_rowid(db);

        sqlite3_close(db);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Records created successfully\n");

        return revEntityGuid;
    }

    return 0;

}

#include <stdio.h>
#include <string.h>
#include "rev_db_models/rev_entity_group.h"
#include <sqlite3.h>
#include "../../../rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"
#include "../../rev_db_init/rev_db_init.h"

long revPersSaveRevGroupEntity(RevGroupEntity *revGroupEntity) {

    long revEntityGuid;

    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char *szSQL;

    char *currTime = revGetCurrentTime();

    long revEntityOwnerGUID = (long) revGroupEntity->_revOwnerEntityGUID;
    long revEntityContainerGUID = (long) revGroupEntity->_revContainerEntityGUID;

    char *revContainerEntityName;
    char *revContainerEntityDescription;

    if (revGroupEntity->_name[0] != '\0')
        revContainerEntityName = strdup(revGroupEntity->_name);

    if (revGroupEntity->_description[0] != '\0')
        revContainerEntityDescription = strdup(revGroupEntity->_description);

    /* Create SQL statement */

    sqlite3_stmt *stmt;
    const char *pzTest;

    // Insert data item into myTable
    szSQL = "INSERT INTO REV_GROUP_ENTITY (" \
            "COLUMN_REV_GROUP_ENTITY_GUID, " \
            "COLUMN_REV_GROUP_ENTITY_OWNER_GUID, " \
            "COLUMN_REV_GROUP_ENTITY_CONTAINER_GUID, " \
            "COLUMN_REV_GROUP_ENTITY_NAME, " \
            "COLUMN_REV_GROUP_ENTITY_DESCRIPTION, " \
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

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        // bind the value

        int revEntityGUID_idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int64(stmt, revEntityGUID_idx, revGroupEntity->_revEntityGUID);

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

long revPersUpdateRevContainerEntity(long revEntityGUID) {
    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char *szSQL;

    /* Create SQL statement */

    sqlite3_stmt *stmt;
    const char *pzTest;

    // Insert data item into myTable
    szSQL = "UPDATE REV_ENTITY_CONTAINER set REV_NAMES = 25000.00 where ID=@revEntityGUID;";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        // bind the value
        int idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int(stmt, idx, revEntityGUID);

        // commit
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Records UPDATED successfully\n");
        return sqlite3_last_insert_rowid(db);
    }

    sqlite3_close(db);

    return 0;
}

long revPersDeleteDataRevContainerEntity(long revEntityGUID) {
    sqlite3 *db = revDb();

    if (!db)
        return -1;

    char *zErrMsg = 0;
    int rc;
    char *szSQL;

    /* Create SQL statement */

    sqlite3_stmt *stmt;
    const char *pzTest;

    // Insert data item into myTable
    szSQL = "DELETE from REV_ENTITY_CONTAINER where ID=@revEntityGUID;";

    rc = sqlite3_prepare(db, szSQL, strlen(szSQL), &stmt, &pzTest);

    if (rc == SQLITE_OK) {
        // bind the value
        int idx = sqlite3_bind_parameter_index(stmt, "@revEntityGUID");
        sqlite3_bind_int(stmt, idx, revEntityGUID);

        // commit
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Records UPDATED successfully\n");
        return sqlite3_last_insert_rowid(db);
    }

    sqlite3_close(db);

    return 0;
}

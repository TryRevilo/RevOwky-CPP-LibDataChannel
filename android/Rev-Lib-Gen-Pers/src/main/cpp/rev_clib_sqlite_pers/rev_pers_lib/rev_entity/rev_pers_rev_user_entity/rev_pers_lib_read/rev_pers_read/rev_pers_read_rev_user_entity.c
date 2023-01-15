//
// Created by rev on 8/16/18.
//

#include <string.h>
#include <android/log.h>

#include "rev_pers_read_rev_user_entity.h"
#include "../../../rev_pers_rev_object_entity/rev_db_models/rev_entity_object.h"
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../rev_db_models/rev_entity_user.h"

RevUserEntity revPersGet_RevRevUserEntityByEmail_Phone(char *revEmailPhone) {

    RevUserEntity revUserEntity;
    revUserEntity._email = "NULL";

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
            "REV_ENTITY_GUID, " \
            "REV_OWNER_ENTITY_GUID, " \
            "REV_ENTITY_CONTAINER_GUID, " \
            "REV_REV_USER_EMAIL, " \
            "REV_REV_USER_FULL_NAMES " \
            "FROM REV_USER_ENTITY_TABLE WHERE " \
            "REV_REV_USER_EMAIL = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *) revEmailPhone, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));

        return revUserEntity;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);

        revEmailPhone = strdup((const char *) sqlite3_column_text(stmt, 3));
        char *revEntityName = strdup((const char *) sqlite3_column_text(stmt, 4));

        revUserEntity._revEntityGUID = revEntityGUID;
        revUserEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revUserEntity._revContainerEntityGUID = revContainerEntityGUID;
        revUserEntity._email = revEmailPhone;
        revUserEntity._full_names = revEntityName;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revUserEntity;
}

RevUserEntity revPersGet_RevRevUserEntityByRevEntityGUID(long revEntityUID) {

    RevUserEntity revUserEntity;

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
            "REV_ENTITY_GUID, " \
            "REV_OWNER_ENTITY_GUID, " \
            "REV_ENTITY_CONTAINER_GUID, " \
            "REV_REV_USER_EMAIL, " \
            "REV_REV_USER_FULL_NAMES " \
            "FROM REV_USER_ENTITY_TABLE WHERE " \
            "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        return revUserEntity;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW) {

        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);

        char *revEmailPhone = strdup((const char *) sqlite3_column_text(stmt, 3));
        char *revEntityName = strdup((const char *) sqlite3_column_text(stmt, 4));

        revUserEntity._revEntityGUID = revEntityGUID;
        revUserEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revUserEntity._revContainerEntityGUID = revContainerEntityGUID;
        revUserEntity._email = revEmailPhone;
        revUserEntity._full_names = revEntityName;

    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revUserEntity;
}
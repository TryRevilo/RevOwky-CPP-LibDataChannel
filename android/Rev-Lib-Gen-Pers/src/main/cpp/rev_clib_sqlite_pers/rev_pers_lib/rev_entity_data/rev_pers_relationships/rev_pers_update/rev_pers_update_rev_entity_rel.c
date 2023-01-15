//
// Created by rev on 12/14/18.
//

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>

#include <malloc.h>

#include <sqlite3.h>

#include "../../../rev_db_init/rev_db_init.h"
#include "../../../../rev_pers_libs_ext/libs_cust_rev/rev_gen_functions.h"

int revPersUpdateRelationshipValueId_By_RelId(long revEntityRelationshipId, long relationshipValueId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE " \
                "SET  REV_RELATIONSHIP_TYPE_VALUE_ID = ?, REV_UPDATED_DATE = ?" \
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, relationshipValueId);
    sqlite3_bind_text(stmt, 2, revGetCurrentTime(), -1, SQLITE_STATIC);

    char *currTime = revGetCurrentTime();
    sqlite3_bind_text(stmt, 5, currTime, -1, SQLITE_STATIC);

    sqlite3_bind_int(stmt, 6, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateRelationshipValueId_By_RelId %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateRelResStatus_By_RelId(long revEntityRelationshipId, int resolveStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE " \
                "SET  REV_RESOLVE_STATUS = ?, REV_UPDATED_DATE = ?" \
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);
    sqlite3_bind_text(stmt, 2, revGetCurrentTime(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateRelationshipResolveStatus_By_ValueId %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateRelResStatus_By_RemoteRelId(long revEntityRelationshipId, int resolveStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE "
                "SET  REV_RESOLVE_STATUS = ?"
                "WHERE REMOTE_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);
    sqlite3_bind_text(stmt, 2, revGetCurrentTime(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateRelationshipResolveStatus_By_ValueId %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateSetRemoteSubjectGUID(long localSubjectGUID, long remoteSubjectGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE " \
                "SET  REV_REMOTE_SUBJECT_GUID = ?" \
                "WHERE REV_SUBJECT_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, remoteSubjectGUID);
    sqlite3_bind_int(stmt, 2, localSubjectGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateSetRemoteSubjectGUID %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateSetRemoteSubjectGUID_By_RelId(long revRelId, long revRemoteSubjectGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE "
                "SET  REV_REMOTE_SUBJECT_GUID = ?"
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRemoteSubjectGUID);
    sqlite3_bind_int(stmt, 2, revRelId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateSetRemoteSubjectGUID %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateSetRemoteTarget_By_RelId(long revRelId, long revRemoteTargetGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE "
                "SET  REV_REMOTE_TARGET_GUID = ?"
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRemoteTargetGUID);
    sqlite3_bind_int(stmt, 2, revRelId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateSetRemoteSubjectGUID %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateSetRemoteTargetGUID(long localTargetGUID, long remoteTargetGUID) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE "
                "SET  REV_REMOTE_TARGET_GUID = ?"
                "WHERE REV_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, remoteTargetGUID);
    sqlite3_bind_int(stmt, 2, localTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateSetRemoteTargetGUID %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersSetRemoteRelationshipRemoteId(long revEntityRelationshipId, long revEntityRemoteRelationshipId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE " \
                "SET  REMOTE_RELATIONSHIP_ID = ? " \
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityRemoteRelationshipId);
    sqlite3_bind_int(stmt, 2, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersSetRemoteRelationshipRemoteId %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateSetRemoteRelationshipRemoteId_By_RevRelType_RemoteSubjectGUID_RemoteTarhetGUID(
    char *revEntityrelationship, long revRemoteSubjectGUID, long revRemoteTargetGUID, long revRemoteRelId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE "
                "SET  REMOTE_RELATIONSHIP_ID = ? "
                "WHERE REMOTE_RELATIONSHIP_ID = ? AND REV_REMOTE_SUBJECT_GUID = ? AND REV_REMOTE_TARGET_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRemoteRelId);
    sqlite3_bind_int(stmt, 2, getRevEntityMetaStringValueId(strdup(revEntityrelationship)));
    sqlite3_bind_int(stmt, 3, revRemoteSubjectGUID);
    sqlite3_bind_int(stmt, 4, revRemoteTargetGUID);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersSetRemoteRelationshipRemoteId %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId(long revEntityRelationshipId, long revEntityRemoteRelationshipId, int resolveStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE " \
                "SET  REMOTE_RELATIONSHIP_ID = ?, REV_RESOLVE_STATUS = ?" \
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityRemoteRelationshipId);
    sqlite3_bind_int(stmt, 2, resolveStatus);
    sqlite3_bind_int(stmt, 3, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersSetRemoteRelationshipResolved(long revEntityRelationshipId, long revEntityRemoteRelationshipId) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE " \
                "SET  REMOTE_RELATIONSHIP_ID = ?, REV_RESOLVE_STATUS = ?" \
                "WHERE REV_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityRemoteRelationshipId);
    sqlite3_bind_int(stmt, 2, 0);
    sqlite3_bind_int(stmt, 3, revEntityRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Error here revPersSetRemoteRelationshipResolved %s", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}

int revPersUpdateSetRelResStatus_By_RemoteRelId(long revEntityRemoteRelationshipId, int revRelResStatus) {
    int revReturnVal = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "UPDATE REV_ENTITY_RELATIONSHIPS_TABLE "
                "SET REV_RESOLVE_STATUS = ?"
                "WHERE REMOTE_RELATIONSHIP_ID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revRelResStatus);
    sqlite3_bind_int(stmt, 2, revEntityRemoteRelationshipId);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    } else {
        if (SQLITE_DONE != sqlite3_step(stmt)) {
            revReturnVal = -1;
        } else {
            revReturnVal = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revReturnVal;
}
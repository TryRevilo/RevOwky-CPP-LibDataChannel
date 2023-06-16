//
// Created by rev on 7/6/18.
//

#include "rev_pers_read.h"

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <strings.h>
#include <android/log.h>
#include "../../../../rev_db_init/rev_db_init.h"
#include "../../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../../libs/cJSON/cJSON.h"
#include "../../../../../../../../libs/rev_map/rev_map.h"

htable_strstr_t *revGetEntityDB_Keys()
{
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "_revEntityType", "REV_ENTITY_TYPE");
    htable_strstr_insert(revMap, "_revEntitySubType", "REV_ENTITY_SUB_TYPE");
    htable_strstr_insert(revMap, "_revEntityResolveStatus", "REV_RESOLVE_STATUS");
    htable_strstr_insert(revMap, "_revEntityChildableStatus", "REV_CHILDABLE_STATUS");
    htable_strstr_insert(revMap, "_revEntityAccessPermission", "REV_ENTITY_ACCESS_PERMISSION");
    htable_strstr_insert(revMap, "_revEntitySiteGUID", "REV_ENTITY_SITE_GUID");
    htable_strstr_insert(revMap, "_revEntityGUID", "REV_ENTITY_GUID");
    htable_strstr_insert(revMap, "_remoteRevEntityGUID", "REMOTE_REV_ENTITY_GUID");
    htable_strstr_insert(revMap, "_revOwnerEntityGUID", "REV_ENTITY_OWNER_GUID");
    htable_strstr_insert(revMap, "_revContainerEntityGUID", "REV_ENTITY_CONTAINER_GUID");
    htable_strstr_insert(revMap, "_revTimeCreated", "REV_CREATED_DATE");
    htable_strstr_insert(revMap, "_timeUpdated", "REV_UPDATED_DATE");
    htable_strstr_insert(revMap, "_revTimePublished", "REV_PUBLISHED_DATE");
    htable_strstr_insert(revMap, "revLimit", "LIMIT");

    return revMap;
}

htable_strstr_t *revGetMapped_Entity_Key_DBFieldName()
{
    htable_strstr_t *revMap;

    revMap = htable_strstr_create(HTABLE_STR_CASECMP);

    htable_strstr_insert(revMap, "REV_ENTITY_TYPE", "_revEntityType");
    htable_strstr_insert(revMap, "REV_ENTITY_SUB_TYPE", "_revEntitySubType");
    htable_strstr_insert(revMap, "REV_RESOLVE_STATUS", "_revEntityResolveStatus");
    htable_strstr_insert(revMap, "REV_CHILDABLE_STATUS", "_revEntityChildableStatus");
    htable_strstr_insert(revMap, "REV_ENTITY_ACCESS_PERMISSION", "_revEntityAccessPermission");
    htable_strstr_insert(revMap, "REV_ENTITY_SITE_GUID", "_revEntitySiteGUID");
    htable_strstr_insert(revMap, "REV_ENTITY_GUID", "_revEntityGUID");
    htable_strstr_insert(revMap, "REMOTE_REV_ENTITY_GUID", "_remoteRevEntityGUID");
    htable_strstr_insert(revMap, "REV_ENTITY_OWNER_GUID", "_revOwnerEntityGUID");
    htable_strstr_insert(revMap, "REV_ENTITY_CONTAINER_GUID", "_revContainerEntityGUID");
    htable_strstr_insert(revMap, "REV_CREATED_DATE", "_revTimeCreated");
    htable_strstr_insert(revMap, "REV_UPDATED_DATE", "_timeUpdated");
    htable_strstr_insert(revMap, "REV_PUBLISHED_DATE", "_revTimePublished");

    return revMap;
}

char *revGetWhere(const cJSON *revWhere_CJSON)
{
    char *revRetWhereStr = "*";

    // Iterate over the items in the object
    if (revWhere_CJSON != NULL && revWhere_CJSON->type == cJSON_Array)
    {
        int revArrSize = cJSON_GetArraySize(revWhere_CJSON);

        if (revArrSize == 0)
        {
            return revRetWhereStr;
        }

        revRetWhereStr = "";
        htable_strstr_t *revMap = revGetEntityDB_Keys();

        for (int i = 0; i < revArrSize; i++)
        {
            cJSON *revCurrArrayElement = cJSON_GetArrayItem(revWhere_CJSON, i);

            if (cJSON_IsString(revCurrArrayElement) && (revCurrArrayElement->valuestring != NULL))
            {
                char *revArrayElementVal = revCurrArrayElement->valuestring;

                if (revArrayElementVal == "*")
                {
                    return "*";
                }

                char *revArrayElementDBTableName = htable_strstr_get_direct(revMap, revArrayElementVal);

                if (i == 0)
                {
                    revRetWhereStr = revConcatStrings(revRetWhereStr, revArrayElementDBTableName);
                }
                else
                {
                    revRetWhereStr = revConcatStrings(revRetWhereStr, ", ");
                    revRetWhereStr = revConcatStrings(revRetWhereStr, revArrayElementDBTableName);
                }
            }
        }

        htable_strstr_destroy(revMap);
    }

    return revRetWhereStr;
}

list *revPersGetRevEntities_By_RevVarArgs(char *revVarArgs)
{
    htable_strstr_t *revMap = revGetEntityDB_Keys();
    htable_strstr_t *revMappedEntityColNameMap = revGetMapped_Entity_Key_DBFieldName();

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    char *revEntitySubType = "";

    char *sql = "SELECT ";

    // Parse the JSON string
    cJSON *revJSON = cJSON_Parse(revVarArgs);

    const cJSON *revSelectDistinct_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revDistinct");

    if (cJSON_IsNumber(revSelectDistinct_JSON) && (revSelectDistinct_JSON->valueint != NULL))
    {
        long revSelectDistinctVal = revSelectDistinct_JSON->valueint;

        if (revSelectDistinctVal == 1)
        {
            sql = revConcatStrings(sql, "DISTINCT ");
        }
    }

    const cJSON *revSelect_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revSelect");

    char *revSelectWhere = revGetWhere(revSelect_JSON);
    if (revSelectWhere[0] == '\0')
    {
        goto revEnd;
    }

    sql = revConcatStrings(sql, revSelectWhere);
    sql = revConcatStrings(sql, " FROM REV_ENTITY_TABLE WHERE ");

    const cJSON *revWhere_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revWhere");

    char **revTableRowsArr = NULL;

    int revStrArrLen = 0;
    char **revStrValsArr = NULL;

    int revIntArrLen = 0;
    int **revIntValsArr = NULL;

    char *revSQL = "";

    char *revIntWhereFields = "";
    int revIntWhereArrLen = 0;
    int **revIntWhereValsArr = NULL;

    char *rev_Int_OR_Str = "";
    char *rev_Str_OR_Str = "";

    if (cJSON_IsObject(revWhere_JSON))
    {
        // Iterate over the items in the object
        cJSON *revWhere;

        for (revWhere = revWhere_JSON->child; revWhere; revWhere = revWhere->next)
        {
            if (revWhere->type == cJSON_String)
            {
                // Handle string type
                char *revCurrKey = revWhere->string;
                char *revCurrVal = revWhere->valuestring;

                revEntitySubType = revCurrVal;

                char *revDBTableName = htable_strstr_get_direct(revMap, revCurrKey);
                if (revDBTableName)
                {
                    if (revSQL[0] == '\0')
                    {
                        revSQL = revConcatStrings(revSQL, revDBTableName);
                        revSQL = revConcatStrings(revSQL, " = ?");
                    }
                    else
                    {
                        revSQL = revConcatStrings(revSQL, " AND ");
                        revSQL = revConcatStrings(revSQL, revDBTableName);
                        revSQL = revConcatStrings(revSQL, " = ?");
                    }

                    // Add another element to the array
                    revStrArrLen++;
                    revStrValsArr = (char **)realloc(revStrValsArr, revStrArrLen * sizeof(char *));
                    revStrValsArr[revStrArrLen - 1] = strdup(revCurrVal);
                }
                else
                {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revEntitySubType value not found\n");
                }
            }
            else if (revWhere->type == cJSON_Array)
            {
                char *revCurr_OR_Str = "";
                char *revCurr_OR_Int = "";

                char *revArrDBTableName = revWhere->string;
                char *revArrayElementDBTableName = htable_strstr_get_direct(revMap, revArrDBTableName);

                // Handle array type
                int revArrSize = cJSON_GetArraySize(revWhere);

                for (int i = 0; i < revArrSize; i++)
                {
                    cJSON *revCurrArrayElement = cJSON_GetArrayItem(revWhere, i);

                    if (cJSON_IsString(revCurrArrayElement) && (revCurrArrayElement->valuestring != NULL))
                    {
                        if (i == 0 && revSQL[0] == '\0')
                        {
                            revCurr_OR_Str = "(";
                        }
                        else if (i == 0 && revCurr_OR_Str[0] == 0)
                        {
                            revCurr_OR_Str = " AND (";
                        }

                        char *revArrayElementVal = revCurrArrayElement->valuestring;

                        revStrArrLen++;
                        revStrValsArr = (char **)realloc(revStrValsArr, revStrArrLen * sizeof(char *));
                        revStrValsArr[revStrArrLen - 1] = revArrayElementVal;

                        if (i == 0)
                        {
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, revArrayElementDBTableName);
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, " = ?");
                        }
                        else
                        {
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, " OR ");
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, revArrayElementDBTableName);
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, " = ?");
                        }

                        if (i == revArrSize - 1)
                        {
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, ")");
                        }
                    }
                    else if (cJSON_IsNumber(revCurrArrayElement))
                    {
                        if (i == 0 && revSQL[0] == '\0')
                        {
                            revCurr_OR_Int = "(";
                        }
                        else if (i == 0 && revCurr_OR_Str[0] == '\0')
                        {
                            revCurr_OR_Int = " AND (";
                        }

                        int revArrayElementVal = revCurrArrayElement->valueint;

                        revIntArrLen++;
                        revIntValsArr = (int **)realloc(revIntValsArr, revIntArrLen * sizeof(int *));
                        revIntValsArr[revIntArrLen - 1] = revArrayElementVal;

                        if (i == 0)
                        {
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, revArrayElementDBTableName);
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, " = ?");
                        }
                        else
                        {
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, " OR ");
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, revArrayElementDBTableName);
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, " = ?");
                        }

                        if (i == revArrSize - 1)
                        {
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, ")");
                        }
                    }
                }

                rev_Str_OR_Str = revConcatStrings(rev_Str_OR_Str, revCurr_OR_Str);
                rev_Int_OR_Str = revConcatStrings(rev_Int_OR_Str, revCurr_OR_Int);
            }
            else if (cJSON_IsNumber(revWhere) && (revWhere->valueint != NULL))
            {
                // Handle string type
                char *revCurrKey = revWhere->string;
                char *revCurrIntVal = revWhere->valueint;

                char *revDBTableName = htable_strstr_get_direct(revMap, revCurrKey);

                if (revDBTableName[0] != '\0')
                {
                    if (revIntWhereFields[0] == '\0')
                    {
                        revIntWhereFields = revConcatStrings(revIntWhereFields, revDBTableName);
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " = ?");
                    }
                    else
                    {
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " AND ");
                        revIntWhereFields = revConcatStrings(revIntWhereFields, revDBTableName);
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " = ?");
                    }

                    // Add another element to the array>>
                    revIntWhereArrLen++;
                    revIntWhereValsArr = (int **)realloc(revIntWhereValsArr, revIntWhereArrLen * sizeof(int *));
                    revIntWhereValsArr[revIntWhereArrLen - 1] = revCurrIntVal;
                }
                else
                {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revEntitySubType value not found\n");
                }
            }
            else if (revWhere->type == cJSON_Object)
            {
                // Handle object type
            }
        }
    }

    revSQL = revConcatStrings(revSQL, rev_Str_OR_Str);
    revSQL = revConcatStrings(revSQL, rev_Int_OR_Str);

    sql = revConcatStrings(sql, revSQL);

    if (revIntWhereFields[0] != '\0')
    {
        if (revSelectWhere[0] == '\0')
        {
            sql = revConcatStrings(sql, revIntWhereFields);
        }
        else
        {
            sql = revConcatStrings(sql, " AND ");
            sql = revConcatStrings(sql, revIntWhereFields);
        }
    }

    // sql = revConcatStrings(sql, " ORDER BY REV_ENTITY_GUID DESC");
    sql = revConcatStrings(sql, " LIMIT ?");

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare(db, sql, -1, &stmt, NULL);

    int revBoundCount = 0;

    for (int i = 0; i < revStrArrLen; i++)
    {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_text(stmt, revBoundCount, (const char *)revStrValsArr[i], -1, SQLITE_STATIC);
    }

    for (int i = 0; i < revIntArrLen; i++)
    {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_int64(stmt, revBoundCount, revIntValsArr[i]);
    }

    for (int i = 0; i < revIntWhereArrLen; i++)
    {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_int64(stmt, revBoundCount, (long)revIntWhereValsArr[i]);
    }

    int revLimit = 10;

    // LIMIT
    const cJSON *revLimit_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revLimit");
    if (cJSON_IsNumber(revLimit_JSON) && (revLimit_JSON->valueint > 0))
    {
        revLimit = revLimit_JSON->valueint;
    }

    sqlite3_bind_int(stmt, 1 + revBoundCount, revLimit);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    int num_cols = 0;
    char **col_names = NULL;

    if (rc == SQLITE_OK)
    {
        num_cols = sqlite3_column_count(stmt);

        __android_log_print(ANDROID_LOG_WARN, "MyApp", "num_cols : %d\n", num_cols);

        col_names = (char **)malloc(num_cols * sizeof(char *));

        for (int i = 0; i < num_cols; i++)
        {
            col_names[i] = strdup(sqlite3_column_name(stmt, i));
        }

        while (sqlite3_step(stmt) == SQLITE_ROW)
        {
            RevEntity revEntity = *(revInitializedEntity());

            if (&revEntity == NULL)
            {
                __android_log_print(ANDROID_LOG_DEBUG, "MyApp", ">>> Error: Failed to allocate memory for RevEntity struct\n");
                continue;
            }

            RevEntityKeyValuePair revEntityKeyValuePairMapping[] = {
                {"_isNull", &revEntity._isNull},
                {"_id", &revEntity._id},
                {"_revEntityType", &revEntity._revEntityType},
                {"_revEntitySubType", &revEntity._revEntitySubType},
                {"_revEntityResolveStatus", &revEntity._revEntityResolveStatus},
                {"_revEntityAccessPermission", &revEntity._revEntityAccessPermission},
                {"_revEntityGUID", &revEntity._revEntityGUID},
                {"_remoteRevEntityGUID", &revEntity._remoteRevEntityGUID},
                {"_revOwnerEntityGUID", &revEntity._revOwnerEntityGUID},
                {"_revContainerEntityGUID", &revEntity._revContainerEntityGUID},
                {"_remoteRevEntityContainerGUID", &revEntity._remoteRevEntityContainerGUID},
                {"_revEntitySiteGUID", &revEntity._revEntitySiteGUID},
                {"_timeCreated", &revEntity._timeCreated},
                {"_timeUpdated", &revEntity._timeUpdated},
                {"_revTimeCreated", &revEntity._revTimeCreated},
                {"_revTimePublished", &revEntity._revTimePublished},
                {"_revTimePublishedUpdated", &revEntity._revTimePublishedUpdated},
                {"childRevEntity", &revEntity.childRevEntity},
                {"_revInfoEntity", &revEntity._revInfoEntity},
                {NULL, NULL} // Sentinel value to mark the end of the array
            };

            for (int i = 0; i < num_cols; i++)
            {
                const char *revColName = col_names[i];
                char *revMappedEntityColName = htable_strstr_get_direct(revMappedEntityColNameMap, revColName);

                int revType = sqlite3_column_type(stmt, i);

                // Search the mapping for the given key
                int j = 0;

                while (revEntityKeyValuePairMapping[j].key != NULL)
                {
                    if (revEntityKeyValuePairMapping[j].key && strcmp(revEntityKeyValuePairMapping[j].key, revMappedEntityColName) == 0)
                    {
                        switch (revType)
                        {
                        case SQLITE_INTEGER:
                        {
                            long revEntityIntPtrVal = sqlite3_column_int64(stmt, i);
                            long *revEntityIntPointer = revEntityKeyValuePairMapping[j].value;
                            *revEntityIntPointer = revEntityIntPtrVal; // Set the value using the member pointer address

                            break;
                        }
                        case SQLITE_FLOAT:
                            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "%.2f ", sqlite3_column_double(stmt, i));
                            break;
                        case SQLITE_TEXT:
                        {
                            const char *revEntityDbCharVal = strdup((const char *)sqlite3_column_text(stmt, i));

                            char **revEntityCharPtr = revEntityKeyValuePairMapping[j].value; // Get the address of the member pointer
                            *revEntityCharPtr = revEntityDbCharVal;                          // Set the value of the member using the member pointer address

                            break;
                        }
                        case SQLITE_BLOB:
                            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "<BLOB> ");
                            break;
                        case SQLITE_NULL:
                            __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> NULL <<<");
                            break;
                        default:
                        {
                            __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> DEFAULT <<<");
                        }
                        }

                        break;
                    }

                    j = j + 1;
                }
            }

            list_append(&revEntityList, &revEntity);
        }

        for (int i = 0; i < num_cols; i++)
        {
            free(col_names[i]);
        }

        free(col_names);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    free(revTableRowsArr);
    free(revStrValsArr);
    free(revIntValsArr);

    htable_strstr_destroy(revMap);

revEnd:

    return &revEntityList;
}

int revEntitySubtypeExists_BY_OWNER_GUID(int revEntityOwnerGUID, char *revEntitySubtype)
{

    int exists = -1;

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else
    {
        if (sqlite3_step(stmt) == SQLITE_ROW)
        {
            exists = 1;
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revEntityExistsByLocalEntityGUID(long localRevEntityGUID)
{

    int exists = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

int revEntityExistsByRemoteEntityGUID(long remoteRevEntityGUID)
{
    int exists = -1;

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        exists = 1;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

long revGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID)
{
    long revEntityOwnerGUID = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_OWNER_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetEntityOwnerGUID_BY_EntityGUID SQL error: %s", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        revEntityOwnerGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityOwnerGUID;
}

list *revPersGet_ALL_RevEntity_By_SiteGUID_SubType(long revSiteEntityGUID, char *revEntitySubType)
{
    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_SITE_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 10";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revSiteEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 3);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 4);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 5));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *)malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(const char *revDBTableFieldName_, long revSiteEntityGUID, const char *revEntitySubType)
{
    htable_strstr_t *revMap = revGetEntityDB_Keys();

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT ";

    char *revDBTableFieldName = htable_strstr_get_direct(revMap, revDBTableFieldName_);
    sql = revConcatStrings(sql, revDBTableFieldName);

    char *revSelectionSQLPart = " FROM REV_ENTITY_TABLE WHERE REV_ENTITY_SITE_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";
    sql = revConcatStrings(sql, revSelectionSQLPart);

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, (long)revSiteEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    htable_strstr_destroy(revMap);

    return &list;
}

int totalLocalRevUserEntites()
{
    long revTotalUsers = -1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "COUNT(REV_ENTITY_GUID)  "
                "FROM REV_USER_ENTITY_TABLE";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        revTotalUsers = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revTotalUsers;
}

long revGetPublicationDate(long localRevEntityGUID)
{
    long remoteRevEntityGUID = (long)-1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_PUBLISHED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetPublicationDate SQL error: %s", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        remoteRevEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return remoteRevEntityGUID;
}

long revGetRemoteEntityGUID_BY_LocalEntityGUID(long localRevEntityGUID)
{
    long remoteRevEntityGUID = (long)-1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, localRevEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "revGetRemoteEntityGUID_BY_LocalEntityGUID SQL error: %s",
                            sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        remoteRevEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return remoteRevEntityGUID;
}

long getLocalRevEntityGUID_By_RemoteRevEntityGUID(long remoteRevEntityGUID)
{
    long localRevEntityGUID = (long)-1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        localRevEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return localRevEntityGUID;
}

long revEntitySubtypeExists_BY_CONTAINER_GUID(int revEntityContainerGUID, char *revEntitySubtype)
{

    long exists = -1;

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else
    {
        if (sqlite3_step(stmt) == SQLITE_ROW)
        {
            exists = sqlite3_column_int64(stmt, 0);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return exists;
}

RevEntity revPersGetRevEntityByGUID(long revEntityGUID)
{

    RevEntity revEntity = *(RevEntity *)malloc(sizeof(RevEntity));

    // Check if the pointer is null
    if (revEntityGUID == NULL)
    {
        printf("The pointer is null.\n");

        return revEntity;
    }

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CHILDABLE_STATUS, "
                "REV_RESOLVE_STATUS, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE, "
                "REV_UPDATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ? AND REV_RESOLVE_STATUS <> ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);
    sqlite3_bind_int(stmt, 2, -3);

    revEntity._isNull = TRUE;

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "NULLABLE >>> %s ", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
        long revEntityResolveStatus = sqlite3_column_int64(stmt, 1);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 7));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 8));

        long revTimeCreated = sqlite3_column_int64(stmt, 9);
        char *timeUpdated = strdup((const char *)sqlite3_column_text(stmt, 10));

        revEntity._isNull = FALSE;
        revEntity._revEntityChildableStatus = revEntityChildableStatus;
        revEntity._revEntityResolveStatus = revEntityResolveStatus;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revEntitySiteGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;
        revEntity._revTimeCreated = revTimeCreated;
        revEntity._timeCreated = strdup(revLocalTimer(revTimeCreated));
        revEntity._timeUpdated = timeUpdated;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntity;
}

RevEntity revPersGetRevEntity_By_RemoteRevEntityGUID(long remoteRevEntityGUID)
{
    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REMOTE_REV_ENTITY_GUID = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, remoteRevEntityGUID);

    RevEntity revEntity = *(RevEntity *)malloc(sizeof(RevEntity));

    revEntity._isNull = TRUE;

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "NULLABLE >>> %s ", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 6));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        revEntity._isNull = FALSE;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revEntitySiteGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;

        revEntity._revTimeCreated = _revTimeCreated;
        revEntity._timeCreated = strdup(revLocalTimer(_revTimeCreated));
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntity;
}

list *revPersGetALLRevEntityGUIDs_By_RevEntityType(char *revEntityType)
{
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_TYPE = ? ORDER BY REV_CREATED_DATE DESC";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *)revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDs_By_ContainerGUID(long revEntityContainerGUID)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? ORDER BY REV_CREATED_DATE DESC";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityContainerGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityTYPE(char *revEntityType)
{

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_TYPE = ? LIMIT 22";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *)revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int(stmt, 0);
        long _remoteRevEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 6));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        RevEntity *revEntity = (RevEntity *)malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_remoteRevEntityGUID = _remoteRevEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;

        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(long revEntityContainerGUID, char *revEntitySubType)
{
    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 100";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, revEntityContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 3);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 4);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 5));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *)malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntity_By_SubType(char *revEntitySubType)
{

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *)revEntitySubType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 1);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 3);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 4);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 5));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 6));

        long _revTimeCreated = sqlite3_column_int64(stmt, 7);

        RevEntity *revEntity = (RevEntity *)malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntityGUIDs_By_ResStatus(int resolveStatus)
{
    list list;
    list_new(&list, sizeof(long long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else
    {
        while (sqlite3_step(stmt) == SQLITE_ROW)
        {
            long long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRemoteRevEntityGUIDs_By_ResStatus(int resolveStatus)
{
    list list;
    list_new(&list, sizeof(long long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REMOTE_REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE  "
                "WHERE REV_RESOLVE_STATUS = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else
    {
        while (sqlite3_step(stmt) == SQLITE_ROW)
        {
            long long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(int resolveStatus, char *revEntitySubtype)
{
    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_ENTITY_SUB_TYPE = ?;";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, resolveStatus);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType %s",
                sqlite3_errmsg(db));
    }
    else
    {
        while (sqlite3_step(stmt) == SQLITE_ROW)
        {
            long revEntityGUID = sqlite3_column_int64(stmt, 0);
            list_append(&list, &revEntityGUID);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityUnSyched()
{
    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CHILDABLE_STATUS, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? LIMIT 20";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);
    sqlite3_bind_int(stmt, 2, 1);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "sqlite3_errmsg(db) >>>> %s", sqlite3_errmsg(db));
    }
    else
    {
        while (sqlite3_step(stmt) == SQLITE_ROW)
        {
            long revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
            long revEntityGUID = sqlite3_column_int64(stmt, 1);
            long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
            long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
            long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
            long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
            int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

            char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 7));
            char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 8));

            long _revTimeCreated = sqlite3_column_int64(stmt, 9);

            RevEntity *revEntity = (RevEntity *)malloc(sizeof(RevEntity));

            revEntity->_revEntityChildableStatus = revEntityChildableStatus;
            revEntity->_revEntityGUID = revEntityGUID;
            revEntity->_remoteRevEntityGUID = remoteRevEntityGUID;
            revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
            revEntity->_revContainerEntityGUID = revContainerEntityGUID;
            revEntity->_revEntitySiteGUID = revSiteEntityGUID;
            revEntity->_revEntityAccessPermission = revEntityAccessPermission;
            revEntity->_revEntityType = revEntityType;
            revEntity->_revEntitySubType = revEntitySubType;
            revEntity->_revTimeCreated = _revTimeCreated;

            revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

            list_append(&revEntityList, revEntity);
        }
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntityUnSychedByType(char *revEntityType)
{

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_CHILDABLE_STATUS, "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_RESOLVE_STATUS = ? AND REV_ENTITY_TYPE = ? LIMIT 20";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, -1);
    sqlite3_bind_text(stmt, 2, (const char *)revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "sqlite3_errmsg(db) >>> %s", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityChildableStatus = sqlite3_column_int64(stmt, 0);
        long revEntityGUID = sqlite3_column_int64(stmt, 1);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 2);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 4);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 5);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 6);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 7));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 8));

        long _revTimeCreated = sqlite3_column_int64(stmt, 9);

        RevEntity revEntity;

        revEntity._revEntityChildableStatus = revEntityChildableStatus;
        revEntity._revEntityGUID = revEntityGUID;
        revEntity._remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity._revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity._revContainerEntityGUID = revContainerEntityGUID;
        revEntity._revEntitySiteGUID = revSiteEntityGUID;
        revEntity._revEntityAccessPermission = revEntityAccessPermission;
        revEntity._revEntityType = revEntityType;
        revEntity._revEntitySubType = revEntitySubType;
        revEntity._timeCreated = strdup(revLocalTimer(_revTimeCreated));
        revEntity._revTimeCreated = _revTimeCreated;

        list_append(&revEntityList, &revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLEntitySubtypeGUIDsByOwnerGUID(char *revEntitySubtype, long ownerGUID)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *)revEntitySubtype, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, ownerGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityByOwnerGUIDType(char *revEntityType, long ownerGUID)
{

    list revEntityList;
    list_new(&revEntityList, sizeof(RevEntity), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID, "
                "REMOTE_REV_ENTITY_GUID, "
                "REV_ENTITY_OWNER_GUID, "
                "REV_ENTITY_CONTAINER_GUID, "
                "REV_ENTITY_SITE_GUID, "
                "REV_ENTITY_ACCESS_PERMISSION, "
                "REV_ENTITY_TYPE, "
                "REV_ENTITY_SUB_TYPE, "
                "REV_CREATED_DATE "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_TYPE = ? AND REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *)revEntityType, -1, SQLITE_STATIC);
    sqlite3_bind_int64(stmt, 2, ownerGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {

        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        long remoteRevEntityGUID = sqlite3_column_int64(stmt, 1);
        long revOwnerEntityGUID = sqlite3_column_int64(stmt, 2);
        long revContainerEntityGUID = sqlite3_column_int64(stmt, 3);
        long revSiteEntityGUID = sqlite3_column_int64(stmt, 4);
        int revEntityAccessPermission = sqlite3_column_int(stmt, 5);

        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 6));
        char *revEntitySubType = strdup((const char *)sqlite3_column_text(stmt, 7));

        long _revTimeCreated = sqlite3_column_int64(stmt, 8);

        RevEntity *revEntity = (RevEntity *)malloc(sizeof(RevEntity));

        revEntity->_revEntityGUID = revEntityGUID;
        revEntity->_remoteRevEntityGUID = remoteRevEntityGUID;
        revEntity->_revOwnerEntityGUID = revOwnerEntityGUID;
        revEntity->_revContainerEntityGUID = revContainerEntityGUID;
        revEntity->_revEntitySiteGUID = revSiteEntityGUID;
        revEntity->_revEntityAccessPermission = revEntityAccessPermission;
        revEntity->_revEntityType = revEntityType;
        revEntity->_revEntitySubType = revEntitySubType;
        revEntity->_revTimeCreated = _revTimeCreated;
        revEntity->_timeCreated = strdup(revLocalTimer(_revTimeCreated));

        list_append(&revEntityList, revEntity);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &revEntityList;
}

list *revPersGetALLRevEntityGUIDsByOwnerGUID_Type(char *revEntityType, long ownerGUID)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, ownerGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDs_SQL_IN(char *sql_IN)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare(db, sql_IN, -1, &stmt, 0);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDsByOwnerGUID(long ownerGUID)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, ownerGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

list *revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(long revContainerEntityGUID,
                                                         char *revEntityType)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revContainerEntityGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntityType, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

int getNumberOfUnreadRevEntites()
{
    int revUnreadEntities = 0;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "COUNT(REV_ENTITY_GUID)  "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_RESOLVE_STATUS < ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int(stmt, 1, 1);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        revUnreadEntities = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revUnreadEntities;
}

list *revPersGetALLRevEntitySubTYPEs(char *revEntitySubtype)
{

    list list;
    list_new(&list, sizeof(long), NULL);

    sqlite3 *db = revDb();

    sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_SUB_TYPE = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, (const char *)revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }

    while (sqlite3_step(stmt) == SQLITE_ROW)
    {
        long revEntityGUID = sqlite3_column_int64(stmt, 0);
        list_append(&list, &revEntityGUID);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return &list;
}

long getRevEntityGUID_By_RevEntityOwnerGUID_Subtype(int revEntityOwnerGUID, char *revEntitySubtype)
{
    long revEntityGUID = (long)-1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_OWNER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityOwnerGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

long getRevEntityGUIDByRevEntityContainerEntityGUID_Subtype(int revEntityContainerGUID, char *revEntitySubtype)
{
    long revEntityGUID = (long)-1;

    struct sqlite3 *db = revDb();
    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_GUID "
                "FROM REV_ENTITY_TABLE "
                "WHERE REV_ENTITY_CONTAINER_GUID = ? AND REV_ENTITY_SUB_TYPE = ? LIMIT 1";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityContainerGUID);
    sqlite3_bind_text(stmt, 2, (const char *)revEntitySubtype, -1, SQLITE_STATIC);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        revEntityGUID = sqlite3_column_int64(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return revEntityGUID;
}

char *getRevEntityTypeByRevEntityGUID(int revEntityGUID)
{

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_TYPE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
        return 0;
    }

    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 0));

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return revEntityType;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

char *getRevEntitySubtypeByRevEntityGUID(int revEntityGUID)
{

    struct sqlite3 *db = revDb();

    struct sqlite3_stmt *stmt;

    char *sql = "SELECT "
                "REV_ENTITY_SUB_TYPE "
                "FROM REV_ENTITY_TABLE WHERE "
                "REV_ENTITY_GUID = ?";

    int rc = sqlite3_prepare(db, sql, -1, &stmt, 0);

    sqlite3_bind_int64(stmt, 1, revEntityGUID);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    }
    else if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        char *revEntityType = strdup((const char *)sqlite3_column_text(stmt, 0));

        sqlite3_finalize(stmt);
        sqlite3_close(db);

        return revEntityType;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return NULL;
}

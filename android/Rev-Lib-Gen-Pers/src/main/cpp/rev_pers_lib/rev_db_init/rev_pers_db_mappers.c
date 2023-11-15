//
// Created by rev on 6/17/23.
//

#include "rev_pers_db_mappers.h"

#include <jni.h>
#include <android/log.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../../../../../libs/cJSON/cJSON.h"
#include "../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../libs/sqlite3/include/sqlite3.h"
#include "../../../../../libs/rev_map/rev_map.h"
#include "../../../../../libs/rev_curl/android-21/include/curl/curl.h"

#include "../../rev_pers_lib/rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../../rev_pers_lib/rev_db_init/rev_db_init.h"
#include "../../rev_gen_functions/rev_gen_functions.h"

char *revGetSelectionFields(const cJSON *revWhere_CJSON, htable_strstr_t *revMap)
{
    char *revRetWhereStr = "";
    char revAll[] = "*";

    // Iterate over the items in the object
    if (revWhere_CJSON != NULL && revWhere_CJSON->type == cJSON_Array)
    {
        int revArrSize = cJSON_GetArraySize(revWhere_CJSON);

        if (revArrSize == 0)
        {
            return revAll;
        }

        for (int i = 0; i < revArrSize; i++)
        {
            cJSON *revCurrArrayElement = cJSON_GetArrayItem(revWhere_CJSON, i);

            if (cJSON_IsString(revCurrArrayElement) && (revCurrArrayElement->valuestring != NULL))
            {
                char *revArrayElementVal = revCurrArrayElement->valuestring;

                if (strcmp(revArrayElementVal, revAll) == 0)
                {
                    return revAll;
                }

                const char *revArrayElementDBTableName = htable_strstr_get_direct(revMap, revArrayElementVal);

                if (revArrayElementDBTableName == NULL || revArrayElementDBTableName[0] == '\0')
                {
                    continue;
                }

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
            else if (cJSON_IsNumber(revCurrArrayElement))
            {
                int revArrayElementVal = revCurrArrayElement->valueint;

                __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revArrayElementVal %d", revArrayElementVal);
            }
        }
    }

    // htable_strstr_destroy(revMap);

    return revRetWhereStr;
}

cJSON *revPersGetQuery_By_RevVarArgs(char *revVarArgs, htable_strstr_t *revMap, htable_strstr_t *revMappedEntityColNameMap)
{
    char revAll[] = "*";

    cJSON *revRetJSonArray = cJSON_CreateArray();

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

    char *revSelectWhere = revGetSelectionFields(revSelect_JSON, revMap);

    if (revSelectWhere[0] == '\0')
    {
        goto revEnd;
    }

    char revFrom[] = " FROM ";

    // Concatenate the first part
    sql = revConcatStrings(sql, revSelectWhere);

    // Check for memory allocation failure
    if (sql == NULL)
    {
        // Handle the error
        return NULL;
    }

    // Concatenate the second part
    char *revFromTempStr = revConcatStrings(sql, " FROM ");
    free(sql);            // Free the memory of the previous result
    sql = revFromTempStr; // Update the pointer

    // Check for memory allocation failure
    if (sql == NULL)
    {
        // Handle the error
        return NULL;
    }

    /** START SET THE TABLE NAME **/
    char *revTableNameVal = NULL;
    const char *revDefaultTableName = "REV_ENTITY_TABLE";

    if (cJSON_HasObjectItem(revJSON, "revTableName"))
    {
        const cJSON *revTableName_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revTableName");
        const char *revSourceString = revTableName_JSON->valuestring;

        // Calculate the length of the source string
        size_t revSourceStringLength = strlen(revSourceString);

        // Allocate memory for revTableNameVal with enough space for the source string
        revTableNameVal = (char *)malloc(revSourceStringLength + 1);

        if (revTableNameVal != NULL)
        {
            // Copy the source string into revTableNameVal
            strcpy(revTableNameVal, revSourceString);
            // Now, revTableNameVal contains the copied string.
        }
        else
        {
            // Handle memory allocation failure
        }
    }
    else
    {
        // Use the default table name if "revTableName" is not present
        size_t revDefaultTableNameLength = strlen(revDefaultTableName);
        revTableNameVal = (char *)malloc(revDefaultTableNameLength + 1);
        if (revTableNameVal != NULL)
        {
            strcpy(revTableNameVal, revDefaultTableName);
            // Now, revTableNameVal contains the default table name.
            free(revTableNameVal); // Don't forget to free the memory when done.
        }
        else
        {
            // Handle memory allocation failure
        }
    }

    // Concatenate the third part
    char *revTableNameTempStr = revConcatStrings(sql, revTableNameVal);
    free(sql); // Free the memory of the previous result
    // free(revTableNameVal);
    sql = revTableNameTempStr; // Update the pointer
    /** END SET THE TABLE NAME **/

    // Check for memory allocation failure
    if (sql == NULL)
    {
        // Handle the error
        goto revEnd;
    }

    const cJSON *revWhere_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revWhere");

    char **revTableRowsArr = NULL;

    int revStrArrLen = 0;
    char **revStrValsArr = NULL;

    int revIntArrLen = 0;
    int **revIntValsArr = NULL;

    char *revPreparedSQL = "";

    char *revIntWhereFields = "";
    int revIntWhereArrLen = 0;
    int **revIntWhereValsArr = NULL;

    char *revSql_OR_Str = "";

    if (cJSON_IsObject(revWhere_JSON))
    {
        // Iterate over the items in the object
        cJSON *revWhere;

        for (revWhere = revWhere_JSON->child; revWhere; revWhere = revWhere->next)
        {
            char *revCurrKey = revWhere->string;

            if (revWhere->type == cJSON_String)
            {
                // Handle string type
                char *revCurrVal = revWhere->valuestring;

                const char *revDBTableField = htable_strstr_get_direct(revMap, revCurrKey);

                if (revDBTableField != NULL && revDBTableField[0] != '\0')
                {
                    if (revPreparedSQL[0] != '\0')
                    {
                        revPreparedSQL = revConcatStrings(revPreparedSQL, " AND ");
                    }

                    revPreparedSQL = revConcatStrings(revPreparedSQL, revDBTableField);
                    revPreparedSQL = revConcatStrings(revPreparedSQL, " = ?");

                    // Add another element to the array
                    revStrArrLen++;
                    revStrValsArr = (char **)realloc(revStrValsArr, revStrArrLen * sizeof(char *));

                    int revArrPos = revStrArrLen < 1 ? 0 : revStrArrLen - 1;
                    revStrValsArr[revArrPos] = strdup(revCurrVal);
                }
                else
                {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revSubType value not found : %s", (revDBTableField != NULL) ? strdup(revDBTableField) : "NULL");
                }
            }
            else if (revWhere->type == cJSON_Object)
            {
                // Iterate over the key-value pairs in the innerObject
                cJSON *revQualifiedWhere = revWhere->child;

                if (revQualifiedWhere == NULL)
                {
                    continue;
                }

                const char *revQualifiedOperatorValue = revQualifiedWhere->string;

                // Handle string type
                char *revCurrVal = revWhere->valuestring;

                const char *revDBTableField = htable_strstr_get_direct(revMap, revCurrKey);

                if (revDBTableField[0] != '\0')
                {
                    if (revPreparedSQL[0] == '\0')
                    {
                        revPreparedSQL = revConcatStrings(revPreparedSQL, revDBTableField);
                    }
                    else
                    {
                        revPreparedSQL = revConcatStrings(revPreparedSQL, " AND ");
                        revPreparedSQL = revConcatStrings(revPreparedSQL, revDBTableField);
                    }

                    revPreparedSQL = revConcatStrings(revPreparedSQL, " ");
                    revPreparedSQL = revConcatStrings(revPreparedSQL, revQualifiedOperatorValue);
                    revPreparedSQL = revConcatStrings(revPreparedSQL, " ?");

                    // Add another element to the array
                    if (revQualifiedWhere->type == cJSON_String)
                    {
                        revStrArrLen++;

                        const char *revQualifiedStrValue = cJSON_GetStringValue(revQualifiedWhere);

                        revStrValsArr = (char **)realloc(revStrValsArr, revStrArrLen * sizeof(char *));

                        int revArrPos = revStrArrLen < 1 ? 0 : revStrArrLen - 1;
                        revStrValsArr[revArrPos] = strdup(revQualifiedStrValue);
                    }
                    else if (revQualifiedWhere->type == cJSON_Number)
                    {
                        long revQualifiedIntValue = revQualifiedWhere->valueint;

                        revIntWhereArrLen++;
                        revIntWhereValsArr = (int **)realloc(revIntWhereValsArr, revIntWhereArrLen * sizeof(int *));

                        int revArrPos = revIntWhereArrLen < 1 ? 0 : revIntWhereArrLen - 1;
                        revIntWhereValsArr[revArrPos] = revQualifiedIntValue;
                    }
                }
                else
                {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revSubType value not found\n");
                }
            }
            else if (revWhere->type == cJSON_Array)
            {
                char *revArrDBTableName = revCurrKey;
                const char *revArrayElementDBTableName = htable_strstr_get_direct(revMap, revArrDBTableName);

                // Handle array type
                int revArrSize = cJSON_GetArraySize(revWhere);

                for (int i = 0; i < revArrSize; i++)
                {
                    cJSON *revCurrArrayElement = cJSON_GetArrayItem(revWhere, i);

                    if (i == 0)
                    {
                        if (revPreparedSQL[0] == '\0')
                        {
                            revSql_OR_Str = " (";
                        }
                        else
                        {
                            revSql_OR_Str = " AND (";
                        }

                        revSql_OR_Str = revConcatStrings(revSql_OR_Str, revArrayElementDBTableName);
                        revSql_OR_Str = revConcatStrings(revSql_OR_Str, " = ?");
                    }
                    else
                    {
                        revSql_OR_Str = revConcatStrings(revSql_OR_Str, " OR ");
                        revSql_OR_Str = revConcatStrings(revSql_OR_Str, revArrayElementDBTableName);
                        revSql_OR_Str = revConcatStrings(revSql_OR_Str, " = ?");
                    }

                    if (i == revArrSize - 1)
                    {
                        revSql_OR_Str = revConcatStrings(revSql_OR_Str, ")");
                    }

                    if (cJSON_IsString(revCurrArrayElement) && (revCurrArrayElement->valuestring != NULL))
                    {
                        char *revArrayElementVal = revCurrArrayElement->valuestring;

                        revStrArrLen = revStrArrLen + 1;
                        revStrValsArr = (char **)realloc(revStrValsArr, revStrArrLen * sizeof(char *));

                        int revArrPos = revStrArrLen < 1 ? 0 : revStrArrLen - 1;
                        revStrValsArr[revArrPos] = revArrayElementVal;
                    }
                    else if (cJSON_IsNumber(revCurrArrayElement))
                    {
                        int revArrayElementVal = revCurrArrayElement->valueint;

                        revIntArrLen = revIntArrLen + 1;
                        revIntValsArr = (int **)realloc(revIntValsArr, revIntArrLen * sizeof(int *));

                        int revArrPos = revIntArrLen < 1 ? 0 : revIntArrLen - 1;
                        revIntValsArr[revArrPos] = revArrayElementVal;
                    }
                }
            }
            else if (cJSON_IsNumber(revWhere))
            {
                // Handle string type
                int revCurrIntVal = revWhere->valueint;
                const char *revDBTableName = htable_strstr_get_direct(revMap, revCurrKey);

                if (revDBTableName[0] != '\0')
                {
                    if (revIntWhereFields[0] == '\0')
                    {
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " ");
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
                    revIntWhereArrLen = revIntWhereArrLen + 1;
                    revIntWhereValsArr = (int **)realloc(revIntWhereValsArr, revIntWhereArrLen * sizeof(int *));

                    int revArrPos = revIntWhereArrLen < 1 ? 0 : revIntWhereArrLen - 1;
                    revIntWhereValsArr[revArrPos] = revCurrIntVal;
                }
                else
                {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revSubType value not found\n");
                }
            }
        }
    }

    revPreparedSQL = revConcatStrings(revPreparedSQL, revSql_OR_Str);

    if (strcmp(revSelectWhere, revAll) != 0 && revPreparedSQL[0] != '\0')
    {
        sql = revConcatStrings(sql, " WHERE ");
        sql = revConcatStrings(sql, revPreparedSQL);
    }

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

    /** START SET ORDER BY **/
    if (cJSON_HasObjectItem(revJSON, "revOrderBy"))
    {
        // Get the "revOrderBy" object from the root revJSON JSON object
        cJSON *revOrderByObject = cJSON_GetObjectItem(revJSON, "revOrderBy");

        if (revOrderByObject != NULL && cJSON_IsObject(revOrderByObject))
        {
            cJSON *revOrderByTableColumn = cJSON_GetObjectItem(revOrderByObject, "revOrderByTableColumn");
            cJSON *revOrderByDirection = cJSON_GetObjectItem(revOrderByObject, "revOrderByDirection");

            if (revOrderByTableColumn != NULL && cJSON_IsString(revOrderByTableColumn) &&
                revOrderByDirection != NULL && cJSON_IsString(revOrderByDirection))
            {
                const char *revOrderByTableColumnVal = revOrderByTableColumn->valuestring;
                char *revOrderByTableColumnNameVal = htable_strstr_get_direct(revMap, revOrderByTableColumnVal);

                if (revOrderByTableColumnNameVal != NULL && revOrderByTableColumnNameVal[0] != '\0')
                {
                    const char *revOrderByDirectionVal = revOrderByDirection->valuestring;

                    sql = revConcatStrings(sql, " ORDER BY ");
                    sql = revConcatStrings(sql, revOrderByTableColumnNameVal);
                    sql = revConcatStrings(sql, " ");
                    sql = revConcatStrings(sql, revOrderByDirectionVal);
                }
            }
            else
            {
                printf("Invalid values within the 'person' object.\n");
            }
        }
        else
        {
            printf("The 'person' object not found or is not an object.\n");
        }
    }
    /** END SET ORDER BY **/

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

    for (int i = 0; i < revIntWhereArrLen; i++)
    {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_int64(stmt, revBoundCount, revIntWhereValsArr[i]);
    }

    for (int i = 0; i < revIntArrLen; i++)
    {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_int64(stmt, revBoundCount, revIntValsArr[i]);
    }

    int revLimit = 10;

    // LIMIT
    const cJSON *revLimit_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revLimit");
    if (cJSON_IsNumber(revLimit_JSON) && (revLimit_JSON->valueint > 0))
    {
        revLimit = revLimit_JSON->valueint;
    }

    sqlite3_bind_int(stmt, revBoundCount + 1, revLimit);

    char *revPrepStmt = sqlite3_expanded_sql(stmt);
    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revPrepStmt %s", revPrepStmt);

    if (rc != SQLITE_OK)
    {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));

        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> SQL error : -revPersGetQuery_By_RevVarArgs %s", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> SQL error : sqlite3_expanded_sql %s", sqlite3_expanded_sql(stmt));
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> SQL error : -sql %s", sql);

        goto revEnd;
    }

    if (rc == SQLITE_OK)
    {
        int num_cols = sqlite3_column_count(stmt);
        char **col_names = (char **)malloc(num_cols * sizeof(char *));

        for (int i = 0; i < num_cols; i++)
        {
            col_names[i] = strdup(sqlite3_column_name(stmt, i));
        }

        while (sqlite3_step(stmt) == SQLITE_ROW)
        {
            cJSON *revCurrJsonObject = cJSON_CreateObject();

            for (int i = 0; i < num_cols; i++)
            {
                const char **revColName = col_names[i];
                const char *revMappedEntityColName = htable_strstr_get_direct(revMappedEntityColNameMap, revColName);

                int revType = sqlite3_column_type(stmt, i);

                switch (revType)
                {
                case SQLITE_INTEGER:
                {
                    long long revEntityIntPtrVal = sqlite3_column_int64(stmt, i);
                    cJSON_AddItemToObject(revCurrJsonObject, revMappedEntityColName, cJSON_CreateNumber(revEntityIntPtrVal)); // Set the value using the member pointer address

                    break;
                }
                case SQLITE_FLOAT:
                    __android_log_print(ANDROID_LOG_ERROR, "MyApp", "%.2f ", sqlite3_column_double(stmt, i));
                    break;
                case SQLITE_TEXT:
                {
                    const char *revEntityDbCharVal = strdup((const char *)sqlite3_column_text(stmt, i)); // The new string value you want to set

                    // Allocate memory for the new string value
                    char *revNewString = malloc(strlen(revEntityDbCharVal) + 1); // +1 for the null terminator

                    // Copy the new value to the dynamically allocated string
                    strcpy(revNewString, revEntityDbCharVal);

                    // Update the pointer to the string
                    cJSON_AddItemToObject(revCurrJsonObject, revMappedEntityColName, cJSON_CreateString(revNewString)); // Set the value using the member pointer address

                    free(revNewString);

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
            }

            cJSON_AddItemToArray(revRetJSonArray, revCurrJsonObject);
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
    free(revIntWhereValsArr);

    // htable_strstr_destroy(revMap);

revEnd:

    return revRetJSonArray;
}
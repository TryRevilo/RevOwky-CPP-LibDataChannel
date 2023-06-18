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

#include "../../rev_pers_lib/rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../../rev_pers_lib/rev_db_init/rev_db_init.h"
#include "../../rev_gen_functions/rev_gen_functions.h"

char *revGetWhere(const cJSON *revWhere_CJSON, htable_strstr_t *revMap) {
    char *revRetWhereStr = "*";

    // Iterate over the items in the object
    if (revWhere_CJSON != NULL && revWhere_CJSON->type == cJSON_Array) {
        int revArrSize = cJSON_GetArraySize(revWhere_CJSON);

        if (revArrSize == 0) {
            return revRetWhereStr;
        }

        revRetWhereStr = "";

        for (int i = 0; i < revArrSize; i++) {
            cJSON *revCurrArrayElement = cJSON_GetArrayItem(revWhere_CJSON, i);

            if (cJSON_IsString(revCurrArrayElement) && (revCurrArrayElement->valuestring != NULL)) {
                char *revArrayElementVal = revCurrArrayElement->valuestring;

                if (revArrayElementVal == "*") {
                    return "*";
                }

                char *revArrayElementDBTableName = htable_strstr_get_direct(revMap, revArrayElementVal);

                if (i == 0) {
                    revRetWhereStr = revConcatStrings(revRetWhereStr, revArrayElementDBTableName);
                } else {
                    revRetWhereStr = revConcatStrings(revRetWhereStr, ", ");
                    revRetWhereStr = revConcatStrings(revRetWhereStr, revArrayElementDBTableName);
                }
            }
        }

        // htable_strstr_destroy(revMap);
    }

    return revRetWhereStr;
}

cJSON *revPersGetQuery_By_RevVarArgs(char *revVarArgs, htable_strstr_t *revMap, htable_strstr_t *revMappedEntityColNameMap) {

    cJSON *revRetJSonArray = cJSON_CreateArray();

    char *sql = "SELECT ";

    // Parse the JSON string
    cJSON *revJSON = cJSON_Parse(revVarArgs);

    const cJSON *revSelectDistinct_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revDistinct");

    if (cJSON_IsNumber(revSelectDistinct_JSON) && (revSelectDistinct_JSON->valueint != NULL)) {
        long revSelectDistinctVal = revSelectDistinct_JSON->valueint;

        if (revSelectDistinctVal == 1) {
            sql = revConcatStrings(sql, "DISTINCT ");
        }
    }

    const cJSON *revSelect_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revSelect");

    char *revSelectWhere = revGetWhere(revSelect_JSON, revMap);

    if (revSelectWhere[0] == '\0') {
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

    if (cJSON_IsObject(revWhere_JSON)) {
        // Iterate over the items in the object
        cJSON *revWhere;

        for (revWhere = revWhere_JSON->child; revWhere; revWhere = revWhere->next) {
            if (revWhere->type == cJSON_String) {
                // Handle string type
                char *revCurrKey = revWhere->string;
                char *revCurrVal = revWhere->valuestring;

                char *revDBTableName = htable_strstr_get_direct(revMap, revCurrKey);

                if (revDBTableName) {
                    if (revSQL[0] == '\0') {
                        revSQL = revConcatStrings(revSQL, revDBTableName);
                        revSQL = revConcatStrings(revSQL, " = ?");
                    } else {
                        revSQL = revConcatStrings(revSQL, " AND ");
                        revSQL = revConcatStrings(revSQL, revDBTableName);
                        revSQL = revConcatStrings(revSQL, " = ?");
                    }

                    // Add another element to the array
                    revStrArrLen++;
                    revStrValsArr = (char **) realloc(revStrValsArr, revStrArrLen * sizeof(char *));
                    revStrValsArr[revStrArrLen - 1] = strdup(revCurrVal);
                } else {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revEntitySubType value not found\n");
                }
            } else if (revWhere->type == cJSON_Array) {
                char *revCurr_OR_Str = "";
                char *revCurr_OR_Int = "";

                char *revArrDBTableName = revWhere->string;
                char *revArrayElementDBTableName = htable_strstr_get_direct(revMap, revArrDBTableName);

                // Handle array type
                int revArrSize = cJSON_GetArraySize(revWhere);

                for (int i = 0; i < revArrSize; i++) {
                    cJSON *revCurrArrayElement = cJSON_GetArrayItem(revWhere, i);

                    if (cJSON_IsString(revCurrArrayElement) && (revCurrArrayElement->valuestring != NULL)) {
                        if (i == 0 && revSQL[0] == '\0') {
                            revCurr_OR_Str = "(";
                        } else if (i == 0 && revCurr_OR_Str[0] == 0) {
                            revCurr_OR_Str = " AND (";
                        }

                        char *revArrayElementVal = revCurrArrayElement->valuestring;

                        revStrArrLen++;
                        revStrValsArr = (char **) realloc(revStrValsArr, revStrArrLen * sizeof(char *));
                        revStrValsArr[revStrArrLen - 1] = revArrayElementVal;

                        if (i == 0) {
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, revArrayElementDBTableName);
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, " = ?");
                        } else {
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, " OR ");
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, revArrayElementDBTableName);
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, " = ?");
                        }

                        if (i == revArrSize - 1) {
                            revCurr_OR_Str = revConcatStrings(revCurr_OR_Str, ")");
                        }
                    } else if (cJSON_IsNumber(revCurrArrayElement)) {
                        if (i == 0 && revSQL[0] == '\0') {
                            revCurr_OR_Int = "(";
                        } else if (i == 0 && revCurr_OR_Str[0] == '\0') {
                            revCurr_OR_Int = " AND (";
                        }

                        int revArrayElementVal = revCurrArrayElement->valueint;

                        revIntArrLen++;
                        revIntValsArr = (int **) realloc(revIntValsArr, revIntArrLen * sizeof(int *));
                        revIntValsArr[revIntArrLen - 1] = revArrayElementVal;

                        if (i == 0) {
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, revArrayElementDBTableName);
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, " = ?");
                        } else {
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, " OR ");
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, revArrayElementDBTableName);
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, " = ?");
                        }

                        if (i == revArrSize - 1) {
                            revCurr_OR_Int = revConcatStrings(revCurr_OR_Int, ")");
                        }
                    }
                }

                rev_Str_OR_Str = revConcatStrings(rev_Str_OR_Str, revCurr_OR_Str);
                rev_Int_OR_Str = revConcatStrings(rev_Int_OR_Str, revCurr_OR_Int);
            } else if (cJSON_IsNumber(revWhere) && (revWhere->valueint != NULL)) {
                __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> %d", 555);

                // Handle string type
                char *revCurrKey = revWhere->string;
                int revCurrIntVal = revWhere->valueint;
                char *revDBTableName = htable_strstr_get_direct(revMap, revCurrKey);

                __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revCurrKey %s revCurrIntVal %d", revCurrKey, revCurrIntVal);

                if (revDBTableName[0] != '\0') {
                    if (revIntWhereFields[0] == '\0') {
                        revIntWhereFields = revConcatStrings(revIntWhereFields, revDBTableName);
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " = ?");
                    } else {
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " AND ");
                        revIntWhereFields = revConcatStrings(revIntWhereFields, revDBTableName);
                        revIntWhereFields = revConcatStrings(revIntWhereFields, " = ?");
                    }

                    // Add another element to the array>>
                    revIntWhereArrLen++;
                    revIntWhereValsArr = (int **) realloc(revIntWhereValsArr, revIntWhereArrLen * sizeof(int *));
                    revIntWhereValsArr[revIntWhereArrLen - 1] = revCurrIntVal;
                } else {
                    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revEntitySubType value not found\n");
                }
            } else if (revWhere->type == cJSON_Object) {
                // Handle object type
            }
        }
    }

    revSQL = revConcatStrings(revSQL, rev_Str_OR_Str);
    revSQL = revConcatStrings(revSQL, rev_Int_OR_Str);

    sql = revConcatStrings(sql, revSQL);

    if (revIntWhereFields[0] != '\0') {
        if (revSelectWhere[0] == '\0') {
            sql = revConcatStrings(sql, revIntWhereFields);
        } else {
            sql = revConcatStrings(sql, " AND ");
            sql = revConcatStrings(sql, revIntWhereFields);
        }
    }

    sql = revConcatStrings(sql, " ORDER BY REV_ENTITY_GUID DESC");
    sql = revConcatStrings(sql, " LIMIT ?");

    sqlite3 *db = revDb();
    sqlite3_stmt *stmt;

    int rc = sqlite3_prepare(db, sql, -1, &stmt, NULL);

    int revBoundCount = 0;

    for (int i = 0; i < revStrArrLen; i++) {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_text(stmt, revBoundCount, (const char *) revStrValsArr[i], -1, SQLITE_STATIC);
    }

    for (int i = 0; i < revIntArrLen; i++) {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_int64(stmt, revBoundCount, revIntValsArr[i]);
    }

    for (int i = 0; i < revIntWhereArrLen; i++) {
        revBoundCount = revBoundCount + 1;
        sqlite3_bind_int64(stmt, revBoundCount, (long) revIntWhereValsArr[i]);
    }

    int revLimit = 10;

    // LIMIT
    const cJSON *revLimit_JSON = cJSON_GetObjectItemCaseSensitive(revJSON, "revLimit");
    if (cJSON_IsNumber(revLimit_JSON) && (revLimit_JSON->valueint > 0)) {
        revLimit = revLimit_JSON->valueint;
    }

    sqlite3_bind_int(stmt, 1 + revBoundCount, revLimit);

    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));

        char *revPrepStmt = sqlite3_expanded_sql(stmt);
        __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> SQL error : -revPersGetQuery_By_RevVarArgs %s\n stmt %s", sqlite3_errmsg(db), revPrepStmt);

        goto revEnd;
    }

    if (rc == SQLITE_OK) {
        int num_cols = sqlite3_column_count(stmt);

        __android_log_print(ANDROID_LOG_DEBUG, "MyApp", ">>> num_cols %d", num_cols);

        char **col_names = (char **) malloc(num_cols * sizeof(char *));

        for (int i = 0; i < num_cols; i++) {
            col_names[i] = strdup(sqlite3_column_name(stmt, i));
        }

        while (sqlite3_step(stmt) == SQLITE_ROW) {

            cJSON *revCurrJsonObject = cJSON_CreateObject();

            for (int i = 0; i < num_cols; i++) {
                const char **revColName = col_names[i];
                char *revMappedEntityColName = htable_strstr_get_direct(revMappedEntityColNameMap, revColName);

                int revType = sqlite3_column_type(stmt, i);

                switch (revType) {
                    case SQLITE_INTEGER: {
                        long revEntityIntPtrVal = sqlite3_column_int64(stmt, i);
                        cJSON_AddItemToObject(revCurrJsonObject, revMappedEntityColName, cJSON_CreateNumber(revEntityIntPtrVal)); // Set the value using the member pointer address

                        break;
                    }
                    case SQLITE_FLOAT:
                        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "%.2f ", sqlite3_column_double(stmt, i));
                        break;
                    case SQLITE_TEXT: {
                        const char *revEntityDbCharVal = strdup((const char *) sqlite3_column_text(stmt, i));  // The new string value you want to set

                        // Allocate memory for the new string value
                        char *revNewString = malloc(strlen(revEntityDbCharVal) + 1);  // +1 for the null terminator

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
                    default: {
                        __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> DEFAULT <<<");
                    }
                }
            }

            cJSON_AddItemToArray(revRetJSonArray, revCurrJsonObject);
        }

        for (int i = 0; i < num_cols; i++) {
            free(col_names[i]);
        }

        free(col_names);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    free(revTableRowsArr);
    free(revStrValsArr);
    free(revIntValsArr);

    // htable_strstr_destroy(revMap);

    revEnd:

    return revRetJSonArray;
}
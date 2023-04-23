#include "rev_db_init.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <android/log.h>

#include "../../../jni/rev_init_jni_lib.hpp"
#include "../../../../../libs/sqlite3/include/sqlite3.h"

#include "../../../../../libs/cJSON/cJSON.h"

void initRevDb(char *dirPath) {
    sqlite3 *db;
    int rc;

    const char *revDbName = "/rev_lite.db";

    char *revDbPath;
    revDbPath = malloc(strlen(dirPath) + 1 + 4); /* make space for the new string (should check the return value ...) */
    strcpy(revDbPath, dirPath);                  /* copy name into the new var */
    strcat(revDbPath, revDbName);                /* add the extension */

    __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Open database: %s\n", revDbPath);

    rc = sqlite3_open(revDbPath, &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Can't open database: %s\n", sqlite3_errmsg(db));
    } else {
        fprintf(stderr, "Opened database successfully\n");
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "Opened database successfully\n");
    }
}

sqlite3 *revDb() {
    sqlite3 *db;
    int rc;

    rc = sqlite3_open("/storage/emulated/0/Documents/Owki/rev_lite.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return (0);
    } else {
        fprintf(stderr, "Opened database successfully\n");
    }

    return db;
}

int callback(void *NotUsed, int argc, char **argv, char **azColName) {
    int i;
    for (i = 0; i < argc; i++) {
        printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    }
    printf("\n");
    return 0;
}

#ifndef REV_DB_INIT_H
#define REV_DB_INIT_H

#include <stdio.h>
#include <stdlib.h>
#include "../../../../../libs/sqlite3/include/sqlite3.h"

sqlite3 *revDb();

void initRevDb(char *dirPath);

int callback(void *NotUsed, int argc, char **argv, char **azColName);

typedef struct {
    char *revKey;
    void *revValue;
} RevKeyValuePair;

#endif // REV_DB_INIT_H

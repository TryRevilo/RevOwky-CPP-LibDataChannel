#ifndef REV_GEN_FUNCTIONS_H
#define REV_GEN_FUNCTIONS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef struct DateAndTime {
    int year;
    int month;
    int day;
    int hour;
    int minutes;
    int seconds;
    int msec;
} DateAndTime;

const char *revGetCurrentTime();

long revCurrentTimestampMillSecs();

void revRemoveSpaces(char *source);

struct tm* revGetTimeAndDate(long milliseconds);

char *revLocalTimer(long revMills);

#endif // REV_GEN_FUNCTIONS_H

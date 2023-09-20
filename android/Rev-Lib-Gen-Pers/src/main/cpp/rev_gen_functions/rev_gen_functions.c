#include "rev_gen_functions.h"

#include <android/log.h>

#include "../../../../libs/cJSON/cJSON.h"

const char *revGetCurrentTime() {
    time_t rawtime;
    struct tm *timeinfo;

    time(&rawtime);
    timeinfo = localtime(&rawtime);

    return asctime(timeinfo);
}

void revRemoveSpaces(char *source) {
    char *i = source;
    char *j = source;
    while (*j != 0) {
        *i = *j++;
        if (*i != ' ')
            i++;
    }
    *i = 0;
}

char *revConcatStrings(const char *revS1, const char *revS2) {
    int length = strlen(revS1) + strlen(revS2);
    char *revResultStr = (char *) malloc(length + 1);

    strcpy(revResultStr, revS1);
    strcat(revResultStr, revS2);

    return revResultStr;
}

int revIsCJsonStringEmpty(cJSON *revJson) {
    if (revJson != NULL && cJSON_IsString(revJson)) {
        const char *value = revJson->valuestring;

        if (value != NULL && strlen(value) > 0) {
            return 1; // String is NOT empty
        }
    }

    return 0; // String is empty or not a string
}

long revCurrentTimestampMillSecs() {
    struct timeval te;
    gettimeofday(&te, NULL); // get current time
    long long revMilliseconds = te.tv_sec * 1000LL + te.tv_usec / 1000; // calculate milliseconds
    return revMilliseconds;
}

struct tm *revGetTimeAndDate(long revMilliseconds) {
    time_t seconds = (time_t) (revMilliseconds / 1000);

    if ((unsigned long long) seconds * 1000 <= revMilliseconds)
        return localtime(&seconds);
    return NULL; // milliseconds >= 4G*1000
}

char *revLocalTimer(long revMills) {
    struct timeval tv;
    struct tm *tm;

    gettimeofday(&tv, NULL);

    tm = revGetTimeAndDate(revMills);

    if (tm == NULL) {
        __android_log_print(ANDROID_LOG_ERROR, "MyApp", "UNSET TIME error: buffer %ld", revMills);
        return strdup("UNSET TIME");
    }

    char formatted_date[40];
    strftime(formatted_date, 40, "%B %d, %Y", &tm);

    char *buffer[80];
    strftime(buffer, 80, "%x - %I:%M%p", tm);

    return strdup(buffer);
}
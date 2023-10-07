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
    if (revS1 == NULL || revS2 == NULL) {
        // Handle NULL pointer input gracefully
        return NULL;
    }

    int length = strlen(revS1) + strlen(revS2);
    char *revResultStr = (char *) malloc(length + 1);

    if (revResultStr == NULL) {
        // Handle memory allocation failure
        return NULL;
    }

    strcpy(revResultStr, revS1);
    strcat(revResultStr, revS2);

    return revResultStr;
}

char *revConcatStringsVariad(const char *revS1, ...) {
    va_list revArgs;
    va_start(revArgs, revS1);

    // Calculate the total length needed for the result
    int revTotalLength = strlen(revS1);
    const char *revNextString = va_arg(revArgs, const char *);

    while (revNextString != NULL) {
        revTotalLength += strlen(revNextString);
        revNextString = va_arg(revArgs, const char *);
    }

    va_end(revArgs);

    // Allocate memory for the result
    char *revResultStr = (char *) malloc(revTotalLength + 1);

    if (revResultStr == NULL) {
        // Handle memory allocation failure
        return NULL;
    }

    // Copy the first string into the result
    strcpy(revResultStr, revS1);

    // Concatenate the rest of the strings
    va_start(revArgs, revS1);
    revNextString = va_arg(revArgs, const char *);

    while (revNextString != NULL) {
        strcat(revResultStr, revNextString);
        revNextString = va_arg(revArgs, const char *);
    }

    va_end(revArgs);

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
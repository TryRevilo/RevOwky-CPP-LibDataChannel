//
// Created by rev on 5/26/23.
//
#include "rev_entity_annotation.h"

#include <string.h>

int revPersGetAnnNameID(char *revEntityAnnotationName) {
    int revAnnNameID = -1;

    if (strcmp(revEntityAnnotationName, "rev_like") == 0) {
        revAnnNameID = 1;
    }

    return revAnnNameID;
}
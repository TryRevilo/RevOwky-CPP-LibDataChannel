//
// Created by rev on 5/26/23.
//
#include "rev_entity_annotation.h"

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>
#include <string.h>

RevEntityAnnotation *revInitializedAnnotation() {
    RevEntityAnnotation *revEntityAnnotation = (RevEntityAnnotation *) malloc(sizeof(RevEntityAnnotation));


    revEntityAnnotation->_revAnnotationResStatus = -1;

    revEntityAnnotation->_revAnnotationNameId = -1;
    revEntityAnnotation->_revAnnotationName = "";

    revEntityAnnotation->_revAnnotationValue = "";

    revEntityAnnotation->_revAnnotationId = -1;
    revEntityAnnotation->_revAnnotationRemoteId = -1;

    revEntityAnnotation->_revAnnotationEntityGUID = -1;
    revEntityAnnotation->_revAnnotationRemoteEntityGUID = -1;

    revEntityAnnotation->_revAnnOwnerEntityGUID = -1;
    revEntityAnnotation->_revAnnRemoteOwnerEntityGUID = -1;

    revEntityAnnotation->_revAnnotationTimeCreated = "";
    revEntityAnnotation->_revAnnotationTimeUpdated = "";

    revEntityAnnotation->_revTimeCreated = -1;
    revEntityAnnotation->_revTimePublished = -1;
    revEntityAnnotation->_revTimePublishedUpdated = -1;

    return revEntityAnnotation;
}

int revPersGetAnnNameID(char *revEntityAnnotationName) {
    int revAnnNameID = -1;

    if (strcmp(revEntityAnnotationName, "rev_like") == 0) {
        revAnnNameID = 1;
    }

    return revAnnNameID;
}
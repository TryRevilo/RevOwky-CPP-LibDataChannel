//
// Created by rev on 8/21/18.
//

#ifndef OWKI_REV_ENTITY_ANNOTATION_H
#define OWKI_REV_ENTITY_ANNOTATION_H

#include <string.h>

typedef struct RevEntityAnnotation {
    int _revResolveStatus;

    char *_revName;

    char *_revValue;

    long _revId;
    long _revRemoteId;

    long _revGUID;
    long _revRemoteGUID;

    long _revOwnerGUID;
    long _revRemoteOwnerGUID;

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityAnnotation;

RevEntityAnnotation *revInitializedAnnotation();

#endif //OWKI_REV_ENTITY_ANNOTATION_H

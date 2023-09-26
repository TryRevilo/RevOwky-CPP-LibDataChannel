//
// Created by rev on 8/21/18.
//

#ifndef OWKI_REV_ENTITY_ANNOTATION_H
#define OWKI_REV_ENTITY_ANNOTATION_H

#include <string.h>

typedef struct RevEntityAnnotation {
    int _revAnnotationResStatus;

    char *_revAnnotationName;

    char *_revAnnotationValue;

    long _revAnnotationId;
    long _revAnnotationRemoteId;

    long _revAnnotationEntityGUID;
    long _revAnnotationRemoteEntityGUID;

    long _revAnnOwnerEntityGUID;
    long _revAnnRemoteOwnerEntityGUID;

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityAnnotation;

RevEntityAnnotation *revInitializedAnnotation();

#endif //OWKI_REV_ENTITY_ANNOTATION_H

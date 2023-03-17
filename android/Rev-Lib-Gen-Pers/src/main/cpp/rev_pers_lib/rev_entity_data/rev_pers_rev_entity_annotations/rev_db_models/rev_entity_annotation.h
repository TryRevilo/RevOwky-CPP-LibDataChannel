//
// Created by rev on 8/21/18.
//

#ifndef OWKI_REV_ENTITY_ANNOTATION_H
#define OWKI_REV_ENTITY_ANNOTATION_H

typedef struct RevEntityAnnotation {
    int _revAnnotationResStatus;

    int _revAnnotationNameId;
    char *_revAnnotationName;

    char *_revAnnotationValue;

    long _revAnnotationId;
    long _revAnnotationRemoteId;

    long _revAnnotationEntityGUID;
    long _revAnnotationRemoteEntityGUID;

    long _revAnnOwnerEntityGUID;
    long _revAnnRemoteOwnerEntityGUID;

    char *_revAnnotationTimeCreated;
    char *_revAnnotationTimeUpdated;

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityAnnotation;

#endif //OWKI_REV_ENTITY_ANNOTATION_H
//
// Created by rev on 12/20/22.
//

#ifndef OWKI_REV_ENTITY_RELATIONSHIPS_H
#define OWKI_REV_ENTITY_RELATIONSHIPS_H

typedef struct RevEntityRelationship
{

    int _revResolveStatus;
    int _revTypeValueId;
    char *_revType;
    long _revId;
    long _revRemoteId;

    long _revGUID;
    long _revRemoteGUID;

    long _revSubjectGUID;
    long _revRemoteSubjectGUID;
    long _revTargetGUID;
    long _revRemoteTargetGUID;

    long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityRelationship;

RevEntityRelationship *revInitializedEntityRelationship();

RevEntityRelationship *revJSONEntityRelationshipFiller(const char *const revJSONStringEntityRelationship);

#endif // OWKI_REV_ENTITY_RELATIONSHIPS_H

//
// Created by rev on 12/20/22.
//

#ifndef OWKI_REV_ENTITY_RELATIONSHIPS_H
#define OWKI_REV_ENTITY_RELATIONSHIPS_H

typedef struct RevEntityRelationship {

    int _revResolveStatus;
    int _revEntityRelationshipTypeValueId;
    char *_revEntityRelationshipType;
    long _revEntityRelationshipId;
    long _revRemoteEntityRelationshipId;

    long _revEntityGUID;
    long _revRemoteEntityGUID;

    long _revEntitySubjectGUID;
    long _revRemoteEntitySubjectGUID;
    long _revEntityTargetGUID;
    long _revRemoteEntityTargetGUID;

    long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityRelationship;

RevEntityRelationship *revInitializedEntityRelationship();

RevEntityRelationship *revJSONEntityRelationshipFiller(const char *const revJSONStringEntityRelationship);

#endif //OWKI_REV_ENTITY_RELATIONSHIPS_H

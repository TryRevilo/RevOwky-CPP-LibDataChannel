#ifndef REV_PERS_RELATIONSHIPS
#define REV_PERS_RELATIONSHIPS

char *getRevEntityRelValue(int relTypeValId);

int revPersGetRelId(char *revEntityrelationship);

long revPersRelationshipObject(RevEntityRelationship *revEntityRelationship);

long revPersRelationships(long revEntitySubjectGUID, char *relationship, long revEntityTargetGUID);

long revPersRelationships_By_SetResolveStatus(long revEntitySubjectGUID, char *revEntityRelationshipType, long revEntityTargetGUID, long remoteRevEntityRelationshipId, int revResolveStatus);

#endif // REV_PERS_RELATIONSHIPS

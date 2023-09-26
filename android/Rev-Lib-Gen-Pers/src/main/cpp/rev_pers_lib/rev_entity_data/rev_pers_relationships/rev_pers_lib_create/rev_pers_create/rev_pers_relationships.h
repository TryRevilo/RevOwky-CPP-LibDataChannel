#ifndef REV_PERS_RELATIONSHIPS
#define REV_PERS_RELATIONSHIPS

#include "../../rev_db_models/rev_entity_relationships.h"

char *getRevEntityRelValue(int relTypeValId);

int revPersGetRelId(char *revEntityRelationship);

long revPersRelationshipObject(RevEntityRelationship *revEntityRelationship);

#endif // REV_PERS_RELATIONSHIPS

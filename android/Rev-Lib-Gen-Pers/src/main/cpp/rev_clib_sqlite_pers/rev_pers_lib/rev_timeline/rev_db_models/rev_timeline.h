#ifndef REV_TIMELINE_H
#define REV_TIMELINE_H

#include "../../rev_entity/rev_pers_rev_object_entity/rev_db_models/rev_entity_object.h"
#include "../../rev_entity/rev_pers_rev_group_entity/rev_db_models/rev_entity_group.h"
#include "../../rev_entity/rev_pers_rev_user_entity/rev_db_models/rev_entity_user.h"
#include "../../rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"
#include <rev_linked_list.h>

typedef struct RevTimeline {

    long _id;
    char *_revEntityType;
    char *_revEntitySubType;

    long _revEntityGUID;
    long _remoteRevEntityGUID;
    long _revOwnerEntityGUID;
    long _revContainerEntityGUID;
    long _revSiteEntityGUID;
    int _revEntityAccessPermission;

    int _revReadStatus;
    int _revLocalResolveStatus;
    int _revRemoteResolveStatus;

    char *_timeCreated;
    char *_timeUpdated;

    RevEntityRelationship _revEntityRelationship;
    RevObjectEntity _revObjectEntity;
    RevGroupEntity _revGroupEntity;
    RevUserEntity _revUserEntity;

    list _revEntityMetadataList;

} RevTimeline;

#endif // REV_TIMELINE_H

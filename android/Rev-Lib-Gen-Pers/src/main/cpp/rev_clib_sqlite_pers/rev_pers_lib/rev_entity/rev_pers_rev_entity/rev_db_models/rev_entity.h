#ifndef REV_ENTITY_H
#define REV_ENTITY_H

#include "../../rev_pers_rev_object_entity/rev_db_models/rev_entity_object.h"
#include "../../rev_pers_rev_group_entity/rev_db_models/rev_entity_group.h"
#include "../../rev_pers_rev_user_entity/rev_db_models/rev_entity_user.h"
#include <rev_linked_list.h>

typedef struct RevEntity {

    bool _isNull;

    long _id;
    char *_revEntityType;
    char *_revEntitySubType;

    int _revEntityResolveStatus;
    int _revEntityChildableStatus;

    long _revEntityGUID;
    long _remoteRevEntityGUID;
    long _revOwnerEntityGUID;
    long _revContainerEntityGUID;
    long _remoteRevEntityContainerGUID;
    long _revSiteEntityGUID;
    int _revEntityAccessPermission;

    char *_timeCreated;
    char *_timeUpdated;

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;

    struct RevEntity *childRevEntity;

    list _revEntityMetadataList;

} RevEntity;

#endif // REV_ENTITY_H

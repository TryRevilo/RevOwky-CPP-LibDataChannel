#ifndef REV_ENTITY_H
#define REV_ENTITY_H

#include <stdio.h>
#include <string.h>

#include "../../rev_pers_rev_object_entity/rev_db_models/rev_entity_object.h"
#include "../../rev_pers_rev_group_entity/rev_db_models/rev_entity_group.h"
#include "../../rev_pers_rev_user_entity/rev_db_models/rev_entity_user.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

typedef struct RevEntity {

    bool _isNull;

    long _id;
    char *_revEntityType;
    char *_revEntitySubType;

    int _revEntityResolveStatus;
    int _revEntityChildableStatus;
    int _revEntityAccessPermission;

    long _revEntityGUID;
    long _remoteRevEntityGUID;
    long _revOwnerEntityGUID;
    long _revContainerEntityGUID;
    long _remoteRevEntityContainerGUID;
    long _revEntitySiteGUID;

    char *_timeCreated;
    char *_timeUpdated;

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;

    struct RevEntity *childRevEntity;
    struct RevEntity *_revInfoEntity;

    list _revEntityMetadataList;

} RevEntity;

typedef struct {
    char *key;
    void *value;
} RevEntityKeyValuePair;

RevEntityKeyValuePair *revGetEntityKeyValuePairMapping(RevEntity *revEntity);

RevEntity *revInitializedEntity();

RevEntity *revJSONEntityFiller(const char *const revJSONStringEntity);

#endif // REV_ENTITY_H

#ifndef REV_ENTITY_H
#define REV_ENTITY_H

#include <stdio.h>
#include <string.h>
#include "../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../libs/rev_map/rev_map.h"
#include "../../../rev_db_init/rev_db_init.h"

typedef struct RevEntity {

    bool _isNull;

    long _id;
    char *_revEntityType;
    char *_revEntitySubType;

    int _revEntityResolveStatus;
    int _revEntityChildableStatus;
    int _revEntityAccessPermission;

    long _revEntityGUID;
    long _revRemoteEntityGUID;
    long _revOwnerEntityGUID;
    long _revContainerEntityGUID;
    long _remoteRevEntityContainerGUID;
    long _revEntitySiteGUID;

    long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;

    struct RevEntity *childRevEntity;
    struct RevEntity *_revInfoEntity;

    list _revEntityMetadataList;

} RevEntity;

RevEntity *revInitializedEntity();

RevEntity *revJSONEntityFiller(const char *const revJSONStringEntity);

/** START MAPPERS **/

RevKeyValuePair *revGetEntityKeyValuePairMapping(RevEntity *revEntity);

htable_strstr_t *revGetEntityDB_Keys();

htable_strstr_t *revGetMapped_Entity_Key_DBFieldName();

#endif // REV_ENTITY_H

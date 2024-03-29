#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <android/log.h>

#include "../rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "../rev_pers_rev_entity/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity.h"
#include "../rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metadata.h"
#include "../rev_entity_data/rev_pers_relationships/rev_db_models/rev_entity_relationships.h"
#include "../rev_entity_data/rev_pers_relationships/rev_pers_lib_create/rev_pers_create/rev_pers_relationships.h"

bool setMetadataOwnerGUID(void *data, long ownerGUID) {
    if (!ownerGUID || ownerGUID < 1)
        return FALSE;

    RevEntityMetadata *d = (RevEntityMetadata *) data;
    d->_revGUID = ownerGUID;

    return TRUE;
}

void loopMetadata(list *list, long revEntityGUID) {
    listNode *node = list->head;
    bool result = TRUE;
    
    while (node != NULL && result) {
        result = setMetadataOwnerGUID(node->data, revEntityGUID);
        node = node->next;
    }
}

long revPersInit(RevEntity *revEntity) {
    long revEntityGUID = revPersSaveRevEntity(revEntity);

    /** Save entity metadata **/
    list revEntityMetadataList = revEntity->_revMetadataList;
    int revMetadataListSize = list_size(&revEntityMetadataList);

    if (revMetadataListSize > 0) {
        loopMetadata(&revEntityMetadataList, revEntityGUID);
        revPersSaveRevMetadata(&revEntityMetadataList);
    }

    RevEntity *revInfoEntity = revEntity->_revInfoEntity;

    char *revEntityType = revInfoEntity->_revType;
    char *revInfoEntitySubType = revInfoEntity->_revSubType;

    if (revInfoEntity && (revEntityType != NULL) && (revEntityType[0] != '\0') && (revInfoEntitySubType != NULL) && (revInfoEntitySubType[0] != '\0')) {
        revInfoEntity->_revContainerGUID = revEntityGUID;

        long revInfoEntityGUID = revPersInit(revInfoEntity);

        RevEntityRelationship *c_revRelationship = revInitializedEntityRelationship();

        c_revRelationship->_revType = "rev_entity_info";
        c_revRelationship->_revSubjectGUID = revInfoEntityGUID;
        c_revRelationship->_revTargetGUID = revEntityGUID;
        c_revRelationship->_revResolveStatus = -1;
        c_revRelationship->_revRemoteId = -1;

        long relationshipId = revPersRelationshipObject(c_revRelationship);
    }

    return revEntityGUID;
}


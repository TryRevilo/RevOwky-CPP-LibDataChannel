#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
#include "../rev_entity/rev_pers_rev_entity/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity.h"
#include "../rev_entity/rev_pers_rev_object_entity/rev_pers_lib_create/rev_pers_create/rev_pers_rev_object_entity.h"
#include "../rev_entity_data/rev_pers_rev_entity_metadata/rev_pers_lib_create/rev_pers_create/rev_pers_rev_entity_metadata.h"

// when building boost we persisted the NDK version used (BOOST_BUILT_WITH_NDK_VERSION) in this custom header file

bool setMetadataOwnerGUID(void *data, long ownerGUID) {
    RevEntityMetadata *d = (RevEntityMetadata *) data;
    d->_metadataOwnerGUID = ownerGUID;
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
    loopMetadata(&(revEntity->_revEntityMetadataList), revEntityGUID);

    if (list_size(&(revEntity->_revEntityMetadataList)) > 0)
        revPersSaveRevMetadata(&(revEntity->_revEntityMetadataList));

    return revEntityGUID;
}


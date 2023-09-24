//
// Created by rev on 6/1/23.
//

#ifndef OWKI_REV_ENTITY_METADATA_H
#define OWKI_REV_ENTITY_METADATA_H

#include "../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../libs/rev_map/rev_map.h"

typedef struct RevEntityMetadata {
    int _resolveStatus;
    long _metadataId;
    long _remoteRevMetadataId;
    long _metadataOwnerGUID;
    long _metadataValueId;
    char *_metadataName;
    char *_metadataValue;

    char *_timeCreated;
    char *_timeUpdated;

    long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityMetadata;

htable_strstr_t *revGetMetadataDB_Keys();

htable_strstr_t *revGetMapped_Metadata_Key_DBFieldName();

RevEntityMetadata *revInitializedMetadata();

RevEntityMetadata *revJSONStrMetadataFiller(const char *revEntityMetadataJSONStr);

list *revMetaDataJSONArrStrFiller(const char *const revEntityMetadataJSONArrStr);

#endif //OWKI_REV_ENTITY_METADATA_H

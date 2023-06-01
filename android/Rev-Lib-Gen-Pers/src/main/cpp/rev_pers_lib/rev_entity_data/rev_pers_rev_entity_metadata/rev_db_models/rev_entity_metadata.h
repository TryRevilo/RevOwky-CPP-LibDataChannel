//
// Created by rev on 6/1/23.
//

#ifndef OWKI_REV_ENTITY_METADATA_H
#define OWKI_REV_ENTITY_METADATA_H

#include "../../../../../../../libs/rev_list/rev_linked_list.h"

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

RevEntityMetadata *revInitializedMetadata();

RevEntityMetadata *revJSONStrMetadataFiller(const char *const revEntityMetadataJSONStr);

list *revMetaDataJSONArrStrFiller(const char *const revEntityMetadataJSONArrStr);

#endif //OWKI_REV_ENTITY_METADATA_H

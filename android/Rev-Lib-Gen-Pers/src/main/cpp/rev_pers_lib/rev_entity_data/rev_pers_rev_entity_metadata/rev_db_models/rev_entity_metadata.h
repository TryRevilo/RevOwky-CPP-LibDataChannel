//
// Created by rev on 12/6/22.
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

list *revJSONMetadataFiller(const char *const revJSONStringMetadata);

#endif //OWKI_REV_ENTITY_METADATA_H

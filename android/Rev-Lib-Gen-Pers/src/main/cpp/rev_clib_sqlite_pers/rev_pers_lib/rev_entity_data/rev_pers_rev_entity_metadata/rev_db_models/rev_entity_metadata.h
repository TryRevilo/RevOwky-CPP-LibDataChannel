//
// Created by rev on 7/9/18.
//

#ifndef OWKI_REV_ENTITY_METADATA_H
#define OWKI_REV_ENTITY_METADATA_H

#include <rev_linked_list.h>
#include <cJSON.h>

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

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityMetadata;

// list *revPersCreateRevEntityMetadataList(char *revJSONStr);

#endif //OWKI_REV_ENTITY_METADATA_H

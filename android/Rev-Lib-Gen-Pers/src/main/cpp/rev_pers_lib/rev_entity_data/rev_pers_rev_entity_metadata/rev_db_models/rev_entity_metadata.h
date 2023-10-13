//
// Created by rev on 6/1/23.
//

#ifndef OWKI_REV_ENTITY_METADATA_H
#define OWKI_REV_ENTITY_METADATA_H

#include "../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../libs/rev_map/rev_map.h"

typedef struct RevEntityMetadata
{
    int _revResolveStatus;
    long _revId;
    long _revRemoteId;
    long _revGUID;
    char *_revName;
    char *_revValue;

    long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityMetadata;

htable_strstr_t *revGetMetadataDB_Keys();

htable_strstr_t *revGetMapped_Metadata_Key_DBFieldName();

RevEntityMetadata *revInitializedMetadata();

RevEntityMetadata *revJSONStrMetadataFiller(const char *revEntityMetadataJSONStr);

void revMetaDataJSONArrStrFiller(list *revList, const char *const revEntityMetadataJSONArrStr);

#endif // OWKI_REV_ENTITY_METADATA_H

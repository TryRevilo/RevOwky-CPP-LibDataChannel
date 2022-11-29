//
// Created by rev on 8/21/18.
//

#include <string.h>
#include "FEED_ENTRY_REV_ENTITY_ANNOTATIONS.h"

FEED_ENTRY_REV_ENTITY_ANNOTATION *NEW_FEED_ENTRY_REV_ENTITY_RELATIONSHIP() {
    FEED_ENTRY_REV_ENTITY_ANNOTATION feedEntryRevEntityMetadata;

    feedEntryRevEntityMetadata.TABLE_NAME = strdup("REV_ENTITY_RELATIONSHIPS_TABLE");
    feedEntryRevEntityMetadata.REV_SUBJECT_GUID = strdup("REV_SUBJECT_GUID");
    feedEntryRevEntityMetadata.REV_TARGET_GUID = strdup("REV_TARGET_GUID");
    feedEntryRevEntityMetadata.REV_RELATIONSHIP_TYPE_VALUE_ID = strdup(
            "REV_RELATIONSHIP_TYPE_VALUE_ID");

    feedEntryRevEntityMetadata.REV_CREATED_DATE = strdup("REV_CREATED_DATE");
    feedEntryRevEntityMetadata.REV_UPDATED_DATE = strdup("REV_UPDATED_DATE");

    return &feedEntryRevEntityMetadata;
}
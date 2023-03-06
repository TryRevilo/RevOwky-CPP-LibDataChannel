#include <string.h>
#include "FEED_ENTRY_REV_ENTITY_METADATA.h"

FEED_ENTRY_REV_ENTITY_METADATA *NEW_FEED_ENTRY_REV_ENTITY_METADATA() {
    FEED_ENTRY_REV_ENTITY_METADATA feedEntryRevEntityMetadata;

    feedEntryRevEntityMetadata.TABLE_NAME = strdup("REV_ENTITY_METADATA_TABLE");
    feedEntryRevEntityMetadata.COLUMN_METADATA_ID = strdup("METADATA_ID");
    feedEntryRevEntityMetadata.COLUMN_METADATA_ENTITY_GUID = strdup("METADATA_ENTITY_GUID");
    feedEntryRevEntityMetadata.COLUMN_METADATA_NAME = strdup("METADATA_NAME");
    feedEntryRevEntityMetadata.COLUMN_METADATA_VALUE_ID = strdup("METADATA_VALUE_ID");
    feedEntryRevEntityMetadata.REV_CREATED_DATE = strdup("CREATED_DATE");
    feedEntryRevEntityMetadata.REV_UPDATED_DATE = strdup("UPDATED_DATE");

    return &feedEntryRevEntityMetadata;
}

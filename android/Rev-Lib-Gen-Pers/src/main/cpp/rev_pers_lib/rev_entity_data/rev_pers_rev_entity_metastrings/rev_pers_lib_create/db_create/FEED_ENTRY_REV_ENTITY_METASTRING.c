#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "FEED_ENTRY_REV_ENTITY_METASTRING.h"

FEED_ENTRY_REV_ENTITY_METASTRING *NEW_FEED_ENTRY_REV_ENTITY_METASTRING() {
    FEED_ENTRY_REV_ENTITY_METASTRING feedEntryRevEntityMetadata;

    feedEntryRevEntityMetadata.TABLE_NAME = strdup("REV_ENTITY_METASTRINGS_TABLE");
    feedEntryRevEntityMetadata.REV_METASTRING_ID = strdup("REV_METASTRING_ID");
    feedEntryRevEntityMetadata.REV_METASTRING_VALUE = strdup("REV_METASTRING_VALUE");
    feedEntryRevEntityMetadata.REV_CREATED_DATE = strdup("REV_CREATED_DATE");
    feedEntryRevEntityMetadata.REV_UPDATED_DATE = strdup("REV_UPDATED_DATE");

    return &feedEntryRevEntityMetadata;
}

#include <string.h>
#include "FEED_ENTRY_REV_ENTITY.h"

FEED_ENTRY_REV_ENTITY * NEW_FEED_ENTRY_REV_ENTITY() {
    FEED_ENTRY_REV_ENTITY feedEntryRevEntity;

    feedEntryRevEntity.TABLE_NAME = strdup("REV_ENTITY_TABLE");
    feedEntryRevEntity.REV_ENTITY_GUID = strdup("REV_ENTITY_GUID");
    feedEntryRevEntity.REV_OWNER_ENTITY_GUID = strdup("REV_OWNER_ENTITY_GUID");
    feedEntryRevEntity.REV_CONTAINER_ENTITY_GUID = strdup(
            "REV_CONTAINER_ENTITY_GUID");
    feedEntryRevEntity.REV_ACCESS_PERMISSION = strdup("REV_ACCESS_PERMISSION");
    feedEntryRevEntity.REV_ENTITY_TYPE = strdup("REV_ENTITY_TYPE");
    feedEntryRevEntity.REV_ENTITY_SUB_TYPE = strdup("REV_ENTITY_SUB_TYPE");
    feedEntryRevEntity.REV_CREATED_DATE = strdup("REV_CREATED_DATE");
    feedEntryRevEntity.REV_UPDATED_DATE = strdup("REV_UPDATED_DATE");

    return &feedEntryRevEntity;
}

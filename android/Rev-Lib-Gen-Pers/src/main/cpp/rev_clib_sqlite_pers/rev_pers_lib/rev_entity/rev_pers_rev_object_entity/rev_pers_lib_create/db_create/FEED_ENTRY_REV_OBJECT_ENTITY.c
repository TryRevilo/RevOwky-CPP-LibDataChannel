#include <string.h>
#include "FEED_ENTRY_REV_OBJECT_ENTITY.h"

FEED_ENTRY_REV_OBJECT_ENTITY *NEW_FEED_ENTRY_REV_OBJECT_ENTITY()
{
    FEED_ENTRY_REV_OBJECT_ENTITY feedEntryRevObjectEntity;

    feedEntryRevObjectEntity.TABLE_NAME = strdup("REV_OBJECT_ENTITY_TABLE");
    feedEntryRevObjectEntity.REV_ENTITY_ID = strdup("REV_ENTITY_ID");
    feedEntryRevObjectEntity.REV_OWNER_ENTITY_GUID = strdup("REV_OWNER_ENTITY_GUID");
    feedEntryRevObjectEntity.REV_ENTITY_CONTAINER_GUID = strdup("REV_ENTITY_CONTAINER_GUID");
    feedEntryRevObjectEntity.REV_REV_OBJJECT_NAME = strdup("REV_REV_OBJJECT_NAME");
    feedEntryRevObjectEntity.REV_REV_OBJJECT_DESCRIPTION = strdup("REV_REV_OBJJECT_DESCRIPTION");
    feedEntryRevObjectEntity.REV_CREATED_DATE = strdup("REV_CREATED_DATE");
    feedEntryRevObjectEntity.REV_UPDATED_DATE = strdup("REV_UPDATED_DATE");

    return &feedEntryRevObjectEntity;
}

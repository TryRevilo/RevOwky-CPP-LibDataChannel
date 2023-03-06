#include <string.h>
#include "FEED_ENTRY_REV_GROUP_ENTITY.h"

FEED_ENTRY_REV_GROUP_ENTITY *newFeedEntry_REV_GROUP_ENTITY()
{
    FEED_ENTRY_REV_GROUP_ENTITY feedEntryRevGROUPEntity;

    feedEntryRevGROUPEntity.TABLE_NAME = strdup("REV_OBJECT_ENTITY_TABLE");
    feedEntryRevGROUPEntity.REV_ENTITY_ID = strdup("REV_ENTITY_ID");
    feedEntryRevGROUPEntity.REV_OWNER_ENTITY_GUID = strdup("REV_OWNER_ENTITY_GUID");
    feedEntryRevGROUPEntity.REV_ENTITY_CONTAINER_GUID = strdup("REV_ENTITY_CONTAINER_GUID");
    feedEntryRevGROUPEntity.REV_REV_GROUP_NAME = strdup("REV_REV_GROUP_NAME");
    feedEntryRevGROUPEntity.REV_REV_GROUP_DESCRIPTION = strdup("REV_REV_GROUP_DESCRIPTION");
    feedEntryRevGROUPEntity.REV_CREATED_DATE = strdup("REV_CREATED_DATE");
    feedEntryRevGROUPEntity.REV_UPDATED_DATE = strdup("REV_UPDATED_DATE");

    return &feedEntryRevGROUPEntity;
}

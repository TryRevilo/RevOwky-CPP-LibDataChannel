#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "FEED_ENTRY_REV_USER_ENTITY.h"

FEED_ENTRY_REV_USER_ENTITY *NEW_FEED_ENTRY_REV_USER_ENTITY()
{
    FEED_ENTRY_REV_USER_ENTITY feedEntryRevUserEntity;

    feedEntryRevUserEntity.TABLE_NAME = strdup("REV_USER_ENTITY_TABLE");
    feedEntryRevUserEntity.REV_ENTITY_ID = strdup("REV_ENTITY_ID");
    feedEntryRevUserEntity.REV_OWNER_ENTITY_GUID = strdup("REV_OWNER_ENTITY_GUID");
    feedEntryRevUserEntity.REV_ENTITY_CONTAINER_GUID = strdup("REV_ENTITY_CONTAINER_GUID");
    feedEntryRevUserEntity.REV_REV_USER_EMAIL = strdup("REV_REV_USER_EMAIL");
    feedEntryRevUserEntity.REV_REV_USER_FULL_NAMES = strdup("REV_REV_USER_FULL_NAMES");
    feedEntryRevUserEntity.REV_CREATED_DATE = strdup("REV_CREATED_DATE");
    feedEntryRevUserEntity.REV_UPDATED_DATE = strdup("REV_UPDATED_DATE");

    return &feedEntryRevUserEntity;
}

#ifndef REV_PERS_REV_CONTAINER_ENTITY
#define REV_PERS_REV_CONTAINER_ENTITY

#include "rev_db_models/rev_entity_group.h"

long revPersSaveRevGroupEntity(RevGroupEntity *revGroupEntity);

long revPersUpdateRevContainerEntity(long entityGUID);

long revPersDeleteDataRevContainerEntity(long revEntityGUID);

#endif // REV_PERS_REV_USER_ENTITY

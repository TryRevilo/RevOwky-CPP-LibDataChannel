#ifndef REV_PERS_REV_USER_ENTITY
#define REV_PERS_REV_USER_ENTITY

#include "../../rev_db_models/rev_entity_user.h"

long revPersSaveRevUserEntity(RevUserEntity *revUserEntity);

RevUserEntity revPersGet_RevRevUserEntityByRevEntityGUID(long revEntityUID);

#endif // REV_PERS_REV_USER_ENTITY

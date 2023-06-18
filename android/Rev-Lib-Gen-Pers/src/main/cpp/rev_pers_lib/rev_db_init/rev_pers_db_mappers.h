//
// Created by rev on 6/17/23.
//

#ifndef OWKI_REV_PERS_DB_MAPPERS_H
#define OWKI_REV_PERS_DB_MAPPERS_H

#include "../../../../../libs/cJSON/cJSON.h"
#include "../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../libs/rev_map/rev_map.h"

#include "rev_db_init.h"

char *revGetWhere(const cJSON *revWhere_CJSON, htable_strstr_t *revMap);

cJSON *revPersGetQuery_By_RevVarArgs(char *revVarArgs, htable_strstr_t *revMap, htable_strstr_t *revMappedEntityColNameMap);

#endif //OWKI_REV_PERS_DB_MAPPERS_H

//
// Created by rev on 7/6/18.
//

#ifndef OWKI_REV_PERS_READ_REV_TIMELINE_H
#define OWKI_REV_PERS_READ_REV_TIMELINE_H

#include "../../rev_entity/rev_pers_rev_entity/rev_db_models/rev_entity.h"

int revTimelineEntityExists_BY_RevEntityGUID(int revEntityGUID);

list *revPersGetALLRevTimelineEntityUnResolved();

#endif //OWKI_REV_PERS_READ_REV_TIMELINE_H

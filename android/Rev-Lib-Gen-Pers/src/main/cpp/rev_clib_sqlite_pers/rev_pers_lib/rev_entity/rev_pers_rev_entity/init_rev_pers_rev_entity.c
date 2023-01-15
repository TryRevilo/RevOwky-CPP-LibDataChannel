//
// Created by rev on 7/3/18.
//

#include "rev_pers_lib_create/db_create/FEED_ENTRY_REV_ENTITY.h"

FEED_ENTRY_REV_ENTITY *EXT_NEW_FEED_ENTRY_REV_ENTITY;

void init_rev_pers_rev_entity() {
    EXT_NEW_FEED_ENTRY_REV_ENTITY = NEW_FEED_ENTRY_REV_ENTITY();
}

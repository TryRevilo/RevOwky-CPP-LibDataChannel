//
// Created by rev on 12/29/22.
//

#ifndef OWKI_REV_PERS_LIB_CREATE_HPP
#define OWKI_REV_PERS_LIB_CREATE_HPP

#include <jni.h>

extern "C"
{
#include "../cpp/rev_pers_lib/rev_entity_data/rev_pers_rev_entity_metadata/rev_db_models/rev_entity_metadata.h"
}

JavaVM *revGetJVM();

#endif //OWKI_REV_PERS_LIB_CREATE_HPP

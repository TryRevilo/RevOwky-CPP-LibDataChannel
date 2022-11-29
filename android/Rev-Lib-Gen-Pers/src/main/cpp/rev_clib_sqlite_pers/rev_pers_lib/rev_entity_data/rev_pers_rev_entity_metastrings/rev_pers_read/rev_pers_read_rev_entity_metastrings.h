//
// Created by rev on 8/10/18.
//

#include <rev_linked_list.h>

#ifndef OWKI_REV_PERS_READ_REV_ENTITY_METASTRINGS_H
#define OWKI_REV_PERS_READ_REV_ENTITY_METASTRINGS_H

int revEntityMetastringExists(char *revMetastringValue);

long getRevEntityMetaStringValueId(char *revMetastringValue);

char *getRevEntityMetaStringById(long id);

list *revPersGetALLRevEntityRevEntityMetastringIdByValue(char *metastringValue);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_METASTRINGS_H

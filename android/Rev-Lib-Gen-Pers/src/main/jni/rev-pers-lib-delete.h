//
// Created by rev on 6/14/23.
//

#ifndef OWKI_REV_PERS_LIB_DELETE_H
#define OWKI_REV_PERS_LIB_DELETE_H

#include "../../../libs/rev_list/rev_linked_list.h"

bool revSetDelAnnResStatus(long revAnnId, int revResStatus);

bool revSetDelRelResStatus(long revRelID, int revResStatus);

bool revSetDelRevEntityResStatus(long revEntityGUID, int revResStatus);

// Callback function signature
typedef bool (*revSetResStatusCallBack)(void *, int);

void revListForEach(list *list, int revResStatus, revSetResStatusCallBack iterator);

int revDeleteEntity_And_Children_By_EntityGUID(long revEntityGUID);

#endif //OWKI_REV_PERS_LIB_DELETE_H

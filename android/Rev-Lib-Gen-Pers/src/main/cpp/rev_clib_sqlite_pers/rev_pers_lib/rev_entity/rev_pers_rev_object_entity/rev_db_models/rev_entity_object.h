//
// Created by rev on 7/9/18.
//

#ifndef OWKI_REV_ENTITY_OBJECT_H
#define OWKI_REV_ENTITY_OBJECT_H

typedef struct {

    char *_name;
    char *_description;

    long _revEntityGUID;

    long _revOwnerEntityGUID;
    long _revContainerEntityGUID;

    char *_timeCreated;
    char *_timeUpdated;

} RevObjectEntity;

#endif //OWKI_REV_ENTITY_OBJECT_H

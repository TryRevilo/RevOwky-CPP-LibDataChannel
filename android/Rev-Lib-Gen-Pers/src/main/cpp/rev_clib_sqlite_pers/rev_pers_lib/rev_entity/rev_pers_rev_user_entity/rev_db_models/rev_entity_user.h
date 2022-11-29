//
// Created by rev on 7/9/18.
//

#ifndef OWKI_REV_ENTITY_USER_H
#define OWKI_REV_ENTITY_USER_H

typedef struct {

    char *_full_names;
    char *_email;

    long _revEntityGUID;

    long _revOwnerEntityGUID;
    long _revContainerEntityGUID;

} RevUserEntity;

#endif //OWKI_REV_ENTITY_USER_H

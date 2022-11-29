//
// Created by rev on 7/9/18.
//

#ifndef OWKI_REV_ENTITY_METASTRINGS_H
#define OWKI_REV_ENTITY_METASTRINGS_H

typedef struct {

    long _metastringId;
    char *_metastringValue;

    char *_timeCreated;
    char *_timeUpdated;

    long long _revTimeCreated;
    long _revTimePublished;
    long _revTimePublishedUpdated;
} RevEntityMetastring;

#endif //OWKI_REV_ENTITY_METASTRINGS_H

//
// Created by rev on 2/4/23.
//

#ifndef OWKI_REV_MAP_H
#define OWKI_REV_MAP_H

/**
 * Copyright (c) 2014 rxi
 *
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the MIT license. See LICENSE for details.
 *
 * https://github.com/rxi/map
 * https://raw.githubusercontent.com/rxi/map/master/src/map.h
 *
 *
 */

#include <stdbool.h>

struct htable;
typedef struct htable htable_t;

struct htable_enum;
typedef struct htable_enum htable_enum_t;

typedef unsigned int (*htable_hash)(const void *in, unsigned int seed);

typedef void *(*htable_kcopy)(void *in);

typedef bool (*htable_keq)(const void *a, const void *b);

typedef void (*htable_kfree)(void *in);

typedef void *(*htable_vcopy)(void *in);

typedef void (*htable_vfree)(void *in);

typedef struct {
    htable_kcopy key_copy;
    htable_kfree key_free;
    htable_vcopy val_copy;
    htable_vfree val_free;
} htable_cbs;

htable_t *htable_create(htable_hash hfunc, htable_keq keq, htable_cbs *cbs);

void htable_destroy(htable_t *ht);

void htable_insert(htable_t *ht, void *key, void *val);

void htable_remove(htable_t *ht, void *key);

bool htable_get(htable_t *ht, void *key, void **val);

void *htable_get_direct(htable_t *ht, void *key);

htable_enum_t *htable_enum_create(htable_t *ht);

bool htable_enum_next(htable_enum_t *he, void **key, void **val);

void htable_enum_destroy(htable_enum_t *he);



// - - - -


struct htable_strstr;
typedef struct htable_strstr htable_strstr_t;

struct htable_strstr_enum;
typedef struct htable_strstr_enum htable_strstr_enum_t;

typedef enum {
    HTABLE_STR_NONE = 0,
    HTABLE_STR_CASECMP
} htable_strstr_flags_t;

htable_strstr_t *htable_strstr_create(unsigned int flags);

void htable_strstr_destroy(htable_strstr_t *ht);

void htable_strstr_insert(htable_strstr_t *ht, const char *key, const char *val);

void htable_strstr_remove(htable_strstr_t *ht, const char *key);

bool htable_strstr_get(htable_strstr_t *ht, const char *key, const char **val);

const char *htable_strstr_get_direct(htable_strstr_t *ht, const char *key);

htable_strstr_enum_t *htable_strstr_enum_create(htable_strstr_t *ht);

bool htable_strstr_enum_next(htable_strstr_enum_t *he, const char **key, const char **val);

void htable_strstr_enum_destroy(htable_strstr_enum_t *he);

#endif //OWKI_REV_MAP_H

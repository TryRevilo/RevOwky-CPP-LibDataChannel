//
// Created by rev on 2/4/23.
//

#include "rev_map.h"

/**
 * Copyright (c) 2014 rxi
 *
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the MIT license. See LICENSE for details.
 */

#include "rev_map.h"

#include <ctype.h>
#include <stdlib.h>
#include <string.h>

#include <limits.h>
#include <stdlib.h>
#include <time.h>

struct htable_bucket {
    void *key;
    void *val;
    struct htable_bucket *next;
};
typedef struct htable_bucket htable_bucket_t;

struct htable {
    htable_hash hfunc;
    htable_keq keq;
    htable_cbs cbs;
    htable_bucket_t *buckets;
    size_t num_buckets;
    size_t num_used;
    unsigned int seed;
};

struct htable_enum {
    htable_t *ht;
    htable_bucket_t *cur;
    size_t idx;
};

static const size_t BUCKET_START = 16;


static void *htable_passthough_copy(void *v) {
    return v;
}

static void htable_passthough_destroy(void *v) {
    return;
}

static size_t htable_bucket_idx(htable_t *ht, void *key) {
    return ht->hfunc(key, ht->seed) % ht->num_buckets;
}

static void htable_add_to_bucket(htable_t *ht, void *key, void *val, bool isrehash) {
    htable_bucket_t *cur;
    htable_bucket_t *last;
    size_t idx;

    idx = htable_bucket_idx(ht, key);
    if (ht->buckets[idx].key == NULL) {
        if (!isrehash) {
            key = ht->cbs.key_copy(key);
            if (val != NULL)
                val = ht->cbs.val_copy(val);
        }
        ht->buckets[idx].key = key;
        ht->buckets[idx].val = val;
        if (!isrehash)
            ht->num_used++;
    } else {
        last = ht->buckets + idx;
        cur = ht->buckets + idx;
        do {
            if (ht->keq(key, cur->key)) {
                if (cur->val != NULL)
                    ht->cbs.val_free(cur->val);
                if (!isrehash && val != NULL)
                    val = ht->cbs.val_copy(val);
                cur->val = val;
                last = NULL;
                break;
            }
            last = cur;
            cur = cur->next;
        } while (cur != NULL);

        if (last != NULL) {
            cur = calloc(1, sizeof(*cur->next));
            if (!isrehash) {
                key = ht->cbs.key_copy(key);
                if (val != NULL)
                    val = ht->cbs.val_copy(val);
            }
            cur->key = key;
            cur->val = val;
            last->next = cur;
            if (!isrehash)
                ht->num_used++;
        }
    }
}

static void htable_rehash(htable_t *ht) {
    htable_bucket_t *buckets;
    htable_bucket_t *cur;
    htable_bucket_t *next;
    size_t num_buckets;
    size_t i;

    if (ht->num_used + 1 < (size_t) (ht->num_buckets * 0.75) || ht->num_buckets >= 1 << 31)
        return;

    num_buckets = ht->num_buckets;
    buckets = ht->buckets;
    ht->num_buckets <<= 1;
    ht->buckets = calloc(ht->num_buckets, sizeof(*buckets));

    for (i = 0; i < num_buckets; i++) {
        if (buckets[i].key == NULL)
            continue;

        htable_add_to_bucket(ht, buckets[i].key, buckets[i].val, true);
        if (buckets[i].next != NULL) {
            cur = buckets[i].next;
            do {
                htable_add_to_bucket(ht, cur->key, cur->val, true);
                next = cur->next;
                free(cur);
                cur = next;
            } while (cur != NULL);
        }
    }

    free(buckets);
}

htable_t *htable_create(htable_hash hfunc, htable_keq keq, htable_cbs *cbs) {
    htable_t *ht;

    if (hfunc == NULL || keq == NULL)
        return NULL;

    ht = calloc(1, sizeof(*ht));
    ht->hfunc = hfunc;
    ht->keq = keq;

    ht->cbs.key_copy = htable_passthough_copy;
    ht->cbs.key_free = htable_passthough_destroy;
    ht->cbs.val_copy = htable_passthough_copy;
    ht->cbs.val_free = htable_passthough_destroy;
    if (cbs != NULL) {
        if (cbs->key_copy != NULL) ht->cbs.key_copy = cbs->key_copy;
        if (cbs->key_free != NULL) ht->cbs.key_free = cbs->key_free;
        if (cbs->val_copy != NULL) ht->cbs.val_copy = cbs->val_copy;
        if (cbs->val_free != NULL) ht->cbs.val_free = cbs->val_free;
    }

    ht->num_buckets = BUCKET_START;
    ht->buckets = calloc(BUCKET_START, sizeof(*ht->buckets));

    ht->seed = (unsigned int) time(NULL);
    ht->seed ^= ((unsigned int) htable_create << 16) | (unsigned int) ht;
    ht->seed ^= (unsigned int) &ht->seed;

    return ht;
}

void htable_destroy(htable_t *ht) {
    htable_bucket_t *next;
    htable_bucket_t *cur;
    size_t i;

    if (ht == NULL)
        return;

    for (i = 0; i < ht->num_buckets; i++) {
        if (ht->buckets[i].key == NULL)
            continue;
        ht->cbs.key_free(ht->buckets[i].key);
        ht->cbs.val_free(ht->buckets[i].val);

        next = ht->buckets[i].next;
        while (next != NULL) {
            cur = next;
            ht->cbs.key_free(cur->key);
            ht->cbs.val_free(cur->val);
            next = cur->next;
            free(cur);
        }
    }

    free(ht->buckets);
    free(ht);
}

void htable_insert(htable_t *ht, void *key, void *val) {
    void *ckey;
    void *cval;

    if (ht == NULL || key == NULL)
        return;

    htable_rehash(ht);
    htable_add_to_bucket(ht, key, val, false);
}

void htable_remove(htable_t *ht, void *key) {
    htable_bucket_t *cur;
    htable_bucket_t *last;
    size_t idx;

    if (ht == NULL || key == NULL)
        return;

    idx = htable_bucket_idx(ht, key);
    if (ht->buckets[idx].key == NULL)
        return;

    if (ht->keq(ht->buckets[idx].key, key)) {
        ht->cbs.key_free(ht->buckets[idx].key);
        ht->cbs.val_free(ht->buckets[idx].val);
        ht->buckets[idx].key = NULL;

        cur = ht->buckets[idx].next;
        if (cur != NULL) {
            ht->buckets[idx].key = cur->key;
            ht->buckets[idx].val = cur->val;
            ht->buckets[idx].next = cur->next;
            free(cur);
        }
        ht->num_used--;
        return;
    }

    last = ht->buckets + idx;
    cur = last->next;
    while (cur != NULL) {
        if (ht->keq(key, cur->key)) {
            last->next = cur->next;
            ht->cbs.key_free(cur->key);
            ht->cbs.val_free(cur->val);
            free(cur);
            ht->num_used--;
            break;
        }
        last = cur;
        cur = cur->next;
    }
}

bool htable_get(htable_t *ht, void *key, void **val) {
    htable_bucket_t *cur;
    size_t idx;

    if (ht == NULL || key == NULL)
        return false;

    idx = htable_bucket_idx(ht, key);
    if (ht->buckets[idx].key == NULL)
        return false;

    cur = ht->buckets + idx;
    while (cur != NULL) {
        if (ht->keq(key, cur->key)) {
            if (val != NULL) {
                *val = cur->val;
            }
            return true;
        }
        cur = cur->next;
    }

    return false;
}

void *htable_get_direct(htable_t *ht, void *key) {
    void *val = NULL;
    htable_get(ht, key, &val);
    return val;
}

htable_enum_t *htable_enum_create(htable_t *ht) {
    htable_enum_t *he;

    if (ht == NULL)
        return NULL;

    he = calloc(1, sizeof(*he));
    he->ht = ht;

    return he;
}

bool htable_enum_next(htable_enum_t *he, void **key, void **val) {
    void *mykey;
    void *myval;

    if (he == NULL || he->idx >= he->ht->num_buckets)
        return false;

    if (key == NULL)
        key = &mykey;
    if (val == NULL)
        val = &myval;

    if (he->cur == NULL) {
        while (he->idx < he->ht->num_buckets && he->ht->buckets[he->idx].key == NULL) {
            he->idx++;
        }
        if (he->idx >= he->ht->num_buckets)
            return false;
        he->cur = he->ht->buckets + he->idx;
        he->idx++;
    }

    *key = he->cur->key;
    *val = he->cur->val;
    he->cur = he->cur->next;

    return true;
}

void htable_enum_destroy(htable_enum_t *he) {
    if (he == NULL)
        return;
    free(he);
}

static unsigned int fnv1a_hash_str_int(const void *in, size_t len, unsigned int seed,
                                       bool ignore_case) {
    unsigned int h = seed; /* default offset_basis: 2166136261 */
    unsigned int c;
    size_t i;

    for (i = 0; i < len; i++) {
        c = ((const unsigned char *) in)[i];
        if (ignore_case)
            c = tolower(c);
        h ^= c;
        h *= 16777619; /* FNV prime */
    }

    return h;
}

static unsigned int fnv1a_hash_str(const void *in, unsigned int seed) {
    return fnv1a_hash_str_int(in, strlen((const char *) in), seed, false);
}

static unsigned int fnv1a_hash_str_casecmp(const void *in, unsigned int seed) {
    return fnv1a_hash_str_int(in, strlen((const char *) in), seed, true);
}

static bool htable_str_eq(const void *a, const void *b) {
    return (strcmp(a, b) == 0) ? true : false;
}

static bool htable_str_caseeq(const void *a, const void *b) {
    return (strcasecmp(a, b) == 0) ? true : false;
}

htable_strstr_t *htable_strstr_create(unsigned int flags) {
    htable_hash hash = fnv1a_hash_str;
    htable_keq keq = htable_str_eq;
    htable_cbs cbs = {
            (void *(*)(void *)) strdup,
            free,
            (void *(*)(void *)) strdup,
            free
    };

    if (flags & HTABLE_STR_CASECMP) {
        hash = fnv1a_hash_str_casecmp;
        keq = htable_str_caseeq;
    }

    return (htable_strstr_t *) htable_create(hash, keq, &cbs);
}

void htable_strstr_destroy(htable_strstr_t *ht) {
    htable_destroy((htable_t *) ht);
}

void htable_strstr_insert(htable_strstr_t *ht, const char *key, const char *val) {
    htable_insert((htable_t *) ht, (void *) key, (void *) val);
}

void htable_strstr_remove(htable_strstr_t *ht, const char *key) {
    htable_remove((htable_t *) ht, (void *) key);
}

bool htable_strstr_get(htable_strstr_t *ht, const char *key, const char **val) {
    return htable_get((htable_t *) ht, (void *) key, (void **) val);
}

/**
const char *htable_strstr_get_direct(htable_strstr_t *ht, const char *key) {
    return htable_get_direct((htable_t *) ht, (void *) key);
}
 **/

const char *htable_strstr_get_direct(htable_strstr_t *ht, const char *key) {
    const char *val = NULL;

    if (htable_strstr_get(ht, key, &val)) {
        return val; // Key found, return the value.
    } else {
        return NULL; // Key not found, return NULL or another appropriate value.
    }
}


htable_strstr_enum_t *htable_strstr_enum_create(htable_strstr_t *ht) {
    return (htable_strstr_enum_t *) htable_enum_create((htable_t *) ht);
}

bool htable_strstr_enum_next(htable_strstr_enum_t *he, const char **key, const char **val) {
    return htable_enum_next((htable_enum_t *) he, (void **) key, (void **) val);
}

void htable_strstr_enum_destroy(htable_strstr_enum_t *he) {
    htable_enum_destroy((htable_enum_t *) he);
}

#ifndef REV_LINKED_LIST_H
#define REV_LINKED_LIST_H

// https://pseudomuto.com/2013/05/implementing-a-generic-linked-list-in-c/

#ifdef __cplusplus
extern "C"
      {
#endif

// a common function used to free malloc'd objects
typedef void (*freeFunction)(void *);

#ifndef __cplusplus
typedef unsigned char bool;
static const bool FALSE = 0;
static const bool TRUE = 1;
#endif

typedef bool (*listIterator)(void *);

typedef struct _listNode {
    void *data;
    struct _listNode *next;
} listNode;

typedef struct {
    int logicalLength;
    int elementSize;
    listNode *head;
    listNode *tail;
    freeFunction freeFn;
} list;

void list_new(list *list, int elementSize, freeFunction freeFn);

void list_destroy(list *list);

void list_prepend(list *list, void *element);

void list_append(list *list, void *element);

int list_size(list *list);

void list_for_each(list *list, listIterator iterator);

void list_head(list *list, void *element, bool removeFromList);

void list_tail(list *list, void *element);

#ifdef __cplusplus
} // extern "C"
#endif

#endif // REV_LINKED_LIST_H

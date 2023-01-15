//
// Created by rev on 12/29/22.
//

#include "rev_gen_functions.h"

#include <stdlib.h>

int revIsCharStrEmpty(char *str) {
    int revIsEmpty = 1;

    if (str != NULL && (str[0] != '\0'))
        revIsEmpty = 0;

    return revIsEmpty;
}

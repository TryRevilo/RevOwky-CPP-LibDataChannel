//
// Created by rev on 1/21/23.
//

#ifndef OWKI_REV_CURL_UPLOAD_FILE_H
#define OWKI_REV_CURL_UPLOAD_FILE_H

#include <stdlib.h>

void revCURLFileUpload(char *revURL, char *revFiles, char *revData, void (*_rev_curl_ret_data_callback_t)(void *revData));

#endif //OWKI_REV_CURL_UPLOAD_FILE_H

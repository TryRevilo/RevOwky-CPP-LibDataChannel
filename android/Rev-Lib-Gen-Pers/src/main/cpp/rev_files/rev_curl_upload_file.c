//
// Created by rev on 1/21/23.
//

#include "rev_curl_upload_file.h"
#include "../../../../libs/cJSON/cJSON.h"
#include "../../../../libs/rev_curl/android-21/include/curl/curl.h"

#include <jni.h>
#include <android/log.h>

#include <stdio.h>
#include <string.h>
#include <stdlib.h>


struct memory {
    char *response;
    size_t size;
};

typedef void (*rev_curl_ret_data_callback_t)(void *revData);

rev_curl_ret_data_callback_t revCURLReturnDataCB;

static size_t WriteMemoryCallback(void *data, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct memory *mem = (struct memory *) userp;

    char *ptr = realloc(mem->response, mem->size + realsize + 1);

    if (ptr == NULL) {
        printf("\nnot enough memory (realloc returned NULL)\n"); // out of memory!
        return 0;
    }

    mem->response = ptr;
    memcpy(&(mem->response[mem->size]), data, realsize);
    mem->size += realsize;
    mem->response[mem->size] = 0;

    printf("\n>>> data %s\n", (char *) data);

    __android_log_print(ANDROID_LOG_ERROR, "MyApp", ">>> revData : %s", (char *) data);

    revCURLReturnDataCB(data);

    return realsize;
}

void revCURLFileUpload(char *revURL, char *revFiles, char *revData, void (*_rev_curl_ret_data_callback_t)(void *revData)) {
    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> revFiles -%s\n", revFiles);

    cJSON *json = cJSON_Parse(revFiles);
    // json now contains the parsed JSON object

    if (json == NULL) {
        // handle parse error
        _rev_curl_ret_data_callback_t("{}");
        return;
    }

    cJSON *array = cJSON_GetObjectItem(json, "rev_files");

    int array_size = cJSON_GetArraySize(array);

    if (array_size < 1) {
        _rev_curl_ret_data_callback_t("{}");
        return;
    }

    __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> array_size -%d\n", array_size);

    revCURLReturnDataCB = _rev_curl_ret_data_callback_t;

    CURL *revCURL;
    CURLcode res;
    struct curl_httppost *revFormPost = NULL;
    struct curl_httppost *last = NULL;
    struct curl_slist *revHeaderList = NULL;

    curl_global_init(CURL_GLOBAL_ALL);

    revCURL = curl_easy_init();

    if (revCURL) {
        /* set the target URL */
        curl_easy_setopt(revCURL, CURLOPT_URL, revURL);
        /* set the POST method */
        curl_easy_setopt(revCURL, CURLOPT_POST, 1L);

        for (int i = 0; i < array_size; i++) {
            cJSON *item = cJSON_GetArrayItem(array, i);
            char *item_value = item->valuestring;
            __android_log_print(ANDROID_LOG_WARN, "MyApp", ">>> FILE -%s\n", item_value);

            char revI[5] = {'\0'};

            if (sprintf(revI, "%d", i) < 0) {
                perror(">>> sprintf");
            }

            char revKey[20] = "rev_key_";
            char revVal[20] = "Rev Val = ";

            strcat(revKey, revI);
            strcat(revVal, revI);

            curl_formadd(&revFormPost, &last, CURLFORM_COPYNAME, "rev_files", CURLFORM_COPYCONTENTS, revVal, CURLFORM_END);

            /* add the file to the POST request */
            curl_formadd(&revFormPost, &last,
                         CURLFORM_COPYNAME, "rev_files",
                         CURLFORM_FILE, item_value,
                         CURLFORM_END);
        }

        cJSON_Delete(json);

        /* set the HTTP headers */
        revHeaderList = curl_slist_append(revHeaderList, "Content-Type: multipart/form-data");
        curl_easy_setopt(revCURL, CURLOPT_HTTPHEADER, revHeaderList);

        /* set the form data */
        curl_easy_setopt(revCURL, CURLOPT_HTTPPOST, revFormPost);

        struct memory chunk = {0};

        /* send all data to this function  */
        curl_easy_setopt(revCURL, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);

        /* we pass our 'chunk' struct to the callback function */
        curl_easy_setopt(revCURL, CURLOPT_WRITEDATA, (void *) &chunk);

        /* perform the request */
        res = curl_easy_perform(revCURL);
        if (res != CURLE_OK) {
            fprintf(stderr, "\ncurl_easy_perform() failed: %s\n", curl_easy_strerror(res));
            __android_log_print(ANDROID_LOG_ERROR, "MyApp", "\ncurl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        } else {
            printf("\n>>> UPLOAD SUCCESSFUL\n");
        }

        /* Cleanup */
        curl_easy_cleanup(revCURL);

        /* Then cleanup the formpost chain */
        curl_formfree(revFormPost);

        /* Free slist */
        curl_slist_free_all(revHeaderList);
    }

    curl_global_cleanup();
}

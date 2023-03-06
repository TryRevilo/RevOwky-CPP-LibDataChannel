//
// Created by rev on 12/6/22.
//

#include "rev_entity_metadata.h"

#include <stdlib.h>
#include "../../../../rev_gen_functions/rev_gen_functions.h"
#include "../../../../../../../libs/cJSON/cJSON.h"

void revFreeMetadata(void *data) {
    free(*(RevEntityMetadata **) data);
}

list *revJSONMetadataFiller(const char *const revJSONStringMetadata) {
    list list;
    list_new(&list, sizeof(RevEntityMetadata), revFreeMetadata);

    // _revEntityMetadataList
    const cJSON *_revEntityMetadataList = cJSON_Parse(revJSONStringMetadata);

    if (cJSON_IsArray(_revEntityMetadataList)) {
        cJSON *revEntityMetadataJSON = NULL;

        cJSON_ArrayForEach(revEntityMetadataJSON, _revEntityMetadataList) {
            RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));

            // _revMetadataName
            const cJSON *_revMetadataName = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_revMetadataName");

            if (cJSON_IsString(_revMetadataName) && (_revMetadataName->valuestring != NULL)) {
                char *_revMetadataNameVal = _revMetadataName->valuestring;
                revEntityMetadata->_metadataName = _revMetadataNameVal;
            }

            // _metadataValue
            const cJSON *_metadataValue = cJSON_GetObjectItemCaseSensitive(revEntityMetadataJSON, "_metadataValue");

            if (cJSON_IsString(_metadataValue) && (_metadataValue->valuestring != NULL)) {
                char *_metadataValueVal = _metadataValue->valuestring;
                revEntityMetadata->_metadataValue = _metadataValueVal;
            }

            // _metadataOwnerGUID
            revEntityMetadata->_resolveStatus = -1;

            // _metadataOwnerGUID
            revEntityMetadata->_metadataOwnerGUID = -1;

            // _remoteRevMetadataId
            revEntityMetadata->_remoteRevMetadataId = -1l;

            // _revTimePublished
            revEntityMetadata->_revTimePublished = revCurrentTimestampMillSecs();

            // _revTimePublishedUpdated
            revEntityMetadata->_revTimePublishedUpdated = revCurrentTimestampMillSecs();

            list_append(&list, revEntityMetadata);
        }
    }

    return &list;
}

RevEntityMetadata *revInitializedMetadata() {
    RevEntityMetadata *revEntityMetadata = (RevEntityMetadata *) malloc(sizeof(RevEntityMetadata));

    revEntityMetadata->_resolveStatus = -1;

    revEntityMetadata->_metadataId = -1;
    revEntityMetadata->_remoteRevMetadataId = -1;
    revEntityMetadata->_metadataOwnerGUID = -1;
    revEntityMetadata->_metadataValueId = -1;

    revEntityMetadata->_metadataName = "";
    revEntityMetadata->_metadataValue = "";

    revEntityMetadata->_timeCreated = "";
    revEntityMetadata->_timeUpdated = "";

    revEntityMetadata->_revTimeCreated = -1;
    revEntityMetadata->_revTimePublished = -1;
    revEntityMetadata->_revTimePublishedUpdated = -1;

    return revEntityMetadata;
}
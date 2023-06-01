#ifndef REV_PERS_REV_ENTITY_METADATA
#define REV_PERS_REV_ENTITY_METADATA

#include "../../rev_db_models/rev_entity_metadata.h"

long revPersSaveRevMetadata(void *revEntityMetadataList);

long revPersSaveRevEntityMetadata(RevEntityMetadata *revEntityMetadata);

long revPersSaveRevEntityMetadataJSONStr(const char *revEntityMetadataJSONStr);

#endif // REV_PERS_REV_ENTITY_METADATA

//
// Created by rev on 8/10/18.
//

#ifndef OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H
#define OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H

#include "../rev_db_models/rev_entity_metadata.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

char *getMetadataValue_By_MetadataId(long metadataId);

RevEntityMetadata *revPersGetRevEntityMetadata_By_MetadataId(long long revMetadataId);

long revGetRevEntityMetadataId_By_RevMetadataName_RevEntityGUID(char *revMetadataName, long revEntityGUID);

char *revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(char *revMetadataName, long revEntityGUID);

long revGetRevEntityMetadataOwnerGUID_By_MetadataName_MetadataValue(char *revMetadataName, char *revMetadataValue);

list *revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(long revEntityGUID);

list *revPersGetALLRevEntityMetadataByResolveStatus(int resolveStatus);

list *revPersGetALLRevEntityMetadataId_By_MetadataName_ResolveStatus(char *metadataName, int resolveStatus);

list *revPersGetALLRevEntityMetadata_By_ResStatus(int resolveStatus);

list *revPersGetALLRevEntityMetadata_BY_ResStatus_MetadataName(int revResolveStatus, char *revMetadataName);

list *revPersGetALLRevEntityMetadataIds_By_ResStatus(int resolveStatus);

list *revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(int resolveStatus, long revEntityGUID);

RevEntityMetadata revGetRevEntityMetadata_By_MetadataName_MetadataValue(char *revMetadataName, char *revMetadataValue);

RevEntityMetadata revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(char *revMetadataName, char *revMetadataValue, long revEntityGUID);

list *revPersGetALLRevEntityMetadataUnsynched();

list *revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(long revEntityGUID);

list *revPersGetALLRevEntityRevEntityMetadataBy_MetadataName_OwnerGUID(char *metadataName, long revEntityGUID);

long revGetRevEntityMetadataOwnerGUID(long metadataId);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H
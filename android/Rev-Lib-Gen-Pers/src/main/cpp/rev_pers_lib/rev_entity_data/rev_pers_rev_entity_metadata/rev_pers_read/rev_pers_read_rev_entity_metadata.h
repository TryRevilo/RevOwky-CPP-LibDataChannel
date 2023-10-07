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

RevEntityMetadata revGetRevEntityMetadata_By_RevMetadataName_RevEntityGUID(char *revMetadataName, long revEntityGUID);

long revGetRevEntityMetadataOwnerGUID_By_revMetadataName_revMetadataValue(char *revMetadataName, char *revMetadataValue);

void revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityMetadataByResolveStatus(list *revList, int revResolveStatus);

void revPersGetALLRevEntityMetadataId_By_revMetadataName_revResolveStatus(list *revList, char *metadataName, int revResolveStatus);

void revPersGetALLRevEntityMetadata_By_ResStatus(int revResolveStatus);

void revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName(list *revList, int revResolveStatus, char *revMetadataName);

void revPersGetALLRevEntityMetadataIds_By_ResStatus(list *revList, int revResolveStatus);

void revPersGetALLRevEntityMetadataIds_By_RevEntityGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(list *revList, int revResolveStatus, long revEntityGUID);

RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(char *revMetadataName, char *revMetadataValue);

RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID(char *revMetadataName, char *revMetadataValue, long revEntityGUID);

void revPersGetALLRevEntityMetadataUnsynched(list *revList);

void revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityRevEntityMetadataBy_revMetadataName_OwnerGUID(list *revList, char *metadataName, long revEntityGUID);

long revGetRevEntityMetadataOwnerGUID(long metadataId);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H

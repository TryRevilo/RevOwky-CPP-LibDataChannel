//
// Created by rev on 8/10/18.
//

#ifndef OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H
#define OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H

#include "../rev_db_models/rev_entity_metadata.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

char *revPersGetMetadataVal_By_Id(long _revId);

RevEntityMetadata *revPersGetRevEntityMetadata_By_MetadataId(long long _revId);

long revGetRevEntityMetadataId_By_revName_revGUID(char *revMetadataName, long revEntityGUID);

char *revPersGetMetadataValue_By_Name_EntityGUID(char *revMetadataName, long revEntityGUID);

RevEntityMetadata revPersGetMetadata_By_Name_EntityGUID(char *revMetadataName, long revEntityGUID);

long revPersGetMetadataOwnerGUID_By_Name_Value(char *revMetadataName, char *revMetadataValue);

void revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityMetadataByResolveStatus(list *revList, int revResolveStatus);

void revPersGetALLRevEntityMetadataId_By_revName_revResolveStatus(list *revList, char *revMetadataName, int revResolveStatus);

void revPersGetALLRevEntityMetadata_By_ResStatus(int revResolveStatus);

void revPersGetMetadata_BY_ResStatus_Name(list *revList, int revResolveStatus, char *revMetadataName);

void revPersGetALLRevEntityMetadataIds_By_ResStatus(list *revList, int revResolveStatus);

void revPersGetALLRevEntityMetadataIds_By_revGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityMetadataIds_By_ResStatus_revGUID(list *revList, int revResolveStatus, long revEntityGUID);

RevEntityMetadata revPersGetMetadata_By_Name_Value(char *revMetadataName, char *revMetadataValue);

RevEntityMetadata revPersGetMetadata_By_Name_Value_EntityGUID(char *revMetadataName, char *revMetadataValue, long revEntityGUID);

void revPersGetALLRevEntityMetadataUnsynched(list *revList);

void revPersGetALLRevEntityMetadataUnsynched_By_revGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityRevEntityMetadataBy_revName_OwnerGUID(list *revList, char *revMetadataName, long revEntityGUID);

long revGetRevEntityMetadataOwnerGUID(long _revId);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H

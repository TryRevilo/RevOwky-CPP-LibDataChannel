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

list *revPersGetALLRevEntityRevEntityMetadataByOwnerGUID(long revEntityGUID);

list *revPersGetALLRevEntityMetadataByResolveStatus(int revResolveStatus);

list *revPersGetALLRevEntityMetadataId_By_revMetadataName_revResolveStatus(char *metadataName, int revResolveStatus);

list *revPersGetALLRevEntityMetadata_By_ResStatus(int revResolveStatus);

list *revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName(int revResolveStatus, char *revMetadataName);

list *revPersGetALLRevEntityMetadataIds_By_ResStatus(int revResolveStatus);

list *revPersGetALLRevEntityMetadataIds_By_RevEntityGUID(long revEntityGUID);

list *revPersGetALLRevEntityMetadataIds_By_ResStatus_RevEntityGUID(int revResolveStatus, long revEntityGUID);

RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(char *revMetadataName, char *revMetadataValue);

RevEntityMetadata revGetRevEntityMetadata_By_revMetadataName_revMetadataValue_EntityGUID(char *revMetadataName, char *revMetadataValue, long revEntityGUID);

list *revPersGetALLRevEntityMetadataUnsynched();

list *revPersGetALLRevEntityMetadataUnsynched_By_RevEntityGUID(long revEntityGUID);

list *revPersGetALLRevEntityRevEntityMetadataBy_revMetadataName_OwnerGUID(char *metadataName, long revEntityGUID);

long revGetRevEntityMetadataOwnerGUID(long metadataId);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_METADATA_H

//
// Created by rev on 11/6/18.
//

#ifndef REVCAMPANN_REV_PERS_READ_H
#define REVCAMPANN_REV_PERS_READ_H

#include "../rev_db_models/rev_entity.h"
#include "../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../libs/cJSON/cJSON.h"

void revPersGetALLRevEntityGUIDsByOwnerGUID(list *revList, long ownerGUID);

void revPersGetALLRevEntityGUIDsByOwnerGUID_Type(list *revList, char *revEntityType, long ownerGUID);

void revPersGetALLRevEntityGUIDs_By_ContainerGUID(list *revList, long revContainerGUID);

void revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(list *revList, long revContainerEntityGUID, char *revEntityType);

void revPersGetALLRevEntityGUIDs_SQL_IN(list *revList, char *sql_IN);

int revSubTypeExists_BY_OWNER_GUID(int revEntityOwnerGUID, char *revSubType);

int revEntityExistsByLocalEntityGUID(long revRemoteEntityGUID);

int revEntityExistsByRemoteEntityGUID(long revRemoteEntityGUID);

long revPersGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID);

void revPersGetEntities_By_SiteGUID_SubType(list *revList, long revSiteEntityGUID, char *revSubType);

void revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(list *revList, const char *revDBTableFieldName_, long revSiteEntityGUID, const char *revSubType);

long revSubTypeExists_BY_CONTAINER_GUID(int revContainerGUID, char *revSubType);

long revGetPublicationDate(long revLocalEntityGUID);

long revPersGetRemoteEntityGUID_BY_LocalEntityGUID(long revLocalEntityGUID);

long revPersGetLocalEntityGUID_BY_RemoteEntityGUID(long revRemoteEntityGUID);

RevEntity revPersGetEntity_By_GUID(long revEntityGUID);

RevEntity revPersGetEntity_By_RemoteEntityGUID(long revRemoteEntityGUID);

void revPersGetALLEntitySubtypeGUIDsByOwnerGUID(list *revList, char *revSubType, long ownerGUID);

void revPersGetEntityGUIDs_By_ResStatus(list *revList, int revResolveStatus);

void revPersGetALLrevRemoteEntityGUIDs_By_ResStatus(list *revList, int revResolveStatus);

void revPersGetEntityGUIDs_By_ResolveStatus_SubType(list *revList, int revResolveStatus, char *revSubType);

long revGetRevEntityGUID_By_revOwnerGUID_Subtype(int revEntityOwnerGUID, char *revSubType);

long revGetRevEntityGUID_By_revContainerGUID_Subtype(int revContainerGUID, char *revSubType);

void revPersGetALLRevEntityGUIDs_By_revType(list *revList, char *revEntityType);

void revPersGetALLRevEntityTYPE(list *revList, char *revEntityType);

void revPersGetEntities_By_ContainerGUID_SubTYPE(list *revList, long revContainerGUID, char *revSubType);

void revPersGetEntities_By_SubType(list *revList, char *revSubType);

cJSON *revPersGetData_By_RevVarArgs(char *revTableName, char *revVarArgs);

int getNumberOfUnreadRevEntites();

void revPersGetALLRevEntityUnSyched(list *revList);

void revPersGetALLRevEntityUnSychedByType(list *revList, char *revEntityType);

void revPersGetALLrevSubTypes(list *revList, char *revSubType);

char *revGetRevEntityType_By_revGUID(int revEntityGUID);

char *revGetrevSubType_By_revGUID(int revEntityGUID);

#endif //REVCAMPANN_REV_PERS_READ_H

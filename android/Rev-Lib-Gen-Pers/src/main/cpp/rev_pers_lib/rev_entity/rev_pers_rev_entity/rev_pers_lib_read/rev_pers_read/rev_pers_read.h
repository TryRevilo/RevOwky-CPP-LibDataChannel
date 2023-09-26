//
// Created by rev on 11/6/18.
//

#ifndef REVCAMPANN_REV_PERS_READ_H
#define REVCAMPANN_REV_PERS_READ_H

#include "../../rev_db_models/rev_entity.h"
#include "../../../../../../../../libs/rev_list/rev_linked_list.h"
#include "../../../../../../../../libs/cJSON/cJSON.h"

list *revPersGetALLRevEntityGUIDsByOwnerGUID(long ownerGUID);

list *revPersGetALLRevEntityGUIDsByOwnerGUID_Type(char *revEntityType, long ownerGUID);

list *revPersGetALLRevEntityGUIDs_By_ContainerGUID(long revEntityContainerGUID);

list *revPersGetALLRevEntityGUIDs_By_ContainerEntityGUID(long revContainerEntityGUID, char *revEntityType);

list *revPersGetALLRevEntityGUIDs_SQL_IN(char *sql_IN);

int revEntitySubtypeExists_BY_OWNER_GUID(int revEntityOwnerGUID, char *revEntitySubtype);

int revEntityExistsByLocalEntityGUID(long revRemoteEntityGUID);

int revEntityExistsByRemoteEntityGUID(long revRemoteEntityGUID);

long revGetEntityOwnerGUID_BY_EntityGUID(long revEntityGUID);

list *revPersGet_ALL_RevEntity_By_SiteGUID_SubType(long revSiteEntityGUID, char *revEntitySubType);

list *revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE(const char *revDBTableFieldName_, long revSiteEntityGUID, const char *revEntitySubType);

long revEntitySubtypeExists_BY_CONTAINER_GUID(int revEntityContainerGUID, char *revEntitySubtype);

long revGetPublicationDate(long revLocalEntityGUID);

long revGetRemoteEntityGUID_BY_LocalEntityGUID(long revLocalEntityGUID);

long revGetLocalEntityGUID_By_RemoteEntityGUID(long revRemoteEntityGUID);

RevEntity revPersGetRevEntityByGUID(long revEntityGUID);

RevEntity revPersGetEntity_By_RemoteEntityGUID(long revRemoteEntityGUID);

list *revPersGetALLEntitySubtypeGUIDsByOwnerGUID(char *revEntitySubtype, long ownerGUID);

list *revPersGetALLRevEntityGUIDs_By_ResStatus(int revResolveStatus);

list *revPersGetALLrevRemoteEntityGUIDs_By_ResStatus(int revResolveStatus);

list *revPersGetALLRevEntityGUIDs_By_revResolveStatus_SubType(int revResolveStatus, char *revEntitySubtype);

long revGetRevEntityGUID_By_RevEntityOwnerGUID_Subtype(int revEntityOwnerGUID, char *revEntitySubtype);

long revGetRevEntityGUID_By_RevEntityContainerEntityGUID_Subtype(int revEntityContainerGUID, char *revEntitySubtype);

list *revPersGetALLRevEntityGUIDs_By_RevEntityType(char *revEntityType);

list *revPersGetALLRevEntityTYPE(char *revEntityType);

list *revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(long revEntityContainerGUID, char *revEntitySubType);

list *revPersGetALLRevEntity_By_SubType(char *revEntitySubType);

cJSON *revPersGetData_By_RevVarArgs(char *revTableName, char *revVarArgs);

int getNumberOfUnreadRevEntites();

list *revPersGetALLRevEntityUnSyched();

list *revPersGetALLRevEntityUnSychedByType(char *revEntityType);

list *revPersGetALLRevEntitySubTYPEs(char *revEntitySubtype);

char *revGetRevEntityType_By_RevEntityGUID(int revEntityGUID);

char *revGetRevEntitySubType_By_RevEntityGUID(int revEntityGUID);

#endif //REVCAMPANN_REV_PERS_READ_H

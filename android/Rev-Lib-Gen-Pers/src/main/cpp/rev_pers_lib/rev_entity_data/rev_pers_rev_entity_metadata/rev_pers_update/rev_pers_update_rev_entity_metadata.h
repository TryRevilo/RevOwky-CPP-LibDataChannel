//
// Created by rev on 1/21/19.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_METADATA_H
#define REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_METADATA_H

int revPersSetRemoteMetadataId(long _revId, long _revRemoteId);

int revPersSetMetadataResStatus_BY_Metadata_Id(int revResolveStatus, long _revId);

int setMetadataResolveStatus_BY_revName_revGUID(char *revMetadataName, long revEntityGUID, int revResolveStatus);

int revPersSetMetadataVal_BY_Id(long _revId, char *revMetadataValue);

#endif //REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_METADATA_H

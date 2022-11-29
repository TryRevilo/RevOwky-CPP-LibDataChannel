//
// Created by rev on 1/21/19.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_METADATA_H
#define REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_METADATA_H

int setRemoteRevEntityMetadataId(long revMetadataId, long remoteRevMetadataId);

int setMetadataResolveStatus_BY_METADATA_ID(int revResolveStatus, long revMetadataId);

int setMetadataResolveStatus_BY_MetadataName_RevEntityGUID(char *revMetadataName, long revEntityGUID, int revResolveStatus);

int setMetadataValue_BY_MetadataId_RevEntityGUID(long revMetadataId, char *revMetadataValue);

#endif //REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_METADATA_H

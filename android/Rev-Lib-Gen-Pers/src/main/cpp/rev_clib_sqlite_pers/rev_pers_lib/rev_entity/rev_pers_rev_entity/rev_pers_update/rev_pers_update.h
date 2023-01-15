//
// Created by rev on 10/2/18.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_H
#define REVCAMPANN_REV_PERS_UPDATE_H

#include "../rev_db_models/rev_entity.h"

int setRemoteRevEntityGUIGByRevEntityGUID(long revEntityGUID, long remoteRevEntityGUID);

int setRevPublishedDate_By_RevEntityGUID(long revEntityGUID, long revPublishedDate);

int setRemoteRevEntityGUID_By_RevCreationDate(long long revTimeCreated, long remoteRevEntityGUID);

int setResStatus_By_RevCreationDate(long revTimeCreated, int revResStatus);

int resetRevEntityOwnerGUIG(long revEntityGUID, long revEntityOwnerGUID);

int revPersSetContainerGUID_By_RevEntityGUID(long revEntityGUID, long revContainerGUID);

int setRemoteRevEntityGUID_Metadata_ByRevEntityGUID(long revEntityGUID, long remoteRevEntityGUID, long revMetadataId, long remoteRevMetadataId);

int setmarkForDeleteByRevEntityGUID(long revEntityGUID);

int setRevEntityResolveStatusByRevEntityGUID(int resolveStatus, long revEntityGUID);

#endif //REVCAMPANN_REV_PERS_UPDATE_H

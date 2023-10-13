//
// Created by rev on 10/2/18.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_H
#define REVCAMPANN_REV_PERS_UPDATE_H

#include "../rev_db_models/rev_entity.h"

int setRemoteRevEntityGUIGByRevEntityGUID(long revEntityGUID, long revRemoteEntityGUID);

int revPersSetPubDate_By_GUID(long revEntityGUID, long revPublishedDate);

int setrevRemoteEntityGUID_By_RevCreationDate(long long revTimeCreated, long revRemoteEntityGUID);

int setResStatus_By_RevCreationDate(long revTimeCreated, int revResStatus);

int resetRevEntityOwnerGUIG(long revEntityGUID, long revEntityOwnerGUID);

int revPersSetContainerGUID_By_revGUID(long revEntityGUID, long revContainerGUID);

int setrevRemoteEntityGUID_Metadata_ByRevEntityGUID(long revEntityGUID, long revRemoteEntityGUID, long _revId, long _revRemoteId);

int revPersSetEntityResStatus_By_EntityGUID(int revResolveStatus, long revEntityGUID);

#endif //REVCAMPANN_REV_PERS_UPDATE_H

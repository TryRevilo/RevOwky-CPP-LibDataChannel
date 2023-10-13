//
// Created by rev on 12/14/18.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_REL_H
#define REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_REL_H

#include "../rev_db_models/rev_entity_relationships.h"

int revPersUpdateRelationshipValueId_By_RelId(long revEntityRelationshipId, long relationshipValueId);

int revPersUpdateRelResStatus_By_RelId(long revEntityRelationshipId, int revResolveStatus);

int revPersUpdateRelResStatus_By_RemoteRelId(long revEntityRelationshipId, int revResolveStatus);

int revPersUpdateSetRelResStatus_By_RemoteRelId(long revEntityRemoteRelationshipId, int revRelResStatus);

int revPersUpdateRelationshipResolve_RemoteRelId_revResolveStatus_By_ValueId(long revEntityRelationshipId, long revEntityRemoteRelationshipId, int revResolveStatus);

int revPersSetRemoteRelId(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

int revPersSetRemoteRelationshipResolved(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

int revPersSetRemoteSubjectGUID(long localSubjectGUID, long remoteSubjectGUID);

int revPersSetRemoteTargetGUID(long localTargetGUID, long remoteTargetGUID);

int revPersSetRemoteSubjectGUID_By_RelId(long revRelId, long revRemoteSubjectGUID);

int revPersUpdateSetRemoteTarget_By_RelId(long revRelId, long revRemoteTargetGUID);

#endif //REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_REL_H

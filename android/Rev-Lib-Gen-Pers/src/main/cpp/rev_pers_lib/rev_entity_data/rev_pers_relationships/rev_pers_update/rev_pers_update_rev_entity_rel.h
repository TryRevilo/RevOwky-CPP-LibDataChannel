//
// Created by rev on 12/14/18.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_REL_H
#define REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_REL_H

#include "../rev_db_models/rev_entity_relationships.h"

int revPersUpdateRelationshipValueId_By_RelId(long revEntityRelationshipId, long relationshipValueId);

int revPersUpdateRelResStatus_By_RelId(long revEntityRelationshipId, int resolveStatus);

int revPersUpdateRelResStatus_By_RemoteRelId(long revEntityRelationshipId, int resolveStatus);

int revPersUpdateSetRelResStatus_By_RemoteRelId(long revEntityRemoteRelationshipId, int revRelResStatus);

int revPersSetRelResStatus_By_RemoteRelId(long revEntityRemoteRelationshipId, int revRelResStatus);

int revPersUpdateRelationshipResolve_RemoteRelId_ResolveStatus_By_ValueId(long revEntityRelationshipId, long revEntityRemoteRelationshipId, int resolveStatus);

int revPersSetRemoteRelationshipRemoteId(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

int revPersUpdateSetRemoteRelationshipRemoteId_By_RevRelType_RemoteSubjectGUID_RemoteTarhetGUID(
char *revEntityrelationship, long revRemoteSubjectGUID, long revRemoteTargetGUID, long revRemoteRelId);

int revPersSetRemoteRelationshipResolved(long revEntityRelationshipId, long revEntityRemoteRelationshipId);

int revPersUpdateSetRemoteSubjectGUID(long localSubjectGUID, long remoteSubjectGUID);

int revPersUpdateSetRemoteTargetGUID(long localTargetGUID, long remoteTargetGUID);

int revPersUpdateSetRemoteSubjectGUID_By_RelId(long revRelId, long revRemoteSubjectGUID);

int revPersUpdateSetRemoteTarget_By_RelId(long revRelId, long revRemoteTargetGUID);

#endif //REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_REL_H

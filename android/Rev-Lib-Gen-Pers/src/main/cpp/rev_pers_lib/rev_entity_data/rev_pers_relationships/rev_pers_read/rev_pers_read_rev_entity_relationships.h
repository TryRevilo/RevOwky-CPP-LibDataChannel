//
// Created by rev on 8/2/18.
//

#ifndef OWKI_REV_PERS_READ_REV_ENTITY_RELATIONSHIPS_H
#define OWKI_REV_PERS_READ_REV_ENTITY_RELATIONSHIPS_H

#include "../../../../../../../libs/rev_list/rev_linked_list.h"

#include "../../../rev_pers_rev_entity/rev_db_models/rev_entity.h"
#include "../rev_db_models/rev_entity_relationships.h"

int revGetAnyRelExists_By_TypeValueId_LocalGUIDs(char *revRelType, long revSubjectGUID, long revTargetGuid);

int revGetAnyRelExists_By_TypeValueId_RemoteGUIDs(char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid);

int revGetAnyRelExists_By_ResStatus_TypeValueId_RemoteGUIDs(int revResStatus, char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid);

long getRevEntityRelationshipId_By_RelType_Subject_Target(char *revEntityRelationship, long remoteRevEntitySubjectGuid, long remoteRevEntityTargetGuid);

RevEntityRelationship revPersGetRevEntityRelById(long revEntityRelationshipId);

void revPersGetRevEntityRels_By_ResStatus(list *revList, int revResStatus);

void revPersGetRevEntityRels_By_ResStatus_RelType(list *revList, int revResStatus, char *revEntityRelationship);

void revPersGetALLRevEntityRelValIds_By_RevResStatus(list *revList, int revResolveStatus);

void revPersGetALLRevEntityRelationshipsAcceptedUnSyched(list *revList, long revEntityTargetGUID, int revRelResolveStatus);

long getRevRelationshipSubjectGUID_By_RelId(long relationshipId);

long getRevRelationshipTargetGUID_By_RelationshipId(long relationshipId);

long getRevRelationshipTargetGUIDByRelationshipValueId(long relationshipValueId);

void revPersGetALLRevEntityRelationships_By_RelTypeValueId(list *revList, long relTypeValueId);

void revPersGetUnresolvedRemoteSubjectGUIDsRelIds(list *revList);

void revPersGetUnresolvedRemoteGUIDsRelId(list *revList);

void revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID(list *revList, long relTypeValueId, long revEntitySubjectGUID);

void revPersGetRevEntityRels_By_RelTypeValueId_TargetGUID(list *revList, long relTypeValueId, long revEntityTargetGUID);

void revPersGetRevEntityRels_By_RelTypeValueId_SubjectGUID_TargetGUID_revResolveStatus(list *revList, int relTypeValueId, long revEntityTargetGUID, int revEntityResolveStatus);

void revPersGetRemoteRelsGUIDs_By_RelTypeValueId_RevEntityGUID_revResolveStatus(list *revList, int relTypeValueId, long revEntityGUID, int revEntityResolveStatus);

void revPersGetAllRevEntityRels_By_RelType_ValueId_revResolveStatus(list *revList, int relTypeValueId, long revEntityGUID, int revResolveStatus);

void revPersGetALLRevEntityRelationshipsSubjectGUID(list *revList);

void revPersGetALLRevRels_RemoteRelId_By_revResolveStatus(list *revList, int revRelResolveStatus);

void revPersGetALLRevRels_RemoteRelId_By_revResolveStatus_RemoteTargetGUID(list *revList, int revRelResolveStatus, long remoteTargetGUID);

void revPersGetALLRevEntityRelationshipsSubjectGUID_BY_TARGET_GUID(list *revList, long targetGUID);

void revPersGetALLRevEntityRelationshipsTargets(list *revList, char *revEntityRelationship, long subjectGUID);

void revPersGetAllRevEntityRelsIDs_By_EntityGUID(list *revList, long revEntityGUID);

void revPersGetALLRevEntityRelGUIDs_By_RelType_revRemoteEntityGUID(list *revList, char *revEntityRelationship, long revRemoteEntityGUID);

void revGetRels_By_RelType_RevEntityGUID_LocalGUIDs(list *revList, const char *revRelType, long revEntityGUID, long revLocalGUID_1, long revLocalGUID_2);

void revGetRels_By_RelType_LocalGUIDs(list *revList, const char *revRelType, long revLocalGUID_1, long revLocalGUID_2);

void revGetRels_By_RelType_RemoteGUIDs(list *revList, const char *revRelType, long revRemoteSubjectGUID, long revRemoteTargetGuid);

void revPersGetALLRelSubjectGUIDs_By_TargetGUID(list *revList, long revTargetGUID);

long revPersGetSubjectGUID_BY_RelStr_TargetGUID(char *revEntityRelationship, long revTargetGUID);

void revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(list *revList, char *revEntityRelationship, long subjectGUID);

void revPersGetUnresolvedRemoteTargetGUIDSRelIds(list *revList);

char *getRevRelationshipTimeCreated(long relationshipId);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_RELATIONSHIPS_H

//
// Created by rev on 8/21/18.
//

#ifndef OWKI_REV_PERS_READ_REV_ENTITY_ANNOTATIONS_H
#define OWKI_REV_PERS_READ_REV_ENTITY_ANNOTATIONS_H

#include "../rev_db_models/rev_entity_annotation.h"
#include "../../../../../../../libs/rev_list/rev_linked_list.h"

long revGetRevAnnotationValueId(char *revAnnotationName, long revEntityGUID);

long revPersGetAnnValueId_By_Name_EntityGUID_OwnerGUID(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID);

char *getRevEntityAnnotationValue(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID);

int revEntityAnnotationExists_ByOwnerEntityGUID(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID);

void getAllRevEntityAnnoationIds_By_revGUID(list *revList, long revEntityGUID);

void getAllRevEntityAnnoationIds_By_OwnerGUID(long revOwnerGUID);

void revPersGetAnnIds_By_Name_EntityGUID(list *revList, char *revAnnotationName, long revEntityGUID);

void revPersGetALLRevEntityAnnotationsOwnerGUID(list *revList);

long getRevAnnotationOwnerGUID_ByAnnotationId(long annotationId);

void getAllRevEntityAnnoationIds_By_ResStatus(list *revList, int revAnnResStatus);

RevEntityAnnotation *revPersGetRevEntityAnn_By_LocalAnnId(long revAnnotationId);

RevEntityAnnotation *revPersGetAnn_By_Name_EntityGUID_OwnerGUID(char *revAnnotationName, long revEntityGUID, long revOwnerGUID);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_ANNOTATIONS_H

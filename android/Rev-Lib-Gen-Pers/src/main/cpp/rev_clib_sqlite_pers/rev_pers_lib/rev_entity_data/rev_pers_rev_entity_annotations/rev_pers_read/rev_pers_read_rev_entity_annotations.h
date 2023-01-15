//
// Created by rev on 8/21/18.
//

#ifndef OWKI_REV_PERS_READ_REV_ENTITY_ANNOTATIONS_H
#define OWKI_REV_PERS_READ_REV_ENTITY_ANNOTATIONS_H

#include <rev_linked_list.h>

long getRevAnnotationValueId(char *revAnnotationName, long revEntityGUID);

long getRevAnnotationValueIdByOwnerEntityGUID(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID);

char *getRevEntityAnnotationValue(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID);

list *getAllRevEntityAnnotationId(char *revAnnotationName, long revEntityGUID);

int revEntityAnnotationExists_ByOwnerEntityGUID(char *revAnnotationName, long revEntityGUID, long ownerEntityGUID);

list *getAllRevEntityAnnoationIds_By_RevEntityGUID(long revEntityGUID);

list *getAllRevEntityAnnoationIds_By_RevEntityContainer_GUID(char *revAnnotationName, long revEntityContainerGUID);

list *revPersGetALLRevEntityAnnotationsOwnerGUID();

long getRevAnnotationOwnerGUID_ByAnnotationId(long annotationId);

list *getAllRevEntityAnnoationIds_By_ResStatus(int revAnnResStatus);

RevEntityAnnotation *revPersGetRevEntityAnn_By_LocalAnnId(long revAnnotationId);

#endif //OWKI_REV_PERS_READ_REV_ENTITY_ANNOTATIONS_H

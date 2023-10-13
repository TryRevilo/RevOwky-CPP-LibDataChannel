//
// Created by home on 2019-09-13.
//

#ifndef REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_ANN_H
#define REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_ANN_H

int revPersSetAnnVal_By_Id(long revAnnotationId, char *revEntityAnnotationValue);

int revPersSetAnnResStatus_By_Id(long revAnnotationId, int revAnnotationResStatus);

int revPersSetRemoteRevAnnId(long revAnnotationId, long revAnnotationRemoteId);

#endif //REVCAMPANN_REV_PERS_UPDATE_REV_ENTITY_ANN_H

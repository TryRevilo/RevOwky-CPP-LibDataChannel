//
// Created by rev on 8/21/18.
//

#ifndef OWKI_REV_PERS_ANNOTATION_H
#define OWKI_REV_PERS_ANNOTATION_H

long revPersAnnotation(char *revEntityAnnotationName, char *revEntityAnnotationValue, long revEntityGUID, long revEntityContainerGUID);

long revPersAnnotationStruct(RevEntityAnnotation *revEntityAnnotation);

#endif //OWKI_REV_PERS_ANNOTATION_H

//
// Created by rev on 7/9/18.
//

#include <jni.h>

#ifndef OWKI_REV_PERS_READ_STRUCTS_H
#define OWKI_REV_PERS_READ_STRUCTS_H

typedef struct REV_ENTITY_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revEntityType_ID;
    jfieldID _revEntitySubType_ID;

    jfieldID _revEntityResolveStatus;
    jfieldID _revEntityChildableStatus;

    jfieldID _revEntityGUID_ID;
    jfieldID _remoteRevEntityGUID_ID;

    jfieldID _revEntityOwnerGUID_ID;
    jfieldID _revEntityContainerGUID_ID;
    jfieldID _remoteRevEntityContainerGUID;
    jfieldID _revSiteEntityGUID_ID;
    jfieldID _revEntityAccessPermission_ID;

    jfieldID _revEntityMetadataList_ID;

    jfieldID _timeCreated_ID;
    jfieldID _timeUpdated_ID;

    jfieldID _revPublisherEntity;

    jfieldID _revTimeCreated;
    jfieldID _revTimePublished;
    jfieldID _revTimePublishedUpdated;

} REV_ENTITY_JNI_POSREC;


typedef struct REV_ENTITY_METADATA_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _resolveStatus;
    jfieldID revMetadataId;
    jfieldID revMetadataValueId;

    jfieldID _revMetadataName;
    jfieldID _metadataValue;

    jfieldID revMetadataOwnerGUID;

    jfieldID _revTimeCreated;
    jfieldID _revTimePublished;
    jfieldID _revTimePublishedUpdated;

} REV_ENTITY_METADATA_JNI_POSREC;


typedef struct REV_ENTITY_ANNOTATION_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revAnnotationResStatus;
    jfieldID _revAnnotationNameId;

    jfieldID _revAnnotationName;
    jfieldID _revAnnotationValue;
    jfieldID _revAnnotationTimeCreated;
    jfieldID _revAnnotationTimeUpdated;

    jfieldID _revAnnotationId;
    jfieldID _revAnnotationRemoteId;

    jfieldID _revAnnotationEntityGUID;
    jfieldID _revAnnotationRemoteEntityGUID;
    jfieldID _revAnnOwnerEntityGUID;
    jfieldID _revAnnRemoteOwnerEntityGUID;

    jfieldID _revTimeCreated;
    jfieldID _revTimePublished;
    jfieldID _revTimePublishedUpdated;

} REV_ENTITY_ANNOTATION_JNI_POSREC;


typedef struct REV_ENTITY_RELATIONSHIP_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revResolveStatus;
    jfieldID _revEntityRelationshipId_ID;
    jfieldID _remoteRevEntityRelationshipId;
    jfieldID _revEntityRelationshipType_ID;
    jfieldID _revEntityRelationshipTypeValueId_ID;
    jfieldID _revEntitySubjectGUID_ID;
    jfieldID _remoteRevevEntitySubjectGUID_ID;
    jfieldID _revEntityTargetGUID_ID;
    jfieldID _remoteRevEntityTargetGUID_ID;

    jfieldID _timeCreated_ID;
    jfieldID _timeUpdated_ID;

    jfieldID _revTimeCreated;
    jfieldID _revTimePublished;
    jfieldID _revTimePublishedUpdated;

} REV_ENTITY_RELATIONSHIP_JNI_POSREC;

#endif //OWKI_REV_PERS_READ_STRUCTS_H

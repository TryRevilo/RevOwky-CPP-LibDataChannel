//
// Created by rev on 7/9/18.
//

#include <jni.h>

#ifndef OWKI_REV_PERS_READ_STRUCTS_H
#define OWKI_REV_PERS_READ_STRUCTS_H

typedef struct REV_ENTITY_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revType_ID;
    jfieldID _revSubType_ID;

    jfieldID _revResolveStatus;
    jfieldID _revChildableStatus;

    jfieldID _revGUID_ID;
    jfieldID _revRemoteGUID_ID;

    jfieldID _revOwnerGUID_ID;
    jfieldID _revContainerGUID_ID;
    jfieldID _revRemoteContainerGUID;
    jfieldID _revSiteGUID_ID;
    jfieldID _revAccessPermission_ID;

    jfieldID _revMetadataList_ID;

    jfieldID _revPublisherEntity_ID;
    jfieldID _revInfoEntity_ID;

    jfieldID _revTimeCreated_ID;
    jfieldID _revTimePublished_ID;
    jfieldID _revTimePublishedUpdated_ID;
} REV_ENTITY_JNI_POSREC;

typedef struct REV_ENTITY_METADATA_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revResolveStatus;
    jfieldID _revId;
    jfieldID revMetadataValueId;
    jfieldID _revRemoteId;

    jfieldID _revName;
    jfieldID _revValue;

    jfieldID _revGUID;

    jfieldID _revTimeCreated_ID;
    jfieldID _revTimePublished_ID;
    jfieldID _revTimePublishedUpdated_ID;
} REV_ENTITY_METADATA_JNI_POSREC;

typedef struct REV_ENTITY_ANNOTATION_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revResolveStatus;

    jfieldID _revName;
    jfieldID _revValue;

    jfieldID _revId;
    jfieldID _revRemoteId;

    jfieldID _revGUID;
    jfieldID _revRemoteGUID;
    jfieldID _revOwnerGUID;
    jfieldID _revRemoteOwnerGUID;

    jfieldID _revTimeCreated_ID;
    jfieldID _revTimePublished_ID;
    jfieldID _revTimePublishedUpdated_ID;

} REV_ENTITY_ANNOTATION_JNI_POSREC;

typedef struct REV_ENTITY_RELATIONSHIP_JNI_POSREC {
    jclass cls;
    jmethodID constructortor_ID;

    jfieldID _revResolveStatus;
    jfieldID _revId_ID;
    jfieldID _revRemoteId;

    jfieldID _revGUID;
    jfieldID _revRemoteGUID;

    jfieldID _revType_ID;
    jfieldID _revTypeValueId_ID;
    jfieldID _revSubjectGUID_ID;
    jfieldID _remoteRevevEntitySubjectGUID_ID;
    jfieldID _revTargetGUID_ID;
    jfieldID _revRemoteTargetGUID_ID;

    jfieldID _revTimeCreated_ID;
    jfieldID _revTimePublished_ID;
    jfieldID _revTimePublishedUpdated_ID;

} REV_ENTITY_RELATIONSHIP_JNI_POSREC;

#endif //OWKI_REV_PERS_READ_STRUCTS_H

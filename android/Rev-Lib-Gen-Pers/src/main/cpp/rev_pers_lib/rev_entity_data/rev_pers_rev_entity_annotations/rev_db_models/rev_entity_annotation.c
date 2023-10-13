//
// Created by rev on 5/26/23.
//
#include "rev_entity_annotation.h"

#include <stdio.h>
#include <stdlib.h>
#include <android/log.h>
#include <string.h>

RevEntityAnnotation *revInitializedAnnotation()
{
    RevEntityAnnotation *revEntityAnnotation = (RevEntityAnnotation *)malloc(sizeof(RevEntityAnnotation));

    revEntityAnnotation->_revResolveStatus = -1;

    revEntityAnnotation->_revName = "";

    revEntityAnnotation->_revValue = "";

    revEntityAnnotation->_revId = -1;
    revEntityAnnotation->_revRemoteId = -1;

    revEntityAnnotation->_revGUID = -1;
    revEntityAnnotation->_revRemoteGUID = -1;

    revEntityAnnotation->_revOwnerGUID = -1;
    revEntityAnnotation->_revRemoteOwnerGUID = -1;

    revEntityAnnotation->_revTimeCreated = -1;
    revEntityAnnotation->_revTimePublished = -1;
    revEntityAnnotation->_revTimePublishedUpdated = -1;

    return revEntityAnnotation;
}
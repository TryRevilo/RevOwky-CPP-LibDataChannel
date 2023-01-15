import {View, Text, NativeModules} from 'react-native';
import React, {useContext, useEffect} from 'react';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevWebRTCReactModule,
  RevGenLibs_Server_React,
} = NativeModules;

import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';

import {REV_CREATE_NEW_REV_ENTITY_URL} from './rev_pers_urls';

import {revIsEmptyJSONObject} from '../../../rev_function_libs/rev_string_function_libs';

export function RevPersSyncDataComponent() {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const revGetUserEntities = () => {
    let revEntities = [];

    let revUnresolvedEntityGUIDsStr =
      RevPersLibRead_React.revPersGetALLRevEntityGUIDs_By_ResolveStatus_SubType(
        -1,
        'rev_user_entity',
      );

    let revUnresolvedEntityGUIDsArr = JSON.parse(revUnresolvedEntityGUIDsStr);

    for (let i = 0; i < revUnresolvedEntityGUIDsArr.length; i++) {
      let revCurrEntityGUID = revUnresolvedEntityGUIDsArr[i];
      let revCurrEntityStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revCurrEntityGUID);

      let revCurrEntity = JSON.parse(revCurrEntityStr);
      revCurrEntity['_remoteRevEntityGUID'] = -1;

      let revCurrInfoEntityGUIDsStr =
        RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
          'rev_entity_info',
          revCurrEntityGUID,
        );

      let revCurrInfoEntityGUIDsArr = JSON.parse(revCurrInfoEntityGUIDsStr);

      if (
        Array.isArray(revCurrInfoEntityGUIDsArr) &&
        revCurrInfoEntityGUIDsArr.length > 0
      ) {
        let revCurrInfoEntity = RevPersLibRead_React.revPersGetRevEntityByGUID(
          revCurrInfoEntityGUIDsArr[0],
        );
        revCurrEntity._revInfoEntity = JSON.parse(revCurrInfoEntity);
      }

      revEntities.push(revCurrEntity);
    }

    return revEntities;
  };

  const revSetRemoteMetadataID = (revEntityGUID, revMetadataArr) => {
    for (let i = 0; i < revMetadataArr.length; i++) {
      let revCurrMetadata = revMetadataArr[i];

      if (revIsEmptyJSONObject(revCurrMetadata)) {
        continue;
      }

      let revLocalMetadataId = revCurrMetadata.localMetadataId;
      let revRemoteMetadataId = revCurrMetadata.metadataId;

      if (revLocalMetadataId == revRemoteMetadataId) {
        let revMatadataName = revCurrMetadata.matadataName;
        let revMatadataValue = revCurrMetadata.matadataValue;

        let revMetadataStr =
          RevPersLibRead_React.revGetRevEntityMetadata_By_MetadataName_MetadataValue_EntityGUID(
            revMatadataName,
            revMatadataValue,
            revEntityGUID,
          );

        let revMetadata = JSON.parse(revMetadataStr);

        if (revIsEmptyJSONObject(revMetadata)) {
          continue;
        }

        if (revMetadata && revMetadata.hasOwnProperty('revMetadataId')) {
          revLocalMetadataId = revMetadata.revMetadataId;
        } else {
          continue;
        }
      }

      let revRemoteMetadataStatus =
        RevPersLibUpdate_React.setRemoteRevEntityMetadataId(
          revLocalMetadataId,
          revRemoteMetadataId,
        );
    }

    return true;
  };

  useEffect(() => {
    let revUnresolvedEntitiesArr = revGetUserEntities();

    /**
     * {"result":{"revPersOptions":{"revPersType":"rev_create"},"filter":[{"_remoteRevEntityGUID":534,"_revEntityMetadataList":[{"localMetadataId":794,"metadataId":794}]}]}}
     */
    let revURL = REV_ROOT_URL + REV_CREATE_NEW_REV_ENTITY_URL;

    revPostServerData(
      revURL,
      {filter: revUnresolvedEntitiesArr},
      revRetPersData => {
        if (
          revIsEmptyJSONObject(revRetPersData) ||
          revRetPersData.hasOwnProperty('error') ||
          !revRetPersData.hasOwnProperty('result')
        ) {
          return;
        }

        let revResult = revRetPersData.result;

        if (revIsEmptyJSONObject(revResult)) {
          return;
        }

        if (
          !revResult.hasOwnProperty('filter') ||
          !Array.isArray(revResult.filter)
        ) {
          return;
        }

        let revFilter = revResult.filter;

        for (let i = 0; i < revFilter.length; i++) {
          let revCurrData = revFilter[i];

          if (revIsEmptyJSONObject(revCurrData)) {
            continue;
          }

          let revEntityGUID = revCurrData._revEntityGUID;
          let remoteRevEntityGUID = revCurrData._remoteRevEntityGUID;

          if (revEntityGUID < 0 || remoteRevEntityGUID < 0) {
            continue;
          }

          let revRemoteGUIDUpdateStatus =
            RevPersLibUpdate_React.setRemoteRevEntityGUIDByRevEntityGUID(
              revEntityGUID,
              remoteRevEntityGUID,
            );

          if (revRemoteGUIDUpdateStatus < 0) {
            continue;
          }

          let revReset =
            RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
              -1,
              revEntityGUID,
            );

          console.log('>>> ENTITY revReset ' + revReset);

          /** START RELATIONSHIPS */
          let revSetRemoteSubjectGUIDStatus =
            RevPersLibUpdate_React.revPersUpdateSetRemoteSubjectGUID(
              revEntityGUID,
              remoteRevEntityGUID,
            );
          console.log(
            '>>> revSetRemoteSubjectGUIDStatus ' +
              revSetRemoteSubjectGUIDStatus,
          );

          let revSetRemoteTargetGUIDStatus =
            RevPersLibUpdate_React.revPersUpdateSetRemoteTargetGUID(
              revEntityGUID,
              remoteRevEntityGUID,
            );
          console.log(
            '>>> revSetRemoteTargetGUIDStatus ' + revSetRemoteTargetGUIDStatus,
          );
          /** END RELATIONSHIPS */

          if (
            revCurrData.hasOwnProperty('_revEntityMetadataList') &&
            Array.isArray(revCurrData._revEntityMetadataList)
          ) {
            let revEntityMetadataList = revCurrData._revEntityMetadataList;
            revSetRemoteMetadataID(revEntityGUID, revEntityMetadataList);
          }

          /** START SAVE INFO */
          if (revCurrData.hasOwnProperty('_revInfoEntity')) {
            let revInfoEntity = revCurrData._revInfoEntity;

            let revInfoEntityGUID = revInfoEntity.revEntityGUID;
            let revInfoRemoteRevEntityGUID = revInfoEntity._remoteRevEntityGUID;

            if (revInfoEntityGUID < 0 || revInfoRemoteRevEntityGUID < 0) {
              continue;
            }

            console.log('>>> revInfoEntityGUID ' + revInfoEntityGUID);

            let revInfoRemoteGUIDUpdateStatus =
              RevPersLibUpdate_React.setRemoteRevEntityGUIDByRevEntityGUID(
                revInfoEntityGUID,
                revInfoRemoteRevEntityGUID,
              );

            console.log(
              '>>> revInfoRemoteGUIDUpdateStatus ' +
                revInfoRemoteGUIDUpdateStatus,
            );

            if (revInfoRemoteGUIDUpdateStatus < 0) {
              continue;
            }

            /** START INFO RELATIONSHIPS */
            let revSetInfoRemoteSubjectGUIDStatus =
              RevPersLibUpdate_React.revPersUpdateSetRemoteSubjectGUID(
                revInfoEntityGUID,
                revInfoRemoteRevEntityGUID,
              );
            console.log(
              '>>> revSetInfoRemoteSubjectGUIDStatus ' +
                revSetInfoRemoteSubjectGUIDStatus,
            );

            let revSetInfoRemoteTargetGUIDStatus =
              RevPersLibUpdate_React.revPersUpdateSetRemoteTargetGUID(
                revInfoEntityGUID,
                revInfoRemoteRevEntityGUID,
              );
            console.log(
              '>>> revSetInfoRemoteTargetGUIDStatus ' +
                revSetInfoRemoteTargetGUIDStatus,
            );
            /** END INFO RELATIONSHIPS */

            let revReset =
              RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
                -1,
                revInfoEntityGUID,
              );

            console.log('>>> ENTITY revReset ' + revReset);

            if (
              !revInfoEntity.hasOwnProperty('_revEntityMetadataList') &&
              !Array.isArray(revInfoEntity._revEntityMetadataList)
            ) {
              continue;
            }

            let revInfoEntityMetadataList =
              revInfoEntity._revEntityMetadataList;

            revSetRemoteMetadataID(
              revInfoEntityGUID,
              revInfoEntityMetadataList,
            );
          }
          /** END SAVE INFO */
        }
      },
    );
  }, []);
  return null;
}

import {DeviceEventEmitter, NativeModules} from 'react-native';
import {useContext} from 'react';

const {RevPersLibCreate_React, RevPersLibRead_React, RevPersLibUpdate_React} =
  NativeModules;

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';

import {revPersGetALLRevEntityGUIDs_By_ResStatus} from '../rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {useRevSetMetadataArrayRemoteID} from '../rev_pers_metadata/rev_update/RevPersUpdateMetadataCustomHooks';
import {useRevSetRemoteRelGUID} from '../rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

import {REV_CREATE_NEW_REV_ENTITY_URL} from './rev_pers_urls';

import {revIsEmptyJSONObject} from '../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyVar} from '../../../rev_function_libs/rev_gen_helper_functions';
import {revPingServer} from '../../../rev_function_libs/rev_gen_helper_functions';

import {REV_CREATE_NEW_REL_URL} from './rev_pers_urls';

const revSettings = require('../../../rev_res/rev_settings.json');

export function useRevPersSyncDataComponent() {
  let revResStatus, revCallBack;

  const {REV_LOGGED_IN_ENTITY, REV_SITE_ENTITY_GUID} =
    useContext(RevSiteDataContext);
  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  DeviceEventEmitter.addListener(
    'rev_curl_file_upload_ret_data_event',
    event => {
      let revRetDataStr = event.eventProperty;

      if (revIsEmptyVar(revRetDataStr)) {
        return;
      }

      try {
        let revRetData = JSON.parse(revRetDataStr);

        if (!revRetData.hasOwnProperty('revFilterSuccess')) {
          console.log(
            '>>> rev_curl_file_upload_ret_data_event <<< revRetDataStr ' +
              revRetDataStr,
          );
          return;
        }

        let revFilterSuccess = revRetData.revFilterSuccess;
        let revFilterFail = revRetData.revFilterFail;

        for (let i = 0; i < revFilterSuccess.length; i++) {
          let revCurrFile = revFilterSuccess[i];

          let revMetadataStr =
            RevPersLibRead_React.revGetRevEntityMetadata_By_MetadataName_MetadataValue(
              'rev_remote_file_name',
              revCurrFile,
            );

          let revMetadata = JSON.parse(revMetadataStr);

          let revMetadataId = revMetadata.revMetadataId;

          if (revMetadataId > 0) {
            RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
              2,
              revMetadataId,
            );
          }
        }

        for (let i = 0; i < revFilterFail.length; i++) {
          let revCurrFile = revFilterFail[i];

          let revMetadata =
            RevPersLibRead_React.revGetRevEntityMetadata_By_MetadataName_MetadataValue(
              'rev_remote_file_name',
              revCurrFile,
            );
          let revMetadataId = revMetadata._metadataId;

          z;
          if (revMetadataId > 0) {
            RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
              0,
              revMetadataId,
            );
          }
        }

        revCURLFileUploadSync();
      } catch (error) {
        console.log('>>> ' + error);
      }
    },
  );

  const revCURLFileUploadSync = () => {
    let revFilesStr =
      RevPersLibRead_React.revPersGetALLRevEntityMetadata_BY_ResStatus_MetadataName(
        0,
        'rev_remote_file_name',
      );

    if (revFilesStr == '') {
      return;
    }

    let revFilesArr = JSON.parse(revFilesStr);

    if (!revFilesArr.length) {
      return;
    }

    console.log('>>> Uploading ' + revFilesArr.length + ' files');

    for (let i = 0; i < revFilesArr.length; i++) {
      let revCurrFile = revFilesArr[i];

      if (
        !revCurrFile.hasOwnProperty('_metadataValue') ||
        revIsEmptyVar(revCurrFile._metadataValue)
      ) {
        continue;
      }

      let revFileURI = revCurrFile._metadataValue;
      revFileURI = revSettings.revPublishedMediaDir + '/' + revFileURI;
      revFilesArr[i] = revFileURI;

      RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
        -2,
        revCurrFile.revMetadataId,
      );
    }

    RevPersLibCreate_React.revCURLFileUpload(
      revSettings.revSiteUploadDirPath,
      JSON.stringify({rev_files: revFilesArr}),
      'char *revData',
    );
  };

  const revSyncRels = () => {
    let revEntityRelationshipsStr =
      RevPersLibRead_React.revPersGetRevEntityRels_By_ResStatus(-1);

    let revEntityRelationshipsArr = JSON.parse(revEntityRelationshipsStr);

    if (!revEntityRelationshipsArr.length) {
      revCURLFileUploadSync();
      return;
    }

    let revLoggedInRemoteRevEntityGUID =
      REV_LOGGED_IN_ENTITY._remoteRevEntityGUID;

    let revPersRelsArr = [];

    for (let i = 0; i < revEntityRelationshipsArr.length; i++) {
      if (i >= 9) {
        break;
      }

      let revCurrRel = revEntityRelationshipsArr[i];

      let remoteRevEntitySubjectGUID = revCurrRel._remoteRevEntitySubjectGUID;
      let remoteRevEntityTargetGUID = revCurrRel._remoteRevEntityTargetGUID;

      if (remoteRevEntitySubjectGUID < 1 || remoteRevEntityTargetGUID < 1) {
        continue;
      }

      revCurrRel['_revOwnerGUID'] = revLoggedInRemoteRevEntityGUID;

      delete revCurrRel['_remoteRevEntityRelationshipId'];
      delete revCurrRel['_revEntityRelationshipTypeValueId'];
      delete revCurrRel['_revEntitySubjectGUID'];
      delete revCurrRel['_revEntityTargetGUID'];
      delete revCurrRel['_revTimePublished'];
      delete revCurrRel['_revTimePublishedUpdated'];
      delete revCurrRel['_timeCreated'];
      delete revCurrRel['_revTimeCreated'];

      revPersRelsArr.push(revCurrRel);
    }

    if (revEntityRelationshipsArr.length) {
      let revURL = REV_ROOT_URL + REV_CREATE_NEW_REL_URL;

      revPostServerData(revURL, {filter: revPersRelsArr}, revRetPersData => {
        let revRetRelsPersDataFilter = revRetPersData.filter;

        for (let i = 0; i < revRetRelsPersDataFilter.length; i++) {
          let revCurrRetRelsPersData = revRetRelsPersDataFilter[i];

          let revEntityRelationshipId =
            revCurrRetRelsPersData._revEntityRelationshipId;
          let revEntityRelationshipRemoteId =
            revCurrRetRelsPersData._revEntityRelationshipRemoteId;

          if (
            revEntityRelationshipId < 1 ||
            revEntityRelationshipRemoteId < 1
          ) {
            continue;
          }

          let revRelRemoteIdUpdateStatus =
            RevPersLibUpdate_React.revPersSetRemoteRelationshipRemoteId(
              revEntityRelationshipId,
              revEntityRelationshipRemoteId,
            );

          if (revRelRemoteIdUpdateStatus > 0) {
            let revRelUpdateStatus =
              RevPersLibUpdate_React.revPersUpdateRelResStatus_By_RelId(
                revEntityRelationshipId,
                0,
              );
          }
        }

        revSyncRels();
      });
    } else {
      console.log('>>> +++ <<<');
    }
  };

  const revFetchUnresolvedEntityData = (revURL, revUnresolvedEntitiesArr) => {
    if (!revUnresolvedEntitiesArr.length) {
      revSyncRels();
    }

    const {revSetRemoteRelGUID} = useRevSetRemoteRelGUID();

    revPostServerData(
      revURL,
      {filter: revUnresolvedEntitiesArr},
      revRetPersData => {
        let revGUIDsArr = [];

        if (
          revIsEmptyJSONObject(revRetPersData) ||
          revRetPersData.hasOwnProperty('error') ||
          !revRetPersData.hasOwnProperty('result')
        ) {
          return revCallBack(revRetPersData);
        }

        let revResult = revRetPersData.result;

        if (revIsEmptyJSONObject(revResult)) {
          return revCallBack(revRetPersData);
        }

        if (
          !revResult.hasOwnProperty('filter') ||
          !Array.isArray(revResult.filter)
        ) {
          return revCallBack(revRetPersData);
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

          RevPersLibUpdate_React.setRemoteRevEntityGUIDByRevEntityGUID(
            revEntityGUID,
            remoteRevEntityGUID,
          );

          RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
            0,
            revEntityGUID,
          );

          /** START RELATIONSHIPS */
          RevPersLibUpdate_React.revPersUpdateSetRemoteSubjectGUID(
            revEntityGUID,
            remoteRevEntityGUID,
          );

          RevPersLibUpdate_React.revPersUpdateSetRemoteTargetGUID(
            revEntityGUID,
            remoteRevEntityGUID,
          );
          /** END RELATIONSHIPS */

          if (
            revCurrData.hasOwnProperty('_revEntityMetadataList') &&
            Array.isArray(revCurrData._revEntityMetadataList)
          ) {
            let revEntityMetadataList = revCurrData._revEntityMetadataList;
            useRevSetMetadataArrayRemoteID(
              revEntityGUID,
              revEntityMetadataList,
            );
          }

          /** START SAVE INFO */
          if (revCurrData.hasOwnProperty('_revInfoEntity')) {
            let revInfoEntity = revCurrData._revInfoEntity;

            let revInfoEntityGUID = revInfoEntity._revEntityGUID;
            let revInfoRemoteRevEntityGUID = revInfoEntity._remoteRevEntityGUID;

            if (revInfoEntityGUID < 0 || revInfoRemoteRevEntityGUID < 0) {
              continue;
            }

            let revInfoRemoteGUIDUpdateStatus =
              RevPersLibUpdate_React.setRemoteRevEntityGUIDByRevEntityGUID(
                revInfoEntityGUID,
                revInfoRemoteRevEntityGUID,
              );

            if (revInfoRemoteGUIDUpdateStatus < 0) {
              continue;
            }

            RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
              0,
              revInfoEntityGUID,
            );

            /** START INFO RELATIONSHIPS */
            if (revInfoRemoteRevEntityGUID) {
              revSetRemoteRelGUID(
                revInfoEntityGUID,
                revInfoRemoteRevEntityGUID,
              );
            }

            if (revInfoRemoteRevEntityGUID) {
              revSetRemoteRelGUID(
                revInfoEntityGUID,
                revInfoRemoteRevEntityGUID,
              );
            }
            /** END INFO RELATIONSHIPS */

            if (
              !revInfoEntity.hasOwnProperty('_revEntityMetadataList') &&
              !Array.isArray(revInfoEntity._revEntityMetadataList)
            ) {
              continue;
            }

            let revInfoEntityMetadataList =
              revInfoEntity._revEntityMetadataList;

            useRevSetMetadataArrayRemoteID(
              revInfoEntityGUID,
              revInfoEntityMetadataList,
            );
          }
          /** END SAVE INFO */

          revGUIDsArr.push(revEntityGUID);
        }

        let revUnresolvedEntitiesArr =
          revPersGetALLRevEntityGUIDs_By_ResStatus(revResStatus);

        if (revUnresolvedEntitiesArr.length) {
          revPersSyncDataComponent(revResStatus, revCallBack);
        } else {
          revCallBack(revGUIDsArr);
        }
      },
    );
  };

  const revPersSyncDataComponent = (_revResStatus, _revCallBack) => {
    revResStatus = _revResStatus;
    revCallBack = _revCallBack;

    const revPingServerCallBack = revRetDada => {
      let revServerStatus = revRetDada.revServerStatus;

      if (revServerStatus !== 200) {
        return _revCallBack(revRetDada);
      }

      let revUnresolvedEntitiesArr =
        revPersGetALLRevEntityGUIDs_By_ResStatus(_revResStatus);

      let revUploadEntitiesArr = [];

      let revSiteRemoteEntityGUID =
        RevPersLibRead_React.revGetRemoteEntityGUID_BY_LocalEntityGUID(
          REV_SITE_ENTITY_GUID,
        );

      for (let i = 0; i < revUnresolvedEntitiesArr.length; i++) {
        if (revUploadEntitiesArr.length >= 10) {
          break;
        }

        let revCurrUpdateEntity = revUnresolvedEntitiesArr[i];
        let revCurrUpdateEntityType = revCurrUpdateEntity._revEntityType;

        let revIsUser = revCurrUpdateEntityType === 'rev_user_entity';
        let revIsSiteEntity =
          revCurrUpdateEntity._revEntitySubType === 'rev_site';

        // Prevent conflict trying to set the site's remote entity guid before remote push
        if (!revIsUser && !revIsSiteEntity && revSiteRemoteEntityGUID < 1) {
          continue;
        }

        // Make sure that all entities have an owner except if user
        let revEntityOwnerGUID = revCurrUpdateEntity._revEntityOwnerGUID;

        if (!revIsUser && revEntityOwnerGUID < 1) {
          continue;
        }

        let revOwnerRemoteEntityGUID =
          RevPersLibRead_React.revGetRemoteEntityGUID_BY_LocalEntityGUID(
            revEntityOwnerGUID,
          );

        // Skip all unowned non-user entitiees
        if (!revIsUser && revOwnerRemoteEntityGUID < 1) {
          continue;
        }

        revCurrUpdateEntity['_revEntityOwnerGUID'] = revOwnerRemoteEntityGUID;

        delete revCurrUpdateEntity['_fromRemote'];
        delete revCurrUpdateEntity['_revPublisherEntity'];

        // Info enties are already attached so skip
        if (revCurrUpdateEntity._revEntitySubType == 'rev_entity_info') {
          continue;
        }

        RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
          -101,
          revCurrUpdateEntity._revEntityGUID,
        );

        // Set an entity's info details
        if (
          revCurrUpdateEntity.hasOwnProperty('_revInfoEntity') &&
          !revIsEmptyJSONObject(revCurrUpdateEntity._revInfoEntity)
        ) {
          RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
            -101,
            revCurrUpdateEntity._revInfoEntity._revEntityGUID,
          );

          revCurrUpdateEntity._revInfoEntity['_revEntitySiteGUID'] =
            revSiteRemoteEntityGUID;
        }

        // If has container GUID set remote container GUID
        let revCurrContainerGUID = revCurrUpdateEntity._revEntityContainerGUID;
        if (revCurrContainerGUID && revCurrContainerGUID > 0) {
          let revCurrRemoteContainerGUID =
            RevPersLibRead_React.revGetRemoteEntityGUID_BY_LocalEntityGUID(
              revCurrContainerGUID,
            );

          if (revCurrRemoteContainerGUID < 1) {
            continue;
          }

          revCurrUpdateEntity['_revEntityContainerGUID'] =
            revCurrRemoteContainerGUID;
        }

        // Finaly set the Site's REMOTE GUID
        revCurrUpdateEntity['_revEntitySiteGUID'] = revSiteRemoteEntityGUID;

        revUploadEntitiesArr.push(revCurrUpdateEntity);
      }

      /**
       * {"result":{"revPersOptions":{"revPersType":"rev_create"},"filter":[{"_remoteRevEntityGUID":534,"_revEntityMetadataList":[{"localMetadataId":794,"metadataId":794}]}]}}
       */
      let revURL = REV_ROOT_URL + REV_CREATE_NEW_REV_ENTITY_URL;
      revFetchUnresolvedEntityData(revURL, revUploadEntitiesArr);

      return _revCallBack(revRetDada);
    };

    let revPingVarArgs = {
      revInterval: 1000,
      revIP: REV_ROOT_URL,
      revCallBack: revPingServerCallBack,
    };

    revPingServer(revPingVarArgs);
  };

  return {revPersSyncDataComponent};
}

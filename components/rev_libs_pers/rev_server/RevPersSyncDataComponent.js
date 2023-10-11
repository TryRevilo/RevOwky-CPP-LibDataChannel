import {DeviceEventEmitter, NativeModules} from 'react-native';
import {useContext, useEffect} from 'react';

const {RevPersLibCreate_React, RevPersLibRead_React, RevPersLibUpdate_React} =
  NativeModules;

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';

import {revPersGetALLRevEntityGUIDs_By_ResStatus} from '../rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {useRevSetMetadataArrayRemoteID} from '../rev_pers_metadata/rev_update/RevPersUpdateMetadataCustomHooks';
import {useRevSetRemoteRelGUID} from '../rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';
import {
  useRevPersGetRevEnty_By_EntityGUID,
  useRevPersQuery_By_RevVarArgs,
} from '../rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {REV_CREATE_NEW_REV_ENTITY_URL} from './rev_pers_urls';

import {revIsEmptyJSONObject} from '../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyVar} from '../../../rev_function_libs/rev_gen_helper_functions';
import {revPingServer} from '../../../rev_function_libs/rev_gen_helper_functions';

import {REV_CREATE_NEW_REL_URL} from './rev_pers_urls';
import {revStringEmpty} from '../../../rev_function_libs/rev_string_function_libs';

const revSettings = require('../../../rev_res/rev_settings.json');

export function useRevPersSyncDataComponent() {
  const {
    REV_LOGGED_IN_ENTITY_GUID,
    REV_LOGGED_IN_ENTITY,
    SET_REV_LOGGED_IN_ENTITY,
    REV_SITE_ENTITY_GUID,
  } = useContext(RevSiteDataContext);
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const {revPersQuery_By_RevVarArgs} = useRevPersQuery_By_RevVarArgs();

  let revSaveNewEntityURL = REV_ROOT_URL + REV_CREATE_NEW_REV_ENTITY_URL;

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
          console.log('>>> rev_curl <<< revRetDataStr ' + revRetDataStr);
          return;
        }

        let revFilterSuccess = revRetData.revFilterSuccess;
        let revFilterFail = revRetData.revFilterFail;

        for (let i = 0; i < revFilterSuccess.length; i++) {
          let revCurrFile = revFilterSuccess[i];

          let revMetadataStr =
            RevPersLibRead_React.revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(
              'rev_remote_file_name',
              revCurrFile,
            );

          let revMetadata = JSON.parse(revMetadataStr);
          let _revMetadataId = revMetadata._revMetadataId;

          if (_revMetadataId > 0) {
            RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
              2,
              _revMetadataId,
            );
          }
        }

        for (let i = 0; i < revFilterFail.length; i++) {
          let revCurrFile = revFilterFail[i];

          let revMetadata =
            RevPersLibRead_React.revGetRevEntityMetadata_By_revMetadataName_revMetadataValue(
              'rev_remote_file_name',
              revCurrFile,
            );
          let _revMetadataId = revMetadata._metadataId;

          if (_revMetadataId > 0) {
            RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
              0,
              _revMetadataId,
            );
          }
        }

        revCURLFileUploadSync();
      } catch (error) {
        console.log('>>> ' + error);
      }
    },
  );

  const revCURLFileUploadSync = revCallBack => {
    let revFilesStr =
      RevPersLibRead_React.revPersGetALLRevEntityMetadata_BY_ResStatus_revMetadataName(
        0,
        'rev_remote_file_name',
      );

    console.log('>>> revFilesStr', revFilesStr);

    if (revStringEmpty(revFilesStr)) {
      return revCallBack();
    }

    let revFilesArr = JSON.parse(revFilesStr);

    if (!revFilesArr.length) {
      return revCallBack();
    }

    console.log('>>> Uploading ' + revFilesArr.length + ' files');

    for (let i = 0; i < revFilesArr.length; i++) {
      let revCurrFile = revFilesArr[i];

      if (
        !revCurrFile.hasOwnProperty('_revMetadataValue') ||
        revIsEmptyVar(revCurrFile._revMetadataValue)
      ) {
        continue;
      }

      let revFileURI = revCurrFile._revMetadataValue;
      revFileURI = revSettings.revPublishedMediaDir + '/' + revFileURI;
      revFilesArr[i] = revFileURI;

      RevPersLibUpdate_React.setMetadataResolveStatus_BY_METADATA_ID(
        -2,
        revCurrFile._revMetadataId,
      );
    }

    RevPersLibCreate_React.revCURLFileUpload(
      revSettings.revSiteUploadDirPath,
      JSON.stringify({rev_files: revFilesArr}),
      'char *revData',
    );

    if (revFilesArr.length) {
      revCURLFileUploadSync(revCallBack);
    }
  };

  const revSyncRels = async () => {
    let revEntityRelationshipsStr =
      RevPersLibRead_React.revPersGetRevEntityRels_By_ResStatus(-1);

    let revEntityRelationshipsArr = JSON.parse(revEntityRelationshipsStr);

    if (!revEntityRelationshipsArr.length) {
      return;
    }

    let revLoggedIn_revRemoteEntityGUID =
      REV_LOGGED_IN_ENTITY._revRemoteEntityGUID;

    let revPersRelsArr = [];

    for (let i = 0; i < revEntityRelationshipsArr.length; i++) {
      if (i >= 9) {
        break;
      }

      let revCurrRel = revEntityRelationshipsArr[i];

      RevPersLibUpdate_React.revPersUpdateRelResStatus_By_RelId(
        revCurrRel._revEntityRelationshipId,
        -101,
      );

      let remoteRevEntitySubjectGUID = revCurrRel._revRemoteEntitySubjectGUID;

      if (remoteRevEntitySubjectGUID < 1) {
        remoteRevEntitySubjectGUID =
          RevPersLibRead_React.revGetRemoteEntityGUID_BY_LocalEntityGUID(
            revCurrRel._revEntitySubjectGUID,
          );

        let revPersUpdateRemoteSubjectGUIDStatus =
          RevPersLibUpdate_React.revPersUpdateSetRemoteSubjectGUID(
            revCurrRel._revEntitySubjectGUID,
            remoteRevEntitySubjectGUID,
          );

        if (revPersUpdateRemoteSubjectGUIDStatus < 1) {
          continue;
        }
      }

      if (remoteRevEntitySubjectGUID < 1) {
        continue;
      }

      let remoteRevEntityTargetGUID = revCurrRel._revRemoteEntityTargetGUID;

      if (remoteRevEntityTargetGUID < 1) {
        remoteRevEntityTargetGUID =
          RevPersLibRead_React.revGetRemoteEntityGUID_BY_LocalEntityGUID(
            revCurrRel._revEntityTargetGUID,
          );

        let revPersUpdateRemoteTargetGUIDStatus =
          RevPersLibUpdate_React.revPersUpdateSetRemoteTargetGUID(
            revCurrRel._revEntityTargetGUID,
            remoteRevEntityTargetGUID,
          );

        if (revPersUpdateRemoteTargetGUIDStatus < 1) {
          continue;
        }
      }

      if (remoteRevEntityTargetGUID < 1) {
        continue;
      }

      revCurrRel['_revOwnerGUID'] = revLoggedIn_revRemoteEntityGUID;

      delete revCurrRel['_remoteRevEntityRelationshipId'];
      delete revCurrRel['_revEntityRelationshipTypeValueId'];
      delete revCurrRel['_revEntitySubjectGUID'];
      delete revCurrRel['_revEntityTargetGUID'];
      delete revCurrRel['_revTimePublished'];
      delete revCurrRel['_revTimePublishedUpdated'];
      delete revCurrRel['_revTimeCreated'];
      delete revCurrRel['_revTimeCreated'];

      revPersRelsArr.push(revCurrRel);
    }

    if (revEntityRelationshipsArr.length) {
      let revURL = REV_ROOT_URL + REV_CREATE_NEW_REL_URL;

      revPostServerData(revURL, {filter: revPersRelsArr}, revRetPersData => {
        if (revIsEmptyJSONObject(revRetPersData)) {
          return;
        }

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

  const revFetchUnresolvedEntityData = async (
    revURL,
    revUnresolvedEntitiesArr,
  ) => {
    if (!revUnresolvedEntitiesArr.length) {
      return null;
    }

    const {revSetRemoteRelGUID} = useRevSetRemoteRelGUID();

    return new Promise((resolve, reject) => {
      revPostServerData(
        revURL,
        {filter: revUnresolvedEntitiesArr},
        revRetPersData => {
          if (
            revIsEmptyJSONObject(revRetPersData) ||
            revRetPersData.hasOwnProperty('error') ||
            !revRetPersData.hasOwnProperty('result')
          ) {
            return [];
          }

          let revResult = revRetPersData.result;

          if (revIsEmptyJSONObject(revResult)) {
            return [];
          }

          if (
            !revResult.hasOwnProperty('filter') ||
            !Array.isArray(revResult.filter)
          ) {
            return [];
          }

          let revFilter = revResult.filter;

          for (let i = 0; i < revFilter.length; i++) {
            let revCurrData = revFilter[i];

            if (
              revIsEmptyJSONObject(revCurrData) ||
              !revCurrData.hasOwnProperty('_revEntityGUID') ||
              !revCurrData.hasOwnProperty('_revRemoteEntityGUID')
            ) {
              continue;
            }

            let revEntityGUID = revCurrData._revEntityGUID;
            let _revRemoteEntityGUID = revCurrData._revRemoteEntityGUID;

            if (revEntityGUID < 0 || _revRemoteEntityGUID < 0) {
              continue;
            }

            RevPersLibUpdate_React.setrevRemoteEntityGUIDByRevEntityGUID(
              revEntityGUID,
              _revRemoteEntityGUID,
            );

            RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
              0,
              revEntityGUID,
            );

            /** START RELATIONSHIPS */
            RevPersLibUpdate_React.revPersUpdateSetRemoteSubjectGUID(
              revEntityGUID,
              _revRemoteEntityGUID,
            );

            RevPersLibUpdate_React.revPersUpdateSetRemoteTargetGUID(
              revEntityGUID,
              _revRemoteEntityGUID,
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
              let revInfo_revRemoteEntityGUID =
                revInfoEntity._revRemoteEntityGUID;

              if (revInfoEntityGUID < 0 || revInfo_revRemoteEntityGUID < 0) {
                continue;
              }

              let revInfoRemoteGUIDUpdateStatus =
                RevPersLibUpdate_React.setrevRemoteEntityGUIDByRevEntityGUID(
                  revInfoEntityGUID,
                  revInfo_revRemoteEntityGUID,
                );

              if (revInfoRemoteGUIDUpdateStatus < 0) {
                continue;
              }

              RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
                0,
                revInfoEntityGUID,
              );

              /** START INFO RELATIONSHIPS */
              if (revInfo_revRemoteEntityGUID) {
                revSetRemoteRelGUID(
                  revInfoEntityGUID,
                  revInfo_revRemoteEntityGUID,
                );
              }

              if (revInfo_revRemoteEntityGUID) {
                revSetRemoteRelGUID(
                  revInfoEntityGUID,
                  revInfo_revRemoteEntityGUID,
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
          }

          resolve(revFilter);
        },
      );
    });
  };

  const revPersSyncMetadata = async () => {
    let revPassVarArgs = {
      revTableName: 'REV_ENTITY_METADATA_TABLE',
      revSelect: [
        '_revMetadataId',
        '_revMetadataEntityGUID',
        '_revRemoteMetadataId',
        '_revMetadataName',
      ],
      revWhere: {
        _revResolveStatus: {'<': 0},
      },
      revLimit: 22,
    };

    let revMetadataArr = revPersQuery_By_RevVarArgs(
      revPassVarArgs,
      'REV_ENTITY_METADATA_TABLE',
    );

    if (revMetadataArr.length) {
      // await revPersSyncMetadata();
    }

    return;
  };

  const revSaveSiteEntity = async revEntityGUID => {
    let revSiteEntity = revPersGetRevEnty_By_EntityGUID(revEntityGUID);

    let revRetData = await revFetchUnresolvedEntityData(revSaveNewEntityURL, [
      revSiteEntity,
    ]);

    revRetData = revRetData.filter[0];

    let revRemoteSiteEntityGUID = -1;

    if (
      !revIsEmptyJSONObject(revRetData) &&
      revRetData.hasOwnProperty('_revRemoteEntityGUID')
    ) {
      revRemoteSiteEntityGUID = revRetData._revRemoteEntityGUID;
    }

    return revRemoteSiteEntityGUID;
  };

  const revSaveLoggedInUserEntity = async () => {
    let revRetPersData = await revFetchUnresolvedEntityData(
      revSaveNewEntityURL,
      [REV_LOGGED_IN_ENTITY],
    );

    SET_REV_LOGGED_IN_ENTITY(revPrev => {
      return {
        ...revPrev,
        _revRemoteEntityGUID: revRetPersData._revRemoteEntityGUID,
      };
    });

    return revRetPersData._revRemoteEntityGUID;
  };

  let revResStatus = -1;

  const revPingServerCallBack = async revRetData => {
    let revServerStatus = revRetData.revServerStatus;

    if (revServerStatus !== 200 || REV_SITE_ENTITY_GUID < 1) {
      return revRetData;
    }

    let revUnresolvedEntitiesArr =
      revPersGetALLRevEntityGUIDs_By_ResStatus(revResStatus);

    let revUploadEntitiesArr = [];

    let revLoggedInRemoteEntityGUID = REV_LOGGED_IN_ENTITY._revRemoteEntityGUID;

    if (revLoggedInRemoteEntityGUID < 1) {
      let revLoggedInRemoteEntityGUID = await revSaveLoggedInUserEntity();

      if (revLoggedInRemoteEntityGUID > 0) {
        return revPingServerCallBack(revRetData);
      } else {
        return;
      }
    }

    let revSiteRemoteEntityGUID =
      RevPersLibRead_React.revGetRemoteEntityGUID_BY_LocalEntityGUID(
        REV_SITE_ENTITY_GUID,
      );

    // Prevent conflict trying to set the site's remote entity guid before remote push
    if (revSiteRemoteEntityGUID < 1) {
      revSiteRemoteEntityGUID = await revSaveSiteEntity(REV_SITE_ENTITY_GUID);
    }

    if (revSiteRemoteEntityGUID < 1) {
      return;
    }

    for (let i = 0; i < revUnresolvedEntitiesArr.length; i++) {
      if (revUploadEntitiesArr.length >= 22) {
        break;
      }

      let revCurrUpdateEntity = revUnresolvedEntitiesArr[i];

      let revCurrUpdateEntityType = revCurrUpdateEntity._revEntityType;

      let revIsUser = revCurrUpdateEntityType === 'rev_user_entity';

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
        if (revCurrUpdateEntity._revEntityOwnerGUID < 1) {
          continue;
        }
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
     * {"result":{"revPersOptions":{"revPersType":"rev_create"},"filter":[{"_revRemoteEntityGUID":534,"_revEntityMetadataList":[{"_revMetadataId":794,"_revRemoteMetadataId":794}]}]}}
     */

    await revFetchUnresolvedEntityData(
      revSaveNewEntityURL,
      revUploadEntitiesArr,
    );

    if (revUnresolvedEntitiesArr.length) {
      let revPingVarArgs = {
        revInterval: 1000,
        revIP: REV_ROOT_URL,
        revCallBack: revPingServerCallBack,
      };

      revPingServer(revPingVarArgs);
    }

    await revPersSyncMetadata();
    await revSyncRels();
    return revCURLFileUploadSync(() => 'Success');
  };

  const revPersSyncDataComponent = async => {
    let revResStatusArr = [-1];

    for (let i = 0; i < revResStatusArr.length; i++) {
      revResStatus = revResStatusArr[i];

      let revPingVarArgs = {
        revInterval: 1000,
        revIP: REV_ROOT_URL,
        revCallBack: revPingServerCallBack,
      };

      revPingServer(revPingVarArgs);
    }

    return 'Success !';
  };

  useEffect(() => {
    console.log('>>> REV_LOGGED_IN_ENTITY_GUID', REV_LOGGED_IN_ENTITY_GUID);
  }, [REV_LOGGED_IN_ENTITY_GUID, REV_SITE_ENTITY_GUID]);

  return {revPersSyncDataComponent};
}

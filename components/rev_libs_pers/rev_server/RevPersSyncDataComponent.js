import {DeviceEventEmitter, NativeModules} from 'react-native';
import {useContext, useEffect} from 'react';

const {RevPersLibCreate_React, RevPersLibRead_React, RevPersLibUpdate_React} =
  NativeModules;

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';
import {revPostServerData} from './rev_pers_lib_create';

import {revPersGetEntityGUIDs_By_ResStatus} from '../rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
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
            RevPersLibRead_React.revPersGetMetadata_By_Name_Value(
              'rev_remote_file_name',
              revCurrFile,
            );

          let revMetadata = JSON.parse(revMetadataStr);
          let _revId = revMetadata._revId;

          if (_revId > 0) {
            RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
              2,
              _revId,
            );
          }
        }

        for (let i = 0; i < revFilterFail.length; i++) {
          let revCurrFile = revFilterFail[i];

          let revMetadata =
            RevPersLibRead_React.revPersGetMetadata_By_Name_Value(
              'rev_remote_file_name',
              revCurrFile,
            );
          let _revId = revMetadata._metadataId;

          if (_revId > 0) {
            RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
              0,
              _revId,
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
    let revFilesStr = RevPersLibRead_React.revPersGetMetadata_BY_ResStatus_Name(
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
        !revCurrFile.hasOwnProperty('_revValue') ||
        revIsEmptyVar(revCurrFile._revValue)
      ) {
        continue;
      }

      let revFileURI = revCurrFile._revValue;
      revFileURI = revSettings.revPublishedMediaDir + '/' + revFileURI;
      revFilesArr[i] = revFileURI;

      RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
        -2,
        revCurrFile._revId,
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
      RevPersLibRead_React.revPersGetRels_By_ResStatus(-1);

    let revEntityRelationshipsArr = JSON.parse(revEntityRelationshipsStr);

    if (!revEntityRelationshipsArr.length) {
      return;
    }

    let revLoggedIn_revRemoteGUID = REV_LOGGED_IN_ENTITY._revRemoteGUID;

    let revPersRelsArr = [];

    for (let i = 0; i < revEntityRelationshipsArr.length; i++) {
      if (i >= 9) {
        break;
      }

      let revCurrRel = revEntityRelationshipsArr[i];

      RevPersLibUpdate_React.revPersUpdateRelResStatus_By_RelId(
        revCurrRel._revId,
        -101,
      );

      let remoteRevEntitySubjectGUID = revCurrRel._revRemoteSubjectGUID;

      if (remoteRevEntitySubjectGUID < 1) {
        remoteRevEntitySubjectGUID =
          RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
            revCurrRel._revSubjectGUID,
          );

        let revPersUpdateRemoteSubjectGUIDStatus =
          RevPersLibUpdate_React.revPersSetRemoteSubjectGUID(
            revCurrRel._revSubjectGUID,
            remoteRevEntitySubjectGUID,
          );

        if (revPersUpdateRemoteSubjectGUIDStatus < 1) {
          continue;
        }
      }

      if (remoteRevEntitySubjectGUID < 1) {
        continue;
      }

      let remoteRevEntityTargetGUID = revCurrRel._revRemoteTargetGUID;

      if (remoteRevEntityTargetGUID < 1) {
        remoteRevEntityTargetGUID =
          RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
            revCurrRel._revTargetGUID,
          );

        let revPersUpdateRemoteTargetGUIDStatus =
          RevPersLibUpdate_React.revPersSetRemoteTargetGUID(
            revCurrRel._revTargetGUID,
            remoteRevEntityTargetGUID,
          );

        if (revPersUpdateRemoteTargetGUIDStatus < 1) {
          continue;
        }
      }

      if (remoteRevEntityTargetGUID < 1) {
        continue;
      }

      revCurrRel['_revOwnerGUID'] = revLoggedIn_revRemoteGUID;

      delete revCurrRel['_remoteRevEntityRelationshipId'];
      delete revCurrRel['_revTypeValueId'];
      delete revCurrRel['_revSubjectGUID'];
      delete revCurrRel['_revTargetGUID'];
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

          let revEntityRelationshipId = revCurrRetRelsPersData._revId;
          let revEntityRelationshipRemoteId =
            revCurrRetRelsPersData._revRemoteId;

          if (
            revEntityRelationshipId < 1 ||
            revEntityRelationshipRemoteId < 1
          ) {
            continue;
          }

          let revRelRemoteIdUpdateStatus =
            RevPersLibUpdate_React.revPersSetRemoteRelId(
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
              !revCurrData.hasOwnProperty('_revGUID') ||
              !revCurrData.hasOwnProperty('_revRemoteGUID')
            ) {
              continue;
            }

            let revEntityGUID = revCurrData._revGUID;
            let _revRemoteGUID = revCurrData._revRemoteGUID;

            if (revEntityGUID < 0 || _revRemoteGUID < 0) {
              continue;
            }

            RevPersLibUpdate_React.revPersSetRemoteEntityGUID_By_LocalEntityGUID(
              revEntityGUID,
              _revRemoteGUID,
            );

            RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
              0,
              revEntityGUID,
            );

            /** START RELATIONSHIPS */
            RevPersLibUpdate_React.revPersSetRemoteSubjectGUID(
              revEntityGUID,
              _revRemoteGUID,
            );

            RevPersLibUpdate_React.revPersSetRemoteTargetGUID(
              revEntityGUID,
              _revRemoteGUID,
            );
            /** END RELATIONSHIPS */

            if (
              revCurrData.hasOwnProperty('_revMetadataList') &&
              Array.isArray(revCurrData._revMetadataList)
            ) {
              let revEntityMetadataList = revCurrData._revMetadataList;
              useRevSetMetadataArrayRemoteID(
                revEntityGUID,
                revEntityMetadataList,
              );
            }

            /** START SAVE INFO */
            if (revCurrData.hasOwnProperty('_revInfoEntity')) {
              let revInfoEntity = revCurrData._revInfoEntity;

              let revInfoEntityGUID = revInfoEntity._revGUID;
              let revInfo_revRemoteGUID = revInfoEntity._revRemoteGUID;

              if (revInfoEntityGUID < 0 || revInfo_revRemoteGUID < 0) {
                continue;
              }

              let revInfoRemoteGUIDUpdateStatus =
                RevPersLibUpdate_React.revPersSetRemoteEntityGUID_By_LocalEntityGUID(
                  revInfoEntityGUID,
                  revInfo_revRemoteGUID,
                );

              if (revInfoRemoteGUIDUpdateStatus < 0) {
                continue;
              }

              RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
                0,
                revInfoEntityGUID,
              );

              /** START INFO RELATIONSHIPS */
              if (revInfo_revRemoteGUID) {
                revSetRemoteRelGUID(revInfoEntityGUID, revInfo_revRemoteGUID);
              }

              if (revInfo_revRemoteGUID) {
                revSetRemoteRelGUID(revInfoEntityGUID, revInfo_revRemoteGUID);
              }
              /** END INFO RELATIONSHIPS */

              if (
                !revInfoEntity.hasOwnProperty('_revMetadataList') &&
                !Array.isArray(revInfoEntity._revMetadataList)
              ) {
                continue;
              }

              let revInfoEntityMetadataList = revInfoEntity._revMetadataList;

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
      revSelect: ['_revId', '_revGUID', '_revRemoteId', '_revName'],
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
      revRetData.hasOwnProperty('_revRemoteGUID')
    ) {
      revRemoteSiteEntityGUID = revRetData._revRemoteGUID;
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
        _revRemoteGUID: revRetPersData._revRemoteGUID,
      };
    });

    return revRetPersData._revRemoteGUID;
  };

  let revResStatus = -1;

  const revPingServerCallBack = async revRetData => {
    let revServerStatus = revRetData.revServerStatus;

    if (revServerStatus !== 200 || REV_SITE_ENTITY_GUID < 1) {
      return revRetData;
    }

    let revUnresolvedEntitiesArr =
      revPersGetEntityGUIDs_By_ResStatus(revResStatus);

    let revUploadEntitiesArr = [];

    let revLoggedInRemoteEntityGUID = REV_LOGGED_IN_ENTITY._revRemoteGUID;

    if (revLoggedInRemoteEntityGUID < 1) {
      let revLoggedInRemoteEntityGUID = await revSaveLoggedInUserEntity();

      if (revLoggedInRemoteEntityGUID > 0) {
        return revPingServerCallBack(revRetData);
      } else {
        return;
      }
    }

    let revSiteRemoteEntityGUID =
      RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
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

      let revCurrUpdateEntityType = revCurrUpdateEntity._revType;

      let revIsUser = revCurrUpdateEntityType === 'rev_user_entity';

      // Make sure that all entities have an owner except if user
      let revEntityOwnerGUID = revCurrUpdateEntity._revOwnerGUID;

      if (!revIsUser && revEntityOwnerGUID < 1) {
        continue;
      }

      let revOwnerRemoteEntityGUID =
        RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
          revEntityOwnerGUID,
        );

      // Skip all unowned non-user entitiees
      if (!revIsUser && revOwnerRemoteEntityGUID < 1) {
        continue;
      }

      revCurrUpdateEntity['_revOwnerGUID'] = revOwnerRemoteEntityGUID;

      delete revCurrUpdateEntity['_fromRemote'];
      delete revCurrUpdateEntity['_revPublisherEntity'];

      // Info enties are already attached so skip
      if (revCurrUpdateEntity._revSubType == 'rev_entity_info') {
        if (revCurrUpdateEntity._revOwnerGUID < 1) {
          continue;
        }
      }

      RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
        -101,
        revCurrUpdateEntity._revGUID,
      );

      // Set an entity's info details
      if (
        revCurrUpdateEntity.hasOwnProperty('_revInfoEntity') &&
        !revIsEmptyJSONObject(revCurrUpdateEntity._revInfoEntity)
      ) {
        RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
          -101,
          revCurrUpdateEntity._revInfoEntity._revGUID,
        );

        revCurrUpdateEntity._revInfoEntity['_revSiteGUID'] =
          revSiteRemoteEntityGUID;
      }

      // If has container GUID set remote container GUID
      let revCurrContainerGUID = revCurrUpdateEntity._revContainerGUID;
      if (revCurrContainerGUID && revCurrContainerGUID > 0) {
        let revCurrRemoteContainerGUID =
          RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
            revCurrContainerGUID,
          );

        if (revCurrRemoteContainerGUID < 1) {
          continue;
        }

        revCurrUpdateEntity['_revContainerGUID'] = revCurrRemoteContainerGUID;
      }

      // Finaly set the Site's REMOTE GUID
      revCurrUpdateEntity['_revSiteGUID'] = revSiteRemoteEntityGUID;

      revUploadEntitiesArr.push(revCurrUpdateEntity);
    }

    /**
     * {"result":{"revPersOptions":{"revPersType":"rev_create"},"filter":[{"_revRemoteGUID":534,"_revMetadataList":[{"_revId":794,"_revRemoteId":794}]}]}}
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

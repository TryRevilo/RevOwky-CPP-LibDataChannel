import {DeviceEventEmitter, NativeModules} from 'react-native';
import {useContext} from 'react';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevPersLibDelete_React,
} = NativeModules;

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
import {
  revIsEmptyVar,
  revPingServer,
} from '../../../rev_function_libs/rev_gen_helper_functions';

import {REV_CREATE_NEW_REL_URL} from './rev_pers_urls';
import {revStringEmpty} from '../../../rev_function_libs/rev_string_function_libs';

const revSettings = require('../../../rev_res/rev_settings.json');

export function useRevPersSyncDataComponent() {
  const {
    REV_LOGGED_IN_ENTITY_GUID,
    SET_REV_LOGGED_IN_ENTITY_GUID,
    SET_REV_SITE_ENTITY_GUID,
    REV_LOGGED_IN_ENTITY,
    SET_REV_LOGGED_IN_ENTITY,
    REV_SITE_ENTITY_GUID,
  } = useContext(RevSiteDataContext);
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();
  const {revPersQuery_By_RevVarArgs} = useRevPersQuery_By_RevVarArgs();

  let revSaveNewEntityURL = REV_ROOT_URL + REV_CREATE_NEW_REV_ENTITY_URL;

  const revGetUploadFilesArr = () => {
    let revFilesStr = RevPersLibRead_React.revPersGetMetadata_BY_ResStatus_Name(
      202,
      'rev_remote_file_name',
    );

    if (revStringEmpty(revFilesStr)) {
      return [];
    }

    try {
      return JSON.parse(revFilesStr);
    } catch (error) {
      console.log('>>> Rrror - revGetUploadFilesArr', error);
      return [];
    }
  };

  DeviceEventEmitter.addListener(
    'rev_curl_file_upload_ret_data_event',
    event => {
      let revRetDataStr = event.eventProperty;

      if (revIsEmptyVar(revRetDataStr)) {
        return;
      }

      try {
        let revRetData = JSON.parse(revRetDataStr);

        if (revIsEmptyJSONObject(revRetData)) {
          return;
        }

        const {revFilterSuccess = [], revFilterFail = []} = revRetData;

        for (let i = 0; i < revFilterSuccess.length; i++) {
          let revCurrFile = revFilterSuccess[i];
          let revMetadataStr =
            RevPersLibRead_React.revPersGetMetadata_By_Name_Value(
              'rev_remote_file_name',
              revCurrFile,
            );

          const {_revId = -1} = JSON.parse(revMetadataStr);

          if (_revId > 0) {
            RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
              2,
              _revId,
            );
          }
        }

        for (let i = 0; i < revFilterFail.length; i++) {
          let revCurrFile = revFilterFail[i];

          let revMetadataStr =
            RevPersLibRead_React.revPersGetMetadata_By_Name_Value(
              'rev_remote_file_name',
              revCurrFile,
            );
          let revMetadata = JSON.parse(revMetadataStr);
          let _revId = revMetadata._revId;

          if (_revId > 0) {
            RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
              -3,
              _revId,
            );
          }
        }

        revCURLFileUploadSync();
      } catch (error) {
        console.log('>>> Error -rev_curl_file_upload_ret_data_event', error);
      }
    },
  );

  const revCURLFileUploadSync = () => {
    let revFilesArr = revGetUploadFilesArr();

    if (!revFilesArr.length) {
      return;
    }

    let revUploadFilesArr = [];

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

      RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
        202,
        revCurrFile._revId,
      );

      revUploadFilesArr.push(revFileURI);
    }

    RevPersLibCreate_React.revCURLFileUpload(
      revSettings.revSiteUploadDirPath,
      JSON.stringify({rev_files: revUploadFilesArr}),
      'char *revData',
    );
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

      const {
        _revGUID = -1,
        _revId = -1,
        _revSubjectGUID = -1,
        _revRemoteSubjectGUID = -1,
        _revTargetGUID = -1,
        _revRemoteTargetGUID = -1,
      } = revCurrRel;

      RevPersLibUpdate_React.revPersUpdateRelResStatus_By_RelId(_revId, -101);

      let remoteRevEntitySubjectGUID = _revRemoteSubjectGUID;

      if (remoteRevEntitySubjectGUID < 1) {
        remoteRevEntitySubjectGUID =
          RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
            _revSubjectGUID,
          );

        let revPersUpdateRemoteSubjectGUIDStatus =
          RevPersLibUpdate_React.revPersSetRemoteSubjectGUID(
            _revSubjectGUID,
            remoteRevEntitySubjectGUID,
          );

        if (revPersUpdateRemoteSubjectGUIDStatus < 1) {
          continue;
        }
      }

      if (remoteRevEntitySubjectGUID < 1) {
        continue;
      }

      let remoteRevEntityTargetGUID = _revRemoteTargetGUID;

      if (remoteRevEntityTargetGUID < 1) {
        remoteRevEntityTargetGUID =
          RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
            _revTargetGUID,
          );

        let revPersUpdateRemoteTargetGUIDStatus =
          RevPersLibUpdate_React.revPersSetRemoteTargetGUID(
            _revTargetGUID,
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

      revPostServerData(
        revURL,
        {filter: revPersRelsArr},
        async revRetPersData => {
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

          await revSyncRels();
        },
      );
    }
  };

  const revFetchUnresolvedEntityData = async (
    revURL,
    revUnresolvedEntitiesArr,
  ) => {
    if (!revUnresolvedEntitiesArr.length) {
      return null;
    }

    for (let i = 0; i < revUnresolvedEntitiesArr.length; i++) {
      const {_revMetadataList = [], _revInfoEntity = {}} =
        revUnresolvedEntitiesArr[i];

      revUnresolvedEntitiesArr[i]['_revMetadataList'] =
        revResolveRemoteMetadataEntityGUID(_revMetadataList);

      const {_revMetadataList: revInfo_revMetadataList = []} = _revInfoEntity;

      if (revInfo_revMetadataList.length) {
        revUnresolvedEntitiesArr[i]._revInfoEntity['_revMetadataList'] =
          revResolveRemoteMetadataEntityGUID(revInfo_revMetadataList);
      }
    }

    const {revSetRemoteRelGUID} = useRevSetRemoteRelGUID();

    return new Promise((resolve, reject) => {
      revPostServerData(
        revURL,
        {filter: revUnresolvedEntitiesArr},
        revResult => {
          if (
            revIsEmptyJSONObject(revResult) ||
            revResult.hasOwnProperty('error')
          ) {
            return resolve([]);
          }

          if (revIsEmptyJSONObject(revResult)) {
            return resolve([]);
          }

          const {filter = []} = revResult;

          for (let i = 0; i < filter.length; i++) {
            let revCurrData = filter[i];

            if (revIsEmptyJSONObject(revCurrData)) {
              continue;
            }

            const {
              _revGUID = -1,
              _revRemoteGUID = -1,
              _revMetadataList = [],
              _revInfoEntity = {},
            } = revCurrData;

            if (_revGUID < 0 || _revRemoteGUID < 0) {
              continue;
            }

            RevPersLibUpdate_React.revPersSetRemoteEntityGUID_By_LocalEntityGUID(
              _revGUID,
              _revRemoteGUID,
            );

            RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
              0,
              _revGUID,
            );

            /** START RELATIONSHIPS */
            RevPersLibUpdate_React.revPersSetRemoteSubjectGUID(
              _revGUID,
              _revRemoteGUID,
            );

            RevPersLibUpdate_React.revPersSetRemoteTargetGUID(
              _revGUID,
              _revRemoteGUID,
            );
            /** END RELATIONSHIPS */

            useRevSetMetadataArrayRemoteID(_revGUID, _revMetadataList);

            /** START SAVE INFO */
            if (!revIsEmptyJSONObject(_revInfoEntity)) {
              const {
                _revGUID: revInfoGUID = -1,
                _revRemoteGUID: revInfoGUID_R = -1,
                _revMetadataList: revInfoEntityMetadataList = [],
              } = _revInfoEntity;

              if (revInfoGUID < 0 || revInfoGUID_R < 0) {
                continue;
              }

              useRevSetMetadataArrayRemoteID(
                revInfoGUID,
                revInfoEntityMetadataList,
              );

              let revInfoRemoteGUIDUpdateStatus =
                RevPersLibUpdate_React.revPersSetRemoteEntityGUID_By_LocalEntityGUID(
                  revInfoGUID,
                  revInfoGUID_R,
                );

              if (revInfoRemoteGUIDUpdateStatus < 0) {
                continue;
              }

              RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
                0,
                revInfoGUID,
              );

              /** START INFO RELATIONSHIPS */
              revSetRemoteRelGUID(revInfoGUID, revInfoGUID_R);
              /** END INFO RELATIONSHIPS */
            }
            /** END SAVE INFO */
          }

          resolve(filter);
        },
      );
    });
  };

  const revPersSyncMetadata = async () => {
    let revPassVarArgs = {
      revTableName: 'REV_ENTITY_METADATA_TABLE',
      revSelect: [
        '_revResolveStatus',
        '_revId',
        '_revGUID',
        '_revRemoteId',
        '_revTimeCreated',
        '_revName',
        '_revValue',
      ],
      revWhere: {
        _revRemoteId: {'<': 0},
        // _revResolveStatus: [0],
      },
      revLimit: 22,
    };

    let revMetadataArr = revPersQuery_By_RevVarArgs(
      revPassVarArgs,
      'REV_ENTITY_METADATA_TABLE',
    );

    let revPersMetadataArr = [];

    for (let i = 0; i < revMetadataArr.length; i++) {
      let revCurrMetadata = revMetadataArr[i];

      const {
        _revId = -1,
        _revGUID = -1,
        _revResolveStatus = -1,
      } = revCurrMetadata;

      if (_revResolveStatus == -101) {
        RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
          -1,
          _revId,
        );
      }

      if (_revResolveStatus == -103) {
        let revInfoGUID = revCurrMetadata._revGUID;

        RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
          404,
          revInfoGUID,
        );

        RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
          404,
          _revId,
        );

        RevPersLibUpdate_React.revPersSetRemoteMetadataId(_revId, 0);

        continue;
      }

      let _revRemoteGUID =
        RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
          _revGUID,
        );

      if (_revId > 0 && _revRemoteGUID > 0) {
        RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
          -101,
          _revId,
        );
      } else {
        RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
          -103,
          _revId,
        );

        continue;
      }

      revCurrMetadata['_revGUID'] = _revRemoteGUID;

      revPersMetadataArr.push(revCurrMetadata);
    }

    let revPersMetadataURL = `${revSettings.revAPIRoot}/save_rev_entity_metadata`;

    let revPersMetadataPromise = new Promise((resolve, reject) => {
      revPostServerData(
        revPersMetadataURL,
        {filter: revPersMetadataArr},
        revResult => {
          resolve(revResult);
        },
      );
    });

    try {
      const {filter: revPersMetadataResultArr = []} =
        await revPersMetadataPromise;

      for (let i = 0; i < revPersMetadataResultArr.length; i++) {
        const {_revId = -1, _revRemoteId = -1} = revPersMetadataResultArr[i];

        if (_revRemoteId < 1) {
          RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
            -103,
            _revId,
          );

          continue;
        }

        let revUpdateRes = RevPersLibUpdate_React.revPersSetRemoteMetadataId(
          _revId,
          _revRemoteId,
        );

        if (revUpdateRes == 1) {
          let revFin =
            RevPersLibUpdate_React.revPersSetMetadataResStatus_BY_Metadata_Id(
              0,
              _revId,
            );

          console.log('>>> revFin', revFin);
        }
      }
    } catch (error) {
      console.log('>>> Error - revPersSyncMetadata', error);
    }

    if (revMetadataArr.length) {
      await revPersSyncMetadata();
    }
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

    SET_REV_SITE_ENTITY_GUID(revSiteEntity._revGUID);

    return revRemoteSiteEntityGUID;
  };

  const revResolveRemoteMetadataEntityGUID = _revMetadataList => {
    let revPersMetadataArr = [];

    for (let i = 0; i < _revMetadataList.length; i++) {
      const {_revId, _revGUID = -1} = _revMetadataList[i];

      if (_revGUID < 1) {
        RevPersLibDelete_React.revDeleteEntityMetadata_By_ID(_revId);
        continue;
      }

      let revMetadataRemoteEntityGUID =
        RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
          _revGUID,
        );

      if (revMetadataRemoteEntityGUID < 1) {
        continue;
      }

      _revMetadataList[i]['_revGUID'] = revMetadataRemoteEntityGUID;

      revPersMetadataArr.push(_revMetadataList[i]);
    }

    return revPersMetadataArr;
  };

  const revSaveLoggedInUserEntity = async () => {
    let revRetPersData = await revFetchUnresolvedEntityData(
      revSaveNewEntityURL,
      [REV_LOGGED_IN_ENTITY],
    );

    const {_revRemoteGUID = -1} = revRetPersData;

    SET_REV_LOGGED_IN_ENTITY(revPrev => {
      return {...revPrev, _revRemoteGUID};
    });

    return _revRemoteGUID;
  };

  let revResStatus = -1;

  const revPingServerCallBack = async revRetData => {
    let revServerStatus = revRetData.revServerStatus;

    if (revServerStatus !== 200 || REV_SITE_ENTITY_GUID < 1) {
      return;
    }

    let revUnresolvedEntitiesArr =
      revPersGetEntityGUIDs_By_ResStatus(revResStatus);

    let revLoggedInRemoteGUID = REV_LOGGED_IN_ENTITY._revRemoteGUID;

    if (revLoggedInRemoteGUID < 1) {
      revLoggedInRemoteGUID = await revSaveLoggedInUserEntity();
    }

    if (revLoggedInRemoteGUID < 1) {
      return SET_REV_LOGGED_IN_ENTITY_GUID(-1);
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
      return SET_REV_LOGGED_IN_ENTITY_GUID(-1);
    }

    let revUploadEntitiesArr = [];

    for (let i = 0; i < revUnresolvedEntitiesArr.length; i++) {
      if (revUploadEntitiesArr.length >= 22) {
        break;
      }

      let revCurrUpdateEntity = revUnresolvedEntitiesArr[i];

      if (revIsEmptyJSONObject(revCurrUpdateEntity)) {
        continue;
      }

      const {
        _revType: revCurrUpdateEntityType = '',
        _revSubType = '',
        _revOwnerGUID: revEntityOwnerGUID = -1,
      } = revCurrUpdateEntity;

      let revIsUser = revCurrUpdateEntityType === 'rev_user_entity';

      console.log('>>>', revEntityOwnerGUID, 'revIsUser', revIsUser);

      // Make sure that all entities have an owner except if user
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
      if (_revSubType == 'rev_entity_info' && revEntityOwnerGUID < 1) {
        continue;
      }

      RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
        -101,
        revCurrUpdateEntity._revGUID,
      );

      // Set an entity's info details
      const {_revInfoEntity = {}} = revCurrUpdateEntity;

      if (!revIsEmptyJSONObject(_revInfoEntity)) {
        const {_revGUID: _revInfoEntity_revGUID = -1} = _revInfoEntity;

        RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
          -101,
          _revInfoEntity_revGUID,
        );

        _revInfoEntity['_revSiteGUID'] = revSiteRemoteEntityGUID;
      }

      // If has container GUID set remote container GUID
      const {_revContainerGUID: revCurrContainerGUID = -1} =
        revCurrUpdateEntity;

      if (revCurrContainerGUID > 0) {
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
      await revPingServerCallBack(revRetData);
    }

    await revPersSyncMetadata();
    await revSyncRels();
    revCURLFileUploadSync();
  };

  const revPersSyncDataComponent = async () => {
    let revResStatusArr = [-1, -101];

    for (let i = 0; i < revResStatusArr.length; i++) {
      revResStatus = revResStatusArr[i];

      let revPingVarArgs = {
        revInterval: 1000,
        revIP: REV_ROOT_URL,
      };

      let revPingRes = await revPingServer(revPingVarArgs);
      await revPingServerCallBack(revPingRes);
    }

    return 'Success !';
  };

  return {revPersSyncDataComponent};
}

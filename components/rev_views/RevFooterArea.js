import React, {useContext, useState, useEffect, useCallback} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../rev_contexts/RevRemoteSocketContext';
import {ReViewsContext} from '../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../rev_plugins_loader';
import {revGetServerData_JSON} from '../rev_libs_pers/rev_server/rev_pers_lib_read';
import {
  revPersGetALLRevEntity_By_SubType_RevVarArgs,
  revPersGetFilledRevEntity_By_GUID,
  useRevPersGetRevEntities_By_EntityGUIDsArr,
} from '../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevVideoCallModal from '../rev_video_call/RevVideoCallModal';

import ChatMessageInputComposer from '../rev_plugins/rev_plugin_text_chat/rev_views/rev_forms/ChatMessageInputComposer';

import {useRev_Server_DeleteEntities_By_entityGUIDsArr} from '../rev_libs_pers/rev_server/rev_pers_lib_delete';

const {RevPersLibRead_React} = NativeModules;

const handleEndVideoCall = () => {
  // RevWebRTCReactModule.revSetTestStr('my_key', 'My Value');
};

function RevFooterArea() {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const {SET_REV_SITE_BODY, REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const [revChatStatus, setRevChatStatus] = useState(false);

  const {rev_Server_DeleteEntities_By_entityGUIDsArr} =
    useRev_Server_DeleteEntities_By_entityGUIDsArr();

  const revGetLocalData = () => {
    let revPassVarArgs = {
      revSelect: [
        '_revEntityGUID',
        '_revOwnerEntityGUID',
        '_revContainerEntityGUID',
        '_revEntitySiteGUID',
        '_revEntityAccessPermission',
        '_revEntityType',
        '_revEntitySubType',
        '_revTimeCreated',
      ],
      revWhere: {
        _revEntityType: 'rev_object',
        _revEntitySubType: 'rev_kiwi',
        _revEntityResolveStatus: [0, -1, -101],
      },
      revLimit: 20,
    };
    let revEntitiesArr = revPersGetALLRevEntity_By_SubType_RevVarArgs(
      JSON.stringify(revPassVarArgs),
    );

    for (let i = 0; i < revEntitiesArr.length; i++) {
      let revCurrEntity = revEntitiesArr[i];
      let revEntityGUID = revCurrEntity._revEntityGUID;

      let revPicAlbumGUID =
        RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
          'rev_pics_album_of',
          revEntityGUID,
        );

      if (revPicAlbumGUID < 1) {
        continue;
      }

      let revPicAlbumEntity =
        revPersGetFilledRevEntity_By_GUID(revPicAlbumGUID);

      let revPicAlbumEntityGUID = revPicAlbumEntity._revEntityGUID;

      let revPicAlbumPicsGUIDsArr =
        RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
          'rev_picture_of',
          revPicAlbumEntityGUID,
        );

      let revPicsEntitiesArr = useRevPersGetRevEntities_By_EntityGUIDsArr(
        JSON.parse(revPicAlbumPicsGUIDsArr),
      );

      revPicAlbumEntity._revEntityChildrenList = revPicsEntitiesArr;

      revEntitiesArr[i]._revEntityChildrenList.push(revPicAlbumEntity);
    }

    return revEntitiesArr;
  };

  let revHandleTaggedPostsTabPress = () => {
    /**** */
    let revURL =
      REV_ROOT_URL +
      '/rev_api?' +
      'rev_logged_in_entity_guid=' +
      REV_LOGGED_IN_ENTITY_GUID +
      '&rev_entity_guid=' +
      -1 +
      '&revPluginHookContextsRemoteArr=revHookRemoteHandlerReadOwkyTimelineEntities';

    revGetServerData_JSON(revURL, revRetData => {
      if (revRetData.hasOwnProperty('revError')) {
        revRetData = revGetLocalData();
        revRetData = {
          revTimelineEntities: revRetData,
          revEntityPublishersArr: [],
        };
      }

      let RevTaggedPostsListing = revPluginsLoader({
        revPluginName: 'rev_plugin_tagged_posts',
        revViewName: 'RevTaggedPostsListing',
        revVarArgs: revRetData,
      });

      SET_REV_SITE_BODY(RevTaggedPostsListing);
    });
  };

  const revHandleGetSiteUsersTabPress = async () => {
    // let revURL =
    //   REV_ROOT_URL +
    //   REV_GET_REV_ENTITIES_BY_SUBTYPE_URL +
    //   '?rev_entity_subtype=rev_user_entity';

    // let revData = await revGetServerData_JSON_Async(revURL);

    // console.log('>>> revData ' + revData.filter.length);

    // let revUpdateMetadataArrStr =
    //   RevPersLibRead_React.revPersGetALLRevEntityMetadata_BY_ResStatus_MetadataName(
    //     101,
    //     'revPostText',
    //   );

    // let revUpdateMetadataArr = JSON.parse(revUpdateMetadataArrStr);

    // let revPostUpdateMetadataArr = [];

    // for (let i = 0; i < revUpdateMetadataArr.length; i++) {
    //   let revCurrMetadata = revUpdateMetadataArr[i];
    //   revPostUpdateMetadataArr.push({
    //     remoteRevMetadataId: revCurrMetadata.remoteRevMetadataId,
    //     _metadataValue: revCurrMetadata._metadataValue,
    //   });
    // }

    // let revServData = {
    //   filter: revPostUpdateMetadataArr,
    // };

    // rev_Server_UpdateMetadata(revServData, revMetadataUpdateRetData => {
    //   console.log(
    //     '>>> revMetadataUpdateRetData ' +
    //       JSON.stringify(revMetadataUpdateRetData),
    //   );
    // });

    // revPersSyncDataComponent(-1, revSynchedGUIDsArr => {
    //   console.log(
    //     '>>> revSynchedGUIDsArr ' + JSON.stringify(revSynchedGUIDsArr),
    //   );
    // });

    /**** */
    let revURL =
      REV_ROOT_URL +
      '/rev_api?' +
      'rev_logged_in_entity_guid=' +
      REV_LOGGED_IN_ENTITY_GUID +
      '&rev_entity_guid=' +
      -1 +
      '&revPluginHookContextsRemoteArr=revHookRemoteHandlerReadOwkyUserMembersEntities';

    revGetServerData_JSON(revURL, revRetData => {
      let RevMembersEntitiesListing = revPluginsLoader({
        revPluginName: 'rev_plugin_members',
        revViewName: 'RevMembersEntitiesListing',
        revVarArgs: revRetData,
      });

      SET_REV_SITE_BODY(RevMembersEntitiesListing);
    });
  };

  const handleDocumentSelection = useCallback(async () => {
    // try {
    //   const response = await DocumentPicker.pick({
    //     presentationStyle: 'fullScreen',
    //     allowMultiSelection: true,
    //   });

    //   for (let i = 0; i < response.length; i++) {
    //     new RevSendFile(peerConnections[2].dataChannel).transferFile(
    //       response[i],
    //     );
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }

    let revDeleEntityGUIDsStr =
      RevPersLibRead_React.revPersGetALLRevEntityGUIDs_By_ResStatus(-3);

    let revDeleEntityGUIDsArr = JSON.parse(revDeleEntityGUIDsStr);

    let revPostDelEntityGUIDsArr = [];

    for (let i = 0; i < revDeleEntityGUIDsArr.length; i++) {
      if (i > 2) {
        break;
      }

      let revCurrEntityGUID = revDeleEntityGUIDsArr[i];
      let revCurrEntityStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revCurrEntityGUID);

      let revCurRemoteEntityGUID =
        JSON.parse(revCurrEntityStr)._remoteRevEntityGUID;

      if (revCurRemoteEntityGUID && revCurRemoteEntityGUID >= 0)
        revPostDelEntityGUIDsArr.push(revCurRemoteEntityGUID);
    }

    console.log(
      '>>> revPostDelEntityGUIDsArr ' +
        JSON.stringify(revPostDelEntityGUIDsArr),
    );

    let revServData = {
      filter: revPostDelEntityGUIDsArr,
    };

    rev_Server_DeleteEntities_By_entityGUIDsArr(
      revServData,
      revDelEnitityGUIDsRetData => {
        console.log(
          '>>> revDelEnitityGUIDsRetData ' +
            JSON.stringify(revDelEnitityGUIDsRetData),
        );
      },
    );
  }, []);

  let revChatMessageTxt = '';

  let revSetChatMessageTxt = revText => {
    revChatMessageTxt = revText;
  };

  let RevFooter1 = revPluginsLoader({
    revPluginName: 'rev_plugin_text_chat',
    revViewName: 'RevFooter1Left',
    revData: {},
  });

  let RevFooter2 = revPluginsLoader({
    revPluginName: 'rev_plugin_text_chat',
    revViewName: 'RevFooter2',
    revData: {},
  });

  let RevFooter3 = revPluginsLoader({
    revPluginName: 'rev_plugin_text_chat',
    revViewName: 'RevFooter3',
    revData: {},
  });

  return (
    <View>
      <View style={styles.chatAreaContainer}>
        <View style={styles.chatChannelsOptionsWrapper}>
          <View style={styles.currentChatOptionsWrapper}>
            <RevVideoCallModal />

            <TouchableOpacity onPress={() => handleEndVideoCall()}>
              <View style={styles.currentChatOptionTab}>
                <FontAwesome
                  name="phone"
                  style={styles.currentChatOptionTabIcon}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.currentChatOptionTab}>
              <FontAwesome
                name="user-plus"
                style={styles.currentChatOptionTabIcon}
              />
            </View>
          </View>
          <View style={styles.channelsContainer}>
            <View style={styles.channelsOptionsWrapper}>
              <TouchableOpacity
                onPress={() => {
                  revHandleTaggedPostsTabPress();
                }}>
                <FontAwesome name="hashtag" style={styles.channelOptionItem} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  revHandleGetSiteUsersTabPress();
                }}>
                <FontAwesome name="flash" style={styles.channelOptionItem} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleDocumentSelection();
                }}>
                <FontAwesome
                  name="folder"
                  style={[
                    styles.revSiteTxtColorLight,
                    styles.revSiteTxtSmall,
                    styles.channelOptionItem,
                  ]}></FontAwesome>
              </TouchableOpacity>

              <FontAwesome
                name="object-ungroup"
                style={styles.channelOptionItem}
              />
              <FontAwesome name="asterisk" style={styles.channelOptionItem} />
              <Text style={styles.channelOptionItem}>ads</Text>
            </View>
          </View>
        </View>
        {RevFooter3}
        {RevFooter2}
        {REV_SITE_FOOTER_1_CONTENT_VIEWER}
        <View style={styles.footerContainer}>{RevFooter1}</View>
      </View>

      {revChatStatus ? (
        <ChatMessageInputComposer
          revSetText={revInputText => {
            revSetChatMessageTxt(revInputText);
          }}
        />
      ) : null}
    </View>
  );
}

export default RevFooterArea;

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteFontBold: {
    fontWeight: '500',
  },
  revSiteTxtTiny: {
    fontSize: 9,
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  chatAreaContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
    borderStyle: 'dotted',
    paddingHorizontal: 5,
    marginHorizontal: -12,
  },
  chatChannelsOptionsWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentChatOptionsWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 8,
  },
  currentChatOptionTab: {
    backgroundColor: '#ffebee',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 50,
    opacity: 0.5,
  },
  currentChatOptionTabIcon: {
    color: '#ec407a',
    textAlign: 'center',
    fontSize: 11,
  },
  channelsContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: 'auto',
    marginRight: 12,
  },
  channelsOptionsWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'auto',
  },
  channelOptionItem: {
    color: '#999',
    fontSize: 11,
    lineHeight: 11,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 5,
    marginRight: 8,
  },
  footerContainer: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'column',
    marginTop: 8,
    marginBottom: 12,
  },
});

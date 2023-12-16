import React, {useContext, useState, useCallback} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../rev_contexts/RevRemoteSocketContext';
import {ReViewsContext} from '../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../rev_plugins_loader';
import {revGetServerData_JSON} from '../rev_libs_pers/rev_server/rev_pers_lib_read';
import {
  useRevPersQuery_By_RevVarArgs,
  revPersGetFilledRevEntity_By_GUID,
  revPersGetRevEntities_By_EntityGUIDsArr,
} from '../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevVideoCallModal from '../rev_plugins/rev_plugin_video_call/rev_views/rev_object_views/rev_widget_views/RevVideoCallModal';

import ChatMessageInputComposer from '../rev_plugins/rev_plugin_text_chat/rev_views/rev_forms/ChatMessageInputComposer';

import {RevSendFile} from '../../rev_webrtc_libs/RevSendFile';

const {RevPersLibRead_React} = NativeModules;

import {useRevSiteStyles} from './RevSiteStyles';

function RevFooterArea() {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY_GUID, REV_LOGGED_IN_ENTITY} =
    useContext(RevSiteDataContext);

  const {SET_REV_SITE_BODY, REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const [revChatStatus] = useState(false);

  const {revPersQuery_W_Info_By_RevVarArgs_Async} =
    useRevPersQuery_By_RevVarArgs();

  const revGetLocalData_Async = async (revLastGUID, revLimit = 10) => {
    let revWhere = {
      _revType: 'rev_object',
      _revSubType: 'rev_kiwi',
      _revResolveStatus: [0, -1, -101],
    };

    if (revLastGUID > 0) {
      revWhere['_revGUID'] = {'<': revLastGUID};
    }

    let revPassVarArgs = {
      revTableName: 'REV_ENTITY_TABLE',
      revSelect: [
        '_revGUID',
        '_revOwnerGUID',
        '_revContainerGUID',
        '_revSiteGUID',
        '_revAccessPermission',
        '_revType',
        '_revSubType',
        '_revTimeCreated',
      ],
      revWhere: revWhere,
      revLimit,
      revOrderBy: {
        revOrderByTableColumn: '_revGUID',
        revOrderByDirection: 'DESC',
      },
    };

    let revEntitiesArr = await revPersQuery_W_Info_By_RevVarArgs_Async(
      revPassVarArgs,
      'REV_ENTITY_TABLE',
    );

    for (let i = 0; i < revEntitiesArr.length; i++) {
      let revCurrEntity = revEntitiesArr[i];
      let revEntityGUID = revCurrEntity._revGUID;

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

      let revPicAlbumEntityGUID = revPicAlbumEntity._revGUID;

      let revPicAlbumPicsGUIDsArr =
        RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
          'rev_picture_of',
          revPicAlbumEntityGUID,
        );

      let revPicsEntitiesArr = revPersGetRevEntities_By_EntityGUIDsArr(
        JSON.parse(revPicAlbumPicsGUIDsArr),
      );

      revPicAlbumEntity._revChildrenList = revPicsEntitiesArr;

      revEntitiesArr[i]._revChildrenList.push(revPicAlbumEntity);
    }

    return revEntitiesArr;
  };

  const handleEndVideoCall = () => {
    let revTargetEntityGUID =
      REV_LOGGED_IN_ENTITY._revRemoteGUID == 407 ? 375 : 407;

    let revDataUserEntityStr =
      RevPersLibRead_React.revPersGetRevEntity_By_revRemoteGUID(
        revTargetEntityGUID,
      );

    let revDataUserEntity = JSON.parse(revDataUserEntityStr);
    delete revDataUserEntity['_revInfoEntity'];

    console.log('>>> revDataUserEntity ' + JSON.stringify(revDataUserEntity));

    let revData = {
      revTargetEntityGUID: revTargetEntityGUID,
      revMsg: 'My AWESOME MESSAGE ! ! !',
    };
  };

  const revLoadLocalDataView = () => {
    revGetLocalData_Async(0, 5)
      .then(revRetData => {
        revRetData = {
          revTimelineEntities: revRetData,
          revEntityPublishersArr: [],
          revGetData: revGetLocalData_Async,
        };

        let revTaggedPostsListing = revPluginsLoader({
          revPluginName: 'rev_plugin_tagged_posts',
          revViewName: 'RevTaggedPostsListing',
          revVarArgs: revRetData,
        });

        SET_REV_SITE_BODY(revTaggedPostsListing);
      })
      .catch(err => {
        console.log('>>> revLoadLocalDataView', err.message);
      });
  };

  let revHandleTaggedPostsTabPress = async () => {
    /**** */
    let revURL =
      REV_ROOT_URL +
      '/rev_api?' +
      'rev_logged_in_entity_guid=' +
      REV_LOGGED_IN_ENTITY_GUID +
      '&rev_entity_guid=' +
      -1 +
      '&revPluginHookContextsRemoteArr=revHookRemoteHandlerReadOwkyTimelineEntities';

    try {
      let revRetData = await revGetServerData_JSON(revURL);
      revRetData['revGetData'] = async revLastGUID => {
        return null;
      };

      if (revRetData.hasOwnProperty('revError')) {
        revLoadLocalDataView();
      } else {
        let revTaggedPostsListing = revPluginsLoader({
          revPluginName: 'rev_plugin_tagged_posts',
          revViewName: 'RevTaggedPostsListing',
          revVarArgs: revRetData,
        });

        SET_REV_SITE_BODY(revTaggedPostsListing);
      }
    } catch (error) {
      console.log('>>> Error - revHandleTaggedPostsTabPress', error);
    }
  };

  const revHandleGetSiteUsersTabPress = async () => {
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
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });

      for (let i = 0; i < response.length; i++) {
        new RevSendFile(peerConnections[2].dataChannel).transferFile(
          response[i],
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  let revChatMessageTxt = '';

  let revSetChatMessageTxt = revText => {
    revChatMessageTxt = revText;
  };

  let RevFooter1 = revPluginsLoader({
    revPluginName: 'rev_plugin_text_chat',
    revViewName: 'RevFooter1',
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

  const handleRevShowUserAdsTabPress = () => {
    let revPurchaseReceipt = revPluginsLoader({
      revPluginName: 'rev_plugin_check_out',
      revViewName: 'RevPurchaseReceipt',
      revVarArgs: {},
    });

    SET_REV_SITE_BODY(revPurchaseReceipt);
  };

  let revRightTabs = (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        styles.revChannelsOptionsWrapper,
      ]}>
      <TouchableOpacity
        onPress={() => {
          revHandleTaggedPostsTabPress();
        }}>
        <FontAwesome
          name="hashtag"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revChannelOptionItem,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          revHandleGetSiteUsersTabPress();
        }}>
        <FontAwesome
          name="flash"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revChannelOptionItem,
          ]}
        />
      </TouchableOpacity>

      <MaterialIcons
        name="stream"
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtNormal,
          styles.revChannelOptionItem,
        ]}
      />

      <MaterialCommunityIcons
        name="select-group"
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtLarge,
          styles.revChannelOptionItem,
        ]}
      />

      <TouchableOpacity
        onPress={() => {
          handleDocumentSelection();
        }}>
        <FontAwesome
          name="folder"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revChannelOptionItem,
          ]}></FontAwesome>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRevShowUserAdsTabPress}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revChannelOptionItem,
          ]}>
          ads
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View
        style={[revSiteStyles.revFlexContainer, styles.revChatAreaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revChatrevChannelsOptionsWrapper,
          ]}>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revCurrentChatOptionsWrapper,
            ]}>
            <RevVideoCallModal />

            <TouchableOpacity onPress={() => handleEndVideoCall()}>
              <View
                style={[
                  revSiteStyles.revFlexWrapper_WidthAuto,
                  styles.revCurrentChatOptionTab,
                ]}>
                <FontAwesome
                  name="phone"
                  style={[
                    revSiteStyles.revSiteTxtAlertDangerColor_Light,
                    revSiteStyles.revSiteTxtNormal,
                    styles.revCurrentChatOptionTabIcon,
                  ]}
                />
              </View>
            </TouchableOpacity>

            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                styles.revCurrentChatOptionTab,
              ]}>
              <FontAwesome
                name="user-plus"
                style={[
                  revSiteStyles.revSiteTxtAlertDangerColor_Light,
                  revSiteStyles.revSiteTxtNormal,
                  styles.revCurrentChatOptionTabIcon,
                ]}
              />
            </View>
          </View>
          {revRightTabs}
        </View>
        {RevFooter3}
        {RevFooter2}
        {REV_SITE_FOOTER_1_CONTENT_VIEWER}

        {RevFooter1}
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
  revChatAreaContainer: {
    backgroundColor: '#F7F7F7',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderStyle: 'solid',
    paddingTop: 5,
    paddingHorizontal: 5,
    marginHorizontal: -12,
  },
  revChatrevChannelsOptionsWrapper: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
    paddingBottom: 5,
  },
  revCurrentChatOptionsWrapper: {
    marginLeft: 8,
  },
  revCurrentChatOptionTab: {
    backgroundColor: '#ffebee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 50,
    opacity: 0.5,
  },
  revCurrentChatOptionTabIcon: {
    textAlign: 'center',
  },
  revChannelsOptionsWrapper: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
    marginRight: 12,
  },
  revChannelOptionItem: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 5,
    marginRight: 8,
  },
});

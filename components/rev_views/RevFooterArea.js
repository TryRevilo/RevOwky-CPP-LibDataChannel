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
import {ReViewsContext} from '../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../rev_plugins_loader';
import {revRequestPermissions} from '../../rev_function_libs/rev_req_perms';

import RevVideoCallModal from '../rev_video_call/RevVideoCallModal';

import ChatMessageInputComposer from '../rev_plugins/rev_text_chat/rev_views/rev_forms/ChatMessageInputComposer';

const {
  RevPersLibCreate_React,
  RevWebRTCReactModule,
  RevPersLibRead_React,
  RevGenLibs_Server_React,
} = NativeModules;

const handleEndVideoCall = () => {
  // RevWebRTCReactModule.revSetTestStr('my_key', 'My Value');
};

function RevFooterArea() {
  const {REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);

  const {REV_SITE_BODY, SET_REV_SITE_BODY, REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const [revChatStatus, setRevChatStatus] = useState(false);

  let revHandleTaggedPostsTabPress = () => {
    let RevTaggedPostsListing = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'RevTaggedPostsListing',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevTaggedPostsListing);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
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
    revPluginName: 'rev_text_chat',
    revViewName: 'RevFooter1Left',
    revData: 'Hello World!',
  });

  let RevFooter2 = revPluginsLoader({
    revPluginName: 'rev_text_chat',
    revViewName: 'RevFooter2',
    revData: 'Hello World!',
  });

  let RevFooter3 = revPluginsLoader({
    revPluginName: 'rev_text_chat',
    revViewName: 'RevFooter3',
    revData: 'Hello World!',
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
                  revHandleTaggedPostsTabPress();
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

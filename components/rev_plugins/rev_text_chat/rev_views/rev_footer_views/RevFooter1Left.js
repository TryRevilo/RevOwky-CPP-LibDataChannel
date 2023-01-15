import React, {useContext, useState, useEffect} from 'react';

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../../../../rev_plugins_loader';

import RevSubmitChatTab from '../rev_forms/RevSubmitChatTab';
import RevNextStrangerChatTab from '../../rev_tabs/RevNextStrangerChatTab';
import ChatMessageInputComposer from '../rev_forms/ChatMessageInputComposer';

export function RevFooter1Left() {
  const {REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);

  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  [isRevFooter1LeftStrangerChat, setIsRevFooter1LeftStrangerChat] =
    useState(true);

  useEffect(() => {
    if (REV_SITE_VAR_ARGS.revRemoteEntityGUID < 1) {
      setIsRevFooter1LeftStrangerChat(false);
    } else {
      setIsRevFooter1LeftStrangerChat(true);
      setRevChatStatus(true);

      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(<ChatMessageInputComposer />);
    }
  }, [REV_SITE_VAR_ARGS]);

  var revTarget;

  var revSetTargetId = _revTarget => {
    revTarget = _revTarget;
  };

  const RevSitePublisher = () => {
    let RevSitePublisherForm = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'RevSitePublisherForm',
      revData: null,
    });

    return RevSitePublisherForm;
  };

  const revHandleShowSitePublisherInputForm = () => {
    setIsRevFooter1LeftStrangerChat(false);

    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(<RevSitePublisher />);
  };

  const revHandleShowStorePublisherInputForm = () => {
    let RevStoresListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_stores',
      revViewName: 'RevStoresListingView',
      revData: null,
    });

    SET_REV_SITE_BODY(RevStoresListingView);
  };

  const [revChatStatus, setRevChatStatus] = useState(false);

  const revHandleShowChatComposer = (revIsChatStatus = true) => {
    setRevChatStatus(revIsChatStatus);

    if (!revIsChatStatus) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    } else {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(<ChatMessageInputComposer />);
    }
  };

  let revChatMessageTxt = '';

  let revSetChatMessageTxt = revText => {
    revChatMessageTxt = revText;
  };

  let RevChatSubmitOptions = () => {
    return (
      <View style={styles.footerSubmitOptionsLeftWrapper}>
        {revChatStatus ? (
          <RevSubmitChatTab
            revTargetId={revTarget}
            revMsg={() => {
              return revChatMessageTxt;
            }}
            revInputFieldCallback={() => {
              revSetChatMessageTxt('');
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              revHandleShowChatComposer();
            }}>
            <View style={[styles.cancelComposeChatMsg]}>
              <FontAwesome
                name="quote-left"
                style={[
                  styles.revSiteTxtColor,
                  styles.revSiteTxtMedium,
                ]}></FontAwesome>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={async () => {
            revWebRTCSendFile(2);
          }}>
          <View style={[styles.cancelComposeChatMsg]}>
            <FontAwesome
              name="image"
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            revHandleShowChatComposer(false);
          }}>
          <View style={[styles.cancelComposeChatMsg]}>
            <FontAwesome
              name="times"
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const revHandleUserSettingsPressed = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: null,
    });

    SET_REV_SITE_BODY(RevUserSettings);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });
  };

  return (
    <View style={styles.revFlexContainer}>
      <View style={styles.chatFooterWrapper}>
        {isRevFooter1LeftStrangerChat ? (
          <RevChatSubmitOptions />
        ) : (
          <RevNextStrangerChatTab />
        )}

        <View
          style={[styles.revFlexWrapper, styles.revSitePublisherTabWrapper]}>
          <TouchableOpacity
            onPress={() => {
              revHandleShowSitePublisherInputForm();
            }}>
            <FontAwesome name="plus" style={styles.revSitePublisherTab} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              revHandleShowSitePublisherInputForm();
            }}>
            <FontAwesome name="camera" style={styles.revSitePublisherTab} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              revHandleShowStorePublisherInputForm();
            }}>
            <FontAwesome
              name="shopping-bag"
              style={styles.revSitePublisherTab}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.revFlexWrapper,
            styles.rightFooterSubmitOptionsWrapper,
          ]}>
          <TouchableOpacity onPress={revHandleUserSettingsPressed}>
            <FontAwesome
              name="gear"
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteTxtSmall,
                styles.rightFooterOptionTab,
              ]}></FontAwesome>
          </TouchableOpacity>
          <FontAwesome
            name="share-alt"
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteTxtSmall,
              styles.rightFooterOptionTab,
            ]}></FontAwesome>
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteTxtSmall,
              styles.revSiteFontBold,
              styles.rightFooterOptionTab,
              styles.rightFooterHelpTab,
            ]}>
            Help
          </Text>
        </View>
      </View>
    </View>
  );
}

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
  revSiteFontWeightNormal: {
    fontWeight: '100',
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
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revSiteTxtMediumLarge: {
    fontSize: 14,
  },
  chatFooterWrapper: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  revSitePublisherTabWrapper: {
    marginLeft: 'auto',
  },
  revSitePublisherTab: {
    color: '#FFF',
    fontSize: 12,
    backgroundColor: '#757575',
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginLeft: 1,
    borderRadius: 55,
  },
  footerSubmitOptionsLeftWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelComposeChatMsg: {
    fontWeight: 'bold',
    marginTop: 2,
    paddingHorizontal: 8,
  },
  rightFooterSubmitOptionsWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginRight: 14,
    marginLeft: 'auto',
  },
  rightFooterOptionTab: {
    paddingHorizontal: 10,
    paddingBottom: 3,
  },
  rightFooterHelpTab: {
    paddingBottom: 1,
  },
  revSitePublisherContainer: {
    borderColor: '#F7F7F7',
    borderWidth: 1,
    marginTop: 4,
    marginHorizontal: 4,
  },
  revSitePublisherTagsInput: {
    color: '#444',
    fontSize: 11,
    paddingHorizontal: 5,
    padding: 0,
  },
  revSitePublisherContentInput: {
    color: '#444',
    fontSize: 11,
    textAlignVertical: 'top',
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
    borderTopColor: '#F7F7F7',
    borderTopWidth: 1,
  },
  revSitePublisherFooterWrapper: {
    alignItems: 'center',
    borderTopColor: '#F7F7F7',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingLeft: 4,
    paddingBottom: 8,
  },
  revSitePublisherSubmitTabWrapper: {
    width: 'auto',
  },
  revSitePublisherSubmitTab: {
    color: '#FFF',
    backgroundColor: '#444',
    width: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  revSitePublisherUpload: {
    paddingHorizontal: 8,
    marginLeft: 5,
  },
  revSitePublisherCancelTab: {
    paddingHorizontal: 5,
  },
});

import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';
import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';

import {useChatMessages} from '../rev_listing_views/ChatMessages';
import {useChatMessageInputComposer} from '../rev_forms/ChatMessageInputComposer';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export default function RevNextStrangerChatTab({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const [isRevNextStrangerChatTab, setIsRevNextStrangerChatTab] =
    useState(false);
  const [isRevComposing, setIsRevComposing] = useState(true);

  const revHandleNextStrangerChat = revChatStatus => {
    setIsRevComposing(revChatStatus);
    setIsRevNextStrangerChatTab(revChatStatus);
  };

  const {revChatInputArea, revSubmitChatOptionsMenuArea} =
    useChatMessageInputComposer(revVarArgs);

  const {revInitChatMessagesListingArea, revAddChatMessage} = useChatMessages();

  const RevNextStrangerChatTabArea = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          let revTargetGUID = REV_LOGGED_IN_ENTITY_GUID == 1 ? 6 : 1;

          revHandleNextStrangerChat(true);

          const revOnViewChangeCallBack = revUpdatedView => {
            SET_REV_SITE_BODY(revUpdatedView);
          };

          revInitChatMessagesListingArea({
            revOnViewChangeCallBack,
            revTargetGUID,
            revSubjectGUID: REV_LOGGED_IN_ENTITY_GUID,
          });
        }}
        style={styles.recipientNextWrapperTouchable}>
        <View style={styles.recipientNextWrapper}>
          <Text style={styles.recipientNextTxt}>NExT</Text>
          <View style={styles.recipientNextUserIconWrapper}>
            <FontAwesome name="user" style={styles.recipientNextUserIcon} />
          </View>
          <FontAwesome
            name="arrow-right"
            style={styles.recipientNextpointerIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const [RevNextChatTab, setRevNextChatTab] = useState(
    <RevNextStrangerChatTabArea />,
  );

  let RevChatSubmitOptions = () => {
    return (
      <View style={styles.footerSubmitOptionsLeftWrapper}>
        {isRevNextStrangerChatTab && isRevComposing ? (
          revSubmitChatOptionsMenuArea(revRetData => {
            if ('revEntity' in revRetData) {
              revAddChatMessage(revRetData.revEntity);
            }
          })
        ) : (
          <TouchableOpacity
            onPress={() => {
              revHandleNextStrangerChat(true);
            }}>
            <View style={[styles.cancelComposeChatMsg]}>
              <FontAwesome
                name="quote-left"
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtMedium,
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
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            revHandleHideComposingForm(false);
          }}>
          <View style={[styles.cancelComposeChatMsg]}>
            <FontAwesome
              name={
                isRevNextStrangerChatTab && isRevComposing ? 'expand' : 'times'
              }
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (isRevNextStrangerChatTab) {
      setRevNextChatTab(<RevChatSubmitOptions />);
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(revChatInputArea());
    }

    if (isRevNextStrangerChatTab && !isRevComposing) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }

    if (!isRevNextStrangerChatTab && !isRevComposing) {
      setRevNextChatTab(<RevNextStrangerChatTabArea />);
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }
  }, [isRevNextStrangerChatTab, isRevComposing]);

  const revHandleHideComposingForm = revComposingStatus => {
    if (!isRevComposing) {
      setIsRevNextStrangerChatTab(false);
    }

    setIsRevComposing(revComposingStatus);
  };

  return RevNextChatTab;
}

const styles = StyleSheet.create({
  recipientNextWrapperTouchable: {
    display: 'flex',
    marginRight: 22,
    marginLeft: 12,
  },
  recipientNextWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientNextTxt: {
    color: '#757575',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 7,
  },
  recipientNextUserIconWrapper: {
    backgroundColor: '#FFF',
  },
  recipientNextUserIcon: {
    color: '#757575',
    fontSize: 22,
    textAlign: 'center',
    marginLeft: 1,
  },
  recipientNextpointerIcon: {
    color: '#757575',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },
  chatFooterWrapper: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
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
});

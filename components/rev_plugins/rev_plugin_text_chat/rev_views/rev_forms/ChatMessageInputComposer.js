import React, {useState, useContext, useRef, useEffect} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../../../rev_contexts/RevWebRTCContext';

import {useChatMessages} from '../rev_listing_views/ChatMessages';
import {RevSubmitChatTab} from './RevSubmitChatTab';
import {useRevChatMessagesHelperFunctions} from '../../rev_func_libs/rev_chat_messages_helper_functions';

import DeviceInfo from 'react-native-device-info';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export function useChatMessageInputComposer(revVarArgs) {
  const {revSiteStyles} = useRevSiteStyles();

  const revChatMessageTxtLatest = useRef('');
  const revTextInputRef = useRef(null);

  const {REV_LOGGED_IN_ENTITY_GUID, REV_LOGGED_IN_ENTITY} =
    useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const {sendMessage} = useContext(RevWebRTCContext);

  const {revInitChatMessagesListingArea} = useChatMessages();

  const [revTargetGUID, setRevTargetGUID] = useState(
    REV_LOGGED_IN_ENTITY_GUID == 1 ? 6 : 1,
  );

  const revHandleNextStrangerChat = () => {
    const revOnViewChangeCallBack = revUpdatedView => {
      SET_REV_SITE_BODY(revUpdatedView);
    };

    revInitChatMessagesListingArea({
      revOnViewChangeCallBack,
      revTargetGUID: REV_LOGGED_IN_ENTITY_GUID,
      revSubjectGUID: revTargetGUID,
    });
  };

  const revChatUserTab = revId => {
    return (
      <TouchableOpacity key={revId}>
        <View style={styles.revChatMsgUserIcon}>
          <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  const revUserIcons = Array.from({length: 3}, (_, i) => revChatUserTab(i));

  const revCurrChatTarget = () => {
    return (
      <TouchableOpacity
        style={[revSiteStyles.revFlexWrapper, styles.revCurrChatTargetWrapper]}>
        {revChatUserTab(1)}
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSiteTxtBold,
            ]}>
            Oliver Muchai
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const RevHeaderNextStrangerTab = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          revHandleNextStrangerChat();
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

  const revChatSettingsTab = () => {
    return (
      <View style={[styles.revChatSettingsTabWrapper]}>
        <TouchableOpacity style={revSiteStyles.revFlexWrapper}>
          <FontAwesome
            name="gear"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
          />
          <FontAwesome
            name="arrow-right"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const revChatHeaderArea = () => {
    return (
      <View style={styles.revChatHeaderAreaWrapper}>
        <View style={styles.revChatHeaderAreaLeftView}>
          {revCurrChatTarget()}
        </View>
        <View style={styles.revChatHeaderAreaCenterView}>
          <ScrollView
            contentContainerStyle={
              styles.revChatHeaderAreaScrollView
            }></ScrollView>
        </View>
        <View style={[styles.revChatHeaderAreaRightView]}>
          <View style={styles.revChatHeaderAreaRightWrapper}>
            {revChatSettingsTab()}
            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                styles.revChatUserIconTabsWrapper,
              ]}>
              {revUserIcons.map(revView => revView)}
            </View>
            <RevHeaderNextStrangerTab />
          </View>
        </View>
      </View>
    );
  };

  const revChatInputArea = () => {
    let revChatInputArea = (
      <View
        style={[revSiteStyles.revFlexContainer, styles.revChatInputContainer]}>
        {revChatHeaderArea()}
        <TextInput
          ref={revTextInputRef}
          style={styles.revChatInputArea}
          placeholder=" Chat away !"
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={5}
          onChangeText={newText => {
            revChatMessageTxtLatest.current = newText;
          }}
          defaultValue={revChatMessageTxtLatest.current}
        />
      </View>
    );

    return revChatInputArea;
  };

  const revSubmitChatOptionsMenuArea = revCallBackFunc => {
    let revTargetEntityGUID = REV_LOGGED_IN_ENTITY_GUID == 6 ? 1 : 6;

    return (
      <RevSubmitChatTab
        revGetCurrentChatTarget={() => {
          return revTargetEntityGUID; // revChatEntityVarArgsLatest.current;
        }}
        revGetChatTextImput={() => revChatMessageTxtLatest.current}
        revCallback={revRetData => {
          revChatMessageTxtLatest.current = '';
          revTextInputRef.current.clear();

          let revRemoteTargetEntityGUID =
            REV_LOGGED_IN_ENTITY._remoteRevEntityGUID == 407 ? 375 : 407;

          // sendMessage(revRemoteTargetEntityGUID, {revMsg: 'HELLO WORLD ! ! !'});
          // onDisplayNotification();

          revCallBackFunc(revRetData);
        }}
      />
    );
  };

  return {revChatInputArea, revSubmitChatOptionsMenuArea};
}

const styles = StyleSheet.create({
  revChatHeaderAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  revChatHeaderAreaLeftView: {
    alignItems: 'center',
  },
  revChatHeaderAreaCenterView: {
    flex: 1,
    alignItems: 'center',
    height: 20,
  },
  revChatHeaderAreaRightView: {
    alignItems: 'flex-end',
  },
  revChatHeaderAreaRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revChatHeaderAreaScrollView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
  },
  revChatUserIconTabsWrapper: {
    marginRight: 4,
  },

  /** */
  revChatMsgUserIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    borderStyle: 'solid',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 4,
    marginRight: 2,
  },
  revChatCommentNonIcon: {
    color: '#c5e1a5',
    fontSize: 15,
  },
  revChatSettingsTabWrapper: {
    width: 'auto',
    paddingHorizontal: 4,
  },
  /** */

  revCurrChatTargetWrapper: {
    alignItems: 'baseline',
  },

  revChatInputContainer: {
    marginTop: 4,
    marginHorizontal: 4,
  },
  revChatInputArea: {
    color: '#444',
    fontSize: 11,
    textAlignVertical: 'top',
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
    borderColor: '#F7F7F7',
    borderWidth: 1,
  },
  recipientNextWrapperTouchable: {
    display: 'flex',
    marginRight: 22,
    // marginLeft: 'auto',
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
});

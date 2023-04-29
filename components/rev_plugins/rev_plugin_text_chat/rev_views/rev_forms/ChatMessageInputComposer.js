import React, {useState, useContext, useRef, useEffect} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../../../rev_contexts/RevWebRTCContext';

import {useChatMessages} from '../rev_listing_views/ChatMessages';
import {RevSubmitChatTab} from './RevSubmitChatTab';
import {useRevChatMessagesHelperFunctions} from '../../rev_func_libs/rev_chat_messages_helper_functions';

import DeviceInfo from 'react-native-device-info';

export function useChatMessageInputComposer(revVarArgs) {
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
      console.log('>>> --- revHandleNextStrangerChat <<<');
      SET_REV_SITE_BODY(revUpdatedView);
    };

    revInitChatMessagesListingArea({
      revOnViewChangeCallBack,
      revTargetGUID: REV_LOGGED_IN_ENTITY_GUID,
      revSubjectGUID: revTargetGUID,
    });
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

  const revChatInputArea = () => {
    let revChatInputArea = (
      <View style={[styles.revFlexContainer, styles.revChatInputContainer]}>
        <RevHeaderNextStrangerTab />
        <TextInput
          ref={revTextInputRef}
          style={styles.chatInput}
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
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revChatInputContainer: {
    marginTop: 4,
    marginHorizontal: 4,
  },
  chatInput: {
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
    marginLeft: 'auto',
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

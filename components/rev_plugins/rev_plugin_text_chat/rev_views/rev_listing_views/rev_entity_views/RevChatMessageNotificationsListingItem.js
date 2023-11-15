import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revRemoveLinebreaks} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import RevChatMessageOptions from '../../RevChatMessageOptions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevChatMessageNotificationsListingItem = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revIsChatOptionsModalVissible, setRevIsChatOptionsModalVissible] =
    useState(false);

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  let revEntityGUID = revVarArgs._revGUID;

  /** START GET PUBLISHER */
  if (
    !revVarArgs.hasOwnProperty('_revPublisherEntity') ||
    revIsEmptyJSONObject(revVarArgs._revPublisherEntity)
  ) {
    return null;
  }

  let revPublisherEntity = revVarArgs._revPublisherEntity;

  if (revPublisherEntity._revType !== 'rev_user_entity') {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    revPublisherEntity._revInfoEntity._revMetadataList,
    'rev_entity_name',
  );
  let revPublisherEntityNames_Trunc = revTruncateString(
    revPublisherEntityNames,
    22,
  );
  /** END GET PUBLISHER */

  let revMsgInfoEntity = revVarArgs._revInfoEntity;

  let revChatMsgStr = revGetMetadataValue(
    revMsgInfoEntity._revMetadataList,
    'rev_entity_desc_val',
  );

  let revTimeCreated = revVarArgs._revTimeCreated;

  let minMessageLen = 1;
  let maxMessageLen = 100;

  let revChatOptions = () => {
    return revIsChatOptionsModalVissible ? (
      <RevChatMessageOptions
        revData={revVarArgs}
        revCallback={() => setRevIsChatOptionsModalVissible(false)}
      />
    ) : null;
  };

  let chatMessageText = chatMsg => {
    let chatMessageView = (
      <Text style={styles.chatMsgContentTxt}>
        {chatMsg.length > maxMessageLen
          ? chatMsg.substring(0, maxMessageLen) + ' . . .'
          : chatMsg}
      </Text>
    );

    return (
      <View key={revEntityGUID} style={styles.chatMsgContentTxtContainer}>
        {chatMessageView}
        {chatMsg.length > maxMessageLen ? (
          <Text style={styles.readMoreTextTab}>Read more</Text>
        ) : null}
      </View>
    );
  };

  const handleRevChatMessageConversationClicked = () => {
    let RevChatMessagesConversationsListing = revPluginsLoader({
      revPluginName: 'rev_plugin_text_chat',
      revViewName: 'RevChatMessagesConversationsListing',
      revData: {},
    });

    SET_REV_SITE_BODY(RevChatMessagesConversationsListing);
  };

  return (
    <TouchableOpacity
      key={Math.abs(revEntityGUID)}
      onLongPress={() => {
        setRevIsChatOptionsModalVissible(true);
      }}
      onPress={() => {
        handleRevChatMessageConversationClicked();
      }}
      style={styles.chatMsgWrapperTouchable}>
      <View style={revSiteStyles.revFlexWrapper}>
        <View style={styles.chatMsgUserIcon}>
          <FontAwesome name="user" style={styles.availableChatPeopleNonIcon} />
        </View>
        <View style={styles.chatMsgContentWrapper}>
          <View style={styles.chatMsgContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={styles.chatMsgContentCarret}
            />
          </View>
          <View style={styles.chatMsgContentContainer}>
            <View style={styles.chatMsgHeaderWrapper}>
              <Text style={styles.chatMsgOwnerTxt}>
                {revPublisherEntityNames_Trunc}
              </Text>
              <Text style={styles.chatMsgSendTime}>{revTimeCreated}</Text>
              <View style={styles.chatMsgOptionsWrapper}>
                <Text style={styles.chatMsgOptions}>
                  <FontAwesome name="reply" />
                </Text>
                <Text style={styles.chatMsgOptions}>
                  <FontAwesome name="retweet" />
                </Text>
                <Text style={styles.chatMsgOptions}>
                  <FontAwesome name="list" />
                </Text>
              </View>
            </View>
            <View style={styles.chatMsgContentTxtContainer}>
              {chatMessageText(revRemoveLinebreaks(revChatMsgStr))}
            </View>
          </View>
        </View>
      </View>

      {revChatOptions()}
    </TouchableOpacity>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 42;

const styles = StyleSheet.create({
  chatMsgWrapperTouchable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
  },
  chatMsgUserIcon: {
    width: 22,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableChatPeopleNonIcon: {
    color: '#c5e1a5',
    fontSize: 17,
  },
  chatMsgContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  chatMsgContentWrapperInbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 2,
  },
  chatMsgContentCarretView: {
    backgroundColor: '#FFF',
    height: 'auto',
    marginTop: 6,
    marginRight: 1,
    marginLeft: 1,
    zIndex: 1,
  },
  chatMsgContentCarret: {
    color: '#EEE',
    textAlign: 'center',
    fontSize: 15,
  },
  chatMsgContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#F7F7F7',
    width: maxChatMessageContainerWidth - 7,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 2,
  },
  chatMsgHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomColor: '#rgba(27, 31, 35, 0.06)',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginTop: 4,
    position: 'relative',
  },
  chatMsgOwnerTxt: {
    color: '#444',
    fontSize: 10,
    lineHeight: 10,
    fontWeight: 'bold',
  },
  chatMsgSendTime: {
    color: '#8d8d8d',
    fontSize: 9,
    lineHeight: 9,
    marginRight: 12,
    marginLeft: 5,
  },
  chatMsgOptionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
    position: 'relative',
  },
  chatMsgOptions: {
    color: '#bdbdbd',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  chatMsgOptionsOutbox: {
    color: '#388e3c',
    fontSize: 12,
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  chatMsgContentTxtContainer: {
    color: '#444',
    fontSize: 10,
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingRight: 5,
    paddingBottom: 4,
    marginTop: 2,
  },
  chatMsgContentTxt: {
    color: '#444',
    fontSize: 10,
  },
  readMoreTextTab: {
    color: '#009688',
    fontWeight: 'bold',
    fontSize: 9,
    width: 'auto',
    paddingTop: 5,
    marginBottom: 4,
  },
});

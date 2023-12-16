import React, {createContext, useContext, useState, useEffect} from 'react';

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {RevReadMoreTextView} from '../../../../../rev_views/rev_page_views';

import RevChatMessageOptions from '../../RevChatMessageOptions';

import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

import {
  revFormatLongDate,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export default function OutboxChatMessage({revVarArgs, revGetChildFilesArr}) {
  const {revSiteStyles} = useRevSiteStyles();

  if (!revVarArgs) {
    return null;
  }

  const {
    revData,
    revPeersArr = [],
    revChildFilesArr = [],
    revDataSetter,
  } = revVarArgs;
  const {revMsgGUID, revType, revMsg = {}} = revData;

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  let revEntityGUID = revVarArgs._revGUID;

  /** START GET PUBLISHER */
  let _revPublisherEntity = REV_LOGGED_IN_ENTITY;

  if (
    revIsEmptyJSONObject(_revPublisherEntity) ||
    _revPublisherEntity._revType !== 'rev_user_entity'
  ) {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    _revPublisherEntity._revInfoEntity._revMetadataList,
    'rev_entity_name',
  );
  let revPublisherEntityNames_Trunc = revTruncateString(
    revPublisherEntityNames,
    22,
  );
  /** END GET PUBLISHER */

  let revMsgInfoEntity = revMsg._revInfoEntity;

  let revChatMsgStr = revGetMetadataValue(
    revMsgInfoEntity._revMetadataList,
    'rev_entity_desc_html',
  );

  let revTimeCreated = revFormatLongDate(revMsg._revTimeCreated);

  const [revIsChatOptionsModalVissible, setRevIsChatOptionsModalVissible] =
    useState(false);

  let revChatOptions = () => {
    return revIsChatOptionsModalVissible ? (
      <RevChatMessageOptions
        revData={revVarArgs}
        revCallback={() => setRevIsChatOptionsModalVissible(false)}
      />
    ) : null;
  };

  return (
    <TouchableOpacity
      key={'InboxMessage_' + revEntityGUID}
      onLongPress={() => {
        setRevIsChatOptionsModalVissible(true);
      }}>
      <View key={revEntityGUID} style={styles.inboxChatMsgWrapper}>
        <View style={styles.chatMsgContentWrapperInbox}>
          <View
            style={[styles.chatMsgContentContainer, styles.chatMsgInboxBlue]}>
            <View style={styles.chatMsgHeaderWrapper}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny_X,
                  revSiteStyles.revSiteTxtBold,
                ]}>
                me
              </Text>
              <Text style={styles.chatMsgSendTime}>{revTimeCreated}</Text>
              <View style={styles.chatMsgOptionsWrapper}>
                <Text style={styles.chatMsgOptions}>
                  <FontAwesome name="reply" />
                </Text>
                <Text style={styles.chatMsgOptions}>
                  <FontAwesome name="check" />
                </Text>
              </View>
            </View>
            <RevReadMoreTextView revText={revChatMsgStr} revMaxLength={255} />
          </View>
          <View style={styles.chatMsgContentCarretView}>
            <FontAwesome
              name="caret-right"
              style={styles.chatMsgContentCarret}
            />
          </View>
        </View>
        <View style={styles.chatMsgUserIconMe}>
          <FontAwesome name="user" style={styles.availableChatPeopleNonIcon} />
        </View>
      </View>

      {revChatOptions()}
    </TouchableOpacity>
  );
}

import {Dimensions} from 'react-native';

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 45;
var chatMsgContentTxtContainerWidth = maxChatMessageContainerWidth - 16;

const styles = StyleSheet.create({
  chatMsgWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
  },
  inboxChatMsgWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
    marginLeft: 'auto',
  },
  chatMsgUserIconMe: {
    width: 22,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableChatPeopleNonIcon: {
    color: '#DDD',
    fontSize: 17,
  },
  chatMsgContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  chatMsgContentWrapperInbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: maxChatMessageContainerWidth,
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
    color: '#DDD',
    textAlign: 'center',
    fontSize: 15,
  },
  chatMsgContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#c5e1a5',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 2,
  },
  chatMsgInboxBlue: {
    backgroundColor: '#F7F7F7',
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
    color: '#80cbc4',
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
    alignItems: 'flex-end',
    maxWidth: chatMsgContentTxtContainerWidth,
    marginTop: 4,
  },
  readMoreTextTab: {
    color: '#009688',
    fontWeight: 'bold',
    fontSize: 9,
    paddingTop: 5,
    marginBottom: 4,
  },
});

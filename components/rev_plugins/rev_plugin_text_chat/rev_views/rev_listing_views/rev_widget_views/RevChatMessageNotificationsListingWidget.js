import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {RevChatMessageNotificationsListingItem} from '../rev_entity_views/RevChatMessageNotificationsListingItem';
import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

const {RevPersLibRead_React} = NativeModules;

export const RevChatMessageNotificationsListingWidget = () => {
  [revPastChatMessagesData, setRevPastChatMessagesData] = useState(null);

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  useEffect(() => {
    new Promise((res, rej) => {
      let revChatMessagesArr = revPastChatConversations();

      res(revChatMessagesArr);
    }).then(result => {
      setRevPastChatMessagesData(result);
    });
  }, []);

  let revPastChatConversations = () => {
    let revInboxMsgsGUIDsArrStr =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsTargetGUIDs_BY_RelStr_SubjectGUID(
        'rev_msg_recipient_of',
        REV_LOGGED_IN_ENTITY_GUID,
      );

    let revInboxMsgsGUIDsArr = JSON.parse(revInboxMsgsGUIDsArrStr);

    let revChatMessagesArr = [];

    for (let i = 0; i < revInboxMsgsGUIDsArr.length; i++) {
      let revInboxMsgsGUID = revInboxMsgsGUIDsArr[i];
      let revCurrMsgStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revInboxMsgsGUID);
      let revCurrMsg = JSON.parse(revCurrMsgStr);

      let revMsgEntityOwnerGUID = revCurrMsg._revEntityOwnerGUID;

      revCurrMsg['revMessageType'] =
        revMsgEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID ? 'outbox' : 'inbox';

      revChatMessagesArr.push(revCurrMsg);
    }

    return revChatMessagesArr;
  };

  function renderItem({item}) {
    return <RevChatMessageNotificationsListingItem revVarArgs={item} />;
  }

  let RevDisplay = () => {
    return revPastChatMessagesData.length ? (
      <FlatList
        data={revPastChatMessagesData}
        renderItem={renderItem}
        keyExtractor={item => {
          return 'RevDisplay_' + item._revEntityGUID;
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    ) : (
      <Text style={styles.revNullNoticias}>
        You do not have any chat conversations yet
      </Text>
    );
  };

  return (
    <View>
      <RevPageContentHeader />

      {revPastChatMessagesData && <RevDisplay />}
    </View>
  );
};

const styles = StyleSheet.create({
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 38,
  },
  revNullNoticias: {
    color: '#90a4ae',
    fontSize: 10,
    alignSelf: 'flex-start',
  },
});

import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';
import React, {useEffect, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {RevPersLibCreate_React, RevPersLibRead_React, RevWebRTCReactModule} =
  NativeModules;

import {RevChatMessageNotificationsListingItem} from './rev_entity_views/RevChatMessageNotificationsListingItem';

export const RevChatMessageNotificationsListing = () => {
  [revPastChatMessagesData, setRevPastChatMessagesData] = useState(null);

  useEffect(() => {
    new Promise((res, rej) => {
      let revChatMessagesArr = revPastChatConversations();
      res(revChatMessagesArr);
    }).then(result => {
      setRevPastChatMessagesData(result);
    });
  }, []);

  let revPastChatConversations = () => {
    let revChatMsgs =
      RevPersLibRead_React.revPersGet_ALL_RevEntity_By_RevEntityContainerGUID_SubTYPE(
        1,
        'rev_chat_message',
      );

    let revChatMessagesArr = JSON.parse(revChatMsgs);

    if (Array.isArray(revChatMessagesArr)) {
      for (let i = 0; i < revChatMessagesArr.length; i++) {
        let revChatMsg = revChatMessagesArr[i];

        revChatMsg['revMessageType'] =
          i > 1 && i % 2 == (0 || 1) ? 'outbox' : 'inbox';
      }
    }

    return revChatMessagesArr;
  };

  function renderItem({item}) {
    return (
      <RevChatMessageNotificationsListingItem
        key={item._revEntityGUID.toString()}
        revVarArgs={item}
      />
    );
  }

  let RevDisplay = () => {
    return revPastChatMessagesData.length > 1 ? (
      <FlatList
        data={revPastChatMessagesData}
        renderItem={renderItem}
        keyExtractor={item => {
          return item._revEntityGUID.toString();
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
      <Text style={styles.revContentBodyTtlTellTxt}>
        <FontAwesome name="dot-circle-o" />
        <FontAwesome name="long-arrow-right" /> 27 new{' '}
        <FontAwesome name="dot-circle-o" />
        <FontAwesome name="long-arrow-right" /> Find
      </Text>

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

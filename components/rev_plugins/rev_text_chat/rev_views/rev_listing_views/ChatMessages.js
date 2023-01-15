import React, {useState, useEffect, useContext} from 'react';

import {ScrollView, StyleSheet, Text, View, NativeModules} from 'react-native';

const {RevPersLibCreate_React, RevPersLibRead_React, RevWebRTCReactModule} =
  NativeModules;

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import RevNullMessagesView from '../../../../rev_views/RevNullMessagesView';
import InboxMessage from './rev_entity_views/InboxMessage';
import OutboxChatMessage from './rev_entity_views/OutboxChatMessage';

import {RevRemoteSocketContext} from '../../../../../rev_contexts/RevRemoteSocketContext';

export default function ChatMessages() {
  const {newPeerDataChannelMessage, setNewPeerDataChannelMessage} = useContext(
    RevRemoteSocketContext,
  );

  const [newPeerMessages, setNewPeerMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  const [listedChatMessages, setListedChatMessages] = useState({});

  let revAddedMessageIdsArr = [];

  useEffect(() => {
    revAddedMessageIdsArr = [];

    if (
      newPeerDataChannelMessage.hasOwnProperty('revMessageId') &&
      !listedChatMessages.hasOwnProperty(newPeerDataChannelMessage.messageId)
    ) {
      newPeerMessages.push(newPeerDataChannelMessage);

      listedChatMessages[newPeerDataChannelMessage.revMessageId] =
        newPeerDataChannelMessage;

      setListedChatMessages(listedChatMessages);

      setNewPeerMessages(newPeerMessages);
    }
  }, [newPeerDataChannelMessage]);

  let RevPastChatConversations = () => {
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

    let revPastChatConversationsArr = (
      <View>
        {revChatMessagesArr.map(chatMsg => {
          let revCurrMsgId = chatMsg._revEntityGUID;

          if (revAddedMessageIdsArr.includes(revCurrMsgId)) {
            return null;
          }

          revAddedMessageIdsArr.push(revCurrMsgId);

          if (chatMsg.revMessageType.localeCompare('inbox') === 0) {
            return <InboxMessage key={revCurrMsgId} revData={chatMsg} />;
          } else {
            return <OutboxChatMessage key={revCurrMsgId} revData={chatMsg} />;
          }
        })}
      </View>
    );

    return revChatMessagesArr.length > 0 ? revPastChatConversationsArr : null;
  };

  return (
    <View>
      <RevNullMessagesView />
      <ScrollView
        ref={ref => {
          this.scrollView = ref;
        }}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({animated: true})
        }
        vertical
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentOffset={{x: 0, y: 99999}}
        style={styles.chatMsgsVScroller}>
        <View style={[styles.revFlexWrapper, styles.userInfoWrapper]}>
          <Text style={[styles.revSiteTxtColor, styles.userInfoTxt]}>
            About me hello!
          </Text>
        </View>
        <Text style={styles.messagesNull}>No messages exchanged</Text>
        <View style={styles.chatMessagesContainer}>
          <RevPastChatConversations />

          {newPeerMessages.map(chatMsg => {
            let revCurrMsgId = chatMsg._revEntityGUID;

            if (revAddedMessageIdsArr.includes(revCurrMsgId)) {
              return null;
            }

            revAddedMessageIdsArr.push(revCurrMsgId);

            if (chatMsg.revMessageType.localeCompare('inbox') === 0) {
              return <InboxMessage key={revCurrMsgId} revData={chatMsg} />;
            } else {
              return <OutboxChatMessage key={revCurrMsgId} revData={revData} />;
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatMsgsVScroller: {
    width: '100%',
    marginTop: 4,
  },
  revSiteTxtColor: {
    color: '#757575',
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  userInfoWrapper: {
    backgroundColor: '#fffde7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    borderRadius: 5,
  },
  userInfoTxt: {
    fontSize: 10,
  },
  messagesNull: {
    color: '#90a4ae',
    fontSize: 10,
    marginTop: 5,
    marginLeft: 12,
  },
  chatMessagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 3,
  },
});

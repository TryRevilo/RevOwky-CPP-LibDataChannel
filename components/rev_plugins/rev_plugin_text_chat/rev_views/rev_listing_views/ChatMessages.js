import React, {useState, useEffect, useContext} from 'react';

import {ScrollView, StyleSheet, Text, View, NativeModules} from 'react-native';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';

import RevNullMessagesView from '../../../../rev_views/RevNullMessagesView';
import InboxMessage from './rev_entity_views/InboxMessage';
import OutboxChatMessage from './rev_entity_views/OutboxChatMessage';

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

const {RevPersLibCreate_React, RevPersLibRead_React} = NativeModules;

export default function ChatMessages({revVarArgs}) {
  if (!'_remoteRevEntityGUID' in revVarArgs) {
    return;
  }

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const [newPeerMessages, setNewPeerMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  const [listedChatMessages, setListedChatMessages] = useState({});

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  let revAddedMessageIdsArr = [];

  useEffect(() => {
    revAddedMessageIdsArr = [];
  }, []);

  let revGUID_1 = REV_LOGGED_IN_ENTITY_GUID;
  let revGUID_2 = REV_LOGGED_IN_ENTITY_GUID == 43 ? 1 : 43;

  let revChatRelsStr = RevPersLibRead_React.revGetRels_By_RelType_LocalGUIDs(
    'rev_stranger_chat_of',
    revGUID_1,
    revGUID_2,
  );

  let revChatRelsArr = JSON.parse(revChatRelsStr);

  let revChatMessagesArr = [];

  for (let i = 0; i < revChatRelsArr.length; i++) {
    let revEntityGUID = revChatRelsArr[i]._revEntityGUID;

    if (revEntityGUID < 1) {
      continue;
    }

    let revChatMsgEntity = revPersGetRevEnty_By_EntityGUID(revEntityGUID);

    let revEntityOwnerGUID = revChatMsgEntity._revEntityOwnerGUID;

    if (revEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID) {
      revChatMsgEntity['revMessageType'] = 'outbox';
    } else {
      revChatMsgEntity['revMessageType'] = 'inbox';
    }

    revChatMessagesArr.push(revChatMsgEntity);
  }

  let revChatMessagesArrCount = revChatMessagesArr.length;

  let RevPastChatConversations = () => {
    let revPastChatConversationsArr = (
      <View>
        {revChatMessagesArr.map(chatMsg => {
          let revCurrMsgId = chatMsg._revEntityGUID;

          if (revAddedMessageIdsArr.includes(revCurrMsgId)) {
            return null;
          }

          revAddedMessageIdsArr.push(revCurrMsgId);

          if (chatMsg.revMessageType.localeCompare('inbox') === 0) {
            return <InboxMessage key={revCurrMsgId} revVarArgs={chatMsg} />;
          } else {
            return (
              <OutboxChatMessage key={revCurrMsgId} revVarArgs={chatMsg} />
            );
          }
        })}
      </View>
    );

    return revChatMessagesArrCount > 0 ? revPastChatConversationsArr : null;
  };

  let revChatMessagesArrCountTxt = revChatMessagesArrCount
    ? '+' + revChatMessagesArrCount + ' chat mEssaGes'
    : 'No chats yet';

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
        <Text style={styles.messagesNull}>{revChatMessagesArrCountTxt}</Text>
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
    marginLeft: 25,
  },
  chatMessagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 3,
    marginBottom: 55,
  },
});

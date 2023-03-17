import React, {useState, useContext} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';

import ChatMessages from '../rev_listing_views/ChatMessages';

export function ChatMessageInputComposer({revSetText}) {
  const [chatMessage, setChatMessage] = useState('');

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const revHandleNextStrangerChat = () => {
    SET_REV_SITE_BODY(<ChatMessages />);
  };

  const RevNextStrangerChatTabArea = () => {
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

  return (
    <View style={[styles.revFlexContainer, styles.revChatInputContainer]}>
      <RevNextStrangerChatTabArea />
      <TextInput
        style={styles.chatInput}
        placeholder=" Chat away !"
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={5}
        onChangeText={newText => {
          setChatMessage(newText);
        }}
        defaultValue={chatMessage}
      />
    </View>
  );
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

import React, {useState} from 'react';

import {StyleSheet, View, TextInput} from 'react-native';

export default function ChatMessageInputComposer({revSetText}) {
  const [chatMessage, setChatMessage] = useState('');

  return (
    <View style={[styles.revFlexContainer, styles.revChatInputContainer]}>
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
});

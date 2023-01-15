import React from 'react';
import {
  Button,
  Text,
  View,
  ScrollView,
  StatusBar,
  useColorScheme,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

export function RevFooter1({revVarArgs}) {
  let revData = revVarArgs.revData;

  return (
    <View>
      <Text style={styles.chatMsgOptions}>{revData}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chatMsgOptions: {
    color: '#bdbdbd',
    fontSize: 12,
    paddingHorizontal: 8,
  },
});

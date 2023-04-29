import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

export default function PeerVideoView({revId, revPeerStream}) {
  return (
    <View style={styles.peerStreamNullContainer}>
      <Text style={styles.peerStreamNull}>!</Text>
      <Text style={styles.peerStreamNullTxt}>No Stream</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  videoStyle: {
    minWidth: '100%',
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  peerStreamNullContainer: {
    display: 'flex',
    width: '100%',
    marginTop: '4%',
  },
  peerStreamNull: {
    color: '#f8bbd0',
    fontSize: 37,
    textAlign: 'center',
    marginTop: 8,
  },
  peerStreamNullTxt: {
    color: '#f8bbd0',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 10,
    marginTop: -7,
  },
});

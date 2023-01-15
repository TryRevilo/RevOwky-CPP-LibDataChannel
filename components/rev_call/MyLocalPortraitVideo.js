import React, {createContext, useContext, useState, useEffect} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function MyLocalPortraitVideo({revId, revLocalStream}) {
  if (revLocalStream) {
    return (
      <View style={styles.localPortraitVideoContainer}>
        <TouchableOpacity
          onPress={() =>
            revLocalStream._tracks[1]._switchCamera()
          }></TouchableOpacity>
      </View>
    );
  }

  return <Text style={styles.noLocalStreamErr}>No Stream!</Text>;
}

const styles = StyleSheet.create({
  localPortraitVideoContainer: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 3,
  },
  myVideoStyle: {
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'dashed',
    alignSelf: 'stretch',
    borderRadius: 3,
  },
  noLocalStreamErr: {
    color: 'red',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: '60%',
  },
});

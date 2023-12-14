import React, {useContext, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';
import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

function RevVideoCallModal({revVarArgs}) {
  if (RevWebRTCContext == undefined) {
    return;
  }

  const {revInitVideoCall} = useContext(RevWebRTCContext);
  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const revPeerIdsArrRef = useRef([]);

  const revSetPeerIdsArr = _revPeerIdsArr => {
    revPeerIdsArrRef.current = _revPeerIdsArr;
  };

  const handleRevInitVideoCallTabPress = async () => {
    let revPeerId = REV_LOGGED_IN_ENTITY._revRemoteGUID;

    try {
      await revInitVideoCall({
        revPeerId: revPeerId,
      });
    } catch (error) {
      console.log('*** error -handleRevInitVideoCallTabPress', error);
    }
  };

  let RevCallBtn = () => {
    return (
      <TouchableOpacity onPress={handleRevInitVideoCallTabPress}>
        <View style={styles.revCurrentChatOptionTab}>
          <FontAwesome
            name="video-camera"
            style={styles.currentChatOptionTabIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return <RevCallBtn />;
}

export default RevVideoCallModal;

const styles = StyleSheet.create({
  revCurrentChatOptionTab: {
    backgroundColor: '#ffebee',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 50,
    opacity: 0.5,
  },
  currentChatOptionTabIcon: {
    color: '#ec407a',
    textAlign: 'center',
    fontSize: 11,
  },

  /** END Collective call audience */
});

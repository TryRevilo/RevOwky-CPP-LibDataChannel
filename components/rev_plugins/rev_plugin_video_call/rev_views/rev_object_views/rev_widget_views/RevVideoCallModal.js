import React, {useContext, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export default function RevVideoCallModal({revVarArgs = {}}) {
  const {revSiteStyles} = useRevSiteStyles();

  if (RevWebRTCContext == undefined) {
    return;
  }

  const {revInitVideoCall} = useContext(RevWebRTCContext);

  const {revSelectedPeerIdsArr = []} = revVarArgs;

  const {SET_REV_SITE_BODY, revInitSiteModal} = useContext(ReViewsContext);
  const revPeerIdsArrRef = useRef(revSelectedPeerIdsArr);

  const revCallPeersListingCallBack = revSelectedPeerIdsArr => {
    revSelectedPeerIdsArrRef.current = revSelectedPeerIdsArr;
  };

  let revCallPeersListing = revPluginsLoader({
    revPluginName: 'rev_plugin_video_call',
    revViewName: 'RevCallPeersListing',
    revVarArgs: {
      revSelectedPeerIdsArr: revPeerIdsArrRef.current,
      revCallBack: revCallPeersListingCallBack,
    },
  });

  const handleRevInitVideoCallTabPress = async () => {
    if (!revSelectedPeerIdsArr.length) {
      revInitSiteModal(
        <View
          style={[
            revSiteStyles.revFlexContainer,
            {
              backgroundColor: '#FFFFFF',
              width: '90%',
              height: '100%',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 3,
              overflow: 'hidden',
            },
          ]}>
          {revCallPeersListing}
        </View>,
      );
    } else {
      try {
        revInitVideoCall({
          revPeerIdsArr: revSelectedPeerIdsArr,
        }).then(revRes => {
          // SET_REV_SITE_BODY(revCallPeersListing);
        });
      } catch (error) {
        console.log('*** error -handleRevInitVideoCallTabPress', error);
      }
    }
  };

  let RevCallBtn = () => {
    return (
      <TouchableOpacity
        onPress={handleRevInitVideoCallTabPress}
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revCurrentChatOptionTab,
          {width: 28},
        ]}>
        <FontAwesome
          name="video-camera"
          style={[
            revSiteStyles.revSiteTxtAlertDangerColor_Light,
            revSiteStyles.revSiteTxtNormal,
            styles.revCurrentChatOptionTabIcon,
          ]}
        />
      </TouchableOpacity>
    );
  };

  return <RevCallBtn />;
}
const styles = StyleSheet.create({
  revCurrentChatOptionTab: {
    backgroundColor: '#ffebee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 10,
    borderRadius: 50,
    opacity: 0.5,
  },
  revCurrentChatOptionTabIcon: {
    textAlign: 'center',
  },
});

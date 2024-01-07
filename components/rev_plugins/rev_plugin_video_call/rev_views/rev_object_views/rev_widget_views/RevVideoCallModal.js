import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevDialingCall} from '../../../../../rev_views/rev_web_rtc_views/rev_views/rev_object_views/RevDialingCall';
import {useChatMessages} from '../../../../rev_plugin_text_chat/rev_views/rev_listing_views/ChatMessages';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export default function RevVideoCallModal({revVarArgs = {}}) {
  const {revSiteStyles} = useRevSiteStyles();

  if (RevWebRTCContext == undefined) {
    return;
  }

  const {
    revActivePeerIdsArr = [],
    revActiveVideoPeerIdsArr = [],
    revInitVideoCall,
    revLocalVideoStream = {},
    revRemoteVideoStreamsObj,
    revGetPeerMessagesArr,
    revEndVideoCall,
  } = useContext(RevWebRTCContext);
  const {revInitSiteModal, revCloseSiteModal, SET_REV_SITE_BODY} =
    useContext(ReViewsContext);

  const {revSelectedPeerIdsArr = []} = revVarArgs;
  const revPeerIdsArrRef = useRef(revSelectedPeerIdsArr);

  const [isRevDialling, setIsRevDialling] = useState(false);

  const {revInitChatMessagesListingArea} = useChatMessages();

  const revCallPeersListingCallBack = revSelectedPeerIdsArr => {
    revPeerIdsArrRef.current = [
      ...revPeerIdsArrRef.current,
      ...revSelectedPeerIdsArr,
    ];
  };

  let revCallPeersListing = revPluginsLoader({
    revPluginName: 'rev_plugin_video_call',
    revViewName: 'RevCallPeersListing',
    revVarArgs: {
      revCallBack: revCallPeersListingCallBack,
    },
  });

  const handleRevInitVideoCallTabPress = async () => {
    if (!revPeerIdsArrRef.current.length) {
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
        revCloseSiteModal();

        await revInitVideoCall({
          revPeerIdsArr: revPeerIdsArrRef.current,
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

  const revEndCallCall = () => {
    revCloseSiteModal();
    setIsRevDialling(false);

    const revOnViewChangeCallBack = revUpdatedView => {
      SET_REV_SITE_BODY(revUpdatedView);
    };

    revInitChatMessagesListingArea({
      revMessagesArr: revGetPeerMessagesArr([revActivePeerIdsArr[0]]),
      revOnViewChangeCallBack,
    });
  };

  useEffect(() => {
    if (isRevDialling || !revLocalVideoStream) {
      return;
    }

    revInitSiteModal(
      <RevDialingCall
        revVarArgs={{
          revLocalVideoStream,
          revCancelCallBackFunc: async () => {
            revEndVideoCall(revActiveVideoPeerIdsArr, () => {
              revEndCallCall();
            });
          },
          revEndDialCallBack: revEndCallCall,
        }}
      />,
    );

    setIsRevDialling(true);
  }, [revLocalVideoStream]);

  useEffect(() => {
    if (revIsEmptyJSONObject(revRemoteVideoStreamsObj)) {
      return;
    }

    setIsRevDialling(false);

    revCloseSiteModal();

    let revVideoCall = revPluginsLoader({
      revPluginName: 'rev_plugin_video_call',
      revViewName: 'RevVideoCall',
      revVarArgs: {},
    });

    SET_REV_SITE_BODY(revVideoCall);
  }, [revRemoteVideoStreamsObj]);

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

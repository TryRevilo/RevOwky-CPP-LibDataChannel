import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {RTCView} from 'react-native-webrtc';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {useChatMessages} from '../../../../rev_plugin_text_chat/rev_views/rev_listing_views/ChatMessages';

import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revIsEmptyInfo} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

const revBorderRadius = 8;

export const RevVideoCallWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const {
    revActivePeerIdsArr = [],
    revGetPeerIdsArr,
    revGetVideoCallPeerIdsArr,
    revGetPeerMessagesArr,
    revEndVideoCall,
    revSetOnVideoChatMessageSent,
    revSetOnVideoChatMessageReceived,
    revLocalVideoStream,
    revSetOnAddRemoteStream,
  } = useContext(RevWebRTCContext);

  const revRemotePeerStreamsObjRef = useRef({});

  const [revMainPeerStream, setRevMainPeerStream] = useState(null);
  const [revMainPeerStreamView, setRevMainPeerStreamView] = useState(null);
  const [revPeerStreamsViewsArr, setRevPeerStreamsViewsArr] = useState([]);

  let revPeerMessagesArr = revGetPeerMessagesArr(revGetPeerIdsArr());
  const [revMessages, setRevMessages] = useState(revPeerMessagesArr);

  const {revInitChatMessagesListingArea, revAddChatMessage} = useChatMessages();

  const handleRevStreamCreated = () => {
    // This function will be called when the video stream is created successfully
    console.log('Video stream created successfully');
  };

  const handleRevError = error => {
    // This function will be called if there's an error in creating the video stream
    console.error('Error creating video stream:', error);
  };

  revSetOnAddRemoteStream(revPeerRemoteStream => {
    const {revPeerId, revRemoteStream} = revPeerRemoteStream;

    let revNewPeerRemoteStream = {...revRemotePeerStreamsObjRef.current};
    revNewPeerRemoteStream[revPeerId] = revRemoteStream;

    revRemotePeerStreamsObjRef.current[revPeerId] = revRemoteStream;

    let revNewVideoParticipantViewsArr = [];
    let revMainPeer = null;

    Object.entries(revRemotePeerStreamsObjRef.current).forEach(
      ([revPeerId, revRemoteStream]) => {
        let revCurrPeer = {revPeerId, revRemoteStream};

        if (!revMainPeer && revRemoteStream) {
          revMainPeer = revCurrPeer;
        }

        revNewVideoParticipantViewsArr.push(
          <TouchableOpacity
            key={revPeerId}
            onPress={() => {
              setRevMainPeerStream(revCurrPeer);
            }}
            style={[
              styles.revRTCVideoContainer,
              {width: 45, height: 65, marginRight: 2},
            ]}>
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revRemoteStream.toURL()}
              onStreamCreated={handleRevStreamCreated}
              onError={handleRevError}
              zOrder={1}
              style={styles.revRTCVideo}
            />
          </TouchableOpacity>,
        );
      },
    );

    setRevMainPeerStream(revMainPeer);
    setRevPeerStreamsViewsArr(revNewVideoParticipantViewsArr);
  });

  revSetOnVideoChatMessageSent(revNewMessage => {
    setRevMessages([...revMessages, revNewMessage]);
  });

  revSetOnVideoChatMessageReceived(revNewMessage => {
    setRevMessages([...revMessages, revNewMessage]);
  });

  const revCallPeersListingCallBack = revSelectedPeerIdsArr => {
    revSelectedPeerIdsArrRef.current = revSelectedPeerIdsArr;
  };

  const RevMsgItem = ({revIndex, revChatMessage}) => {
    const {_revPublisherEntity, revPeersArr, revData} = revChatMessage;
    const {revMsgGUID, revType, revMsg = {}} = revData;
    const {_revRemoteGUID = -1} = _revPublisherEntity;

    if (revIsEmptyInfo(revMsg)) {
      return null;
    }

    let revMsgInfoEntity = revMsg._revInfoEntity;

    let revChatMsgStr = revGetMetadataValue(
      revMsgInfoEntity._revMetadataList,
      'rev_entity_desc',
    );

    return (
      <TouchableOpacity
        style={[
          revSiteStyles.revFlexContainer,
          {
            backgroundColor: '#F7F7F7',
            opacity: 1,
            paddingHorizontal: 4,
            paddingVertical: 4,
            marginTop: revIndex ? 1 : 0,
          },
        ]}>
        <View style={[revSiteStyles.revFlexWrapper, {alignItems: 'center'}]}>
          <View style={styles.revUserIconTab}>
            <FontAwesome
              name="user"
              style={[
                revSiteStyles.revSiteColorIconGreen,
                revSiteStyles.revSiteTxtMedium,
              ]}
            />
          </View>

          <View style={{paddingHorizontal: 5}}>
            <MaterialCommunityIcons
              name="format-horizontal-align-right"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtSmall,
              ]}
            />
          </View>

          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtTiny_X,
            ]}>
            me + {'2'} {' others'}
          </Text>
        </View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorDark,
            revSiteStyles.revSiteTxtTiny_X,
            {marginTop: 2},
          ]}>
          {revChatMsgStr}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleRevCloseAllVidCallsPressed = () => {
    revEndVideoCall(revGetVideoCallPeerIdsArr(), () => {
      const revOnViewChangeCallBack = revUpdatedView => {
        SET_REV_SITE_BODY(revUpdatedView);
      };

      revInitChatMessagesListingArea({
        revMessagesArr: revGetPeerMessagesArr([revGetPeerIdsArr()[0]]),
        revOnViewChangeCallBack,
      });
    });
  };

  let revEndCall = (
    <View style={styles.revEndCallBtnWrapper}>
      <TouchableOpacity onPress={handleRevCloseAllVidCallsPressed}>
        <Text style={styles.revEndCallBtn}>
          <FontAwesome name="power-off" style={styles.revEndCallBtnIcon} />
        </Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    console.log('>>> revLocalVideoStream', JSON.stringify(revLocalVideoStream));
  }, [revLocalVideoStream]);

  useEffect(() => {
    if (revMainPeerStream && revMainPeerStream.revRemoteStream) {
      setRevMainPeerStreamView(
        <RTCView
          mirror={true}
          objectFit={'cover'}
          streamURL={revMainPeerStream.revRemoteStream.toURL()}
          onStreamCreated={handleRevStreamCreated}
          onError={handleRevError}
          zOrder={0}
          style={styles.revRTCVideo}
        />,
      );
    }
  }, [revMainPeerStream]);

  return (
    <View style={[revSiteStyles.revFlex_1_Container]}>
      <RevPageContentHeader revVarArgs={{revIsIndented: true}} />

      <View
        style={[
          revSiteStyles.revFlex_1_Container,
          {
            backgroundColor: '#FFF',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: revBorderRadius,
          },
        ]}>
        <View
          style={[
            revSiteStyles.revFlex_1_Container,
            {
              backgroundColor: '#444',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: revBorderRadius,
            },
          ]}>
          {revMainPeerStreamView}
        </View>

        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revRTCVideoContainerPos,
            {
              width: '50%',
              height: 75,
              bottom: 8,
              left: 8,
              borderRadius: revBorderRadius,
              overflow: 'hidden',
            },
          ]}>
          {revPeerStreamsViewsArr}

          {revEndCall}
        </View>

        <View
          style={[
            styles.revRTCVideoContainerPos,
            {
              backgroundColor: 'red',
              width: 55,
              height: 100,
              top: 8,
              left: 8,
              borderRadius: revBorderRadius,
              overflow: 'hidden',
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setRevMainPeerStream({revRemoteStream: revLocalVideoStream});
            }}
            style={styles.revRTCVideoContainer}>
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={revLocalVideoStream && revLocalVideoStream.toURL()}
              onStreamCreated={handleRevStreamCreated}
              onError={handleRevError}
              zOrder={3}
              style={styles.revRTCVideo}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            {
              backgroundColor: '#FFF',
              width: '55%',
              height: '60%',
              opacity: 0.6,
              padding: 4,
              position: 'absolute',
              top: 8,
              right: 8,
              borderRadius: revBorderRadius,
              overflow: 'hidden',
            },
          ]}>
          <View
            style={{
              flex: 1,
              borderRadius: revBorderRadius,
              overflow: 'hidden',
            }}>
            <RevScrollView_V
              revScrollViewContent={
                <View style={[revSiteStyles.revFlexContainer]}>
                  {revMessages.map((revCurr, revIndex) => {
                    return (
                      <RevMsgItem
                        key={revIndex}
                        revIndex={revIndex}
                        revChatMessage={revCurr}
                      />
                    );
                  })}
                </View>
              }
            />
          </View>

          <View
            style={[
              revSiteStyles.revFlexWrapper,
              {
                flex: 0,
                marginTop: 5,
                borderRadius: revBorderRadius,
              },
            ]}>
            {revActivePeerIdsArr.map(revCurr => (
              <View key={revCurr} style={styles.revUserIconTabFooter}>
                <FontAwesome
                  name="user"
                  style={[
                    revSiteStyles.revSiteColorIconGreen,
                    revSiteStyles.revSiteTxtMedium,
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revEndCallBtnWrapper: {
    backgroundColor: '#e57373',
    padding: 1,
    marginLeft: 'auto',
    borderRadius: 100,
  },
  revEndCallBtn: {
    backgroundColor: '#ba000d',
    width: 'auto',
    padding: 15,
    borderRadius: 100,
  },
  revEndCallBtnIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
  revRTCVideoContainerPos: {
    position: 'absolute',
  },
  revRTCVideoContainer: {
    backgroundColor: '#CCCCCC',
    width: '100%',
    height: '100%',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: revBorderRadius,
    overflow: 'hidden',
  },
  revRTCVideo: {
    backgroundColor: '#CCCCCC',
    width: '100%',
    height: '100%',
  },

  /** END Collective call audience */
  revUserIconTab: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    marginRight: 2,
    borderRadius: revBorderRadius,
  },
  revUserIconTabFooter: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    width: 22,
    height: 27,
    marginRight: 2,
    borderRadius: revBorderRadius,
  },
});

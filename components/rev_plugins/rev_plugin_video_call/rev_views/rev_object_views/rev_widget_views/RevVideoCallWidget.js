import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import {RTCView, MediaStream} from 'react-native-webrtc';

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
    revActiveVideoPeerIdsArr = [],
    revGetPeerMessagesArr,
    revEndVideoCall,
    revSetOnVideoChatMessageSent,
    revSetOnVideoChatMessageReceived,
    revSetOnAddLocalStream,
    revSetOnAddRemoteStream,
    revRemoteVideoStreamsObj,
  } = useContext(RevWebRTCContext);

  const [revLocalVideoStream, setRevLocalVideoStream] = useState(null);
  const [revMainPeerStream, setRevMainPeerStream] = useState(null);
  const [revPeerStreamsViewsArr, setRevPeerStreamsViewsArr] = useState([]);

  let revPeerMessagesArr = revGetPeerMessagesArr(revActivePeerIdsArr);
  const [revMessages, setRevMessages] = useState(revPeerMessagesArr);

  const {revInitChatMessagesListingArea, revAddChatMessage} = useChatMessages();

  revSetOnAddLocalStream((revPeerStream = {}) => {
    setRevLocalVideoStream(revPeerStream);
  });

  revSetOnAddRemoteStream((revPeerRemoteStream = {}) => {
    const {revPeerId, revStream} = revPeerRemoteStream;

    if (!revMainPeerStream && revStream) {
      setRevMainPeerStream(revPeerRemoteStream);
    }
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
    revEndVideoCall(revActiveVideoPeerIdsArr, () => {
      const revOnViewChangeCallBack = revUpdatedView => {
        SET_REV_SITE_BODY(revUpdatedView);
      };

      revInitChatMessagesListingArea({
        revMessagesArr: revGetPeerMessagesArr([revActivePeerIdsArr[0]]),
        revOnViewChangeCallBack,
      });
    });
  };

  let revEndCall = (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        {alignItems: 'center', marginRight: 22, marginLeft: 'auto'},
      ]}>
      <TouchableOpacity
        onPress={handleRevCloseAllVidCallsPressed}
        style={styles.revEndCallBtnWrapper}>
        <Text style={styles.revEndCallBtn}>
          <FontAwesome
            name="power-off"
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtLarge,
            ]}
          />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {}}
        style={[styles.revEndCallBtnWrapper, {backgroundColor: '#333'}]}>
        <Text style={styles.revPauseCallBtn}>
          <AntDesign
            name="pause"
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtLarge,
            ]}
          />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleRevCloseAllVidCallsPressed}
        style={[styles.revEndCallBtnWrapper, {backgroundColor: '#333'}]}>
        <Text style={styles.revPauseCallBtn}>
          <MaterialCommunityIcons
            name="volume-mute"
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtLarge,
            ]}
          />
        </Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    let revNewVideoParticipantViewsArr = [];

    let revPeerIdsArr = Object.keys(revRemoteVideoStreamsObj);

    for (let i = 0; i < revPeerIdsArr.length; i++) {
      let revPeerId = revPeerIdsArr[i];
      let revStream = revRemoteVideoStreamsObj[revPeerId];

      revNewVideoParticipantViewsArr.push(
        <TouchableOpacity
          key={revPeerId}
          onPress={() => {
            setRevMainPeerStream({revPeerId, revStream});
          }}
          style={[
            styles.revRTCVideoContainer,
            {width: 45, height: 65, marginRight: 2},
          ]}>
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={revStream && new MediaStream(revStream).toURL()}
            zOrder={1}
            style={styles.revRTCVideo}
          />
        </TouchableOpacity>,
      );
    }

    setRevPeerStreamsViewsArr(revNewVideoParticipantViewsArr);
  }, [revRemoteVideoStreamsObj]);

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
            marginBottom: 5,
            borderRadius: revBorderRadius,
          },
        ]}>
        <View
          style={[
            revSiteStyles.revFlex_1_Container,
            {
              backgroundColor: '#444',
              width: '100%',
              height: '100%',
              position: 'absolute',
              overflow: 'hidden',
              borderRadius: revBorderRadius,
            },
          ]}>
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={
              revMainPeerStream &&
              revMainPeerStream.revStream &&
              new MediaStream(revMainPeerStream.revStream).toURL()
            }
            zOrder={0}
            style={styles.revRTCVideo}
          />
        </View>

        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revRTCVideoContainerPos,
            {
              alignItems: 'center',
              width: '100%',
              height: 75,
              bottom: 8,
              left: 8,
              borderRadius: revBorderRadius,
              overflow: 'hidden',
            },
          ]}>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              {flex: 1, alignItems: 'center'},
            ]}>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                {width: 'auto', marginRight: 8},
              ]}>
              {revPeerStreamsViewsArr}
            </View>

            <TouchableOpacity
              onPress={handleRevCloseAllVidCallsPressed}
              style={[styles.revEndCallBtnWrapper, {backgroundColor: '#333'}]}>
              <Text style={styles.revPauseCallBtn}>
                <Feather
                  name="user-plus"
                  style={[
                    revSiteStyles.revSiteTxtColorWhite,
                    revSiteStyles.revSiteTxtLarge,
                  ]}
                />
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              revSiteStyles.revFlexWrapper_WidthAuto,
              {flex: 0, alignItems: 'center'},
            ]}>
            {revEndCall}
          </View>
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
              setRevMainPeerStream(revLocalVideoStream);
            }}
            style={[styles.revRTCVideoContainer]}>
            <RTCView
              mirror={true}
              objectFit={'cover'}
              streamURL={
                revLocalVideoStream &&
                revLocalVideoStream.revStream &&
                revLocalVideoStream.revStream.toURL()
              }
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
            {revActivePeerIdsArr &&
              revActivePeerIdsArr.map(revCurr => (
                <View key={revCurr} style={styles.revUserIconTabFooter}>
                  <FontAwesome
                    name="user"
                    style={[
                      revSiteStyles.revSiteTxtColor,
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
    marginRight: 5,
    borderRadius: 100,
    opacity: 0.5,
  },
  revEndCallBtn: {
    backgroundColor: '#ba000d',
    width: 'auto',
    padding: 15,
    borderRadius: 100,
  },
  revPauseCallBtn: {
    backgroundColor: '#F7F7F7',
    width: 'auto',
    padding: 8,
    borderRadius: 100,
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

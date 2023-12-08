import React, {useState, useContext, useRef, useEffect} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {REV_ENTITY_STRUCT} from '../../../../rev_libs_pers/rev_db_struct_models/revEntity';
import {REV_METADATA_FILLER} from '../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../../../rev_contexts/RevWebRTCContext';
import {RevRemoteSocketContext} from '../../../../../rev_contexts/RevRemoteSocketContext';

import {useChatMessages} from '../rev_listing_views/ChatMessages';
import {RevSubmitChatTab} from './RevSubmitChatTab';
import {useRevChatMessagesHelperFunctions} from '../../rev_func_libs/rev_chat_messages_helper_functions';

import {revGetMetadataValue} from '../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import DeviceInfo from 'react-native-device-info';

import {revPostServerData} from '../../../../rev_libs_pers/rev_server/rev_pers_lib_create';

import {revOnDisplayNotification} from '../../../../../rev_function_libs/rev_live_noticias_functions';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../rev_function_libs/rev_gen_helper_functions';
import {
  revSplitStringToArray,
  revTruncateFullNamesString,
} from '../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';
import {RevPurchaseReceipt} from '../../../rev_plugin_check_out/rev_views/rev_object_views/RevPurchaseReceipt';

export function ChatMessageInputComposer({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();
  const deviceModel = DeviceInfo.getModel();

  const revChatMessageTxtLatest = useRef('');
  const revTextInputRef = useRef(null);

  const [revRandLoggedInEntities, setRevRandLoggedInEntities] = useState([]);
  const [revActivePeerTabsArea, setRevActivePeerTabsArea] = useState(null);
  const [revRandLoggedInUserTabs, setRevRandLoggedInUserTabs] = useState(null);
  const [revActivePeerEntitiesArr, setRevActivePeerEntitiesArr] = useState([]);
  const revActivePeerEntitiesArrRef = useRef([]);

  const [revActivePeerTab, setRevActivePeerTab] = useState(null);
  const [isRevShowComposer, setIsRevShowComposer] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const [typingTimer, setTypingTimer] = useState(null);
  const [hasSentTypingMessage, setHasSentTypingMessage] = useState(false);

  const {REV_LOGGED_IN_ENTITY_GUID, REV_LOGGED_IN_ENTITY} =
    useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {revInitPeerConn, sendMessage, revRecconnectPeer} =
    useContext(RevWebRTCContext);

  const revPrevConnectionsArrref = useRef([]);

  const {revInitChatMessagesListingArea, revAddChatMessage} = useChatMessages();

  const revMessagesArrRef = useRef([]);
  const revActivePeerMessagesArrRef = useRef([]);

  const sendTypingMessage = () => {
    if (revIsEmptyJSONObject(revActivePeerEntitiesArr)) {
      return;
    }

    if (!hasSentTypingMessage) {
      //   sendMessage(revActivePeerEntity._revRemoteGUID, {
      //     revMsg: 'User is typing...',
      //     revSender: REV_LOGGED_IN_ENTITY._revRemoteGUID,
      //   });
    }
  };

  const handleTypingStart = () => {
    if (!hasSentTypingMessage) {
      setHasSentTypingMessage(true);
      setIsTyping(true);
    }
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    const newTypingTimer = setTimeout(() => {
      sendTypingMessage();
      setTypingTimer(null);
    }, 3000);
    setTypingTimer(newTypingTimer);
  };

  const handleTypingStop = () => {
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    setHasSentTypingMessage(false);
    setIsTyping(false);
  };

  const handleTextInputChange = newText => {
    revChatMessageTxtLatest.current = newText;
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    if (!hasSentTypingMessage) {
      handleTypingStart();
    }
    const newTypingTimer = setTimeout(() => {
      sendTypingMessage();
      setTypingTimer(null);
      setHasSentTypingMessage(false);
      setIsTyping(false);
    }, 3000);
    setTypingTimer(newTypingTimer);
  };

  const revChatUserTab = revNewActivePeer => {
    const {_revRemoteGUID = -1} = revNewActivePeer;

    const revAddChatPeer = () => {
      let revCurrPeers = revActivePeerEntitiesArrRef.current;

      let revNewPeers = revCurrPeers.find(
        revCurr => revCurr._revRemoteGUID == _revRemoteGUID,
      );

      if (revIsEmptyJSONObject(revNewPeers)) {
        setRevActivePeerEntitiesArr([...revCurrPeers, revNewActivePeer]);
      } else {
        if (revCurrPeers.length == 1) {
          return;
        }

        setRevActivePeerEntitiesArr(revPrev => {
          return revCurrPeers.filter(
            revCurr => revCurr._revRemoteGUID !== _revRemoteGUID,
          );
        });
      }
    };

    return (
      <TouchableOpacity key={_revRemoteGUID} onPress={revAddChatPeer}>
        <View style={styles.revChatMsgUserIcon}>
          <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  const revSetNullPeersMessage = revNullMsg => {
    if (!revNullMsg) {
      revNullMsg = 'Error retrieving Peers ! Please try again later . . .';
    }

    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(
      <Text
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtTiny,
          {paddingHorizontal: 12, paddingVertical: 22},
        ]}>
        {revNullMsg}
      </Text>,
    );
  };

  const revFetchNewPeers = () => {
    let revURL = REV_ROOT_URL + '/rev_api/rev_get_rand_logged_in_guids';

    revPostServerData(
      revURL,
      {
        revLoggedInRemoteGUID: REV_LOGGED_IN_ENTITY._revRemoteGUID,
        filter: revPrevConnectionsArrref.current,
      },
      revRetPersData => {
        if ('revError' in revRetPersData) {
          revSetNullPeersMessage(
            'Network error ! Please check your internet configuration, then try again . . .',
          );
          setRevRandLoggedInEntities([]);
        } else if (revRetPersData) {
          const {filter = []} = revRetPersData;

          if (!filter.length) {
            revSetNullPeersMessage();
            return;
          }

          let revNewActivePeerEntitiesArr = [];
          let revNewActivePeerEntity = null;

          for (let i = 0; i < filter.length; i++) {
            const {revRemoteAddress, revRemotePort, revEntity} = filter[i];

            if (revIsEmptyJSONObject(revEntity)) {
              continue;
            }

            const {_revRemoteGUID = -1} = revEntity;

            if (_revRemoteGUID < 1) {
              continue;
            }

            if (_revRemoteGUID !== REV_LOGGED_IN_ENTITY._revRemoteGUID) {
              revNewActivePeerEntitiesArr.push(revEntity);
            } else {
              continue;
            }

            if (!revPrevConnectionsArrref.current.includes(_revRemoteGUID)) {
              // revPrevConnectionsArrref.current.push(_revRemoteGUID);
            }

            if (revNewActivePeerEntity == null) {
              revNewActivePeerEntity = revEntity;
            }
          }

          if (!revIsEmptyJSONObject(revNewActivePeerEntity)) {
            const {_revRemoteGUID = -1} = revNewActivePeerEntity;

            if (_revRemoteGUID > 0) {
              setRevActivePeerEntitiesArr([revNewActivePeerEntity]);
            }
          }

          if (!revNewActivePeerEntitiesArr.length) {
            return revSetNullPeersMessage();
          }

          setRevRandLoggedInEntities(revNewActivePeerEntitiesArr);
        }
      },
    );
  };

  const revHandleNextStrangerChat = isRevShowComposer => {
    if (isRevShowComposer) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(revChatInputArea());
    } else {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }

    revFetchNewPeers();

    setRevNextChatTab(<RevChatSubmitOptions />);
  };

  const RevCurrChatTargetTab = ({revEntity}) => {
    if (!revEntity) {
      return null;
    }

    const {_revInfoEntity = {}} = revEntity;

    if (revIsEmptyJSONObject(_revInfoEntity)) {
      return null;
    }

    const {_revMetadataList = []} = _revInfoEntity;

    let revFullNames = revGetMetadataValue(_revMetadataList, 'rev_entity_name');
    revFullNames = revTruncateFullNamesString(revFullNames, {
      revMaxLen: 2,
      revFirstPartLen: 1,
      revSecondPartLen: 1,
    });

    return (
      <TouchableOpacity
        style={[
          revSiteStyles.revFlexContainer,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        {revChatUserTab(revEntity)}
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny_X,
              revSiteStyles.revSiteTxtBold,
            ]}>
            {revFullNames}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  let revNextUserIcon = (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        styles.revRecipientNextWrapperTouchable,
      ]}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny_X,
        ]}>
        NExT
      </Text>
      <AntDesign
        name="adduser"
        style={[
          revSiteStyles.revSiteTxtLarge,
          revSiteStyles.revSiteTxtColor,
          styles.recipientNextUserIcon,
        ]}
      />
    </View>
  );

  const RevHeaderNextStrangerTab = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          revHandleNextStrangerChat(isRevShowComposer);
        }}>
        {revNextUserIcon}
      </TouchableOpacity>
    );
  };

  const revChatSettingsTab = () => {
    return (
      <View style={[styles.revChatSettingsTabWrapper]}>
        <TouchableOpacity style={revSiteStyles.revFlexWrapper}>
          <FontAwesome
            name="gear"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
          />
          <FontAwesome
            name="arrow-right"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const revInitActivePeerChatArea = async () => {
    for (let i = 0; i < revActivePeerEntitiesArr.length; i++) {
      const {_revRemoteGUID = -1} = revActivePeerEntitiesArr[i];

      await revInitPeerConn({
        revEntity: revActivePeerEntitiesArr[i],
        revOnConnSuccess: () => {
          console.log('>>> CONN - SUCCESS ! ! !');
        },
        revOnConnFail: revStatus => {
          console.log('>>> FAIL', revStatus);

          revRecconnectPeer(_revRemoteGUID);
        },
        revOnMessageSent: revMessage => {},
        revOnMessageReceived: revData => {
          revMessagesArrRef.current = [...revMessagesArrRef.current, revData];
          revAddChatMessage(revData);
        },
      });
    }

    /** START list messages */
    const revOnViewChangeCallBack = revUpdatedView => {
      SET_REV_SITE_BODY(revUpdatedView);
    };

    revInitChatMessagesListingArea({
      revMessagesArr: revActivePeerMessagesArrRef.current,
      revOnViewChangeCallBack,
      revPeerEntitiesArr: revActivePeerEntitiesArr,
    });

    let revCurrChatTargetTabsArr = revActivePeerEntitiesArr.map(
      (revCurr, revIndex) => (
        <RevCurrChatTargetTab key={revIndex} revEntity={revCurr} />
      ),
    );

    setRevActivePeerTabsArea(revCurrChatTargetTabsArr);
  };

  const RevChatHeaderArea = () => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revChatHeaderAreaWrapper]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper_WidthAuto,
            styles.revChatHeaderAreaLeftView,
          ]}>
          {revActivePeerTab}
        </View>
        <View style={styles.revChatHeaderAreaCenterView}>
          <ScrollView
            contentContainerStyle={
              styles.revChatHeaderAreaScrollView
            }></ScrollView>
        </View>
        <View style={[styles.revChatHeaderAreaRightView]}>
          <View style={[revSiteStyles.revFlexWrapper, {alignItems: 'center'}]}>
            {revActivePeerTabsArea}

            <TouchableOpacity
              onPress={() => {
                setRevActivePeerEntitiesArr([
                  revActivePeerEntitiesArrRef.current[0],
                ]);
              }}
              style={{
                alignSelf: 'flex-start',
                paddingHorizontal: 10,
                paddingVertical: 8,
              }}>
              <AntDesign
                name="sync"
                style={[
                  revSiteStyles.revSiteTxtMedium,
                  revSiteStyles.revSiteTxtColor,
                ]}
              />
            </TouchableOpacity>
            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                {alignItems: 'center', marginLeft: 'auto'},
              ]}>
              {revChatSettingsTab()}
              {revRandLoggedInUserTabs}
              <RevHeaderNextStrangerTab />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const revChatInputArea = () => {
    let revCurrActivePeerEntitiesArr = revActivePeerEntitiesArrRef.current;

    if (
      !revCurrActivePeerEntitiesArr ||
      revIsEmptyJSONObject(revCurrActivePeerEntitiesArr[0])
    ) {
      return;
    }

    const {_revInfoEntity = {_revMetadataList: []}} =
      revCurrActivePeerEntitiesArr[0];

    let revFullNames = revGetMetadataValue(
      _revInfoEntity._revMetadataList,
      'rev_entity_name',
    );

    let revPromptTxt = `Chat away with ${revTruncateFullNamesString(
      revFullNames,
      {revMaxLen: 22},
    )}`;

    if (revCurrActivePeerEntitiesArr.length > 1) {
      revPromptTxt = `${revPromptTxt} + ${
        revCurrActivePeerEntitiesArr.length - 1
      } others`;
    }

    revPromptTxt = revPromptTxt + ' !';

    let revRetView = (
      <View
        style={[revSiteStyles.revFlexContainer, styles.revChatInputContainer]}>
        <RevChatHeaderArea
          revActivePeerEntitiesArr={revCurrActivePeerEntitiesArr}
          revActivePeerTabsArea={revActivePeerTabsArea}
        />
        <TextInput
          ref={revTextInputRef}
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtTiny,
            styles.revChatInputArea,
          ]}
          placeholder={revPromptTxt}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={5}
          onChangeText={newText => {
            revChatMessageTxtLatest.current = newText;
            // handleTextInputChange();
          }}
          onBlur={handleTypingStop}
          defaultValue={revChatMessageTxtLatest.current}
        />
      </View>
    );

    return revRetView;
  };

  const revInitMsgData = () => {
    let revMsgGUID = revMessagesArrRef.current.length + 1;

    let revPersEntity = REV_ENTITY_STRUCT();
    revPersEntity._revType = 'rev_object';
    revPersEntity._revSubType = 'rev_im_msg';
    revPersEntity._revGUID = revMsgGUID;
    revPersEntity._revRemoteGUID = revMsgGUID;
    revPersEntity._revOwnerGUID = REV_LOGGED_IN_ENTITY._revRemoteGUID;

    /** START REV INFO */
    let revPersEntityInfo = REV_ENTITY_STRUCT();

    revPersEntityInfo._revChildableStatus = 3;
    revPersEntityInfo._revType = 'revObject';
    revPersEntityInfo._revSubType = 'rev_entity_info';
    revPersEntityInfo._revChildableStatus = 3;
    revPersEntityInfo._revTimeCreated = new Date().getTime();
    /** END REV INFO */

    revPersEntityInfo._revMetadataList = [
      REV_METADATA_FILLER('rev_entity_desc', revChatMessageTxtLatest.current),
      REV_METADATA_FILLER(
        'rev_entity_desc_html',
        revChatMessageTxtLatest.current,
      ),
    ];

    /** REV START ATTACH INFO */
    revPersEntity._revInfoEntity = revPersEntityInfo;
    /** REV END ATTACH INFO */

    let revMsgData = {
      _revPublisherEntity: REV_LOGGED_IN_ENTITY,
      revPeersArr: [...revActivePeerEntitiesArrRef.current],
      revType: 'revText',
      revMsg: revPersEntity,
      revSelectedPicsFiles: 0,
      revSelectedVideoFiles: 0,
    };

    return revMsgData;
  };

  const handleRevSendChatMsg = async () => {
    let revCurrPeersArr = revActivePeerEntitiesArrRef.current;

    let revMsgData = revInitMsgData();
    const {revMsg} = revMsgData;

    for (let i = 0; i < revCurrPeersArr.length; i++) {
      let revActivePeerEntity = revCurrPeersArr[i];

      let revRemoteTargetEntityGUID = revActivePeerEntity._revRemoteGUID;

      sendMessage(revRemoteTargetEntityGUID, {
        revMsg: revMsgData,
      });

      let revBody = revGetMetadataValue(
        revMsg._revInfoEntity._revMetadataList,
        'rev_entity_desc',
      );

      await revOnDisplayNotification({revBody});
    }

    revAddChatMessage(revMsgData);
    revMessagesArrRef.current.push(revMsgData);

    revChatMessageTxtLatest.current = '';
    revTextInputRef.current.clear();
  };

  const revSubmitChatOptionsMenuArea = () => {
    return (
      <TouchableOpacity onPress={handleRevSendChatMsg}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revSubmitChatTabWrapper,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              styles.revSubmitChatTab,
            ]}>
            Send
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const revHandleHideComposingForm = revComposingStatus => {
    setIsRevShowComposer(!revComposingStatus);
  };

  let RevChatSubmitOptions = () => {
    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revFooterSubmitOptionsLeftWrapper,
        ]}>
        {isRevShowComposer ? (
          revSubmitChatOptionsMenuArea()
        ) : (
          <TouchableOpacity
            onPress={() => {
              revHandleNextStrangerChat(true);
              setIsRevShowComposer(true);
            }}>
            <View
              style={[
                revSiteStyles.revSiteTxtBold,
                styles.revCancelComposeChatMsg,
              ]}>
              <FontAwesome
                name="quote-left"
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtMedium,
                ]}></FontAwesome>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={async () => {
            revWebRTCSendFile(2);
          }}>
          <View
            style={[
              revSiteStyles.revSiteTxtBold,
              styles.revCancelComposeChatMsg,
            ]}>
            <FontAwesome
              name="image"
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            revHandleHideComposingForm(isRevShowComposer);
          }}>
          <View
            style={[
              revSiteStyles.revSiteTxtBold,
              styles.revCancelComposeChatMsg,
            ]}>
            <FontAwesome
              name={isRevShowComposer ? 'times' : 'expand'}
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (!revRandLoggedInEntities || !Array.isArray(revRandLoggedInEntities)) {
      return revSetNullPeersMessage();
    }

    let revRandLoggedInUserTabsArr = [];

    for (let i = 0; i < revRandLoggedInEntities.length; i++) {
      let revRandLoggedInEntity = revRandLoggedInEntities[i];
      revRandLoggedInUserTabsArr.push(revChatUserTab(revRandLoggedInEntity));
    }

    setRevRandLoggedInUserTabs(
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revChatUserIconTabsWrapper,
        ]}>
        {revRandLoggedInUserTabsArr}
      </View>,
    );
  }, [revRandLoggedInEntities]);

  useEffect(() => {
    if (!revActivePeerEntitiesArr.length) {
      return;
    }

    revActivePeerEntitiesArrRef.current = revActivePeerEntitiesArr;

    revActivePeerMessagesArrRef.current = revMessagesArrRef.current.filter(
      revCurr => {
        const {revPeersArr = []} = revCurr;

        let revMessagesPeerGUIDsArr = revPeersArr
          .map(revCurr => revCurr._revRemoteGUID)
          .sort();

        let revActivePeerGUIDsArr = revActivePeerEntitiesArr
          .map(revCurr => revCurr._revRemoteGUID)
          .sort();

        return (
          JSON.stringify(revMessagesPeerGUIDsArr) ==
          JSON.stringify(revActivePeerGUIDsArr)
        );
      },
    );

    revInitActivePeerChatArea();
  }, [revActivePeerEntitiesArr]);

  useEffect(() => {
    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(revChatInputArea());
  }, [revActivePeerTabsArea]);

  useEffect(() => {
    if (isRevShowComposer) {
      setRevNextChatTab(<RevChatSubmitOptions />);
    } else {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
      setRevNextChatTab(<RevNextStrangerChatTabArea />);
    }
  }, [revRandLoggedInUserTabs, isRevShowComposer]);

  const RevNextStrangerChatTabArea = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsRevShowComposer(true);
          revHandleNextStrangerChat(true);
        }}>
        {revNextUserIcon}
      </TouchableOpacity>
    );
  };

  const [RevNextChatTab, setRevNextChatTab] = useState(
    <RevNextStrangerChatTabArea />,
  );

  return RevNextChatTab;
}

const styles = StyleSheet.create({
  revChatHeaderAreaWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  revChatHeaderAreaLeftView: {
    alignItems: 'center',
  },
  revChatHeaderAreaCenterView: {
    flex: 1,
    alignItems: 'center',
    height: 20,
  },
  revChatHeaderAreaRightView: {
    alignItems: 'flex-end',
  },
  revChatHeaderAreaScrollView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
  },
  revChatUserIconTabsWrapper: {
    marginRight: 4,
  },

  /** */
  revChatMsgUserIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    borderStyle: 'solid',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 4,
    marginRight: 2,
  },
  revChatCommentNonIcon: {
    color: '#c5e1a5',
    fontSize: 15,
  },
  revChatSettingsTabWrapper: {
    width: 'auto',
    paddingTop: 5,
    paddingHorizontal: 8,
  },
  /** */

  revSubmitChatTabWrapper: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginRight: 5,
  },

  revSubmitChatTab: {
    backgroundColor: '#444',
    paddingHorizontal: 17,
    paddingVertical: 3,
    marginTop: 2,
    borderRadius: 8,
  },

  revChatInputContainer: {
    marginTop: 4,
    marginHorizontal: 4,
  },
  revChatInputArea: {
    textAlignVertical: 'top',
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
    borderColor: '#F7F7F7',
    borderWidth: 1,
  },
  revRecipientNextWrapperTouchable: {
    alignItems: 'flex-end',
    paddingBottom: 2,
    paddingHorizontal: 12,
  },
  revRecipientNextWrapper: {
    alignItems: 'flex-end',
    marginLeft: 4,
  },
  recipientNextUserIconWrapper: {
    backgroundColor: '#FFF',
  },
  recipientNextUserIcon: {
    marginLeft: 1,
  },
  revRecipientNextpointerIcon: {
    textAlign: 'center',
    marginTop: 5,
  },

  /** */

  revChatFooterWrapper: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  revFooterSubmitOptionsLeftWrapper: {
    alignItems: 'center',
  },
  revCancelComposeChatMsg: {
    marginTop: 2,
    paddingHorizontal: 8,
  },
  rightFooterSubmitOptionsWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginRight: 14,
    marginLeft: 'auto',
  },
});

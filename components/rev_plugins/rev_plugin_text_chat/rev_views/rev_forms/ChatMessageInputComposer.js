import React, {useState, useContext, useRef, useEffect} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

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
  revArraysEqual,
  revIsEmptyJSONObject,
} from '../../../../../rev_function_libs/rev_gen_helper_functions';
import {revSplitStringToArray} from '../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export function ChatMessageInputComposer({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();
  const deviceModel = DeviceInfo.getModel();

  const revChatMessageTxtLatest = useRef('');
  const revTextInputRef = useRef(null);

  const [revRandLoggedInEntities, setRevRandLoggedInEntities] = useState([]);
  const [revRandLoggedInUserTabs, setRevRandLoggedInUserTabs] = useState(null);
  const [revActivePeerEntity, setRevActivePeerEntity] = useState(null);
  const [revActivePeerTab, setRevActivePeerTab] = useState(null);
  const [isRevShowComposer, setIsRevShowComposer] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const [typingTimer, setTypingTimer] = useState(null);
  const [hasSentTypingMessage, setHasSentTypingMessage] = useState(false);

  const [revTargetGUID, setRevTargetGUID] = useState(
    REV_LOGGED_IN_ENTITY_GUID == 6 ? 1 : 6,
  );

  const {REV_LOGGED_IN_ENTITY_GUID, REV_LOGGED_IN_ENTITY} =
    useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {sendMessage} = useContext(RevWebRTCContext);

  const {revInitChatMessagesListingArea, revAddChatMessage} = useChatMessages();

  const sendTypingMessage = () => {
    if (revIsEmptyJSONObject(revActivePeerEntity)) {
      return;
    }

    if (!hasSentTypingMessage) {
      sendMessage(revActivePeerEntity._revRemoteGUID, {
        revMsg: 'User is typing...',
        revSender: REV_LOGGED_IN_ENTITY._revRemoteGUID,
      });
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
    let revNewActivePeerGUID = revNewActivePeer._revRemoteGUID;

    return (
      <TouchableOpacity
        key={revNewActivePeerGUID}
        onPress={() => {
          setRevActivePeerEntity(revNewActivePeer);
        }}>
        <View style={styles.revChatMsgUserIcon}>
          <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  const revUserIcons = Array.from({length: 3}, (_, i) => revChatUserTab(i));

  const revHandleNextStrangerChat = isRevShowComposer => {
    if (isRevShowComposer) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(revChatInputArea());
    } else {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }

    const revOnViewChangeCallBack = revUpdatedView => {
      SET_REV_SITE_BODY(revUpdatedView);

      let revURL = REV_ROOT_URL + '/rev_api/rev_get_rand_logged_in_guids';

      revPostServerData(
        revURL,
        {
          revLoggedInRemoteEntityGUID: REV_LOGGED_IN_ENTITY._revRemoteGUID,
          filter: [],
        },
        revRetPersData => {
          if ('revError' in revRetPersData) {
            setRevRandLoggedInEntities([]);
          } else if (revRetPersData && 'filter' in revRetPersData) {
            let revRetLoggedInEntitiesDataFilter = revRetPersData.filter;

            setRevRandLoggedInEntities(prevState => {
              let revNewActivePeerEntitiesArr = [];

              for (
                let i = 0;
                i < revRetLoggedInEntitiesDataFilter.length;
                i++
              ) {
                const {revRemoteAddress, revRemotePort, revEntity} =
                  revRetLoggedInEntitiesDataFilter[i];
                if (
                  revEntity &&
                  revEntity._revRemoteGUID ==
                    REV_LOGGED_IN_ENTITY._revRemoteGUID
                ) {
                  revNewActivePeerEntitiesArr.push(revEntity);
                }
              }

              let revNewActivePeerEntity = revNewActivePeerEntitiesArr[0];
              setRevActivePeerEntity(revNewActivePeerEntity);
              setRevActivePeerTab(revCurrChatTargetTab(revNewActivePeerEntity));

              return revNewActivePeerEntitiesArr;
            });
          }
        },
      );
    };

    revInitChatMessagesListingArea({
      revOnViewChangeCallBack,
      revTargetGUID: REV_LOGGED_IN_ENTITY_GUID,
      revSubjectGUID: revTargetGUID,
    });

    setRevNextChatTab(<RevChatSubmitOptions />);
  };

  const revCurrChatTargetTab = revEntity => {
    if (!revEntity) {
      return null;
    }

    if (!('_revInfoEntity' in revEntity)) {
      return null;
    }

    let revInfoEntity = revEntity._revInfoEntity;

    if (!('_revMetadataList' in revInfoEntity)) {
      return null;
    }

    let revFullNames = revGetMetadataValue(
      revInfoEntity._revMetadataList,
      'rev_full_names',
    );

    return (
      <TouchableOpacity
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revCurrChatTargetTabWrapper,
        ]}>
        {revChatUserTab(revEntity)}
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
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
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revChatHeaderAreaRightWrapper,
            ]}>
            {revChatSettingsTab()}
            {revRandLoggedInUserTabs}
            <RevHeaderNextStrangerTab />
          </View>
        </View>
      </View>
    );
  };

  const revChatInputArea = () => {
    let revFullNames = '';

    if (revActivePeerEntity) {
      let revInfoEntity = revActivePeerEntity._revInfoEntity;
      revFullNames = revGetMetadataValue(
        revInfoEntity._revMetadataList,
        'rev_full_names',
      );
    }

    let revRetView = (
      <View
        style={[revSiteStyles.revFlexContainer, styles.revChatInputContainer]}>
        <RevChatHeaderArea />
        <TextInput
          ref={revTextInputRef}
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtTiny,
            styles.revChatInputArea,
          ]}
          placeholder={` Chat away with ${
            revSplitStringToArray(revFullNames)[0]
          } !`}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={5}
          onChangeText={newText => {
            revChatMessageTxtLatest.current = newText;
            handleTextInputChange();
          }}
          onBlur={handleTypingStop}
          defaultValue={revChatMessageTxtLatest.current}
        />
      </View>
    );

    return revRetView;
  };

  const revSubmitChatOptionsMenuArea = revCallBackFunc => {
    let revTargetEntityGUID = REV_LOGGED_IN_ENTITY_GUID == 6 ? 1 : 6;

    return (
      <RevSubmitChatTab
        revGetCurrentChatTarget={() => {
          return revTargetEntityGUID; // revChatEntityVarArgsLatest.current;
        }}
        revGetChatTextImput={() => revChatMessageTxtLatest.current}
        revCallback={revRetData => {
          let revRemoteTargetEntityGUID = revActivePeerEntity._revRemoteGUID;

          sendMessage(revRemoteTargetEntityGUID, {
            revMsg: revChatMessageTxtLatest.current,
          });
          revOnDisplayNotification();

          revCallBackFunc(revRetData);

          revChatMessageTxtLatest.current = '';
          revTextInputRef.current.clear();
        }}
      />
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
          revSubmitChatOptionsMenuArea(revRetData => {
            if (
              !revIsEmptyJSONObject(revRetData) &&
              'revEntity' in revRetData
            ) {
              revAddChatMessage(revRetData.revEntity);
            }
          })
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
      return;
    }

    let revRandLoggedInUserTabsArea = [];

    for (let i = 0; i < revRandLoggedInEntities.length; i++) {
      let revRandLoggedInEntity = revRandLoggedInEntities[i];
      revRandLoggedInUserTabsArea.push(revChatUserTab(revRandLoggedInEntity));
    }

    setRevRandLoggedInUserTabs(
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revChatUserIconTabsWrapper,
        ]}>
        {revRandLoggedInUserTabsArea.map(revView => revView)}
      </View>,
    );

    setRevActivePeerTab(revCurrChatTargetTab(revActivePeerEntity));
  }, [revRandLoggedInEntities, revActivePeerEntity]);

  useEffect(() => {
    if (isRevShowComposer) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(revChatInputArea());
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
  revChatHeaderAreaRightWrapper: {
    alignItems: 'center',
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

  revCurrChatTargetTabWrapper: {
    alignItems: 'baseline',
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

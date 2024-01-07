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
import Feather from 'react-native-vector-icons/Feather';

import DocumentPicker, {isInProgress} from 'react-native-document-picker';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../../../rev_contexts/RevWebRTCContext';
import {RevRemoteSocketContext} from '../../../../../rev_contexts/RevRemoteSocketContext';

import {useChatMessages} from '../rev_listing_views/ChatMessages';

import {revGetMetadataValue} from '../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {
  revCurrDelayedTime,
  revReadFileAsBinaryString,
} from '../../../../../rev_function_libs/rev_gen_helper_functions';

import DeviceInfo from 'react-native-device-info';

import {revPostServerData} from '../../../../rev_libs_pers/rev_server/rev_pers_lib_create';
import {useRevInitPersFile} from '../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_create/revPersLibCreateCustomHooks';

import {revOnDisplayNotification} from '../../../../../rev_function_libs/rev_live_noticias_functions';

import {revIsEmptyJSONObject} from '../../../../../rev_function_libs/rev_gen_helper_functions';
import {revTruncateFullNamesString} from '../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';
import {RevPurchaseReceipt} from '../../../rev_plugin_check_out/rev_views/rev_object_views/RevPurchaseReceipt';

export function RevChatMessageInputComposer({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  const {_revContainerGUID = -1} = revVarArgs;

  const revChatMessageTxtLatest = useRef('');
  const revTextInputRef = useRef(null);
  const revSelectedMediaRef = useRef([]);

  const [revRandLoggedInEntities, setRevRandLoggedInEntities] = useState([]);
  const [revActivePeerTabsArea, setRevActivePeerTabsArea] = useState(null);
  const [revRandLoggedInUserTabs, setRevRandLoggedInUserTabs] = useState(null);

  const [revActivePeerEntitiesArr, setRevActivePeerEntitiesArr] = useState([]);
  const revActivePeerEntitiesArrRef = useRef([]);
  const revActivePeerIdsArrRef = useRef([]);

  const [revActivePeerTab, setRevActivePeerTab] = useState(null);
  const [isRevShowComposer, setIsRevShowComposer] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const [typingTimer, setTypingTimer] = useState(null);
  const [hasSentTypingMessage, setHasSentTypingMessage] = useState(false);

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {
    revActivePeerIdsArr,
    revInitPeerConn,
    revSendWebRTCMessage,
    revRecconnectPeer,
    revPushPeerMessages,
    revGetPeerMessagesArr,
  } = useContext(RevWebRTCContext);

  const revPrevConnectionsArrref = useRef(revActivePeerIdsArr);

  const {revInitChatMessagesListingArea, revAddChatMessage} = useChatMessages();

  const {revInitPersFile, revInitPersFilesArr} = useRevInitPersFile();

  const revActivePeerMessagesArrRef = useRef(
    revGetPeerMessagesArr(revActivePeerIdsArr),
  );

  const sendTypingMessage = () => {
    if (revIsEmptyJSONObject(revActivePeerEntitiesArr)) {
      return;
    }

    if (!hasSentTypingMessage) {
      //   revSendWebRTCMessage(revActivePeerEntity._revRemoteGUID, {
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
        filter: [], // revPrevConnectionsArrref.current,
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
    revActivePeerMessagesArrRef.current =
      revGetPeerMessagesArr(revActivePeerIdsArr);

    if (isRevShowComposer) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(revChatInputArea());
    } else {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }

    if (!revActivePeerMessagesArrRef.current.length) {
      revFetchNewPeers();
    } else {
      revInitActivePeerChatArea();
    }

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

  const revChatExitTab = () => {
    return (
      <View style={[styles.revChatSettingsTabWrapper]}>
        <TouchableOpacity style={revSiteStyles.revFlexWrapper}>
          <Feather
            name="power"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtMedium,
            ]}
          />
        </TouchableOpacity>
      </View>
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
      const {_revRemoteGUID: revPeerId = -1} = revActivePeerEntitiesArr[i];

      await revInitPeerConn({
        revEntity: revActivePeerEntitiesArr[i],
        revOnConnSuccess: () => {
          console.log('>>> CONN - SUCCESS ! ! !');
        },
        revOnConnFail: revStatus => {
          console.log('>>> FAIL', revStatus);

          revRecconnectPeer(revPeerId);
        },
        revOnMessageSent: revMessage => {
          const {revType} = revMessage;

          console.log('>>> revType', revType);

          switch (revType) {
            case 'revFile':
              break;

            default:
              break;
          }
        },
        revOnMessageReceived: revData => {
          revPushPeerMessages(revData, revActivePeerIdsArrRef.current);
          revAddChatMessage(revData);
        },
      });
    }

    /** START list messages */
    const revOnViewChangeCallBack = revUpdatedView => {
      SET_REV_SITE_BODY(revUpdatedView);
    };

    revInitChatMessagesListingArea({
      revMessagesArr: revGetPeerMessagesArr(revActivePeerIdsArrRef.current),
      revOnViewChangeCallBack,
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
              {revChatExitTab()}
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

  const revInitMsgData = async ({
    revSelectedPicsFiles = [],
    revSelectedVideoFiles = [],
  }) => {
    let revDelayedTime = await revCurrDelayedTime();

    let revMsgGUID = REV_LOGGED_IN_ENTITY._revRemoteGUID + '' + revDelayedTime;
    revMsgGUID = Number(revMsgGUID);

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
    revPersEntityInfo._revTimeCreated = revDelayedTime;
    /** END REV INFO */

    revPersEntityInfo._revMetadataList = [
      REV_METADATA_FILLER('rev_entity_desc', revChatMessageTxtLatest.current),
      REV_METADATA_FILLER(
        'rev_entity_desc_html',
        revChatMessageTxtLatest.current,
      ),
    ];

    /** REV START ATTACH INFO */
    revPersEntity['_revInfoEntity'] = revPersEntityInfo;
    /** REV END ATTACH INFO */
    let revData = {
      revType: 'revText',
      revMsg: revPersEntity,
      revMsgGUID,
      _revContainerGUID: _revContainerGUID,
    };

    let revMsgData = {
      revData,
      _revPublisherEntity: REV_LOGGED_IN_ENTITY,
      revPeersArr: [...revActivePeerEntitiesArrRef.current],
      revSelectedPicsFiles: revSelectedPicsFiles.length,
      revSelectedVideoFiles: revSelectedVideoFiles.length,
    };

    return revMsgData;
  };

  const handleRevSendChatMsg = async () => {
    let revCurrPeersArr = revActivePeerEntitiesArrRef.current;

    let revSelectedPicsFiles = [];
    let revSelectedVideoFiles = [];

    let revMsgData = await revInitMsgData({
      revSelectedPicsFiles,
      revSelectedVideoFiles,
    });

    const {revMsg} = revMsgData.revData;
    const {_revRemoteGUID: revMsgGUID} = revMsg;

    let revPeerIdsArr = [];

    for (let i = 0; i < revCurrPeersArr.length; i++) {
      let revActivePeerEntity = revCurrPeersArr[i];

      let revRemoteTargetEntityGUID = revActivePeerEntity._revRemoteGUID;
      revPeerIdsArr.push(revRemoteTargetEntityGUID);

      await revSendWebRTCMessage(revRemoteTargetEntityGUID, {
        revMsg: revMsgData,
      });

      let revBody = revGetMetadataValue(
        revMsg._revInfoEntity._revMetadataList,
        'rev_entity_desc',
      );

      await revOnDisplayNotification({revBody});
    }

    revAddChatMessage(revMsgData);
    revPushPeerMessages(revMsgData, revPeerIdsArr);

    revChatMessageTxtLatest.current = '';
    revTextInputRef.current.clear();

    /** Send Files */
    let revSelectedFilesArr = revSelectedMediaRef.current;

    for (let i = 0; i < revCurrPeersArr.length; i++) {
      let revActivePeerEntity = revCurrPeersArr[i];
      let revRemoteTargetEntityGUID = revActivePeerEntity._revRemoteGUID;

      for (let j = 0; j < revSelectedFilesArr.length; j++) {
        let revSelectedFile = revSelectedFilesArr[j];
        const {revFileAbsolutePath} = revSelectedFile;

        try {
          let revArrayBuffer = await revReadFileAsBinaryString(
            revFileAbsolutePath,
            'base64',
          );

          let revData = {
            revType: 'revFile',
            revMsgGUID: revSelectedFile._revRemoteGUID,
            _revContainerGUID: revMsgGUID,
            revMsg: {
              _revContainerGUID: revMsgGUID,
              ...revSelectedFile,
              revArrayBuffer,
              revIsStringArr: true,
            },
          };

          let revMsgData = {
            revData,
            _revPublisherEntity: REV_LOGGED_IN_ENTITY,
            revPeersArr: [...revActivePeerEntitiesArrRef.current],
          };

          await revSendWebRTCMessage(revRemoteTargetEntityGUID, {
            revMsg: revMsgData,
          });

          revAddChatMessage(revMsgData);
        } catch (error) {
          console.log('>>> ERROR - revSelectedFilesArr', error);
        }
      }
    }

    revSelectedMediaRef.current = [];
  };

  const revSubmitChatOptionsMenuArea = () => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await handleRevSendChatMsg();
        }}>
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

  const revHandleError = err => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const revHandleOnMediaSelectTab = async () => {
    try {
      let revResponseArr = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });

      if (!Array.isArray(revResponseArr)) {
        return;
      }

      let revPersFilesArr = await revInitPersFilesArr(revResponseArr);
      revSelectedMediaRef.current = [
        ...revSelectedMediaRef.current,
        ...revPersFilesArr,
      ];
    } catch (err) {
      revHandleError(err);
    }
  };

  let RevChatSubmitOptions = () => {
    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
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

        <TouchableOpacity onPress={revHandleOnMediaSelectTab}>
          <Feather
            name="upload"
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtMedium,
              styles.revSitePublisherUpload,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome
            name="flag-o"
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              styles.revSitePublisherUpload,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleRevSitePublisherCancelTab();
          }}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtTiny_X,
              revSiteStyles.revSiteTxtBold,
              styles.revSitePublisherCancelTab,
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />{' '}
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            revHandleHideComposingForm(isRevShowComposer);
          }}>
          <View
            style={[
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              styles.revCancelComposeChatMsg,
            ]}>
            <AntDesign
              name={isRevShowComposer ? 'close' : 'arrowsalt'}
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtMedium,
              ]}></AntDesign>
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

    revActivePeerIdsArrRef.current = revActivePeerEntitiesArr.map(
      revCurr => revCurr._revRemoteGUID,
    );

    revActivePeerMessagesArrRef.current = revGetPeerMessagesArr(
      revActivePeerIdsArrRef.current,
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
  revSitePublisherUpload: {
    paddingHorizontal: 8,
  },
  revSitePublisherCancelTab: {
    paddingHorizontal: 5,
  },
});

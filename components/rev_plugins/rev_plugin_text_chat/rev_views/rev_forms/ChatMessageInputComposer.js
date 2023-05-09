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

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export function ChatMessageInputComposer({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  const revChatMessageTxtLatest = useRef('');
  const revTextInputRef = useRef(null);

  const [revRandLoggedInEntities, setRevRandLoggedInEntities] = useState([]);
  const [revRandLoggedInUserTabs, setRevRandLoggedInUserTabs] = useState(null);
  const [revActivePeerEntity, setRevActivePeerEntity] = useState(null);
  const [revActivePeerTab, setRevActivePeerTab] = useState(null);
  const [isRevShowComposer, setIsRevShowComposer] = useState(false);

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

  const revChatUserTab = revNewActivePeer => {
    let revNewActivePeerGUID = revNewActivePeer._remoteRevEntityGUID;

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
          revLoggedInRemoteEntityGUID:
            REV_LOGGED_IN_ENTITY._remoteRevEntityGUID,
          filter: [],
        },
        revRetPersData => {
          if ('revError' in revRetPersData) {
            setRevRandLoggedInEntities([]);
          } else if ('filter' in revRetPersData) {
            let revRetLoggedInEntitiesDataFilter = revRetPersData.filter;

            setRevRandLoggedInEntities(revRetLoggedInEntitiesDataFilter);

            let revNewActivePeerEntity = revRetLoggedInEntitiesDataFilter[0];

            setRevActivePeerEntity(revNewActivePeerEntity);
            setRevActivePeerTab(revCurrChatTargetTab(revNewActivePeerEntity));
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

    let revInfoEntity = revEntity._revInfoEntity;
    let revFullNames = revGetMetadataValue(
      revInfoEntity._revEntityMetadataList,
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

  const RevHeaderNextStrangerTab = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          revHandleNextStrangerChat(isRevShowComposer);
        }}
        style={styles.recipientNextWrapperTouchable}>
        <View style={styles.recipientNextWrapper}>
          <Text style={styles.recipientNextTxt}>NExT</Text>
          <View style={styles.recipientNextUserIconWrapper}>
            <FontAwesome name="user" style={styles.recipientNextUserIcon} />
          </View>
          <FontAwesome
            name="arrow-right"
            style={styles.recipientNextpointerIcon}
          />
        </View>
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
      <View style={styles.revChatHeaderAreaWrapper}>
        <View style={styles.revChatHeaderAreaLeftView}>{revActivePeerTab}</View>
        <View style={styles.revChatHeaderAreaCenterView}>
          <ScrollView
            contentContainerStyle={
              styles.revChatHeaderAreaScrollView
            }></ScrollView>
        </View>
        <View style={[styles.revChatHeaderAreaRightView]}>
          <View style={styles.revChatHeaderAreaRightWrapper}>
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
        revInfoEntity._revEntityMetadataList,
        'rev_full_names',
      );
    }

    let revRetView = (
      <View
        style={[revSiteStyles.revFlexContainer, styles.revChatInputContainer]}>
        <RevChatHeaderArea />
        <TextInput
          ref={revTextInputRef}
          style={styles.revChatInputArea}
          placeholder={` Chat away with ${revFullNames} !`}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={5}
          onChangeText={newText => {
            revChatMessageTxtLatest.current = newText;
          }}
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
          revChatMessageTxtLatest.current = '';
          revTextInputRef.current.clear();

          let revRemoteTargetEntityGUID =
            revActivePeerEntity._remoteRevEntityGUID;

          sendMessage(revRemoteTargetEntityGUID, {revMsg: 'HELLO WORLD ! ! !'});
          revOnDisplayNotification();

          revCallBackFunc(revRetData);
        }}
      />
    );
  };

  const revHandleHideComposingForm = revComposingStatus => {
    setIsRevShowComposer(!revComposingStatus);
  };

  let RevChatSubmitOptions = () => {
    return (
      <View style={styles.footerSubmitOptionsLeftWrapper}>
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
            <View style={[styles.cancelComposeChatMsg]}>
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
          <View style={[styles.cancelComposeChatMsg]}>
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
          <View style={[styles.cancelComposeChatMsg]}>
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
        }}
        style={styles.recipientNextWrapperTouchable}>
        <View style={styles.recipientNextWrapper}>
          <Text style={styles.recipientNextTxt}>NExT</Text>
          <View style={styles.recipientNextUserIconWrapper}>
            <FontAwesome name="user" style={styles.recipientNextUserIcon} />
          </View>
          <FontAwesome
            name="arrow-right"
            style={styles.recipientNextpointerIcon}
          />
        </View>
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
    flexDirection: 'row',
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
    flexDirection: 'row',
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
    color: '#444',
    fontSize: 11,
    textAlignVertical: 'top',
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
    borderColor: '#F7F7F7',
    borderWidth: 1,
  },
  recipientNextWrapperTouchable: {
    display: 'flex',
    marginRight: 22,
    // marginLeft: 'auto',
  },
  recipientNextWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  recipientNextTxt: {
    color: '#757575',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 7,
  },
  recipientNextUserIconWrapper: {
    backgroundColor: '#FFF',
  },
  recipientNextUserIcon: {
    color: '#757575',
    fontSize: 22,
    textAlign: 'center',
    marginLeft: 1,
  },
  recipientNextpointerIcon: {
    color: '#757575',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },

  /** */

  chatFooterWrapper: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  footerSubmitOptionsLeftWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelComposeChatMsg: {
    fontWeight: 'bold',
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

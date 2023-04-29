import React, {useRef, useState, useEffect, useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';

import RevNullMessagesView from '../../../../rev_views/RevNullMessagesView';
import InboxMessage from './rev_entity_views/InboxMessage';
import OutboxChatMessage from './rev_entity_views/OutboxChatMessage';
import {useRevChatMessagesHelperFunctions} from '../../rev_func_libs/rev_chat_messages_helper_functions';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';
import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

export function useChatMessages() {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_SITE_BODY} = useContext(ReViewsContext);

  const {revGetLocalChatMessages} = useRevChatMessagesHelperFunctions();

  const [revMessagesArr, setRevMessagesArr] = useState([]);

  const revDisplayCallBackRef = useRef(null);

  const [revCurrTargetGUID, setRevCurrTargetGUID] = useState(-1);
  const [revCurrSubjectGUID, setRevCurrSubjectGUID] = useState(-1);

  const revMessagesArrLatestRef = useRef(null);

  const revFlatListRef = useRef(null);

  const {revSetChatMessage} = useRevChatMessagesHelperFunctions();

  let pageSize = 10;

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const revGetMessagesArr = () => revMessagesArr;

  const revRenderItem = ({item}) => {
    let chatMsg = item;

    let revCurrMsgId = chatMsg._revEntityGUID;

    let revView = null;

    if (chatMsg.revMessageType.localeCompare('inbox') === 0) {
      revView = <InboxMessage key={revCurrMsgId} revVarArgs={chatMsg} />;
    } else {
      revView = <OutboxChatMessage key={revCurrMsgId} revVarArgs={chatMsg} />;
    }

    let revPastChatConversationsArr = (
      <View
        key={chatMsg._revEntityGUID + '_revRenderItem_' + revGetRandInteger()}>
        {revView}
      </View>
    );

    return revPastChatConversationsArr;
  };

  const revScrollEndReached = () => {
    console.log('>>> revScrollEndReached <<<');
  };

  const revInitChatFlatList = (revFlatListData, revFlatListRef) => {
    let revRetView = (
      <FlatList
        ref={revFlatListRef}
        inverted={true}
        data={revFlatListData}
        renderItem={revRenderItem}
        keyExtractor={item => item._revEntityGUID}
        onLayout={() => {
          // revFlatListRef.current.scrollToEnd({animated: true});
        }}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        onEndReached={revScrollEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={pageSize}
        maxToRenderPerBatch={pageSize}
        style={styles.chatMsgsVScroller}></FlatList>
    );

    return revRetView;
  };

  const revChatMessagesListingView = revListingView => {
    if (!revMessagesArr) {
      return null;
    }

    return (
      <View style={styles.chatMessagesContainer}>
        <RevNullMessagesView />
        <View style={[revSiteStyles.revFlexContainer, styles.userInfoWrapper]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            About me hello!
          </Text>

          {revChatMessagesCountView(revMessagesArrLatestRef.current)}
        </View>

        {revListingView}
      </View>
    );
  };

  const revAddChatMessage = revChatMessage => {
    revChatMessage = revSetChatMessage(revChatMessage);

    if (revIsEmptyJSONObject(revChatMessage._revPublisherEntity)) {
      revChatMessage['_revPublisherEntity'] = revPersGetRevEnty_By_EntityGUID(
        revChatMessage._revEntityOwnerGUID,
      );
    }

    setRevMessagesArr(prevState => {
      let revLatestData = [...prevState, revChatMessage];
      return revLatestData;
    });
  };

  let revChatMessagesCountView = revTotChatMessagesCount => {
    if (!revTotChatMessagesCount) {
      return null;
    }

    let revMessagesArrCountTxt = revTotChatMessagesCount
      ? '+' + revTotChatMessagesCount + ' chat mEssaGes'
      : 'No chats yet';

    return (
      <Text
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtTiny,
          styles.revChatMessagesCounterTxt,
        ]}>
        {revMessagesArrCountTxt}
      </Text>
    );
  };

  const revInitChatMessagesListingArea = ({
    revOnViewChangeCallBack,
    revTargetGUID,
    revSubjectGUID,
  }) => {
    setRevMessagesArr([]);

    revDisplayCallBackRef.current = revOnViewChangeCallBack;

    setRevCurrTargetGUID(-1);
    setRevCurrSubjectGUID(-1);

    setTimeout(() => {
      setRevCurrTargetGUID(revTargetGUID);
      setRevCurrSubjectGUID(revSubjectGUID);
    }, 0);
  };

  useEffect(() => {
    if (revCurrTargetGUID < 1 || revCurrSubjectGUID < 1) {
      return;
    }

    let revPastMessagesArr = revGetLocalChatMessages(
      revCurrTargetGUID,
      revCurrSubjectGUID,
    );

    setRevMessagesArr(revPastMessagesArr);
  }, [revCurrTargetGUID, revCurrSubjectGUID]);

  useEffect(() => {
    if (revCurrTargetGUID < 1 || revCurrSubjectGUID < 1) {
      return;
    }

    revMessagesArrLatestRef.current = revMessagesArr.length;

    revFlatListRef.current = revInitChatFlatList(
      revMessagesArr,
      revFlatListRef,
    );

    if (revDisplayCallBackRef.current) {
      let revListingView = revChatMessagesListingView(revFlatListRef.current);
      revDisplayCallBackRef.current(revListingView);
    }
  }, [revMessagesArr]);

  return {
    revAddChatMessage,
    revSetChatMessage,
    revGetMessagesArr,
    revInitChatMessagesListingArea,
  };
}

const styles = StyleSheet.create({
  chatMsgsVScroller: {
    width: '100%',
    marginTop: 4,
    marginBottom: 50,
  },
  userInfoWrapper: {
    backgroundColor: '#fffde7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 5,
  },
  revChatMessagesCounterTxt: {
    marginTop: 5,
  },
  chatMessagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 3,
  },
});

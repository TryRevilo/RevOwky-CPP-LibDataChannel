import React, {useRef, useState, useEffect, useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';

import RevNullMessagesView from '../../../../rev_views/RevNullMessagesView';
import InboxMessage from './rev_entity_views/InboxMessage';
import OutboxChatMessage from './rev_entity_views/OutboxChatMessage';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revGenLoreumIpsumText,
  revRemoveLineBreaks,
  revTruncateString,
} from '../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export function useChatMessages() {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  let revLoggedInRemoteGUID = REV_LOGGED_IN_ENTITY._revRemoteGUID;

  const [revMessagesArr, setRevMessagesArr] = useState([]);

  const revDisplayCallBackRef = useRef(null);

  const [revCurrSubjectGUID, setRevCurrSubjectGUID] = useState(-1);

  const revMessagesArrLatestRef = useRef(null);

  const revFlatListRef = useRef(null);

  let pageSize = 10;

  const revGetMessagesArr = () => revMessagesArr;

  const revRenderItem = ({item}) => {
    let chatMsg = item;

    if (revIsEmptyJSONObject(chatMsg)) {
      return null;
    }

    const {revMsg = {}} = chatMsg;
    const {_revGUID = -1, _revOwnerGUID = -1} = revMsg;

    let revKey = _revGUID > 0 ? _revGUID : revGetRandInteger();

    let revView = null;

    if (revLoggedInRemoteGUID == _revOwnerGUID) {
      revView = <OutboxChatMessage key={revKey} revVarArgs={chatMsg} />;
    } else {
      revView = <InboxMessage key={revKey} revVarArgs={chatMsg} />;
    }

    let revPastChatConversationsArr = (
      <View key={_revGUID + '_revRenderItem_' + revGetRandInteger()}>
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
        keyExtractor={item => {
          let _revGUID = item.revMsg._revGUID;
          return _revGUID > 0 ? _revGUID : revGetRandInteger();
        }}
        onLayout={() => {
          // revFlatListRef.current.scrollToEnd({animated: true});
        }}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        onEndReached={revScrollEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={pageSize}
        maxToRenderPerBatch={pageSize}
        style={styles.revChatMsgsVScroller}></FlatList>
    );

    return revRetView;
  };

  const revChatMessagesListingView = revListingView => {
    if (!revMessagesArr) {
      return null;
    }

    let revUseBriefrInfoTxt = revRemoveLineBreaks(
      revGenLoreumIpsumText({revMaxWordsPerSentence: 8}),
    );
    revUseBriefrInfoTxt = revTruncateString(revUseBriefrInfoTxt, 35);

    return (
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revChatMessagesContainer,
        ]}>
        <RevNullMessagesView />
        <View
          style={[revSiteStyles.revFlexContainer, styles.revUserInfoWrapper]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            {revUseBriefrInfoTxt}
          </Text>

          {revChatMessagesCountView(revMessagesArrLatestRef.current)}
        </View>

        {revListingView}
      </View>
    );
  };

  const revAddChatMessage = revChatMessage => {
    setRevMessagesArr([...revMessagesArr, revChatMessage]);
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
    revMessagesArr: _revMessagesArr,
    revOnViewChangeCallBack,
    revSubjectGUID,
  }) => {
    setRevMessagesArr(_revMessagesArr);

    revDisplayCallBackRef.current = revOnViewChangeCallBack;

    setRevCurrSubjectGUID(-1);

    setTimeout(() => {
      setRevCurrSubjectGUID(revSubjectGUID);
    }, 0);
  };

  useEffect(() => {
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
    revGetMessagesArr,
    revInitChatMessagesListingArea,
  };
}

const styles = StyleSheet.create({
  revChatMsgsVScroller: {
    width: '100%',
    marginTop: 4,
    marginBottom: 50,
  },
  revUserInfoWrapper: {
    backgroundColor: '#fffde7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 4,
    borderRadius: 5,
  },
  revChatMessagesCounterTxt: {
    marginTop: 5,
  },
  revChatMessagesContainer: {
    marginTop: 3,
    marginBottom: 3,
  },
});

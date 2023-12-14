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
  const revMessagesArrRef = useRef([]);

  const revDisplayCallBackRef = useRef(null);

  const revPeerEntitiesArrRef = useRef([]);

  const revMessagesArrLatestRef = useRef(null);

  const revFlatListRef = useRef(null);

  let pageSize = 10;

  const revGetMessagesArr = () => revMessagesArr;

  const revDataSetterCallBacksArrRef = useRef({});
  const revChildFilesRef = useRef({});

  const revGetChildFilesArr = revGUID => {
    if (revChildFilesRef.current.hasOwnProperty(revGUID)) {
      return revChildFilesRef.current[revGUID];
    }

    return [];
  };

  const revRenderItem = ({item: revChatMessage}) => {
    if (revIsEmptyJSONObject(revChatMessage)) {
      return null;
    }

    const {_revPublisherEntity, revPeersArr, revData} = revChatMessage;
    const {_revRemoteGUID = -1} = _revPublisherEntity;
    const {revMsgGUID} = revData;

    let revChildFilesArr = revGetChildFilesArr(revMsgGUID);

    let revView = null;

    if (revLoggedInRemoteGUID == _revRemoteGUID) {
      revView = (
        <OutboxChatMessage
          key={revMsgGUID}
          revVarArgs={{...revChatMessage, revChildFilesArr}}
          revGetChildFilesArr={revGetChildFilesArr}
        />
      );
    } else {
      revView = (
        <InboxMessage
          key={revMsgGUID}
          revVarArgs={{...revChatMessage, revChildFilesArr}}
          revGetChildFilesArr={revGetChildFilesArr}
        />
      );
    }

    return revView;
  };

  const revScrollEndReached = () => {
    console.log('>>> revScrollEndReached <<<');
  };

  const revInitChatFlatList = (revFlatListData, revFlatListRef) => {
    let revRetView = (
      <FlatList
        ref={revFlatListRef}
        inverted={false}
        data={revFlatListData}
        renderItem={revRenderItem}
        keyExtractor={item => {
          const {revData = {revMsgGUID: -1}} = item;

          let revMsgGUID = revData.revMsgGUID;
          return revMsgGUID + '_' + revGetRandInteger();
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
    const {_revPublisherEntity, revPeersArr, revData} = revChatMessage;
    const {revMsgGUID, _revContainerGUID, revType, revMsg = {}} = revData;

    if (
      revType !== 'revFile' &&
      !revDataSetterCallBacksArrRef.current.hasOwnProperty(revMsgGUID)
    ) {
      const revDataSetter = revDataSetterCallBack => {
        revDataSetterCallBacksArrRef.current[revMsgGUID] =
          revDataSetterCallBack;
      };

      revChatMessage = {...revChatMessage, revDataSetter};
    }

    if (revType == 'revFile') {
      if (!revChildFilesRef.current.hasOwnProperty(_revContainerGUID)) {
        revChildFilesRef.current[_revContainerGUID] = [];
      }

      revChildFilesRef.current[_revContainerGUID].push(revChatMessage);

      if (
        revDataSetterCallBacksArrRef.current.hasOwnProperty(_revContainerGUID)
      ) {
        let revDataSetterCallBack =
          revDataSetterCallBacksArrRef.current[_revContainerGUID];

        if (revDataSetterCallBack) {
          revDataSetterCallBack();
        }
      }

      return;
    }

    setRevMessagesArr([...revMessagesArrRef.current, revChatMessage]);
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
    revPeerEntitiesArr,
  }) => {
    revDisplayCallBackRef.current = revOnViewChangeCallBack;
    revPeerEntitiesArrRef.current = revPeerEntitiesArr;
    setRevMessagesArr([..._revMessagesArr]);
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

    revMessagesArrRef.current = revMessagesArr;
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
    marginBottom: 42,
  },
});

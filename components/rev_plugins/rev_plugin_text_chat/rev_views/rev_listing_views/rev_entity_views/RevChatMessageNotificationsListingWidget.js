import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {RevChatMessageNotificationsListingItem} from './RevChatMessageNotificationsListingItem';
import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revArrIncludesElement} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibRead_React} = NativeModules;

import {
  useRevPersGetALLRevEntity_By_SubType_RevVarArgs,
  useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevChatMessageNotificationsListingWidget = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revPastChatMessagesData, setRevPastChatMessagesData] = useState(null);

  const {REV_SITE_ENTITY_GUID, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const {revPersGetALLRevEntity_By_SubType_RevVarArgs} =
    useRevPersGetALLRevEntity_By_SubType_RevVarArgs();

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const {revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE} =
    useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE();

  useEffect(() => {
    new Promise((res, rej) => {
      let revChatMessagesArr = revPastChatConversations();

      res(revChatMessagesArr);
    }).then(result => {
      setRevPastChatMessagesData(result);
    });
  }, []);

  let revPastChatConversations = () => {
    let revPassVarArgs = {
      revDistinct: 1,
      revSelect: ['_revEntityGUID', '_revOwnerEntityGUID'],
      revWhere: {
        _revEntityType: 'rev_object',
        _revEntitySubType: 'rev_message',
        _revEntityResolveStatus: [0, -1, -101],
        _revEntitySiteGUID: [5, 10],
      },
      revLimit: 22,
    };

    let revVarArgsEntitiesArr = revPersGetALLRevEntity_By_SubType_RevVarArgs(
      JSON.stringify(revPassVarArgs),
    );

    let revMsgsArr = [];
    let revAddedMsgsGUIDsArr = [];

    for (let i = 0; i < revVarArgsEntitiesArr.length; i++) {
      let revCurrMsg = revVarArgsEntitiesArr[i];

      let revMsgEntityOwnerGUID = revCurrMsg._revPublisherEntity._revEntityGUID;

      if (revArrIncludesElement(revAddedMsgsGUIDsArr, revMsgEntityOwnerGUID)) {
        continue;
      } else {
        revAddedMsgsGUIDsArr.push(revMsgEntityOwnerGUID);
      }

      revCurrMsg['revMessageType'] =
        revMsgEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID ? 'outbox' : 'inbox';

      revMsgsArr.push(revCurrMsg);
    }

    return revMsgsArr;
  };

  function renderItem({item}) {
    return <RevChatMessageNotificationsListingItem revVarArgs={item} />;
  }

  let RevDisplay = () => {
    return revPastChatMessagesData.length ? (
      <FlatList
        data={revPastChatMessagesData}
        renderItem={renderItem}
        keyExtractor={item => {
          return (
            'RevDisplay_' + revGetRandInteger() + '_' + item._revEntityGUID
          );
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    ) : (
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revFlexWrapper,
        ]}>
        You do not have any chat conversations yet
      </Text>
    );
  };

  return (
    <View>
      <RevPageContentHeader />

      {revPastChatMessagesData && <RevDisplay />}
    </View>
  );
};

const styles = StyleSheet.create({
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 38,
  },
});

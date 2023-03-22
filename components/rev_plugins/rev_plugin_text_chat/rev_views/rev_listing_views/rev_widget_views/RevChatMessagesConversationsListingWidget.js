import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import InboxMessage from '../rev_entity_views/InboxMessage';
import OutboxChatMessage from '../rev_entity_views/OutboxChatMessage';

const {RevPersLibRead_React} = NativeModules;

import {useRevPersGetALLRevEntity_By_SubType_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

export const RevChatMessagesConversationsListingWidget = ({revVarArgs}) => {
  [revPastChatMessagesData, setRevPastChatMessagesData] = useState(null);

  const {REV_SITE_ENTITY_GUID, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const {revPersGetALLRevEntity_By_SubType_RevVarArgs} =
    useRevPersGetALLRevEntity_By_SubType_RevVarArgs();

  let RevPastChatConversations = () => {
    let revPassVarArgs = {
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

    return revVarArgsEntitiesArr;
  };

  function renderItem({item}) {
    let revCurrMsg = item;

    let revMsgEntityOwnerGUID = revCurrMsg._revPublisherEntity._revEntityGUID;

    let revMessageView =
      revMsgEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID ? (
        <OutboxChatMessage revVarArgs={revCurrMsg} />
      ) : (
        <InboxMessage revVarArgs={revCurrMsg} />
      );

    return (
      <View key={'RevRetView_' + revGetRandInteger()}>{revMessageView}</View>
    );
  }

  const RevDisplay = () => {
    let revEntitiesArr = RevPastChatConversations();

    return revEntitiesArr.length > 0 ? (
      <FlatList
        inverted={false}
        initialScrollIndex={revEntitiesArr.length - 1}
        data={revEntitiesArr}
        renderItem={renderItem}
        keyExtractor={item => {
          let revEntityGUID = revGetLocal_OR_RemoteGUID(item);
          return (
            'RevDisplay_' + revEntityGUID.toString() + '_' + revGetRandInteger()
          );
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={styles.revSitePostsListingContainer}
      />
    ) : (
      <Text style={styles.revNullNoticias}>
        You do not have any chat conversations yet !
      </Text>
    );
  };

  return (
    <View>
      <RevPageContentHeader />
      <RevDisplay />
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
  revNullNoticias: {
    color: '#90a4ae',
    fontSize: 10,
    alignSelf: 'flex-start',
  },
});

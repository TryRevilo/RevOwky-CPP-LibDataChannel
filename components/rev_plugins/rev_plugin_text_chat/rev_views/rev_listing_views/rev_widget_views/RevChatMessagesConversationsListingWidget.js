import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {RevChatMessageNotificationsListingItem} from '../rev_entity_views/RevChatMessageNotificationsListingItem';
import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revArrIncludesElement} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import InboxMessage from '../rev_entity_views/InboxMessage';
import OutboxChatMessage from '../rev_entity_views/OutboxChatMessage';

const {RevPersLibRead_React} = NativeModules;

import {
  useRevPersGetALLRevEntity_By_SubType_RevVarArgs,
  useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

export const RevChatMessagesConversationsListingWidget = ({revVarArgs}) => {
  [revPastChatMessagesData, setRevPastChatMessagesData] = useState(null);

  const {REV_SITE_ENTITY_GUID, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const {revPersGetALLRevEntity_By_SubType_RevVarArgs} =
    useRevPersGetALLRevEntity_By_SubType_RevVarArgs();

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const {revPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE} =
    useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE();

  let RevPastChatConversations = () => {
    console.log('>>> REV_SITE_ENTITY_GUID ' + REV_SITE_ENTITY_GUID);

    let revPassVarArgs = {
      revSelect: ['_revEntityGUID', '_revOwnerEntityGUID'],
      revWhere: {
        _revEntityType: 'rev_object',
        _revEntitySubType: 'rev_message',
        _revEntityResolveStatus: [0, -1, -101],
        _revEntitySiteGUID: [5, REV_SITE_ENTITY_GUID],
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

      let RevMessageView =
        revMsgEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID ? (
          <OutboxChatMessage revVarArgs={revCurrMsg} />
        ) : (
          <InboxMessage revVarArgs={revCurrMsg} />
        );

      revMsgsArr.push(RevMessageView);
    }

    let RevRetView = null;

    if (revMsgsArr.length) {
      RevRetView = revMsgsArr.map(revView => {
        return <View key={'RevRetView_' + revGetRandInteger()}>{revView}</View>;
      });
    }

    return RevRetView;
  };

  return (
    <View>
      <RevPageContentHeader />

      <RevPastChatConversations />
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

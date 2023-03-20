import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {RevChatMessageNotificationsListingItem} from '../rev_entity_views/RevChatMessageNotificationsListingItem';
import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

const {RevPersLibRead_React} = NativeModules;

import {
  useRevPersGetALLRevEntity_By_SubType_RevVarArgs,
  useRevPersGet_ALL_UNIQUE_GUIDs_By_FieldName_SiteGUID_SubTYPE,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

export const RevChatMessageNotificationsListingWidget = () => {
  [revPastChatMessagesData, setRevPastChatMessagesData] = useState(null);

  const {REV_SITE_ENTITY_GUID, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const {revPersGetALLRevEntity_By_SubType_RevVarArgs} =
    useRevPersGetALLRevEntity_By_SubType_RevVarArgs();

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
    console.log('>>> REV_SITE_ENTITY_GUID ' + REV_SITE_ENTITY_GUID);

    let revPassVarArgs = {
      revSelect: [
        '_revEntityType',
        '_revEntitySubType',
        '_revEntityGUID',
        '_revOwnerEntityGUID',
        '_revContainerEntityGUID',
        '_revEntitySiteGUID',
        '_revEntityAccessPermission',
        '_revTimeCreated',
      ],
      revWhere: {
        _revEntityType: 'rev_object',
        _revEntitySubType: 'rev_message',
        _revEntityResolveStatus: [0, -1, -101],
        _revEntitySiteGUID: REV_SITE_ENTITY_GUID,
      },
      revLimit: 22,
    };

    let revVarArgsEntitiesArr = revPersGetALLRevEntity_By_SubType_RevVarArgs(
      JSON.stringify(revPassVarArgs),
    );

    for (let i = 0; i < revVarArgsEntitiesArr.length; i++) {
      let revCurrMsg = revVarArgsEntitiesArr[i];
      let revMsgEntityOwnerGUID = revCurrMsg._revEntityOwnerGUID;

      revCurrMsg['revMessageType'] =
        revMsgEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID ? 'outbox' : 'inbox';
    }

    return revVarArgsEntitiesArr;
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
          return 'RevDisplay_' + item._revEntityGUID;
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    ) : (
      <Text style={styles.revNullNoticias}>
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
  revNullNoticias: {
    color: '#90a4ae',
    fontSize: 10,
    alignSelf: 'flex-start',
  },
});

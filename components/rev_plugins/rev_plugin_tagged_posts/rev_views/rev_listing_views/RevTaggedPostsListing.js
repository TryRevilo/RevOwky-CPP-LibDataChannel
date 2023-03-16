import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  NativeModules,
} from 'react-native';

import {revPluginsLoader} from '../../../../rev_plugins_loader';

const {RevPersLibRead_React} = NativeModules;

import RevPageContentHeader from '../../../../rev_views/RevPageContentHeader';
import {RevTaggedPostsListingItem} from './rev_entity_views/RevTaggedPostsListingItem';
import {revGetRandInteger} from '../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyJSONObject} from '../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetPublisherEntity} from '../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export const RevTaggedPostsListing = ({revVarArgs}) => {
  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revVarArgs')
  ) {
    return null;
  }

  revVarArgs = revVarArgs.revVarArgs;

  const {revSiteStyles} = useRevSiteStyles();

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revTimelineEntities') ||
    !revVarArgs.hasOwnProperty('revEntityPublishersArr')
  ) {
    return null;
  }

  let revEntitiesArr = revVarArgs.revTimelineEntities;
  let revEntityPublishersArr = revVarArgs.revEntityPublishersArr;

  let revCounter = 1;

  function renderItem({item}) {
    let revEntityGUID = revGetLocal_OR_RemoteGUID(item);

    if (revEntityGUID < 0) {
      return null;
    }

    let revEntityOwnerGUID = item._revEntityOwnerGUID;

    let revPublisherEntity = revGetPublisherEntity(
      revEntityPublishersArr,
      revEntityOwnerGUID,
    );

    if (revIsEmptyJSONObject(revPublisherEntity)) {
      let revPublisherEntityStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revEntityOwnerGUID);
      revPublisherEntity = JSON.parse(revPublisherEntityStr);

      revVarArgs.revEntityPublishersArr.push(revPublisherEntity);
    }

    item['_revPublisherEntity'] = revPublisherEntity;

    let RevAdEntityListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_ads',
      revViewName: 'RevAdEntityListingView',
      revData: item,
      revVarArgs: null,
    });

    let revPrevCounter = revCounter - 1;
    let revAddAd = revCounter % 2 == 0 && revPrevCounter % 2 !== 0;
    let RevView = revAddAd == true ? RevAdEntityListingView : null;
    revCounter = revCounter + 1;

    return (
      <View
        key={
          revEntityGUID.toString() +
          '_rev_kiwi_list_item_' +
          revGetRandInteger()
        }>
        {RevView}
        <RevTaggedPostsListingItem
          key={revEntityGUID.toString()}
          revVarArgs={item}
        />
      </View>
    );
  }

  let RevDisplay = () => {
    return revEntitiesArr.length > 0 ? (
      <FlatList
        data={revEntitiesArr}
        renderItem={renderItem}
        keyExtractor={item => {
          let revEntityGUID = revGetLocal_OR_RemoteGUID(item);
          return revEntityGUID.toString() + '_' + revGetRandInteger();
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={styles.revSitePostsListingContainer}
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
      <RevDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  revNullNoticias: {
    color: '#90a4ae',
    fontSize: 10,
    alignSelf: 'flex-start',
  },
  revSitePostsListingContainer: {
    marginTop: 5,
  },
});

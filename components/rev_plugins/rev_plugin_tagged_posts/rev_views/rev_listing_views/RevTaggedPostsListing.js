import React from 'react';
import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';

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
  const {revSiteStyles} = useRevSiteStyles();

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revVarArgs')
  ) {
    return null;
  }

  revVarArgs = revVarArgs.revVarArgs;

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revTimelineEntities') ||
    !revVarArgs.hasOwnProperty('revEntityPublishersArr')
  ) {
    return null;
  }

  let revEntitiesArr = revVarArgs.revTimelineEntities;

  let revEntityPublishersArr = revVarArgs.revEntityPublishersArr;

  let revCounter = 0;

  function revRenderItem({item}) {
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

      if (revIsEmptyJSONObject(revPublisherEntity)) {
        return null;
      }

      revVarArgs.revEntityPublishersArr.push(revPublisherEntity);
    }

    item['_revPublisherEntity'] = revPublisherEntity;

    let RevAdEntityListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_ads',
      revViewName: 'RevAdEntityListingView',
      revData: item,
      revVarArgs: null,
    });

    let revAddAd = revCounter % 2 == 0 && revCounter !== 0;
    let RevView = revAddAd == true ? RevAdEntityListingView : null;
    revCounter++;

    return (
      <View key={revEntityGUID + '_revRenderItem_' + revGetRandInteger()}>
        {RevView}
        <RevTaggedPostsListingItem revVarArgs={item} />
      </View>
    );
  }

  let revDisplayEntitiesArr = revEntitiesArr.slice(0, 5);
  revDisplayEntitiesArr = JSON.parse(JSON.stringify(revDisplayEntitiesArr));

  let RevDisplay = () => {
    return revDisplayEntitiesArr.length > 0 ? (
      <FlatList
        data={revDisplayEntitiesArr}
        renderItem={revRenderItem}
        keyExtractor={item => {
          let revEntityGUID = revGetLocal_OR_RemoteGUID(item);
          return revEntityGUID + '_rev_tagged_post_L' + revGetRandInteger();
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={styles.revSitePostsListingContainer}
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
      <RevDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  revSitePostsListingContainer: {
    marginTop: 5,
  },
});

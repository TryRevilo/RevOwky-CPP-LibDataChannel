import React from 'react';
import {StyleSheet, Text, View, FlatList, NativeModules} from 'react-native';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

const {RevPersLibRead_React} = NativeModules;

import {useRevPersGetRevEntities_By_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetPublisherEntity} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevTaggedPostsListingWidget = ({revVarArgs}) => {
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

  const {revPersGetRevEntities_By_RevVarArgs} =
    useRevPersGetRevEntities_By_RevVarArgs();

  let revPassVarArgs = {
    revSelect: [
      '_revEntityGUID',
      '_revOwnerEntityGUID',
      '_revContainerEntityGUID',
      '_revEntitySiteGUID',
      '_revEntityAccessPermission',
      '_revEntityType',
      '_revEntitySubType',
      '_revTimeCreated',
    ],
    revWhere: {
      _revEntityType: 'rev_object',
      _revEntitySubType: 'rev_ad',
    },
    revLimit: 22,
  };
  let revAdEntitiesArr = revPersGetRevEntities_By_RevVarArgs(
    JSON.stringify(revPassVarArgs),
  );

  let revAdEntitiesParsedArr = [];

  for (let i = 0; i < revAdEntitiesArr.length; i++) {
    let revAdEntity = revAdEntitiesArr[i];
    let revAdEntityGUID = revAdEntity._revEntityGUID;

    if (revAdEntityGUID < 1) {
      continue;
    }

    let revOrganizationGUID =
      RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
        'rev_organization_of',
        revAdEntity._revEntityGUID,
      );

    let revprodLineGUID =
      RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
        'rev_product_line_of',
        revAdEntity._revEntityGUID,
      );

    if (revOrganizationGUID < 1 || revprodLineGUID < 1) {
      continue;
    }

    revAdEntitiesParsedArr.push(revAdEntity);
  }

  let revEntitiesArr = revVarArgs.revTimelineEntities;
  let revEntityPublishersArr = revVarArgs.revEntityPublishersArr;

  let revCounter = 0;
  let revCurrAdItem = 0;

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
      revVarArgs: {revData: revAdEntitiesParsedArr[revCurrAdItem]},
    });

    let revAddAd = revCounter % 2 == 0;
    let RevView = revAddAd == true ? RevAdEntityListingView : null;
    revCounter++;

    if (revAddAd) {
      revCurrAdItem =
        revCurrAdItem == revAdEntitiesParsedArr.length - 1
          ? 0
          : ++revCurrAdItem;
    }

    let revTaggedPostsListingItem = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'RevTaggedPostsListingItem',
      revVarArgs: item,
    });

    return (
      <View key={revEntityGUID + '_revRenderItem_' + revGetRandInteger()}>
        {RevView}
        {revTaggedPostsListingItem}
      </View>
    );
  }

  let revDisplayEntitiesArr = revEntitiesArr.slice(0, 10);

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
    <>
      <RevPageContentHeader />
      <RevDisplay />
    </>
  );
};

const styles = StyleSheet.create({});

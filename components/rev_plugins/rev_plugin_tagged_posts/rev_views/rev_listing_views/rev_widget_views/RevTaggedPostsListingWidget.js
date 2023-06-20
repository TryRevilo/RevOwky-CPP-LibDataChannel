import React, {useRef, useState} from 'react';
import {StyleSheet, FlatList, NativeModules} from 'react-native';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

const {RevPersLibRead_React} = NativeModules;

import {useRevPersGetRevEntities_By_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetPublisherEntity} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevInfoArea} from '../../../../../rev_views/rev_page_views';

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

  let revTimelineEntitiesArr = revVarArgs.revTimelineEntities;
  let revEntityPublishersArr = revVarArgs.revEntityPublishersArr;

  const [revListingData, setRevListingData] = useState(revTimelineEntitiesArr); // Array to hold the loaded data
  const [revPage, setRevPage] = useState(1); // Current revPage number
  const [revLoading, setRevLoading] = useState(false); // Flag to indicate if data is being loaded

  const revFetchData = async () => {
    try {
      setRevLoading(true); // Set revLoading flag to true while fetching data
      const revNewData = revVarArgs.revGetData(
        revListingData[revListingData.length - 1]._revEntityGUID,
      );

      if (!revNewData.length) {
        return;
      }

      setRevListingData(revPrevListingData => [
        ...revPrevListingData,
        ...revNewData,
      ]); // Append new data to the existing data array
      setRevPage(prevrevPage => prevrevPage + 1); // Increment the revPage number
    } catch (error) {
      console.error(error);
    } finally {
      setRevLoading(false); // Set revLoading flag to false after data is fetched
    }
  };

  const {revPersGetRevEntities_By_RevVarArgs} =
    useRevPersGetRevEntities_By_RevVarArgs();

  let revAdsCount = Math.floor(5 / 2);

  let revPassVarArgs = {
    revSelect: [
      '_revEntityGUID',
      '_revEntityOwnerGUID',
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
    revLimit: revAdsCount,
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
      <>
        {RevView}
        {revTaggedPostsListingItem}
      </>
    );
  }

  let RevDisplay = () => {
    return revListingData.length > 0 ? (
      <FlatList
        data={revListingData}
        renderItem={revRenderItem}
        keyExtractor={item => {
          let revEntityGUID = revGetLocal_OR_RemoteGUID(item);
          return revEntityGUID + '_rev_tagged_post_L' + revGetRandInteger();
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        onEndReached={revFetchData} // Call the revFetchData function when the end of the list is reached
        onEndReachedThreshold={0.5} // Adjust this value based on your needs (e.g., 0.5 means triggering when 50% of the list is scrolled)
      />
    ) : (
      <RevInfoArea revInfoText={'You do not have any chat conversations yet'} />
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

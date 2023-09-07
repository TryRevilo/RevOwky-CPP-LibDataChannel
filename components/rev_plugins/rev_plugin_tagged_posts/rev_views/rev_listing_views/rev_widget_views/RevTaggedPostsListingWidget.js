import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, FlatList, NativeModules} from 'react-native';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

const {RevPersLibRead_React} = NativeModules;

import {useRevPersGetRevEntities_By_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetPublisherEntity} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevInfoArea} from '../../../../../rev_views/rev_page_views';
import RevCustomLoadingView from '../../../../../rev_views/rev_loaders/RevCustomLoadingView';

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

  const revIncrementals = 2;

  const [revListingData, setRevListingData] = useState(revTimelineEntitiesArr);
  const [revPage, setRevPage] = useState(1);
  const [revPageSize, setRevPageSize] = useState(revIncrementals);

  const revIsLoadingRef = useRef(false);

  const revAsyncFetchData = async () => {
    let revLastGUID = 0;

    if (revListingData.length) {
      revLastGUID = revListingData[revListingData.length - 1]._revEntityGUID;
    }

    let revNewData = revVarArgs.revGetData(revLastGUID);

    console.log('>>> revNewData', revNewData.length);

    if (revNewData.length) {
      setRevListingData([...revListingData, ...revNewData]); // Append new data to the existing data array
    }
  };

  const revLoadMoreData = () => {
    if (revListingData.length > revPage * revPageSize) {
      setRevPage(revPage + 1);
      setRevPageSize(revPageSize + revIncrementals);
    } else {
      revIsLoadingRef.current = false;
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

  const renderFooter = () => {
    console.log('>>> revIsLoading', revIsLoadingRef.current);

    if (!revIsLoadingRef.current) {
      return null;
    }

    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revFooterLoadingWrapper,
        ]}>
        <RevCustomLoadingView
          backgroundColor={'#FFF'}
          revLoadintText={'Loading'}
        />
      </View>
    );
  };

  const revRenderItem = ({item}) => {
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

    revIsLoadingRef.current = true;

    item['_revPublisherEntity'] = revPublisherEntity;

    let revAddAd = revCounter % 2 == 0;

    let revAdView = revAddAd ? (
      <View style={{marginTop: 12}}>
        {revPluginsLoader({
          revPluginName: 'rev_plugin_ads',
          revViewName: 'RevAdEntityListingView',
          revVarArgs: {revData: revAdEntitiesParsedArr[revCurrAdItem]},
        })}
      </View>
    ) : null;

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

    let revIsLastItem =
      revListingData[revListingData.length - 1]._revEntityGUID == revEntityGUID;

    if (revIsLastItem) {
      revIsLoadingRef.current = false;
    }

    return (
      <View>
        {revAdView}
        {revTaggedPostsListingItem}
      </View>
    );
  };

  let RevDisplay = () => {
    return revListingData.length > 0 ? (
      <FlatList
        data={revListingData.slice(0, revPage * revPageSize)}
        renderItem={revRenderItem}
        keyExtractor={item => revGetLocal_OR_RemoteGUID(item)}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        onEndReached={revLoadMoreData}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        initialNumToRender={2}
        maxToRenderPerBatch={revPageSize}
      />
    ) : (
      <RevInfoArea revInfoText={'No posts to display yet'} />
    );
  };

  useEffect(() => {
    revAsyncFetchData();
  }, []);

  return (
    <>
      <RevPageContentHeader />
      <RevDisplay />
    </>
  );
};

const styles = StyleSheet.create({
  revFooterLoadingWrapper: {
    alignItems: 'center',
    height: 55,
    overflow: 'visible',
    marginLeft: 40,
    marginTop: 12,
  },
});

import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, FlatList, NativeModules} from 'react-native';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

const {RevPersLibRead_React} = NativeModules;

import {useRevPersQuery_By_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetPublisherEntity} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevInfoArea} from '../../../../../rev_views/rev_page_views';
import RevCustomLoadingView from '../../../../../rev_views/rev_loaders/RevCustomLoadingView';
import {revGenRandString} from '../../../../../../rev_function_libs/rev_string_function_libs';

export const RevTaggedPostsListingWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revVarArgs')
  ) {
    return null;
  }

  revVarArgs = revVarArgs.revVarArgs;

  const {revGetData} = revVarArgs;

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revTimelineEntities') ||
    !revVarArgs.hasOwnProperty('revEntityPublishersArr')
  ) {
    return null;
  }

  const REV_INCREMENTALS = 10;

  let revTimelineEntitiesArr = revVarArgs.revTimelineEntities;
  revTimelineEntitiesArr = revTimelineEntitiesArr.slice(0, REV_INCREMENTALS);

  let revEntityPublishersArr = revVarArgs.revEntityPublishersArr;

  const [revListingData, setRevListingData] = useState(revTimelineEntitiesArr);
  const [revPage, setRevPage] = useState(1);
  const [revPageSize, setRevPageSize] = useState(REV_INCREMENTALS);

  const revIsLoadingRef = useRef(false);

  const [revAdEntitiesArr, setRevAdEntitiesArr] = useState([]);

  const [isRevAllLoaded, setIsRevAllLoaded] = useState(false);

  const revFetchData = () => {
    revIsLoadingRef.current = true;

    let revLastEntityGUID = 0;
    let revLastEntity = null;

    if (revListingData.length) {
      revLastEntity = revListingData[revListingData.length - 1];
    }

    if (
      !revIsEmptyJSONObject(revLastEntity) &&
      revLastEntity.hasOwnProperty('_revGUID')
    ) {
      revLastEntityGUID = revLastEntity._revGUID;
    }

    revGetData(revLastEntityGUID, REV_INCREMENTALS)
      .then(revRetData => {
        if (Array.isArray(revRetData) && revRetData.length) {
          setRevListingData(prev => {
            let revNewArr = [...prev, ...revRetData];

            if (revNewArr.length >= REV_INCREMENTALS * 2) {
              revNewArr = revNewArr.slice(
                REV_INCREMENTALS - 1,
                REV_INCREMENTALS * 2 - 1,
              );
            }

            revIsLoadingRef.current = false;
            return revNewArr;
          });
        } else {
          revIsLoadingRef.current = false;
          setIsRevAllLoaded(true);

          setRevListingData([...revListingData, null]);
        }
      })
      .catch(err => {
        console.log('>>> revLoadLocalDataView', err.message);
      });
  };

  const revLoadMoreData = () => {
    if (!isRevAllLoaded) {
      setRevPage(revPage + 1);
      setRevPageSize(revPageSize + REV_INCREMENTALS);

      revFetchData();
    } else {
      revIsLoadingRef.current = false;
    }
  };

  const {revPersQuery_W_Info_By_RevVarArgs_Async} =
    useRevPersQuery_By_RevVarArgs();

  let revAdsCount = Math.floor(5 / 2);

  const revLoadAdsArr = async () => {
    let revPassVarArgs = {
      revSelect: [
        '_revGUID',
        '_revOwnerGUID',
        '_revContainerGUID',
        '_revSiteGUID',
        '_revAccessPermission',
        '_revType',
        '_revSubType',
        '_revTimeCreated',
      ],
      revWhere: {
        _revType: 'rev_object',
        _revSubType: 'rev_ad',
      },
      revLimit: revAdsCount,
    };

    let revAdEntitiesData = await revPersQuery_W_Info_By_RevVarArgs_Async(
      revPassVarArgs,
    );

    let revAdEntitiesParsedArr = [];

    for (let i = 0; i < revAdEntitiesData.length; i++) {
      let revAdEntity = revAdEntitiesData[i];
      let revAdEntityGUID = revAdEntity._revGUID;

      if (revAdEntityGUID < 1) {
        continue;
      }

      let revOrganizationGUID =
        RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
          'rev_organization_of',
          revAdEntity._revGUID,
        );

      let revProdLineGUID =
        RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
          'rev_product_line_of',
          revAdEntity._revGUID,
        );

      if (revOrganizationGUID < 1 || revProdLineGUID < 1) {
        continue;
      }

      revAdEntitiesParsedArr.push(revAdEntity);
    }

    setRevAdEntitiesArr(revAdEntitiesParsedArr);
  };

  let revCounter = 0;
  let revCurrAdItem = 0;

  const renderFooter = () => {
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
          backgroundColor={'#FFFFFF'}
          revLoadintText={'Loading'}
        />
      </View>
    );
  };

  const revRenderItem = ({item}) => {
    if (revIsEmptyJSONObject(item)) {
      return null;
    }

    let revEntityGUID = revGetLocal_OR_RemoteGUID(item);

    if (revEntityGUID < 0) {
      return null;
    }

    let revEntityOwnerGUID = item._revOwnerGUID;

    let revPublisherEntity = revGetPublisherEntity(
      revEntityPublishersArr,
      revEntityOwnerGUID,
    );

    if (revIsEmptyJSONObject(revPublisherEntity)) {
      let revPublisherEntityStr =
        RevPersLibRead_React.revPersGetEntity_By_GUID(revEntityOwnerGUID);
      revPublisherEntity = JSON.parse(revPublisherEntityStr);

      if (revIsEmptyJSONObject(revPublisherEntity)) {
        return null;
      }

      revVarArgs.revEntityPublishersArr.push(revPublisherEntity);
    }

    revIsLoadingRef.current = true;

    item['_revPublisherEntity'] = revPublisherEntity;

    let revAddAd = revCounter % 2 == 0;

    let revAdView = null;

    if (revAdEntitiesArr.length) {
      revAdView = revAddAd ? (
        <View style={{marginTop: 12}}>
          {revPluginsLoader({
            revPluginName: 'rev_plugin_ads',
            revViewName: 'RevAdEntityListingView',
            revVarArgs: {revData: revAdEntitiesArr[revCurrAdItem]},
          })}
        </View>
      ) : null;

      revCounter++;

      if (revAddAd) {
        revCurrAdItem =
          revCurrAdItem == revAdEntitiesArr.length - 1 ? 0 : ++revCurrAdItem;
      }
    }

    let revTaggedPostsListingItem = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'RevTaggedPostsListingItem',
      revVarArgs: item,
    });

    if (!revIsEmptyJSONObject(revListingData[revListingData.length - 1])) {
      revIsLoadingRef.current =
        revListingData[revListingData.length - 1]._revGUID == revEntityGUID;
    } else {
      revIsLoadingRef.current = false;
    }

    return (
      <View>
        {revAdView}
        {revTaggedPostsListingItem}
      </View>
    );
  };

  useEffect(() => {
    revLoadAdsArr();

    if (revListingData.length < 1) {
      revFetchData();
    }
  }, []);

  return (
    <>
      <RevPageContentHeader />
      {revListingData.length > 0 ? (
        <FlatList
          data={revListingData.slice(0, revPage * revPageSize)}
          renderItem={revRenderItem}
          keyExtractor={item =>
            revGetLocal_OR_RemoteGUID(item) + '_' + revGenRandString(5)
          }
          updateCellsBatchingPeriod={5000}
          ListFooterComponent={renderFooter}
          onEndReached={revLoadMoreData}
          onEndReachedThreshold={0.75}
          initialNumToRender={REV_INCREMENTALS}
          maxToRenderPerBatch={revPageSize}
        />
      ) : (
        <RevInfoArea revInfoText={'No posts to display yet'} />
      )}
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

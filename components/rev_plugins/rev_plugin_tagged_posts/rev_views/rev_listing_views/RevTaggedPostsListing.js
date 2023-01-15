import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  NativeModules,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../rev_plugins_loader';

const {RevPersLibRead_React} = NativeModules;

import {RevTaggedPostsListingItem} from './rev_entity_views/RevTaggedPostsListingItem';
import {revGetRndInteger} from '../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevTaggedPostsListing = () => {
  let revEntitiesStr =
    RevPersLibRead_React.revPersGetALLRevEntity_By_SubType('rev_kiwi');

  let revEntitiesArr = JSON.parse(revEntitiesStr);

  let revCounter = 1;

  function renderItem({item}) {
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
      <View>
        {RevView}
        <RevTaggedPostsListingItem
          key={item._revEntityGUID.toString()}
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
          return (
            item._revEntityGUID.toString() + '_' + revGetRndInteger(100, 1000)
          );
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

  let RevHeaderLink = ({revLinkText}) => {
    return (
      <TouchableOpacity>
        <Text
          style={[
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
            styles.revHeaderTextLink,
          ]}>
          / {'   '}
          {revLinkText}
        </Text>
      </TouchableOpacity>
    );
  };

  let RevHeaderLinks = () => {
    return (
      <View style={styles.revFlexWrapper}>
        <RevHeaderLink revLinkText={'mine'} />
        <RevHeaderLink revLinkText={'contacts'} />
        <RevHeaderLink revLinkText={<FontAwesome name="shopping-bag" />} />
      </View>
    );
  };

  let RevHeader = () => {
    return (
      <View style={[styles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <Text style={styles.revContentBodyTtlTellTxt}>
          <FontAwesome name="dot-circle-o" />
          <FontAwesome name="long-arrow-right" /> All
        </Text>
        <View>
          <RevHeaderLinks />
        </View>
      </View>
    );
  };

  return (
    <View>
      <RevHeader />
      <RevDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtNormal: {
    fontSize: 11,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revSiteTxtBold: {
    fontWeight: 'bold',
  },
  revSiteTxtWeightNormal: {
    fontWeight: '100',
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revHeaderTextLink: {
    marginLeft: 4,
  },
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
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

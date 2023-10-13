import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevStoresListingViewWidget = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  let revEntitiesArr = [];

  const revHandleCreateNewStoreTabPress = () => {
    let RevCreateNewStoreForm = revPluginsLoader({
      revPluginName: 'rev_plugin_stores',
      revViewName: 'RevCreateNewStoreForm',
      revData: null,
    });

    SET_REV_SITE_BODY(RevCreateNewStoreForm);
  };

  const RevNullStoresDisplay = () => {
    return (
      <View style={[styles.revFlexContainer, styles.revNullDisplayContainer]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          You have not yet created any stores to list your products into
        </Text>
        <TouchableOpacity
          onPress={() => {
            revHandleCreateNewStoreTabPress();
          }}
          style={[styles.revFlexWrapper, styles.revPublishNewTabWrapper]}>
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtLarge,
            ]}
            name="plus"
          />
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              revSiteStyles.revSiteTxtBold,
              styles.revPublishNewTabTell,
            ]}>
            Click to create a new Store
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  let RevDisplay = () => {
    return revEntitiesArr.length > 0 ? (
      <FlatList
        data={revEntitiesArr}
        renderItem={renderItem}
        keyExtractor={item => {
          return item._revGUID.toString() + '_' + revGetRandInteger(100, 1000);
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    ) : (
      <RevNullStoresDisplay />
    );
  };

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <RevPageContentHeader />
      <RevDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingLeft: 8,
  },
  revNullDisplayContainer: {
    marginTop: 12,
  },
  revPublishNewTabWrapper: {
    alignItems: 'center',
    paddingLeft: 8,
    paddingVertical: 8,
  },
  revPublishNewTabTell: {
    paddingBottom: 2,
    paddingLeft: 4,
  },
});

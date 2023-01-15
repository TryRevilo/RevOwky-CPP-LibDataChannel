import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

export const RevStoresListingViewWidget = () => {
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
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
            styles.revNullNoticias,
          ]}>
          You have not yet created any stores to list your products into
        </Text>
        <TouchableOpacity
          onPress={() => {
            revHandleCreateNewStoreTabPress();
          }}
          style={[styles.revFlexWrapper, styles.revPublishNewTabWrapper]}>
          <FontAwesome
            style={[styles.revSiteTxtColorLight, styles.revSiteTxtLarge]}
            name="plus"
          />
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteTxtSmall,
              styles.revSiteTxtBold,
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
          return (
            item._revEntityGUID.toString() + '_' + revGetRndInteger(100, 1000)
          );
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    ) : (
      <RevNullStoresDisplay />
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
        <RevHeaderLink revLinkText={'My Stores'} />
        <RevHeaderLink revLinkText={'Products'} />
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
    <View style={styles.revFlexContainer}>
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
  revSiteTxtLarge: {
    fontSize: 14,
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
    paddingLeft: 8,
  },
  revNullNoticias: {
    alignSelf: 'flex-start',
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

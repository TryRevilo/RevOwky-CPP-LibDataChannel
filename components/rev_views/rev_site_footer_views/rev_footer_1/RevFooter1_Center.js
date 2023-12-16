import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';

import Feather from 'react-native-vector-icons/Feather';

import {ReViewsContext} from '../../../../rev_contexts/ReViewsContext';
import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

import {useRevSiteStyles} from '../../RevSiteStyles';
import {revPluginsLoader} from '../../../rev_plugins_loader';

const RevFooter1_Center = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const RevSitePublisher = () => {
    let RevSitePublisherForm = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'RevSitePublisherForm',
      revData: null,
    });

    return RevSitePublisherForm;
  };

  const revHandleShowSitePublisherInputForm = () => {
    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(<RevSitePublisher />);
  };

  const revHandleShowStorePublisherInputForm = () => {
    let RevStoresListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_stores',
      revViewName: 'RevStoresListingView',
      revData: null,
    });

    SET_REV_SITE_BODY(RevStoresListingView);
  };

  const revFooterTab = ({revIcon, revCallback}) => (
    <TouchableOpacity onPress={revCallback}>
      <Feather
        name={revIcon}
        style={[
          revSiteStyles.revSiteTxtColorWhite,
          revSiteStyles.revSiteTxtTiny,
          styles.revSitePublisherTab,
        ]}
      />
    </TouchableOpacity>
  );
  return (
    <View style={[revSiteStyles.revFlexWrapper_WidthAuto]}>
      {revFooterTab({
        revIcon: 'plus',
        revCallback: revHandleShowSitePublisherInputForm,
      })}

      {revFooterTab({
        revIcon: 'camera',
        revCallback: () => {},
      })}

      {revFooterTab({
        revIcon: 'shopping-cart',
        revCallback: revHandleShowStorePublisherInputForm,
      })}
    </View>
  );
};

export default RevFooter1_Center;

const styles = StyleSheet.create({
  revSitePublisherTab: {
    backgroundColor: '#757575',
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginLeft: 2,
    borderRadius: 55,
  },
});
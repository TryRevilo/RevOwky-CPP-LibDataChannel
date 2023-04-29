import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../rev_contexts/ReViewsContext';
import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';

import {useRevSiteStyles} from '../RevSiteStyles';
import {revPluginsLoader} from '../../rev_plugins_loader';

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

  return (
    <View
      style={[revSiteStyles.revFlexWrapper, styles.revFooter1_Center_Wrapper]}>
      <TouchableOpacity
        onPress={() => {
          revHandleShowSitePublisherInputForm();
        }}>
        <FontAwesome name="plus" style={styles.revSitePublisherTab} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <FontAwesome name="camera" style={styles.revSitePublisherTab} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          revHandleShowStorePublisherInputForm();
        }}>
        <FontAwesome name="shopping-bag" style={styles.revSitePublisherTab} />
      </TouchableOpacity>
    </View>
  );
};

export default RevFooter1_Center;

const styles = StyleSheet.create({
  revFooter1_Center_Wrapper: {
    width: 'auto',
  },
  revSitePublisherTab: {
    color: '#FFF',
    fontSize: 12,
    backgroundColor: '#757575',
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginLeft: 1,
    borderRadius: 55,
  },
});

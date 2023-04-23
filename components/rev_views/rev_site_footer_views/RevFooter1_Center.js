import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {AndroidColor} from '@notifee/react-native';

import {ReViewsContext} from '../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../rev_contexts/RevWebRTCContext';
import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';

import {useRevSiteStyles} from '../RevSiteStyles';
import {revPluginsLoader} from '../../rev_plugins_loader';

import DeviceInfo from 'react-native-device-info';

const RevFooter1_Center = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY} = useContext(RevSiteDataContext);

  const {SET_REV_SITE_BODY, SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const {createPeerConnection, sendMessage} = useContext(RevWebRTCContext);

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

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Mary Cooking Lunch - Ugali',
      body: 'Main body content of the notification. pressAction is needed if you want the notification to open the app when pressed . . .',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  return (
    <View
      style={[revSiteStyles.revFlexWrapper, styles.revFooter1_Center_Wrapper]}>
      <TouchableOpacity
        onPress={() => {
          revHandleShowSitePublisherInputForm();
        }}>
        <FontAwesome name="plus" style={styles.revSitePublisherTab} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          let revTargetEntityGUID =
            REV_LOGGED_IN_ENTITY._remoteRevEntityGUID == 407 ? 375 : 407;

          sendMessage(revTargetEntityGUID, {revMsg: 'HELLO WORLD ! ! !'});

          onDisplayNotification();
        }}>
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

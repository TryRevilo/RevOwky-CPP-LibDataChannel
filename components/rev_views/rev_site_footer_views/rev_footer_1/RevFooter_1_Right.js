import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useState, useRef} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {WebView} from 'react-native-webview';

import {ReViewsContext} from '../../../../rev_contexts/ReViewsContext';
import {RevRemoteSocketContext} from '../../../../rev_contexts/RevRemoteSocketContext';
import {revPluginsLoader} from '../../../rev_plugins_loader';
import {revPostServerData} from '../../../rev_libs_pers/rev_server/rev_pers_lib_create';

import {useRevSiteStyles} from '../../RevSiteStyles';

const RevFooter_1_Right = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const webViewRef = useRef(null);

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);
  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const revHandleUserSettingsPressed = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: {},
    });

    SET_REV_SITE_BODY(RevUserSettings);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [revOrderID, setRevOrderID] = useState(-1);

  const handleWebViewNavigationStateChange = navState => {
    const {url} = navState;
    if (url.includes('http://localhost:4000/success')) {
      // Payment was approved, parse query params and capture payment

      webViewRef.current.stopLoading();

      const {url} = navState;

      console.log('>>> url', url);

      if (url) {
        const path =
          Platform.OS === 'android'
            ? url.replace('file:///', 'file:///android_asset/')
            : url;
        webViewRef.current.injectJavaScript(`location.href = '${path}';`);
      }

      let revURL =
        REV_ROOT_URL + '/rev_api/rev_authorize_and_capture_paypal_payment';

      revPostServerData(
        revURL,
        {
          filter: {
            revOrderId: revOrderID,
          },
        },
        revResponseData => {
          console.log(
            '>>> CAPTURE -revResponseData',
            JSON.stringify(revResponseData),
          );
        },
      );
    }
  };

  const revHandleHelpTabPressed = () => {
    let revURL = REV_ROOT_URL + '/rev_api/rev_make_paypal_order';

    revPostServerData(revURL, {}, revResponseData => {
      console.log('>>> revResponseData', JSON.stringify(revResponseData));

      if ('revError' in revResponseData) {
        return;
      }

      setRevOrderID(revResponseData.id);

      let revCheckOutNowLink = '';

      let revLinks = revResponseData.links;

      for (let i = 0; i < revLinks.length; i++) {
        if (revLinks[i].rel == 'payer-action') {
          revCheckOutNowLink = revLinks[i].href;
        }
      }

      const INJECTED_JAVASCRIPT = `
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, initial-scale=0.75, maximum-scale=0.75, user-scalable=0');
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);
  `;

      SET_REV_SITE_BODY(
        <WebView
          ref={webViewRef}
          startInLoadingState
          scalesPageToFit={true}
          useWebKit={true}
          allowsZooming={true}
          allowsBackForwardNavigationGestures={true}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          automaticallyAdjustContentInsets={false}
          contentInset={{top: 0, right: 0, bottom: 0, left: 0}}
          source={{uri: revCheckOutNowLink}}
          style={{flex: 1}}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />,
      );
    });
  };

  return (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        styles.rightFooterSubmitOptionsWrapper,
      ]}>
      <TouchableOpacity onPress={revHandleUserSettingsPressed}>
        <FontAwesome
          name="gear"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
            styles.rightFooterOptionTab,
          ]}></FontAwesome>
      </TouchableOpacity>
      <FontAwesome
        name="share-alt"
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtSmall,
          styles.rightFooterOptionTab,
        ]}></FontAwesome>
      <TouchableOpacity onPress={revHandleHelpTabPressed}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
            revSiteStyles.revSiteFontBold,
            styles.rightFooterOptionTab,
            styles.rightFooterHelpTab,
          ]}>
          Help
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RevFooter_1_Right;

const styles = StyleSheet.create({
  rightFooterOptionTab: {
    paddingHorizontal: 10,
    paddingBottom: 3,
  },
  rightFooterSubmitOptionsWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginRight: 14,
    marginLeft: 'auto',
  },
  rightFooterHelpTab: {
    paddingBottom: 1,
  },
});

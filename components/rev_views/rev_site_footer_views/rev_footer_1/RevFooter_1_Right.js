import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useState, useRef} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../../../rev_plugins_loader';

import {useRevSiteStyles} from '../../RevSiteStyles';

const RevFooter_1_Right = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const revHandleUserSettingsPressed = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: {},
    });

    SET_REV_SITE_BODY(RevUserSettings);
  };

  const revHandleHelpTabPressed = () => {};

  return (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        styles.rightFooterSubmitOptionsWrapper,
      ]}>
      <TouchableOpacity onPress={revHandleUserSettingsPressed}>
        <FontAwesome
          name="gear"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
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
            revSiteStyles.revSiteTxtTiny_X,
            revSiteStyles.revSiteFontBold,
            styles.rightFooterOptionTab,
          ]}>
          Help
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RevFooter_1_Right;

const styles = StyleSheet.create({
  rightFooterSubmitOptionsWrapper: {
    alignItems: 'center',
    marginRight: 14,
    marginLeft: 'auto',
  },
  rightFooterOptionTab: {
    paddingHorizontal: 10,
  },
  rightFooterHelpTab: {
    paddingBottom: 1,
  },
});

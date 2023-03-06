import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';

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
      revData: null,
    });

    SET_REV_SITE_BODY(RevUserSettings);
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

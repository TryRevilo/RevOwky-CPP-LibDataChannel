import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useContext, useState, useRef} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../../../rev_plugins_loader';

import RevFooter_1_Right from './RevFooter_1_Right';
import {RevScrollView_H} from '../../rev_page_views';

import {useRevSiteStyles} from '../../RevSiteStyles';

export const RevFooter1 = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_FOOTER_1_CENTER} = useContext(ReViewsContext);

  let RevFooter1Left = revPluginsLoader({
    revPluginName: 'rev_plugin_text_chat',
    revViewName: 'RevFooter1Left',
    revData: {},
  });

  let revRetView = (
    <View
      style={[revSiteStyles.revFlexWrapper_WidthAuto, styles.revFooterWrapper]}>
      {RevFooter1Left}
      {REV_FOOTER_1_CENTER}

      <RevFooter_1_Right />
    </View>
  );

  return <RevScrollView_H revScrollViewContent={revRetView} />;
};

var revPageWidth = Dimensions.get('window').width - 10;

console.log('>>> revPageWidth', revPageWidth);

const styles = StyleSheet.create({
  revFooterWrapper: {
    alignItems: 'flex-end',
    backgroundColor: '#FFF',
    minWidth: revPageWidth,
    paddingVertical: 12,
  },
});

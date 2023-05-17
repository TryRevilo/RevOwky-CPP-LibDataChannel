import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevAdObjectViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revAdEntityListingView = revPluginsLoader({
    revPluginName: 'rev_plugin_ads',
    revViewName: 'RevAdEntityListingView',
    revVarArgs: {},
  });

  return <View>{revAdEntityListingView}</View>;
};

const styles = StyleSheet.create({});

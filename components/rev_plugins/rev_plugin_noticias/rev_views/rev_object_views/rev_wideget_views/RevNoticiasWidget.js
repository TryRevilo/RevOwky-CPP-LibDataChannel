import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevNoticiasWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let RevMemberConnectionRequests = revPluginsLoader({
    revPluginName: 'rev_plugin_member_connections',
    revViewName: 'RevMemberConnectionRequests',
    revVarArgs,
  });

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      <RevPageContentHeader />

      {RevMemberConnectionRequests}
    </View>
  );
};

const styles = StyleSheet.create({});

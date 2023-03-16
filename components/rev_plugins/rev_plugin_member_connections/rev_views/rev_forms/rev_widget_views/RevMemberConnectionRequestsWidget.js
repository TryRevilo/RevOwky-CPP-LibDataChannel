import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevMemberConnectionRequestsWidget = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;

  const {revSiteStyles} = useRevSiteStyles();

  let revViewsArr = [];

  for (let i = 0; i < revVarArgs.length; i++) {
    let revConnUser = revVarArgs[i];

    let RevMemberConnectionRequestItem = revPluginsLoader({
      revPluginName: 'rev_plugin_member_connections',
      revViewName: 'RevMemberConnectionRequestItem',
      revVarArgs: revConnUser,
    });

    revViewsArr.push(RevMemberConnectionRequestItem);
  }

  return (
    <View style={[revSiteStyles.revFlexPageContainer]}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtSmall,
          styles.revNoticiasGroupHeader,
        ]}>
        coNnEcTioN reQuests
      </Text>

      <View style={revSiteStyles.revFlexContainer}>
        {revViewsArr.map((RevView, index) => {
          return (
            <View
              key={
                'RevMemberConnectionRequestsWidget_' +
                index +
                '_' +
                revGetRandInteger(10, 1000)
              }>
              {RevView}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revNoticiasGroupHeader: {
    marginVertical: 5,
  },
});

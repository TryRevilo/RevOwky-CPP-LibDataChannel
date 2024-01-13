import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';

export const RevMemberConnectionRequestsWidget = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;

  if (!Array.isArray(revVarArgs)) {
    return null;
  }

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
          revSiteStyles.revSiteTxtTiny_X,
          {
            borderStyle: 'dotted',
            borderBottomColor: '#EEE',
            borderBottomWidth: 1,
            paddingLeft: 42,
            marginVertical: 5,
          },
        ]}>
        Connection Requests
      </Text>

      <RevScrollView_V
        revScrollViewContent={
          <View style={revSiteStyles.revFlexContainer}>
            {revViewsArr.map((RevView, index) => {
              return (
                <View
                  key={index + '' + revGetRandInteger(10, 1000)}
                  style={{
                    backgroundColor: index % 2 ? '#F7F7F7' : '#FFFFFF',
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                    borderRadius: 3,
                  }}>
                  {RevView}
                </View>
              );
            })}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({});

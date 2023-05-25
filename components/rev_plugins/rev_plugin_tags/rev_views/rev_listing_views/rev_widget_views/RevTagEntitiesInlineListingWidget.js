import {StyleSheet, View} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevScrollView_H} from '../../../../../rev_views/rev_page_views';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevTagEntitiesInlineListingWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {revTagItemsArr = []} = revVarArgs;

  let revTagViewsArr = [];

  for (let i = 0; i < revTagItemsArr.length; i++) {
    let revTagItemView = revPluginsLoader({
      revPluginName: 'rev_plugin_tags',
      revViewName: 'RevTagItemView',
      revVarArgs: {},
    });

    revTagViewsArr.push(revTagItemView);
  }

  let revRetView = (
    <View style={[revSiteStyles.revFlexWrapper]}>
      {revTagViewsArr.map(revCurrView => (
        <View key={'RevLikeInlineFormWidget_' + revGetRandInteger(10, 1000)}>
          {revCurrView}
        </View>
      ))}
    </View>
  );

  return <RevScrollView_H revScrollViewContent={revRetView} />;
};

const styles = StyleSheet.create({});

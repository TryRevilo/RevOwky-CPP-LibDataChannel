import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevScrollView_H} from '../../../../../rev_views/rev_page_views';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevTagEntitiesInlineListingWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {revTagItemsArr = []} = revVarArgs;

  if (!revTagItemsArr.length) {
    return null;
  }

  let revTagViewsArr = [];

  for (let i = 0; i < revTagItemsArr.length; i++) {
    let revTagEntity = revTagItemsArr[i];

    if (revIsEmptyJSONObject(revTagEntity)) {
      continue;
    }

    let revTagItemView = revPluginsLoader({
      revPluginName: 'rev_plugin_tags',
      revViewName: 'RevTagItemView',
      revVarArgs: revTagEntity,
    });

    if (revIsEmptyVar(revTagItemView) || revTagItemView == null) {
      continue;
    }

    revTagViewsArr.push(revTagItemView);
  }

  if (!revTagViewsArr.length) {
    return null;
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

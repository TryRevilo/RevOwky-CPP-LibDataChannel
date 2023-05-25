import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevTagItemViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <TouchableOpacity
      key={'RevTagItemViewWidget_' + revGetRandInteger(100, 1000)}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          styles.revPostTagsListItem,
        ]}>
        hello_world
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  revPostTagsListItem: {
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 4,
  },
});

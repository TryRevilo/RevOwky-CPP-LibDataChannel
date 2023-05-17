import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCheckOutFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
        ]}>
        RevCheckOutFormWidget
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

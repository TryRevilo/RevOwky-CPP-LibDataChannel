import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevSearchEntityListing = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      <RevPageContentHeader />
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({});

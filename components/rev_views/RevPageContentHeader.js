import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import {useRevSiteStyles} from './RevSiteStyles';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revIsEmptyJSONObject} from '../../rev_function_libs/rev_gen_helper_functions';

const RevPageContentHeader = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revIsIndented = true;

  if (
    !revIsEmptyJSONObject(revVarArgs) &&
    revVarArgs.hasOwnProperty('revIsIndented')
  ) {
    revIsIndented = revVarArgs.revIsIndented;
  }

  let RevHeaderLink = ({revLinkText}) => {
    return (
      <TouchableOpacity>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
            styles.revHeaderTextLink,
          ]}>
          / {'   '}
          {revLinkText}
        </Text>
      </TouchableOpacity>
    );
  };

  let RevHeaderLinks = () => {
    return (
      <View style={revSiteStyles.revFlexWrapper}>
        <RevHeaderLink revLinkText={'mine'} />
        <RevHeaderLink revLinkText={'contacts'} />
        <RevHeaderLink revLinkText={<FontAwesome name="shopping-bag" />} />
      </View>
    );
  };

  let RevHeader = () => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <Text
          style={
            revIsIndented
              ? styles.revAllItemsListingFilterTabIndented
              : styles.revAllItemsListingFilterTabUnIndented
          }>
          <FontAwesome name="dot-circle-o" />
          <FontAwesome name="long-arrow-right" /> All
        </Text>
        <View>
          <RevHeaderLinks />
        </View>
      </View>
    );
  };

  return <RevHeader />;
};

export default RevPageContentHeader;

const styles = StyleSheet.create({
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revHeaderTextLink: {
    marginLeft: 4,
  },
  revAllItemsListingFilterTabIndented: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 38,
  },
  revAllItemsListingFilterTabUnIndented: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 4,
  },
});

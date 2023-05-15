import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revGetRandInteger} from '../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from './RevSiteStyles';

export const RevTagsOutputListing = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revTagsArr = [], revDelTagItemCallBack = null} = revVarArgs;

  if (revDelTagItemCallBack == null) {
    return null;
  }

  const revDrawTagTab = revData => (
    <View
      key={'revDrawTagTab_' + revGetRandInteger()}
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        revSiteStyles.revTagOutputTabWrapper,
      ]}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
        ]}>
        {revData}
      </Text>

      <TouchableOpacity
        style={revSiteStyles.revDeleteOutputTabItem}
        onPress={() => {
          revDelTagItemCallBack(revData);
        }}>
        <FontAwesome
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtNormal,
          ]}
          name="dot-circle-o"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 0}}>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revTagsOutputListingWrapper,
        ]}>
        {revTagsArr.map(revData => revDrawTagTab(revData))}
      </View>
    </ScrollView>
  );
};

export const RevScrollView_H = ({revScrollViewContent}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 0}}>
      {revScrollViewContent}
    </ScrollView>
  );
};

export const RevScrollView_V = ({revScrollViewContent}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: 0}}>
      <View style={[revSiteStyles.revFlexContainer, {marginBottom: 25}]}>
        {revScrollViewContent}
      </View>
    </ScrollView>
  );
};

export const RevInfoArea = ({revInfoText}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View style={[revSiteStyles.revFlexContainer, revSiteStyles.revInfoArea]}>
      <Text>
        <FontAwesome
          name="exclamation"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtNormal,
          ]}
        />
        {'  '}
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {revInfoText}
        </Text>
      </Text>
    </View>
  );
};

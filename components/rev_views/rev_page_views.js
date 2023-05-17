import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import MaskedView from '@react-native-masked-view/masked-view';
// import Svg, {Defs, ClipPath, Path} from 'react-native-svg';
import {Svg, Path} from 'react-native-svg';

import {revGetRandInteger} from '../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from './RevSiteStyles';

export const RevSectionPointer = ({revStyles = null}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        revSiteStyles.revRightBorderedArrowPointerWrapper,
        {flex: 0},
        revStyles,
      ]}>
      <FontAwesome
        style={[
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny,
          {color: '#ede7f6'},
        ]}
        name="long-arrow-right"
      />
    </View>
  );
};

export const RevSectionPointedContent = ({revContent}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (!revContent) {
    return null;
  }

  return (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        revSiteStyles.revDescriptiveTitleViewContentWrapper,
      ]}>
      <RevSectionPointer />

      <View style={revSiteStyles.revSectionPointedContentContainer}>
        {revContent}
      </View>
    </View>
  );
};

export const RevDescriptiveTitleView = ({
  revVarArgs,
  revVarArgs: {revBodyContentItemsArr = [], revNullContentTxt = ''},
}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revTitle = revVarArgs.revTitle;

  let revNullContentSection = null;

  if (revNullContentTxt) {
    let revNullContentSectionView = (
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
        ]}>
        {revNullContentTxt}
      </Text>
    );

    revNullContentSection = (
      <RevSectionPointedContent revContent={revNullContentSectionView} />
    );
  }

  let revRetView = (
    <View style={[revSiteStyles.revFlexContainer]}>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revDescriptiveTitleViewTitleWrapper,
          {paddingHorizontal: 10},
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {revTitle}
        </Text>
      </View>

      {revNullContentSection}

      {revBodyContentItemsArr.map(revBodyContentItem => (
        <RevSectionPointedContent
          key={'revBodyContentItem_' + revGetRandInteger()}
          revContent={revBodyContentItem}
        />
      ))}
    </View>
  );

  return revRetView;
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

export const RevImageView = ({revImageURL}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return <View style={[revSiteStyles.revImageMedium]}></View>;
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

export const RevScrollView_V = ({revScrollViewContent, revStyles}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: 0}}>
      <View
        style={[revSiteStyles.revFlexContainer, {marginBottom: 25}, revStyles]}>
        {revScrollViewContent}
      </View>
    </ScrollView>
  );
};

export const RevParallelogramShapeClip = ({
  revContent,
  revWidth,
  revHeight,
}) => {
  return (
    <MaskedView
      style={{flex: 1}}
      maskElement={
        <Svg height="100%" width="100%">
          <Path
            d={`M${20} 0 L${revWidth} 0 L${
              revHeight - 20
            } ${revWidth} L0 ${revWidth} Z`}
            fill="black"
          />
        </Svg>
      }>
      <View style={{flex: 1}}>{revContent}</View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  parallelogram: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 100,
    transform: [{skewX: '-30deg'}],
    backgroundColor: 'black',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});

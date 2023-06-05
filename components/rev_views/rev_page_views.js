import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import MaskedView from '@react-native-masked-view/masked-view';
// import Svg, {Defs, ClipPath, Path} from 'react-native-svg';
import {Svg, Path} from 'react-native-svg';

import {revGetRandInteger} from '../../rev_function_libs/rev_gen_helper_functions';
import {
  revStringEmpty,
  revTruncateString,
} from '../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from './RevSiteStyles';

export const RevReadMoreTextView = ({revText, revMaxLength}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revExpanded, setRevExpanded] = useState(false);

  const togglerevExpanded = () => {
    setRevExpanded(!revExpanded);
  };

  const revRenderText = () => {
    if (revText.length <= revMaxLength || revExpanded) {
      return revText;
    }

    return revTruncateString(revText, revMaxLength);
  };

  const revRenderReadMoreButton = () => {
    if (revText.length > revMaxLength) {
      if (revExpanded) {
        return (
          <TouchableOpacity onPress={togglerevExpanded}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorBlueLink,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtTiny,
                {paddingVertical: 5},
              ]}>
              Show Less
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={togglerevExpanded}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorBlueLink,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtTiny,
                {paddingVertical: 5},
              ]}>
              Read More
            </Text>
          </TouchableOpacity>
        );
      }
    }

    return null;
  };

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <Text
        style={[revSiteStyles.revSiteTxtColor, revSiteStyles.revSiteTxtTiny]}>
        {revRenderText()}
      </Text>
      {revRenderReadMoreButton()}
    </View>
  );
};

export const RevCenteredImage = ({
  revImageURI,
  revImageDimens = {revWidth: 22, revHeight: 22},
  revStyles = null,
}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revImageLoaded, setRevImageLoaded] = useState(false);
  const [revImageError, setRevImageError] = useState(false);

  const handleImageLoad = () => {
    setRevImageLoaded(true);
  };

  const handleRevImageError = () => {
    setRevImageError(true);
  };

  let revErrImagePlaceholder = (
    <View
      style={[
        revSiteStyles.revNullImagePlaceholder,
        {
          justifyContent: 'center',
          alignItems: 'center',
          width: revImageDimens.revWidth,
          height: revImageDimens.revHeight,
        },
      ]}>
      <FontAwesome
        style={[
          revSiteStyles.revSiteTxtAlertDangerColor,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny,
        ]}
        name="exclamation"
      />
    </View>
  );

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 'auto',
        height: 'auto',
      }}>
      {(revImageLoaded && revImageError) || revStringEmpty(revImageURI) ? (
        <>{revErrImagePlaceholder}</>
      ) : (
        <Image
          source={{uri: revImageURI}}
          style={[
            {
              width: revImageDimens.revWidth,
              height: revImageDimens.revHeight,
              resizeMode: 'cover',
            },
            revStyles,
          ]}
          onLoad={handleImageLoad}
          onError={handleRevImageError}
        />
      )}
    </View>
  );
};

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

export const RevSectionPointedContent = ({revContent, revStyles}) => {
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
      <RevSectionPointer revStyles={revStyles} />

      <View style={revSiteStyles.revSectionPointedContentContainer}>
        {revContent}
      </View>
    </View>
  );
};

const myFunc = ({val1 = 'default val', val2 = 'default val'} = {}) => {
  // Your function logic here
};

const MyFuncComponent = ({myVarArgs = {}}) => {
  const {val1 = 'default val', val2 = 'default val'} = myVarArgs;
};

const MyFuncComponent_ = ({
  myVarArgs: {val1 = 'default val', val2 = 'default val'} = {},
}) => {};

export const RevDescriptiveTitleView = ({
  revVarArgs: {
    revTitle = '',
    revBodyContentItemsArr = [],
    revNullContentTxt = '',
    revStyles = {},
    revPointerStyles = {},
  },
} = {}) => {
  const {revSiteStyles} = useRevSiteStyles();

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
      <RevSectionPointedContent
        revContent={revNullContentSectionView}
        revStyles={revPointerStyles}
      />
    );
  }

  let revRetView = (
    <View style={[revSiteStyles.revFlexContainer, revStyles]}>
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
          revStyles={revPointerStyles}
        />
      ))}
    </View>
  );

  return revRetView;
};

export const RevInfoArea = ({revInfoText, revStyles = null}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        revSiteStyles.revInfoArea,
        revStyles,
      ]}>
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
      contentContainerStyle={{width: '100%', paddingVertical: 0}}>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          {width: '100%', marginBottom: 25},
          revStyles,
        ]}>
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

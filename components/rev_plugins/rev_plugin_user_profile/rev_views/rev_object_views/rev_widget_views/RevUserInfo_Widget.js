import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevScrollView_H} from '../../../../../rev_views/rev_page_views';
import {RevDescriptiveTitleView} from '../../../../../rev_views/rev_page_views';

import {RevEntityInfoDetailsWidget} from './RevEntityInfoDetailsWidget';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsUserEntity_WithInfo} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevUserInfo_Widget = ({revVarArgs}) => {
  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revVarArgs')
  ) {
    return null;
  }

  let revOwkiMemberEntity = revVarArgs.revVarArgs;

  if (!revIsUserEntity_WithInfo(revOwkiMemberEntity)) {
    return null;
  }

  const {revSiteStyles} = useRevSiteStyles();

  const RevUserProfileMedia = () => {
    return (
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.revEntityProfileImagesScroller}>
        <View
          style={[
            [revSiteStyles.revFlexWrapper, styles.revProfileMediaWrapper],
          ]}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20220428_093819_620.jpg',
              }}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20220604_115651_061.jpg',
              }}
            />
          </View>
          <View style={styles.profileVideoContainer}>
            <View style={styles.profileVideoStyle}>
              <Image
                style={styles.imageStyle}
                source={{
                  uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20220505_154409_825.jpg',
                }}
              />
            </View>
            <View style={styles.profilePlayVideoStyle}>
              <FontAwesome
                style={styles.profilePlayVideoStyleTxt}
                name="play"
              />
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20220604_135207_430.jpg',
              }}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20220721_090725_387.jpg',
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  const revGetTagTab = revTag => {
    return (
      <Text
        key={revTag}
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revTagTab,
        ]}>
        <FontAwesome style={revSiteStyles.revSiteTxtTiny} name="hashtag" />
        {'my_own_tag_' + revTag}
      </Text>
    );
  };

  let revTags = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  let revScrollViewContent = (
    <View style={[revSiteStyles.revFlexWrapper_WidthAuto]}>
      {revTags.map(revCurrTag => revGetTagTab(revCurrTag))}
    </View>
  );

  let revEntityTagsOutputView = (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        revSiteStyles.revDescriptiveTitleViewTitleWrapper,
      ]}>
      <RevScrollView_H
        revScrollViewContent={revScrollViewContent}></RevScrollView_H>
    </View>
  );

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revEntityInfoDetailsWidgetContainer,
        ]}>
        <RevEntityInfoDetailsWidget revVarArgs={revOwkiMemberEntity} />
      </View>

      {revEntityTagsOutputView}

      <RevUserProfileMedia />

      <RevDescriptiveTitleView
        revVarArgs={{
          revTitle: 'Stores',
          revNullContentTxt: 'no stores published on this profile yet',
        }}
      />
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revHeaderTextLink: {
    paddingLeft: 12,
  },
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 15,
  },
  revSearchResultsContainer: {
    width: maxChatMessageContainerWidth,
  },
  revEntityInfoDetailsWidgetContainer: {
    paddingHorizontal: 8,
  },
  revEditTab: {
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  revUserInfoWrapper: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  revEntityProfileImagesScroller: {
    flexGrow: 0,
    marginTop: 12,
  },
  revProfileMediaWrapper: {
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#444',
    width: 25,
    height: 25,
    borderRadius: 22,
    marginRight: 1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  profileVideoContainer: {
    backgroundColor: '#444',
    width: 225,
    height: 35,
    borderRadius: 15,
    marginRight: 1,
    position: 'relative',
  },
  profileVideoStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute',
    top: 0,
  },
  profilePlayVideoStyle: {
    position: 'absolute',
    top: '17%',
    left: '45%',
  },
  profilePlayVideoStyleTxt: {
    color: '#FFF',
    fontSize: 25,
  },

  /** */

  /** START STORES */
  /** END STORES */
});

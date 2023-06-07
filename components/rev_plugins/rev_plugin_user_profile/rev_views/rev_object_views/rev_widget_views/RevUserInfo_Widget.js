import React, {useContext, useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Touchable,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {RevScrollView_H} from '../../../../../rev_views/rev_page_views';
import {RevDescriptiveTitleView} from '../../../../../rev_views/rev_page_views';

import {RevEntityInfoDetailsWidget} from './RevEntityInfoDetailsWidget';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsUserEntity_WithInfo} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {
  revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID,
  revPersGetRevEntities_By_EntityGUIDsArr,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

export const RevUserInfo_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);

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

  let revTagRelsArr =
    revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_tag_of',
      REV_LOGGED_IN_ENTITY_GUID,
    );

  let revTagEntitiesArr =
    revPersGetRevEntities_By_EntityGUIDsArr(revTagRelsArr);

  let revTagValsArr = [];

  for (let i = 0; i < revTagEntitiesArr.length; i++) {
    let revTagVal = revGetMetadataValue(
      revTagEntitiesArr[i]._revInfoEntity._revEntityMetadataList,
      'rev_entity_name_val',
    );
    revTagValsArr.push(revTagVal);
  }

  let revN = 3;

  const revColumnArrays = Array.from({length: revN}, () => []);

  const getImageDimensions = uri => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => {
          resolve({width, height});
        },
        error => {
          reject(error);
        },
      );
    });
  };

  let revPageWidth = Dimensions.get('window').width - 23;
  let revImageWidth = revPageWidth / 3;

  const RevPicContainer = ({revMediaEntity, revStyles}) => {
    const revMediaEntityPressed = () => {
      console.log(
        '>>> revMediaEntity._revEntityGUID',
        revMediaEntity._revEntityGUID,
      );
    };
    let revImagePath =
      'file:///storage/emulated/0/Documents/Owki/rev_media/' +
      revGetMetadataValue(
        revMediaEntity._revEntityMetadataList,
        'rev_remote_file_name',
      );

    const [revWidth, setRevWidth] = useState();
    const [revHeight, setRevHeight] = useState();

    useEffect(() => {
      (async () => {
        const {width, height} = await getImageDimensions(revImagePath);

        let revAspectRatio = revImageWidth / width;

        setRevWidth(width);
        setRevHeight(height * revAspectRatio);
      })();
    }, []);

    return (
      <TouchableOpacity
        key={'RevPicContainer_' + revMediaEntity._revEntityGUID}
        onPress={revMediaEntityPressed}
        style={{
          width: revImageWidth - 1,
          borderColor: '#FFF',
          borderWidth: 1,
          marginTop: -1,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
        <FastImage
          source={{uri: revImagePath}}
          resizeMode={FastImage.resizeMode.contain}
          style={{
            width: revImageWidth,
            height: revHeight,
          }}
        />
      </TouchableOpacity>
    );
  };

  let revPicsArray = REV_LOGGED_IN_ENTITY.revEntityPicsAlbum.revPicsArray;

  for (let i = 0; i < revPicsArray.length; i++) {
    let revPicView = <RevPicContainer revMediaEntity={revPicsArray[i]} />;

    let revInsertionColumn = i < revN ? i : i % revN;
    revColumnArrays[revInsertionColumn].push(revPicView);
  }

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
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          revSiteStyles.revTagTab,
        ]}>
        <View style={styles.revTagBorderDivider}></View>
        <Text
          key={'revGetTagTab_' + revGetRandInteger()}
          style={[
            revSiteStyles.revSiteTxtColorBlueLink,
            revSiteStyles.revSiteTxtTiny,
            ,
          ]}>
          <FontAwesome style={revSiteStyles.revSiteTxtTiny} name="hashtag" />
          {' ' + revTag}
        </Text>
      </View>
    );
  };

  let revScrollViewContent = (
    <View style={[revSiteStyles.revFlexWrapper_WidthAuto]}>
      {revTagValsArr.map(revCurrTag => revGetTagTab(revCurrTag))}
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
    <View style={revSiteStyles.revFlexContainer}>
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

      <View
        style={[revSiteStyles.revFlexWrapper, {width: '100%', marginTop: 12}]}>
        {revColumnArrays.map((revCurrolumn, index) => (
          <View
            key={'revColumnArrays_' + index}
            style={{flex: 1, flexDirection: 'column'}}>
            {revCurrolumn}
          </View>
        ))}
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const imageWidth = pageWidth / 2 - 20;

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

  /** START TAGS */
  revTagBorderDivider: {
    alignSelf: 'flex-end',
    backgroundColor: '#5c6bc0',
    width: 12,
    height: 2,
    marginRight: -9,
    marginBottom: 3,
    zIndex: 100,
  },
  /** END TAGS */
});

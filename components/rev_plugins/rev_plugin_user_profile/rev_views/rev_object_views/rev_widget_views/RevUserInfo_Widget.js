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
  revPersGetSubjectGUIDs_BY_RelStr_TargetGUID,
  revPersGetRevEntities_By_EntityGUIDsArr,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revStringEmpty} from '../../../../../../rev_function_libs/rev_string_function_libs';

const revSettings = require('../../../../../../rev_res/rev_settings.json');

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

  let revTagRelsArr = revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
    'rev_tag_of',
    REV_LOGGED_IN_ENTITY_GUID,
  );

  let revTagEntitiesArr =
    revPersGetRevEntities_By_EntityGUIDsArr(revTagRelsArr);

  let revTagValsArr = [];

  for (let i = 0; i < revTagEntitiesArr.length; i++) {
    let revTagVal = revGetMetadataValue(
      revTagEntitiesArr[i]._revInfoEntity._revMetadataList,
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

  let revPageWidth = Dimensions.get('window').width - 20;
  let revImageWidth = revPageWidth / 3;

  const RevPicContainer = ({revMediaEntity, revStyles}) => {
    const revMediaEntityPressed = () => {
      console.log('>>> revMediaEntity._revGUID', revMediaEntity._revGUID);
    };
    let revImagePathVal = revGetMetadataValue(
      revMediaEntity._revMetadataList,
      'rev_remote_file_name',
    );

    if (revStringEmpty(revImagePathVal)) {
      return null;
    }

    let revImagePath =
      'file://' + revSettings.revPublishedMediaDir + '/' + revImagePathVal;

    const [revImageErr, setRevImageErr] = useState(false);
    const [revWidth, setRevWidth] = useState();
    const [revHeight, setRevHeight] = useState();

    useEffect(() => {
      (async () => {
        try {
          const {width, height} = await getImageDimensions(revImagePath);

          let revAspectRatio = revImageWidth / width;

          setRevWidth(width);
          setRevHeight(height * revAspectRatio);
        } catch (error) {
          console.log('*** error -RevPicContainer', error);
          setRevImageErr(true);
        }
      })();
    }, []);

    return (
      <TouchableOpacity
        key={'RevPicContainer_' + revMediaEntity._revGUID}
        onPress={revMediaEntityPressed}
        style={{
          width: revImageWidth - 2,
          borderColor: '#FFF',
          borderWidth: 1,
          borderBottomWidth: 0,
          overflow: 'hidden',
        }}>
        {revImageErr ? null : (
          <FastImage
            source={{uri: revImagePath}}
            resizeMode={FastImage.resizeMode.contain}
            style={{
              width: revImageWidth,
              height: revHeight,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  let revPicsArray = [];

  if (REV_LOGGED_IN_ENTITY.hasOwnProperty('revEntityPicsAlbum')) {
    let revEntityPicsAlbum = REV_LOGGED_IN_ENTITY.revEntityPicsAlbum;

    if (
      !revIsEmptyJSONObject(revEntityPicsAlbum) &&
      revEntityPicsAlbum.hasOwnProperty('revPicsArray')
    ) {
      revPicsArray = revEntityPicsAlbum.revPicsArray;
    }
  }

  for (let i = 0; i < revPicsArray.length; i++) {
    let revPicView = (
      <RevPicContainer
        key={'RevPicContainer_' + revGetRandInteger()}
        revMediaEntity={revPicsArray[i]}
      />
    );

    let revInsertionColumn = i < revN ? i : i % revN;
    revColumnArrays[revInsertionColumn].push(revPicView);
  }

  let revImageURL =
    'file:///storage/emulated/0/DCIM/Camera/IMG_20220428_093819_620.jpg';

  const RevProfileImageView = ({revMediaURL, revMediaType}) => {
    return (
      <View style={styles.revProfileImageContainer}>
        {revMediaType == 'rev_image' ? (
          <Image
            style={styles.revProfileImage}
            source={{
              uri: revMediaURL,
            }}
          />
        ) : null}
      </View>
    );
  };

  let revProfileImagesArea = (
    <View
      style={[[revSiteStyles.revFlexWrapper, styles.revProfileMediaWrapper]]}>
      <RevProfileImageView
        revMediaURL={revImageURL}
        revMediaType={'rev_image'}
      />

      <RevProfileImageView
        revMediaURL={revImageURL}
        revMediaType={'rev_image'}
      />

      <View style={styles.revProfVidContainer}>
        <View style={styles.revProfPlayVid}>
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtLarge,
            ]}
            name="play"
          />
        </View>
      </View>

      <RevProfileImageView
        revMediaURL={revImageURL}
        revMediaType={'rev_image'}
      />

      <RevProfileImageView
        revMediaURL={revImageURL}
        revMediaType={'rev_image'}
      />
    </View>
  );

  const revGetTagTab = revTag => {
    return (
      <View
        key={'revGetTagTab_' + revGetRandInteger()}
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

      <View style={{marginTop: 8}}>{revProfileImagesArea}</View>

      <RevDescriptiveTitleView
        revVarArgs={{
          revTitle: 'Stores',
          revNullContentTxt: 'no stores published on this profile yet',
        }}
      />

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          {
            backgroundColor: '#444',
            width: '100%',
            marginTop: 12,
            borderRadius: 8,
            overflow: 'hidden',
          },
        ]}>
        {revColumnArrays.map((revCurrolumn, index) => (
          <View
            key={'revColumnArrays_' + index + revGetRandInteger()}
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
  revProfileMediaWrapper: {
    alignItems: 'center',
  },

  /** Start Profile Images */
  revProfileMediaWrapper: {
    alignItems: 'center',
  },
  revProfileImageContainer: {
    backgroundColor: '#F7F7F7',
    width: 25,
    height: 25,
    borderColor: '#EEE',
    borderWidth: 1,
    borderRadius: 22,
    marginRight: 1,
  },
  revProfileImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  revProfVidContainer: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    minWidth: 215,
    height: 35,
    borderRadius: 15,
    marginRight: 1,
    position: 'relative',
  },
  revProfileVid: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute',
    top: 0,
  },
  revProfPlayVid: {
    position: 'absolute',
    top: '25%',
    left: '45%',
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

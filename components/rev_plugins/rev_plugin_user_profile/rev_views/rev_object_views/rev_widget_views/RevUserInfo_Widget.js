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
import {LoremIpsum} from 'lorem-ipsum';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {revFormatLongDate} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevUserInfo_Widget = ({revVarArgs}) => {
  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !revVarArgs.hasOwnProperty('revVarArgs')
  ) {
    return null;
  }

  let revOwkiMemberEntity = revVarArgs.revVarArgs;

  if (revIsEmptyJSONObject(revOwkiMemberEntity)) {
    return null;
  }

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revOwkiMemberEntity);

  if (revEntityGUID < 1) {
    return null;
  }

  if (!revOwkiMemberEntity.hasOwnProperty('_revInfoEntity')) {
    return null;
  }

  let revInfoEntity = revOwkiMemberEntity._revInfoEntity;
  if (
    !revInfoEntity.hasOwnProperty('_remoteRevEntityGUID') ||
    revInfoEntity._remoteRevEntityGUID < 0
  ) {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_full_names',
  );

  let revUserRegLongDate = revInfoEntity._revTimePublished;
  let revFormattedLongDate = revFormatLongDate(revUserRegLongDate);

  let minMessageLen = 10;
  let maxMessageLen = 55;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 2,
      min: 1,
    },
    wordsPerSentence: {
      max: getRndInteger(minMessageLen, maxMessageLen),
      min: getRndInteger(1, 2),
    },
  });

  let revUserInfoDescTxt = lorem.generateSentences(getRndInteger(1, 3));

  const RevDrawUserInfo = ({revLabel, revVal}) => {
    return (
      <View
        key={'RevUserInfo_Widget_' + revEntityGUID}
        style={[styles.revFlexWrapper, styles.revUserInfoWrapper]}>
        <Text
          style={[
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
            styles.revSiteTxtBold,
            styles.revUserInfoLabel,
          ]}>
          {revLabel}
        </Text>
        <Text
          style={[
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
            styles.revFlexWrapper,
            styles.revUserInfoVal,
          ]}>
          {revVal}
        </Text>
      </View>
    );
  };

  const RevUserProfileMedia = () => {
    return (
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.profileImagesScroller}>
        <View style={[[styles.revFlexWrapper, styles.revProfileMediaWrapper]]}>
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

  const RevInfoSettings = () => {
    return (
      <View style={[styles.revFlexContainer]}>
        <View
          style={[
            styles.revFlexContainer,
            styles.revUserInfoSettingsContainer,
          ]}>
          <RevDrawUserInfo
            revLabel={'Full names'}
            revVal={revPublisherEntityNames}
          />
          <RevDrawUserInfo revLabel={'About'} revVal={revUserInfoDescTxt} />
          <RevDrawUserInfo
            revLabel={'member since'}
            revVal={revFormattedLongDate}
          />
        </View>

        <RevUserProfileMedia />
      </View>
    );
  };

  return <RevInfoSettings />;
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtNormal: {
    fontSize: 11,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revSiteTxtBold: {
    fontWeight: 'bold',
  },
  revSiteTxtWeightNormal: {
    fontWeight: '100',
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
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
  revUserInfoSettingsContainer: {
    marginTop: 0,
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
  revUserInfoLabel: {
    textAlign: 'right',
    width: 55,
  },
  revUserInfoVal: {
    width: maxChatMessageContainerWidth - 55,
    marginLeft: 4,
  },
  profileImagesScroller: {
    flexGrow: 0,
    marginTop: 4,
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
    verticalAlign: 'middle',
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
    verticalAlign: 'middle',
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
});

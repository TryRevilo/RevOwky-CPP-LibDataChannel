import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../rev_plugins_loader';

import {useRevSiteStyles} from './RevSiteStyles';

const RevNullMessagesView = () => {
  const {revSiteStyles} = useRevSiteStyles();

  let RevHeaderLink = ({revLinkText}) => {
    return (
      <TouchableOpacity>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
            styles.revHeaderTextLink,
          ]}>
          / {'  '}
          {revLinkText}
        </Text>
      </TouchableOpacity>
    );
  };

  let RevHeaderLinks = () => {
    return (
      <View style={revSiteStyles.revFlexWrapper}>
        <RevHeaderLink revLinkText={'networks'} />
        <RevHeaderLink revLinkText={'posts'} />
        <RevHeaderLink revLinkText={<FontAwesome name="shopping-bag" />} />
      </View>
    );
  };

  const revHandleOnLogOutTabPressed = () => {
    SET_REV_LOGGED_IN_ENTITY_GUID(0);
  };

  let RevHeader = () => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <TouchableOpacity onPress={revHandleOnLogOutTabPressed}>
          <Text style={styles.revContentBodyTtlTellTxt}>
            <FontAwesome name="dot-circle-o" />
            <FontAwesome name="long-arrow-right" /> Info
          </Text>
        </TouchableOpacity>
        <View>
          <RevHeaderLinks />
        </View>
      </View>
    );
  };

  const RevTimelineActivityListingView = () => {
    let RevTimelineActivityListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_timeline_activity',
      revViewName: 'RevTimelineActivityListingView',
      revData: 'Hello World!',
    });

    return RevTimelineActivityListingView;
  };

  return (
    <View>
      <RevHeader />

      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.profileImagesScroller}>
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
    </View>
  );
};

export default RevNullMessagesView;

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 65;

const styles = StyleSheet.create({
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: maxChatMessageContainerWidth + 55,
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
    paddingLeft: 9,
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
});

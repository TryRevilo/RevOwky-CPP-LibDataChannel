import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {LoremIpsum} from 'lorem-ipsum';

import {revPluginsLoader} from '../../../../rev_plugins_loader';
import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {useRevGetLoggedInSiteEntity} from '../../../../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';

const {RevPersLibUpdate_React} = NativeModules;

export const RevUserSettings = () => {
  const {REV_LOGGED_IN_ENTITY_GUID, SET_REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const {revGetLoggedInSiteEntity} = useRevGetLoggedInSiteEntity();

  const [revIsEditView, setRevIsEditView] = useState(false);

  let RevHeaderLink = ({revLinkText}) => {
    return (
      <TouchableOpacity>
        <Text
          style={[
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
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
      <View style={styles.revFlexWrapper}>
        <RevHeaderLink revLinkText={'info'} />
        <RevHeaderLink revLinkText={'account'} />
        <RevHeaderLink revLinkText={<FontAwesome name="shopping-bag" />} />
      </View>
    );
  };

  const revHandleOnLogOutTabPressed = () => {
    let revSiteEntity = revGetLoggedInSiteEntity(REV_LOGGED_IN_ENTITY_GUID);
    let revEntityResolveStatusByRevEntityGUID =
      RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
        0,
        revSiteEntity._revEntityGUID,
      );

    if (revEntityResolveStatusByRevEntityGUID) {
      SET_REV_LOGGED_IN_ENTITY_GUID(-1);
    }
  };

  let RevHeader = () => {
    return (
      <View style={[styles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <TouchableOpacity onPress={revHandleOnLogOutTabPressed}>
          <Text style={styles.revContentBodyTtlTellTxt}>
            <FontAwesome name="dot-circle-o" />
            <FontAwesome name="long-arrow-right" /> Log out
          </Text>
        </TouchableOpacity>
        <View>
          <RevHeaderLinks />
        </View>
      </View>
    );
  };

  let minMessageLen = 10;
  let maxMessageLen = 55;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: getRndInteger(minMessageLen, maxMessageLen),
      min: getRndInteger(1, 2),
    },
  });

  let chatMsg = lorem.generateSentences(getRndInteger(1, 5));

  const RevDrawUserInfo = ({revLabel, revVal}) => {
    return (
      <View style={[styles.revFlexWrapper, styles.revUserInfoWrapper]}>
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
          <RevDrawUserInfo revLabel={'Full names'} revVal={'Oliver Muchai'} />
          <RevDrawUserInfo revLabel={'About'} revVal={chatMsg} />
          <RevDrawUserInfo
            revLabel={'member since'}
            revVal={'10:40 Jun 14, 2022'}
          />
        </View>

        <RevUserProfileMedia />
      </View>
    );
  };

  const [RevSettingsBody, setRevSettingsBody] = useState(<RevInfoSettings />);

  const revHandleEditInfoTabPressed = () => {
    let RevEditUserInfoForm = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevEditUserInfoForm',
      revData: 'Hello World!',
    });

    setRevIsEditView(!revIsEditView);

    if (!revIsEditView) {
      setRevSettingsBody(RevEditUserInfoForm);
    } else {
      setRevSettingsBody(<RevInfoSettings />);
    }
  };

  const RevGetEditTab = () => {
    return (
      <TouchableOpacity onPress={revHandleEditInfoTabPressed}>
        <Text
          style={[
            styles.revSiteTxtColor,
            styles.revSiteTxtSmall,
            styles.revEditTab,
          ]}>
          <FontAwesome name="edit" style={styles.revSiteTxtSmall} /> - Edit
        </Text>
      </TouchableOpacity>
    );
  };

  const RevGetBackTab = () => {
    return (
      <TouchableOpacity onPress={revHandleEditInfoTabPressed}>
        <Text
          style={[
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
            styles.revEditTab,
          ]}>
          <FontAwesome
            name="long-arrow-left"
            style={[styles.revSiteTxtSmall, styles.revSiteTxtWeightNormal]}
          />
          <FontAwesome
            name="dot-circle-o"
            style={[styles.revSiteTxtSmall, styles.revSiteTxtWeightNormal]}
          />{' '}
          BacK
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.revFlexContainer, styles.revSearchResultsContainer]}>
      <RevHeader />
      {revIsEditView ? <RevGetBackTab /> : <RevGetEditTab />}
      <View style={[styles.revFlexContainer]}>{RevSettingsBody}</View>
    </View>
  );
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

import {StyleSheet, View, Image, ScrollView, Dimensions} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useRevSiteStyles} from './RevSiteStyles';
import RevPageContentHeader from './RevPageContentHeader';
import {RevScrollView_H} from './rev_page_views';

const RevNullMessagesView = () => {
  const {revSiteStyles} = useRevSiteStyles();

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

  let revImagesScrollArea = (
    <RevScrollView_H revScrollViewContent={revProfileImagesArea} />
  );

  return (
    <View>
      <RevPageContentHeader revVarArgs={{revIsIndented: false}} />

      <View style={{marginTop: 4}}>{revImagesScrollArea}</View>
    </View>
  );
};

export default RevNullMessagesView;

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 65;

const styles = StyleSheet.create({
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
});

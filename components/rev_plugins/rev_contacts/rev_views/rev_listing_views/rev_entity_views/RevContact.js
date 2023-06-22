import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

let RevContactItemsDraw = ({revContactsArr}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revContactsArrLen = revContactsArr.length;

  if (revContactsArrLen == 1) {
    let revContactItem = revContactsArr[0];
    return (
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
        ]}>
        {revContactItem.number}
      </Text>
    );
  }

  return (
    <Text
      style={[
        revSiteStyles.revSiteTxtColorLight,
        revSiteStyles.revSiteTxtTiny,
      ]}>
      {revContactsArr.map(
        (revContactItem, index) =>
          revContactItem.number +
          (index == revContactsArr.length - 1 ? '' : ' / '),
      )}
    </Text>
  );
};

export function RevContact({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  let revPhoneNumbers = revVarArgs.phoneNumbers;
  let revDisplayName = revVarArgs.displayName;

  const handleRevContactPressed = () => {
    console.log('>>> handleRevContactPressed', JSON.stringify(revPhoneNumbers));
  };

  return (
    <TouchableOpacity onPress={handleRevContactPressed}>
      <View style={[revSiteStyles.revFlexWrapper, styles.revContactWrapper]}>
        <View style={styles.revContactUserIcon}>
          <FontAwesome
            name="user"
            style={[
              revSiteStyles.revSiteTxtLarge,
              styles.revAvailableChatPeopleNonIcon,
            ]}
          />
        </View>
        <View style={styles.revContactContentWrapper}>
          <View style={styles.revrevContactContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={[
                revSiteStyles.revSiteTxtColorLight_X,
                revSiteStyles.revSiteTxtLarge,
              ]}
            />
          </View>
          <View style={styles.revContactContentContainer}>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revContactHeaderWrapper,
              ]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorDark,
                  revSiteStyles.revSiteTxtBold,
                  revSiteStyles.revSiteTxtTiny,
                ]}>
                {revDisplayName}
              </Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny_X,
                  styles.revContactSendTime,
                ]}>
                10:40 Jun 14, 2022
              </Text>
              <View style={styles.revrevContactOptionsWrapper}>
                <Text style={styles.revContactOptions}>
                  <FontAwesome name="quote-right" />
                </Text>
                <Text style={styles.revContactOptions}>
                  <FontAwesome name="phone" />
                </Text>
                <Text style={styles.revContactOptions}>
                  <FontAwesome name="video-camera" />
                </Text>
              </View>
            </View>
            <View style={styles.revContactContentTxtContainer}>
              <RevContactItemsDraw revContactsArr={revPhoneNumbers} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

var pageWidth = Dimensions.get('window').width;
var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revContactWrapper: {
    alignItems: 'flex-start',
  },
  revContactUserIcon: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    marginTop: 2,
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderRadius: 100,
  },
  revAvailableChatPeopleNonIcon: {
    color: '#c5e1a5',
  },
  revContactContentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  revrevContactContentCarretView: {
    flex: 0,
    backgroundColor: '#FFF',
    marginTop: 7,
    marginRight: 1,
    marginLeft: 1,
  },
  revContactContentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#F7F7F7',
    width: maxChatMessageContainerWidth,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 2,
  },
  revContactHeaderWrapper: {
    alignItems: 'baseline',
    borderBottomColor: '#rgba(27, 31, 35, 0.06)',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginTop: 4,
    position: 'relative',
  },
  revContactSendTime: {
    marginRight: 12,
    marginLeft: 5,
  },
  revrevContactOptionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
    position: 'relative',
  },
  revContactOptions: {
    color: '#bdbdbd',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  revContactContentTxtContainer: {
    color: '#444',
    fontSize: 10,
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 4,
    marginTop: 2,
  },
});

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

let RevContactItemsDraw = ({revContactsArr}) => {
  let revContactsArrLen = revContactsArr.length;

  if (revContactsArrLen == 1) {
    let revContactItem = revContactsArr[0];
    return <Text key={Math.random().toString()}>{revContactItem.number}</Text>;
  }

  return revContactsArr.map(revContactItem => {
    return (
      <Text key={Math.random().toString()}>{revContactItem.number} / </Text>
    );
  });
};

export function RevContact({revVarArgs}) {
  let revPhoneNumbers = revVarArgs.phoneNumbers;
  let revDisplayName = revVarArgs.displayName;
  let revRawContactId = revVarArgs.rawContactId;

  return (
    <TouchableOpacity key={Math.random().toString()}>
      <View style={styles.contactWrapper}>
        <View style={styles.contactUserIcon}>
          <FontAwesome name="user" style={styles.availableChatPeopleNonIcon} />
        </View>
        <View style={styles.contactContentWrapper}>
          <View style={styles.contactContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={styles.contactContentCarret}
            />
          </View>
          <View style={styles.contactContentContainer}>
            <View style={styles.contactHeaderWrapper}>
              <Text style={styles.contactOwnerTxt}>{revDisplayName}</Text>
              <Text style={styles.contactSendTime}>10:40 Jun 14, 2022</Text>
              <View style={styles.contactOptionsWrapper}>
                <Text style={styles.contactOptions}>
                  <FontAwesome name="quote-right" />
                </Text>
                <Text style={styles.contactOptions}>
                  <FontAwesome name="phone" />
                </Text>
                <Text style={styles.contactOptions}>
                  <FontAwesome name="video-camera" />
                </Text>
              </View>
            </View>
            <View style={styles.contactContentTxtContainer}>
              <Text style={styles.contactContentTxt}>
                <RevContactItemsDraw
                  key={Math.random().toString()}
                  revContactsArr={revPhoneNumbers}
                />
              </Text>
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
  contactWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
  },
  contactUserIcon: {
    width: 22,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableChatPeopleNonIcon: {
    color: '#c5e1a5',
    fontSize: 17,
  },
  contactContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  contactContentCarretView: {
    backgroundColor: '#FFF',
    height: 'auto',
    marginTop: 6,
    marginRight: 1,
    marginLeft: 1,
    zIndex: 1,
  },
  contactContentCarret: {
    color: '#DDD',
    textAlign: 'center',
    fontSize: 15,
  },
  contactContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#F7F7F7',
    width: maxChatMessageContainerWidth,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 2,
  },
  contactHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomColor: '#rgba(27, 31, 35, 0.06)',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginTop: 4,
    position: 'relative',
  },
  contactOwnerTxt: {
    color: '#666',
    fontSize: 11,
    lineHeight: 11,
    fontWeight: 'bold',
  },
  contactSendTime: {
    color: '#8d8d8d',
    fontSize: 9,
    lineHeight: 9,
    marginRight: 12,
    marginLeft: 5,
  },
  contactOptionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
    position: 'relative',
  },
  contactOptions: {
    color: '#bdbdbd',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  contactContentTxtContainer: {
    color: '#444',
    fontSize: 10,
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 4,
    marginTop: 2,
  },
  contactContentTxt: {
    color: '#777',
    fontSize: 9,
    lineHeight: 10,
    fontWeight: 'bold',
    paddingTop: 5,
  },
});

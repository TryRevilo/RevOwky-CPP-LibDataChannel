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

export function RevContact({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revIndex,
    phoneNumbers: revPhoneNumbers,
    displayName: revDisplayName,
    handleRevContactPressed,
    RevContactItemsDraw,
  } = revVarArgs;

  return (
    <TouchableOpacity
      onPress={() => {
        handleRevContactPressed(revPhoneNumbers);
      }}>
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
          <View
            style={[
              styles.revContactContentContainer,
              {backgroundColor: revIndex % 2 == 0 ? '#FFFFFF' : '#F7F7F7'},
            ]}>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revContactHeaderWrapper,
              ]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorDark,
                  revSiteStyles.revSiteTxtBold,
                  revSiteStyles.revSiteTxtTiny_X,
                ]}>
                {revDisplayName}
              </Text>
            </View>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revContactContentTxtContainer,
              ]}>
              <RevContactItemsDraw revContactsArr={revPhoneNumbers} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

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
    paddingHorizontal: 5,
    paddingVertical: 5,
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
  revContactContentTxtContainer: {
    paddingBottom: 4,
    marginTop: 2,
  },
});

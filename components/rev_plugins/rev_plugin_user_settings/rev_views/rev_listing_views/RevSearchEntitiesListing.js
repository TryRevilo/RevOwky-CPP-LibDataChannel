import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export const RevSearchEntitiesListing = () => {
  const {revSiteStyles} = useRevSiteStyles();

  let RevHeaderLink = ({revLinkText}) => {
    return (
      <TouchableOpacity>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revHeaderTextLink,
          ]}>
          / {'   '}
          {revLinkText}
        </Text>
      </TouchableOpacity>
    );
  };

  let RevHeaderLinks = () => {
    return (
      <View style={revSiteStyles.revFlexWrapper}>
        <RevHeaderLink revLinkText={'mine'} />
        <RevHeaderLink revLinkText={'contacts'} />
        <RevHeaderLink revLinkText={'all'} />
      </View>
    );
  };

  let RevHeader = () => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <Text style={styles.revContentBodyTtlTellTxt}>
          <FontAwesome name="dot-circle-o" />
          <FontAwesome name="long-arrow-right" /> Find
        </Text>
        <View>
          <RevHeaderLinks />
        </View>
      </View>
    );
  };

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      <RevHeader />
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revSearchResultsContainer,
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtSmall,
          ]}>
          RevSearchEntitiesListing
        </Text>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revHeaderTextLink: {
    marginLeft: 4,
  },
  revContentBodyTtlTellTxt: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 38,
  },
  revSearchResultsContainer: {
    marginTop: 8,
    width: pageWidth - 10,
  },
});

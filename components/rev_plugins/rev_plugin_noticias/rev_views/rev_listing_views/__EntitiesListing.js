import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import RevPageContentHeader from '../../../../rev_views/RevPageContentHeader';

export const RevSearchEntitiesListing = () => {
  return (
    <View style={[styles.revFlexContainer]}>
      <RevPageContentHeader />
      <View style={[styles.revFlexContainer, styles.revSearchResultsContainer]}>
        <Text style={[styles.revSiteTxtColor, styles.revSiteTxtSmall]}>
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
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
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
    width: '100%',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revHeaderTextLink: {
    color: '#90a4ae',
    fontSize: 11,
    marginLeft: 4,
  },
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
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
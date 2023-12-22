import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevWebRTCContext} from '../../rev_contexts/RevWebRTCContext';

import {revIsEmptyJSONObject} from '../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from './RevSiteStyles';

const RevPageContentHeader = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {isRevSocketServerUp} = useContext(RevWebRTCContext);

  let revIsOnline = (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        styles.revHeaderOnlineStateWrapper,
      ]}>
      <FontAwesome
        style={[
          revSiteStyles.revSiteTxtAlertSafe,
          revSiteStyles.revSiteTxtTiny_X,
        ]}
        name="dot-circle-o"
      />
      <Text
        style={[
          revSiteStyles.revSiteTxtAlertSafe,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny_X,
          styles.revHeaderOnlineStateTextLink,
        ]}>
        onLiNE
      </Text>
    </View>
  );

  let revIsOoffline = (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        styles.revHeaderOnlineStateWrapper,
      ]}>
      <FontAwesome
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny_X,
        ]}
        name="dot-circle-o"
      />
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny_X,
          styles.revHeaderOnlineStateTextLink,
        ]}>
        offLiNE
      </Text>
    </View>
  );

  const [revIsOnlineView, setRevIsOnlineView] = useState(revIsOnline);

  let revIsIndented = true;

  if (
    !revIsEmptyJSONObject(revVarArgs) &&
    revVarArgs.hasOwnProperty('revIsIndented')
  ) {
    revIsIndented = revVarArgs.revIsIndented;
  }

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
      <View style={[revSiteStyles.revFlexWrapper, {alignItems: 'center'}]}>
        <RevHeaderLink revLinkText={'mine'} />
        <RevHeaderLink revLinkText={'contacts'} />
        <RevHeaderLink revLinkText={<FontAwesome name="shopping-bag" />} />
      </View>
    );
  };

  useEffect(() => {
    if (isRevSocketServerUp) {
      setRevIsOnlineView(revIsOnline);
    } else {
      setRevIsOnlineView(revIsOoffline);
    }
  }, [isRevSocketServerUp]);

  let RevHeader = () => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
            revIsIndented
              ? styles.revAllItemsListingFilterTabIndented
              : styles.revAllItemsListingFilterTabUnIndented,
          ]}>
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="dot-circle-o"
          />
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="long-arrow-right"
          />{' '}
          All
        </Text>

        <RevHeaderLinks />

        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revHeaderOnlineStateWrapper,
          ]}>
          {revIsOnlineView}
        </View>
      </View>
    );
  };

  return <RevHeader />;
};

export default RevPageContentHeader;

const styles = StyleSheet.create({
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  revHeaderTextLink: {
    marginLeft: 4,
  },
  revAllItemsListingFilterTabIndented: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 38,
  },
  revAllItemsListingFilterTabUnIndented: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 4,
  },
  revHeaderOnlineStateWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginRight: 17,
    marginLeft: 'auto',
  },
  revHeaderOnlineStateTextLink: {
    marginLeft: 2,
  },
});

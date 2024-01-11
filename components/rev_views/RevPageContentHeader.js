import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevRemoteSocketContext} from '../../rev_contexts/RevRemoteSocketContext';

import {
  revIsEmptyJSONObject,
  revSetStateData,
} from '../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from './RevSiteStyles';

const RevPageContentHeader = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {isRevSocketServerUp} = useContext(RevRemoteSocketContext);

  let revIsOnline = (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
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

  let revIsOffline = (
    <View
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
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
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
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
        <RevHeaderLink revLinkText={'MiNE'} />
        <RevHeaderLink revLinkText={'CoNTActs'} />
      </View>
    );
  };

  useLayoutEffect(() => {
    if (isRevSocketServerUp) {
      revSetStateData(setRevIsOnlineView, revIsOnline);
    } else {
      revSetStateData(setRevIsOnlineView, revIsOffline);
    }
  }, [isRevSocketServerUp]);

  return (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        styles.revPageHeaderAreaWrapper,
        revIsIndented
          ? styles.revAllItemsListingFilterTabIndented
          : styles.revAllItemsListingFilterTabUnIndented,
      ]}>
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revHeaderTextLink,
          {alignItems: 'center'},
        ]}>
        <FontAwesome
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny_X,
          ]}
          name="dot-circle-o"
        />
        <FontAwesome
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny_X,
          ]}
          name="long-arrow-right"
        />
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          {' '}
          ALL
        </Text>
      </View>

      <RevHeaderLinks />

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revHeaderOnlineStateWrapper,
          styles.revHeaderTextLink,
        ]}>
        {revIsOnlineView}
      </View>
    </View>
  );
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
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 8,
  },
  revAllItemsListingFilterTabIndented: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 22,
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
    marginRight: 5,
    marginLeft: 'auto',
  },
  revHeaderOnlineStateTextLink: {
    marginLeft: 2,
  },
});

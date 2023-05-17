import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {
  RevScrollView_H,
  RevDescriptiveTitleView,
  RevImageView,
  RevParallelogramShapeClip,
  RevSectionPointer,
} from '../../../../../rev_views/rev_page_views';

import {revGenLoreumIpsumText} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevAdObjectViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revAdEntityListingView = revPluginsLoader({
    revPluginName: 'rev_plugin_ads',
    revViewName: 'RevAdEntityListingView',
    revVarArgs: {},
  });

  let revAboutOrganizationBrief = (
    <Text
      style={[
        revSiteStyles.revSiteTxtColorLight,
        revSiteStyles.revSiteTxtTiny,
      ]}>
      <Text style={revSiteStyles.revSiteTxtBold}>Brief</Text>
      <Text>{' ' + revGenLoreumIpsumText({revMaxCharCount: 155})}</Text>
    </Text>
  );

  let revAboutOrganization = (
    <Text
      style={[
        revSiteStyles.revSiteTxtColorLight,
        revSiteStyles.revSiteTxtTiny,
      ]}>
      <Text style={revSiteStyles.revSiteTxtBold}>About us</Text>
      <Text>
        {' ' +
          revGenLoreumIpsumText({revMaxCharCount: 555, revMaxSentences: 12})}
      </Text>
    </Text>
  );

  let revProductLineItems = () => {
    let revPructLineItems = (
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revProductLineItemsWrapper,
        ]}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(revView => (
          <View
            key={revView}
            style={[
              revSiteStyles.revFlexContainer,
              styles.revProductLineItemContainer,
            ]}>
            <RevImageView />
            <View
              style={[
                revSiteStyles.revFlexContainer,
                styles.revProductLineItemDescContainer,
              ]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtBold,
                  styles.revSiteProductLineTxtTiny,
                ]}>
                My Product
              </Text>
            </View>
          </View>
        ))}
      </View>
    );

    return (
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revProductLineItemsContainer,
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {'     Product line'}
        </Text>

        <RevScrollView_H revScrollViewContent={revPructLineItems} />
      </View>
    );
  };

  const RevOrgPic = ({revItemData}) => {
    return (
      <View style={[revItemData !== 1 ? styles.revOrgPicItem : null]}>
        <RevParallelogramShapeClip
          revWidth={55}
          revHeight={55}
          revContent={<View style={styles.revOrgPicContainer} />}
        />
      </View>
    );
  };

  let revOrgPiscArr = (
    <View style={[revSiteStyles.revFlexWrapper, styles.revOrgPiscArrWrapper]}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(revItemData => (
        <RevOrgPic key={revItemData} revItemData={revItemData} />
      ))}
    </View>
  );

  const RevTeamMember = () => {
    let revContent = (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revTeamMemberWrapper,
        ]}>
        <RevSectionPointer revStyles={{marginTop: 0, marginRight: 1}} />
        <View style={[revSiteStyles.revUserIconTinyCircle]}></View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revTeamMemberTxt,
          ]}>
          <Text style={[revSiteStyles.revSiteTxtBold]}>Oliver Muchai</Text>
          <Text style={[revSiteStyles.revSiteTxtWeightNormal]}>
            {'  -  ' +
              revGenLoreumIpsumText({revMaxCharCount: 155, revMaxSentences: 5})}
          </Text>
        </Text>
      </View>
    );

    return revContent;
  };

  return (
    <View>
      {revAdEntityListingView}

      <RevDescriptiveTitleView
        revVarArgs={{
          revTitle: 'Stores',
          revNullContentTxt: 'no stores published on this profile yet',
        }}
      />

      <RevDescriptiveTitleView
        revVarArgs={{
          revTitle: 'ABout us',
          revNullContentTxt: 'no stores published on this profile yet',
          revBodyContentItemsArr: [
            revAboutOrganizationBrief,
            revAboutOrganization,
          ],
        }}
      />

      {revProductLineItems()}

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revTeamMembersContainer,
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revSiteTxtBold,
            styles.revTeamTtlText,
          ]}>
          The Team
        </Text>
        {[1, 2, 3].map(revItemData => (
          <RevTeamMember key={revItemData} />
        ))}
      </View>

      <RevScrollView_H revScrollViewContent={revOrgPiscArr} />
    </View>
  );
};

const styles = StyleSheet.create({
  revProductLineItemsContainer: {
    marginTop: 10,
  },
  revProductLineItemContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#ede7f6',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 2,
    marginRight: 4,
  },
  revProductLineItemsWrapper: {
    marginTop: 4,
  },
  revProductLineItemDescContainer: {
    marginTop: 4,
  },
  revSiteProductLineTxtTiny: {
    fontSize: 8,
  },
  revOrgPiscArrWrapper: {
    marginTop: 10,
  },
  revOrgPicItem: {
    marginLeft: -19,
  },
  revOrgPicContainer: {
    backgroundColor: '#ede7f6',
    width: 55,
    height: 35,
  },

  /** START REV TEAM MEMBER */
  revTeamMembersContainer: {
    marginTop: 8,
  },
  revTeamTtlText: {
    width: 70,
    paddingHorizontal: 10,
    borderBottomColor: '#ede7f6',
    borderBottomWidth: 1,
  },
  revTeamMemberWrapper: {
    alignItems: 'flex-start',
    marginTop: 4,
    marginLeft: 22,
  },
  revTeamMemberTxt: {
    paddingRight: 20,
    marginTop: 3,
    marginLeft: 2,
  },
});

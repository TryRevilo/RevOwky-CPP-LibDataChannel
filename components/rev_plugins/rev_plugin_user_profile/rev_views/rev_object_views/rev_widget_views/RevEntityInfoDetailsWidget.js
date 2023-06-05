import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {revIsUserEntity_WithInfo} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {
  revSplitStringToArray,
  revStringEmpty,
} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {revFormatLongDate} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGenLoreumIpsumText} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevCenteredImage} from '../../../../../rev_views/rev_page_views';

export const RevEntityInfoDetailsWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (!revIsUserEntity_WithInfo(revVarArgs)) {
    return null;
  }

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);
  let revInfoEntity = revVarArgs._revInfoEntity;

  let revEntityFullNames = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_full_names',
  );

  let revEntityDescVal = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_entity_desc_val',
  );

  let revAboutEntityInfo = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_about_entity_info',
  );

  let revEntityFullNamesArr = revSplitStringToArray(revEntityFullNames);
  let revEntityFirstName = revEntityFullNamesArr[0];
  let revEntityOtherNamesArr = revEntityFullNamesArr.splice(
    1,
    revEntityFullNamesArr.length,
  );

  let revUserRegLongDate = revVarArgs._revTimeCreated;
  let revFormattedLongDate = revFormatLongDate(revUserRegLongDate);

  let revMainEntityIconVal = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_main_entity_icon_val',
  );

  let revMainEntityIconView = !revStringEmpty(revMainEntityIconVal) ? (
    <RevCenteredImage
      revImageURI={revMainEntityIconVal}
      revImageDimens={{revWidth: 28, revHeight: 28}}
      revStyles={{borderRadius: 100}}
    />
  ) : (
    <FontAwesome name="user" style={revSiteStyles.revSiteTxtLarge} />
  );

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revPaymentBriefContainer]}>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revPPalPaymentBriefLeftContainer,
          ]}>
          <View style={[revSiteStyles.revFlexWrapper]}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtTiny,
              ]}>
              {revEntityFirstName}
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtWeightNormal,
                revSiteStyles.revSiteTxtTiny,
              ]}>
              {' '}
              {revEntityOtherNamesArr.toString().replace(',', ' ')}
            </Text>
          </View>

          <View
            style={[revSiteStyles.revFlexContainer, styles.revMarginTopText]}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}>
              {'Joined ' + revFormattedLongDate}
            </Text>
            <View style={[]}></View>

            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}>
              <Text style={[revSiteStyles.revSiteTxtBold]}>ID :</Text>
              <Text> {revEntityGUID}</Text>
            </Text>
          </View>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revPaymentStatusWrapper,
            ]}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}>
              Verified :
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
                styles.revPPalPaymentBriefPaymentStatus,
              ]}>
              not yet
            </Text>
          </View>

          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            <Text style={revSiteStyles.revSiteTxtBold}>brief -</Text>
            <Text>{' ' + revEntityDescVal}</Text>
          </Text>

          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            <Text style={revSiteStyles.revSiteTxtBold}>about -</Text>
            <Text>{' ' + revAboutEntityInfo}</Text>
          </Text>
        </View>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revPPalGrossAmtContainer,
          ]}>
          <View
            style={[
              revSiteStyles.revUserIconSmallCircle,
              {width: 32, height: 32},
            ]}>
            {revMainEntityIconView}
          </View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            +.6
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revPPalPaymentBriefLeftContainer: {
    width: 'auto',
  },
  revMarginTopText: {
    marginTop: 4,
  },
  revPaymentStatusWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  revPPalPaymentBriefPaymentStatus: {
    borderColor: '#21ce93',
    borderWidth: 1,
    paddingHorizontal: 4,
    marginTop: 2,
    marginLeft: 2,
  },
  revPPalPaymentRowWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  revRightDetailsTxt: {
    marginLeft: 2,
  },
  revPPalGrossAmtContainer: {
    alignItems: 'center',
    width: 'auto',
    marginLeft: 'auto',
  },
});

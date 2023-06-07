import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevTextInput} from '../../../../../rev_views/rev_input_form_views';

import {
  RevDescriptiveTitleView,
  RevInfoArea,
} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevAdCampaignTeamInputFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revPhoneNumber, setRevPhoneNumber] = useState('');
  const [revInputBudgetAmount, setRevInputBudgetAmount] = useState(0);
  const [revImpressions, setRevImpressions] = useState(0);

  const handleRevEMailInputChange = revTxtVal => {
    setRevPhoneNumber(revTxtVal);
  };

  let revPhoneNumberInput = (
    <View style={[revSiteStyles.revFlexWrapper, styles.revEMailInputWrapper]}>
      <RevTextInput
        revVarArgs={{
          revPlaceHolderTxt: 'Phone # . . .   ',
          revTextInputOnChangeCallBack: handleRevEMailInputChange,
          revKeyboardType: 'phone-pad',
        }}
      />
    </View>
  );

  let revEMailInput = (
    <View style={[revSiteStyles.revFlexWrapper, styles.revEMailInputWrapper]}>
      <RevTextInput
        revVarArgs={{
          revPlaceHolderTxt: 'EMail . . .   ',
          revTextInputOnChangeCallBack: handleRevEMailInputChange,
          revKeyboardType: 'email-address',
        }}
      />
    </View>
  );

  let revTeamMemberFullNamesInput = (
    <View style={[revSiteStyles.revFlexWrapper, styles.revEMailInputWrapper]}>
      <RevTextInput
        revVarArgs={{
          revPlaceHolderTxt: 'Names . . .   ',
          revTextInputOnChangeCallBack: handleRevEMailInputChange,
          revKeyboardType: 'email-address',
        }}
      />
    </View>
  );

  let revRetView = (
    <View style={revSiteStyles.revFlexContainer}>
      {revPhoneNumberInput}
      {revEMailInput}
      {revTeamMemberFullNamesInput}
      {
        <View
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revFlexWrapper,
            styles.revAddTeamMemberTabWrapper,
          ]}>
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtSmall,
            ]}
            name="plus"
          />
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            {' add member'}
          </Text>
        </View>
      }
    </View>
  );

  let revCampaignTextInfoTxt =
    'Only you will be able to alter the Ad. People you add here will be listed as Team Members on the Ad Campaign Page ';

  return (
    <RevDescriptiveTitleView
      revVarArgs={{
        revTitle: 'Campaign Team [ optional ]',
        revNullContentTxt: '',
        revBodyContentItemsArr: [
          <RevInfoArea revInfoText={revCampaignTextInfoTxt} />,
          revRetView,
        ],
        revPointerStyles: {marginTop: 15},
        revStyles: {marginTop: 8},
      }}
    />
  );
};

const styles = StyleSheet.create({
  revEMailInputWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  revCurrSetInputBudgetAmount: {
    marginTop: 4,
    marginLeft: 10,
  },
  revAddTeamMemberTabWrapper: {
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 10,
  },
});

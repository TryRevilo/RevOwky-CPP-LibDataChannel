import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import {
  RevTextInput,
  RevDropdownListSelector,
} from '../../../../../rev_views/rev_input_form_views';

import {
  RevDescriptiveTitleView,
  RevInfoArea,
} from '../../../../../rev_views/rev_page_views';

import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevAdBudgetInputFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revDefaultCurrency, setRevDefaultCurrency] = useState('USD');
  const [revInputBudgetAmount, setRevInputBudgetAmount] = useState(0);
  const [revImpressions, setRevImpressions] = useState(0);

  const handleRevBudgetAmountInputChange = revTxtVal => {
    const typingTimer = setTimeout(() => {
      setRevInputBudgetAmount(Number(revTxtVal));
    }, 3000);

    return () => {
      clearTimeout(typingTimer); // Clear the timer on component unmount
    };
  };

  let revCurrencySelectionOptions = require('../../../../rev_plugin_check_out/rev_resources/rev_world_currencies.json');

  let revCurrencySelectionOptionsArr = [];

  Object.keys(revCurrencySelectionOptions).forEach(key => {
    revCurrencySelectionOptionsArr.push({
      key: key,
      value: revCurrencySelectionOptions[key]['name'],
    });
  });

  let revCurrencyDropdownListSelector = (
    <RevDropdownListSelector
      revFixedSelectedValue={revDefaultCurrency}
      revOptions={revCurrencySelectionOptionsArr}
      revOnSelect={setRevDefaultCurrency}
    />
  );

  let revBudgetAmountInput = (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        styles.revBudgetAmountInputWrapper,
      ]}>
      <View style={styles.revBudgetAmountInput}>
        <RevTextInput
          revVarArgs={{
            revPlaceHolderTxt: 'Your Budget amount . . .   ',
            revTextInputOnChangeCallBack: handleRevBudgetAmountInputChange,
            revKeyboardType: 'numeric',
          }}
        />
      </View>

      <View style={styles.revBudgetAmountInputCurrency}>
        {revCurrencyDropdownListSelector}
      </View>
    </View>
  );

  let revRetView = (
    <View>
      {revBudgetAmountInput}
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtMedium,
          styles.revCurrSetInputBudgetAmount,
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          {revTruncateString(revDefaultCurrency, 12, false)}
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtSmall,
          ]}>
          {' ' + revInputBudgetAmount.toLocaleString('en-US') + '    ~'}
        </Text>
        <Text style={[revSiteStyles.revSiteTxtBold]}>
          {revImpressions.toLocaleString('en-US')}
        </Text>
        <Text style={[revSiteStyles.revSiteTxtTiny]}>{' Impressions'}</Text>
      </Text>
    </View>
  );

  useEffect(() => {
    setRevImpressions(revInputBudgetAmount * 185);
  }, [revInputBudgetAmount]);

  let revBudgetImpressionsTextInfoTxt =
    'Please note that this is a minimum estimate';

  return (
    <RevDescriptiveTitleView
      revVarArgs={{
        revTitle: 'Budget & Impressions',
        revNullContentTxt: '',
        revBodyContentItemsArr: [
          <RevInfoArea revInfoText={revBudgetImpressionsTextInfoTxt} />,
          revRetView,
        ],
        revStyles: {marginTop: 8},
        revPointerStyles: {marginTop: 11},
      }}
    />
  );
};

const styles = StyleSheet.create({
  revBudgetAmountInputWrapper: {
    alignItems: 'center',
  },
  revBudgetAmountInput: {
    width: 132,
  },
  revBudgetAmountInputCurrency: {
    flex: 2,
  },
  revCurrSetInputBudgetAmount: {
    flex: 1,
    marginTop: 4,
    marginLeft: 8,
  },
});

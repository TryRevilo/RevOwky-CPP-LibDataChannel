import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCheckOutFormWidget = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');

  let revInfoText =
    'You will be redirected to set your Ad to Live, after which we will start pushing it to the Owky community';
  let revStartSTopInfoText =
    'Please note that you can always Pause the Ad at any time from the Ad Dashboard';

  return (
    <View style={styles.revCheckoutPayContainer}>
      <RevInfoArea revInfoText={revInfoText} />
      <RevInfoArea revInfoText={revStartSTopInfoText} />
      <TextInput
        style={[revSiteStyles.revTextInput, styles.revCheckOutTextInput]}
        placeholderTextColor="#999"
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={[revSiteStyles.revTextInput, styles.revCheckOutTextInput]}
        placeholderTextColor="#999"
        placeholder="Card Holder Name"
        value={cardHolderName}
        onChangeText={setCardHolderName}
      />
      <View style={styles.revRow}>
        <TextInput
          style={[
            [revSiteStyles.revTextInput, styles.revCheckOutTextInput],
            styles.revHalfInput,
          ]}
          placeholderTextColor="#999"
          placeholder="Expiration Date"
          value={expirationDate}
          onChangeText={setExpirationDate}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            [revSiteStyles.revTextInput, styles.revCheckOutTextInput],
            styles.revHalfInputLast,
          ]}
          placeholderTextColor="#999"
          placeholder="CVV"
          value={cvv}
          onChangeText={setCVV}
          keyboardType="numeric"
          secureTextEntry
        />
      </View>

      <View
        style={[revSiteStyles.revFlexWrapper, styles.revCheckOutFooterWrapper]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorWhite,
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revSiteTxtBold,
            styles.revCheckOutTab,
          ]}>
          Pay Now
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revCheckoutPayContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ede7f6',
    borderRadius: 10,
  },
  revRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revCheckOutTextInput: {
    backgroundColor: '#FFF',
    borderWidth: 0,
  },
  revHalfInput: {
    flex: 1,
    marginRight: 5,
  },
  revHalfInputLast: {
    flex: 1,
  },
  revCheckOutFooterWrapper: {
    marginTop: 12,
  },
  revCheckOutTab: {
    backgroundColor: '#444',
    paddingHorizontal: 22,
    paddingVertical: 3,
    borderRadius: 100,
  },
});

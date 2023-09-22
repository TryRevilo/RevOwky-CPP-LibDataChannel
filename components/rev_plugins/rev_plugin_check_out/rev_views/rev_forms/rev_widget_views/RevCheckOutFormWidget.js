import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCheckOutFormWidget = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');

  let revOrderDetails = revPluginsLoader({
    revPluginName: 'rev_plugin_check_out',
    revViewName: 'RevOrderDetails',
    revVarArgs: {},
  });

  let revInfoText =
    'You will be redirected to set your Ad to Live, after which we will start pushing it to the Owky community';
  let revStartStopInfoText =
    'Please note that you can always Pause the Ad at any time from the Ad Dashboard';

  return (
    <View>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revOrderDetailsContainer,
        ]}>
        {revOrderDetails}
      </View>

      <View style={styles.revCheckoutPayContainer}>
        <RevInfoArea revInfoText={revInfoText} />
        <RevInfoArea revInfoText={revStartStopInfoText} />
        <TextInput
          style={[
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revTextInput,
            styles.revCheckOutTextInput,
          ]}
          placeholderTextColor="#999"
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revTextInput,
            styles.revCheckOutTextInput,
          ]}
          placeholderTextColor="#999"
          placeholder="Card Holder Name"
          value={cardHolderName}
          onChangeText={setCardHolderName}
        />
        <View style={styles.revRow}>
          <TextInput
            style={[
              [
                revSiteStyles.revSiteTxtTiny,
                revSiteStyles.revTextInput,
                styles.revCheckOutTextInput,
              ],
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
              [
                revSiteStyles.revSiteTxtTiny,
                revSiteStyles.revTextInput,
                styles.revCheckOutTextInput,
              ],
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
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revCheckOutFooterWrapper,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtTiny_X,
              revSiteStyles.revSiteTxtBold,
              styles.revCheckOutTab,
            ]}>
            Pay Now
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revCheckoutPayContainer: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 17,
    marginTop: -1,
    borderRadius: 12,
  },
  revOrderDetailsContainer: {
    paddingHorizontal: 20,
  },
  revRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revCheckOutTextInput: {
    backgroundColor: '#FFF',
    borderColor: '#EEE',
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

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevOrderDetailsWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <View style={styles.header}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
            styles.orderDetails,
          ]}>
          Order details
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
            styles.quantity,
          ]}>
          Quantity
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
            styles.price,
          ]}>
          Price
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
            styles.subtotal,
          ]}>
          Subtotal
        </Text>
      </View>
      <View style={revSiteStyles.revFlexContainer}>
        <View style={styles.row}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
              styles.revOrderDetailsTd,
            ]}>
            Ad Impressions
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.quantityTd,
            ]}>
            1
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.priceTd,
            ]}>
            $1.35 USD
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.subtotalTd,
            ]}>
            $1.35 USD
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.revOrderDetailsTd}></Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.quantityTd,
            ]}></Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.priceTd,
            ]}>
            Purchase Total
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.subtotalTd,
            ]}>
            $1.35 USD
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.revOrderDetailsTd}></Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.quantityTd,
            ]}></Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.priceTd,
            ]}>
            Funding Source
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.subtotalTd,
            ]}>
            PayPal Account
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revPPalReceiptHeader: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: '#cfd8dc',
    paddingHorizontal: 10,
    marginTop: 8,
  },

  revPayerDetailsContainer: {
    paddingHorizontal: 10,
  },
  revPaymentBriefContainer: {
    marginTop: 5,
  },
  revPPalPaymentAreaUnBordered: {
    borderTopColor: '#cfd8dc',
    borderStyle: 'dotted',
    borderTopWidth: 1,
    paddingVertical: 5,
    marginTop: 5,
  },

  /** */

  revOrderDetailsTableContainer: {
    marginTop: 5,
  },
  header: {
    backgroundColor: '#ede7f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 10,
  },
  orderDetails: {
    flex: 1,
  },
  quantity: {
    textAlign: 'right',
    flex: 1,
  },
  price: {
    textAlign: 'right',
    flex: 1,
  },
  subtotal: {
    textAlign: 'right',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EEE',
    paddingTop: 2,
    paddingHorizontal: 8,
  },
  revOrderDetailsTd: {
    flex: 1,
  },
  quantityTd: {
    flex: 1,
    textAlign: 'right',
  },
  priceTd: {
    flex: 1,
    textAlign: 'right',
  },
  subtotalTd: {
    flex: 1,
    textAlign: 'right',
  },

  /** */
  revLinksFooterContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  revLinksFooterTab: {
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  /** */

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

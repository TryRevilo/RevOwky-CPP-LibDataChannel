import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {RevScrollView_V} from '../../../../../rev_views/rev_output_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevPurchaseReceiptWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revPaymentBrief = (
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
            Payment sent to
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtWeightNormal,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            {' '}
            John Doe's Test Store
          </Text>
        </View>

        <View style={[revSiteStyles.revFlexContainer, styles.revMarginTopText]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            31 March 2021 at 3:22:16 AM GMT-7
          </Text>
          <View style={[]}></View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            ID : 7GH28969JJ087252Y
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
            Payment Status :
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revPPalPaymentBriefPaymentStatus,
            ]}>
            compLEted
          </Text>
        </View>
        <View
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revFlexWrapper,
            styles.revPPalPaymentRowWrapper,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            Payment Type :
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revRightDetailsTxt,
            ]}>
            Checkout
          </Text>
        </View>
      </View>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revPPalGrossAmtContainer,
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          Gross
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtLarge,
            styles.revPPalBriefGrossAmt,
          ]}>
          -$1.35 USD
        </Text>
      </View>
    </View>
  );

  let revShippingAddress = (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        styles.revPPalPaymentAreaUnBordered,
      ]}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revSiteTxtBold,
        ]}>
        Shipping address
      </Text>
      <View style={[revSiteStyles.revFlexContainer]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revPPalPaymentRowWrapper,
          ]}>
          Rev Store Buyer
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revPPalPaymentRowInnerWrapper,
          ]}>
          6448 - 00100
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revPPalPaymentRowInnerWrapper,
          ]}>
          Nairobi, Nairobi 00100
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revPPalPaymentRowInnerWrapper,
          ]}>
          Kenya
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revPPalPaymentRowInnerWrapper,
          ]}>
          254-346-6336
        </Text>
      </View>
    </View>
  );

  const RevOrderDetails = () => {
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
            <Text style={styles.orderDetailsTd}></Text>
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
            <Text style={styles.orderDetailsTd}></Text>
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
            <Text style={styles.orderDetailsTd}></Text>
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

  const RevPaymentDetails = () => {
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
            Your Payment
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny,
              styles.quantity,
            ]}></Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny,
              styles.price,
            ]}></Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny,
              styles.subtotal,
            ]}></Text>
        </View>
        <View style={revSiteStyles.revFlexContainer}>
          <View style={styles.row}>
            <Text style={styles.orderDetailsTd}></Text>
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
            <Text style={styles.orderDetailsTd}></Text>
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
              Sales Tax{' '}
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
            <Text style={styles.orderDetailsTd}></Text>
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
              Shipping{' '}
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
                styles.subtotalTd,
              ]}>
              $0.35 USD
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.orderDetailsTd}></Text>
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
              Handling{' '}
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
                styles.subtotalTd,
              ]}>
              $0.50 USD
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.orderDetailsTd}></Text>
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
              Gross{' '}
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
                styles.subtotalTd,
              ]}>
              $22.00 USD
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.orderDetailsTd}></Text>
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
              Net{' '}
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
                styles.subtotalTd,
              ]}>
              $22.00 USD
            </Text>
          </View>
        </View>
      </View>
    );
  };

  let revPageTitle = (
    <Text
      style={[
        revSiteStyles.revSiteTxtColorLight,
        revSiteStyles.revSiteTxtTiny,
        revSiteStyles.revSiteTxtBold,
        styles.revPPalReceiptHeader,
      ]}>
      Transaction details
    </Text>
  );

  let revRetView = (
    <View style={revSiteStyles.revFlexContainer}>
      {revPageTitle}

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revPayerDetailsContainer,
        ]}>
        {revPaymentBrief}
        {revShippingAddress}
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revOrderDetailsTableContainer,
        ]}>
        <RevOrderDetails />
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revOrderDetailsTableContainer,
        ]}>
        <RevPaymentDetails />
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revLinksFooterContainer,
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revSiteTxtColorBlueLink,
            styles.revLinksFooterTab,
          ]}>
          https://www.example.com
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtTiny,
            revSiteStyles.revSiteTxtColorBlueLink,
            styles.revLinksFooterTab,
          ]}>
          cs-sb-t4q5y5530508@business.example.com
        </Text>
      </View>
    </View>
  );

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <RevPageContentHeader revVarArgs={{revIsIndented: false}} />

      <RevScrollView_V revScrollViewContent={revRetView}></RevScrollView_V>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

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
    alignItems: 'flex-end',
    width: 'auto',
    marginLeft: 'auto',
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
  orderDetailsTd: {
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
});

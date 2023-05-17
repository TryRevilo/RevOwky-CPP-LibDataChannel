import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {
  RevScrollView_H,
  RevScrollView_V,
} from '../../../../../rev_views/rev_output_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCreateNewAdFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revCreateNewOrganization = revPluginsLoader({
    revPluginName: 'rev_plugin_organization',
    revViewName: 'RevCreateNewOrganization',
    revVarArgs: {},
  });

  let revCreateProductLine = revPluginsLoader({
    revPluginName: 'rev_plugin_organization',
    revViewName: 'RevCreateProductLine',
    revVarArgs: {},
  });

  let revCreateNewAdDetailsForm = revPluginsLoader({
    revPluginName: 'rev_plugin_ads',
    revViewName: 'RevCreateNewAdDetailsForm',
    revVarArgs: {},
  });

  const revAdPreview = () => {
    let revAdPreviewHeader = (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revAdPreviewHeaderWrapper,
        ]}>
        <TouchableOpacity>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAdPreviewHeaderTab,
            ]}>
            <FontAwesome name="edit" />
            {' Edit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAdPreviewHeaderTab,
            ]}>
            <FontAwesome name="paypal" />
            {' Continue to CheckOut'}
          </Text>
        </TouchableOpacity>
      </View>
    );

    let revAdObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_ads',
      revViewName: 'RevAdObjectView',
      revVarArgs: {},
    });

    return (
      <View style={revSiteStyles.revFlexContainer}>
        {revAdPreviewHeader}
        {revAdObjectView}
      </View>
    );
  };

  let revCheckOutForm = revPluginsLoader({
    revPluginName: 'rev_plugin_check_out',
    revViewName: 'RevCheckOutForm',
    revVarArgs: {},
  });

  const [revCurrFormView, setRevCurrFormView] = useState(
    revCreateNewOrganization,
  );

  const handleRevCreateNewOrgTabPressed = () => {
    setRevCurrFormView(revCreateNewOrganization);
  };

  const handleRevCreateNewProdLineTabPressed = () => {
    setRevCurrFormView(revCreateProductLine);
  };

  const handleRevCreateNewAdDetailsTabPressed = () => {
    setRevCurrFormView(revCreateNewAdDetailsForm);
  };

  const handleRevCreateNewAdPreviewTabPressed = () => {
    setRevCurrFormView(revAdPreview());
  };

  const handleRevCreateNewAdCheckOutTabPressed = () => {
    setRevCurrFormView(revCheckOutForm);
  };

  let revTabsDataArr = [
    {
      revTabId: 1,
      revLabel: 1,
      revCallBackFunc: handleRevCreateNewOrgTabPressed,
    },
    {
      revTabId: 2,
      revLabel: 2,
      revCallBackFunc: handleRevCreateNewProdLineTabPressed,
    },
    {
      revTabId: 3,
      revLabel: 3,
      revCallBackFunc: handleRevCreateNewAdDetailsTabPressed,
    },
    {
      revTabId: 4,
      revLabel: 'Preview',
      revCallBackFunc: handleRevCreateNewAdPreviewTabPressed,
    },
    {
      revTabId: 5,
      revLabel: 'Check out',
      revCallBackFunc: handleRevCreateNewAdCheckOutTabPressed,
    },
  ];

  const revInitTabsArr = () => {
    return revTabsDataArr.map(revCurrTabData => (
      <RevFormsNavTab
        key={revCurrTabData.revTabId}
        revTabData={revCurrTabData}
      />
    ));
  };

  const [revCurrTabsArr, setRevCurrTabsArr] = useState([]);
  const [revCurrTabId, setRevCurrTabId] = useState(1);

  let RevFormsNavTab = ({revTabData}) => {
    let revTabId = revTabData.revTabId;
    let revCurrSelectedTabStyle =
      revCurrTabId == revTabId ? styles.revSelectedTab : null;

    return (
      <TouchableOpacity
        key={revTabId}
        onPress={() => {
          setRevCurrTabId(revTabId);
          revTabData.revCallBackFunc();
        }}>
        <Text
          key={revTabId}
          style={[
            revSiteStyles.revSiteTxtColorWhite,
            revSiteStyles.revSiteTxtTiny,
            styles.revFormsNavTab,
            revCurrSelectedTabStyle,
          ]}>
          {revTabData.revLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setRevCurrTabsArr(revInitTabsArr());
  }, [revCurrTabId]);

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <RevPageContentHeader revVarArgs={{revIsIndented: false}} />

      <View style={{marginVertical: 10, position: 'relative'}}>
        <View style={styles.revFormsNavTabBorderWrapper}></View>
        <View
          style={[
            revSiteStyles.revFlexWrapper_WidthAuto,
            styles.revFormsNavTabWrapper,
          ]}>
          <RevScrollView_H revScrollViewContent={revCurrTabsArr} />
        </View>
      </View>

      <RevScrollView_V
        revScrollViewContent={revCurrFormView}
        revStyles={{marginBottom: 75}}></RevScrollView_V>
    </View>
  );
};

const styles = StyleSheet.create({
  revFormsNavTabBorderWrapper: {
    backgroundColor: '#DDD',
    width: '100%',
    height: 1,
    position: 'relative',
    top: '53%',
  },
  revFormsNavTabWrapper: {
    position: 'relative',
    left: 5,
  },
  revFormsNavTab: {
    backgroundColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginLeft: 4,
    borderRadius: 12,
  },
  revSelectedTab: {
    backgroundColor: '#444',
  },
  revAdPreviewHeaderWrapper: {
    alignItems: 'center',
  },
  revAdPreviewHeaderTab: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 4,
  },
});

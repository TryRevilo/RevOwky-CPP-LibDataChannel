import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import Svg, {Defs, ClipPath, Path} from 'react-native-svg';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {RevScrollView_V} from '../../../../../rev_views/rev_output_form_views';

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

  let revTabsDataArr = [
    {revTabId: 1, revCallBackFunc: handleRevCreateNewOrgTabPressed},
    {revTabId: 2, revCallBackFunc: handleRevCreateNewProdLineTabPressed},
    {revTabId: 3, revCallBackFunc: handleRevCreateNewAdDetailsTabPressed},
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
          {revTabId}
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
          {revCurrTabsArr}
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
});

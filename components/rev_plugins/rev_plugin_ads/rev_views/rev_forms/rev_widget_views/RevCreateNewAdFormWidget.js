import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {
  RevScrollView_H,
  RevScrollView_V,
} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCreateNewAdFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revOrganizationEntityGUID, setRevOrganizationEntityGUID] =
    useState(-1);

  const revOrganizationEntityGUIDRef = useRef(revOrganizationEntityGUID);

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const revAdPreview = revAdData => {
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
      revVarArgs: {revData: revAdData},
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

  const revInitCreateNewAdPreview = revRetData => {
    let revNewSavedAd = revPersGetRevEnty_By_EntityGUID(revRetData);
    setRevCurrFormView(revAdPreview(revNewSavedAd));
    setRevCurrTabId(4);
  };

  const revInitCreateNewAdDetailsForm = revRetData => {
    let revCreateNewAdDetailsForm = revPluginsLoader({
      revPluginName: 'rev_plugin_ads',
      revViewName: 'RevCreateNewAdDetailsForm',
      revVarArgs: {
        revData: revRetData,
        revOnSaveCallBack: revRetData => {
          revInitCreateNewAdPreview(revRetData);
        },
      },
    });

    setRevCurrTabId(3);
    setRevCurrFormView(revCreateNewAdDetailsForm);
  };

  const revInitNewProdLineForm = revContainerEntityGUID => {
    let revCreateProductLine = revPluginsLoader({
      revPluginName: 'rev_plugin_organization',
      revViewName: 'RevCreateProductLine',
      revVarArgs: {
        revContainerEntityGUID: revContainerEntityGUID,
        revOnSaveCallBack: revPersEntityGUID => {
          revInitCreateNewAdDetailsForm({
            revOrganizationEntityGUID: revOrganizationEntityGUIDRef.current,
            revProductLineGUID: revPersEntityGUID,
          });
        },
      },
    });

    setRevCurrTabId(2);
    setRevCurrFormView(revCreateProductLine);
  };

  let revCreateNewOrganization = revPluginsLoader({
    revPluginName: 'rev_plugin_organization',
    revViewName: 'RevCreateNewOrganization',
    revVarArgs: {
      revOnSaveCallBack: revPersEntityGUID => {
        setRevOrganizationEntityGUID(revPersEntityGUID);
        revOrganizationEntityGUIDRef.current = revPersEntityGUID;
        revInitNewProdLineForm(revOrganizationEntityGUIDRef.current);
      },
    },
  });

  const [revCurrFormView, setRevCurrFormView] = useState(
    revCreateNewOrganization,
  );

  const handleRevCreateNewOrgTabPressed = () => {
    setRevCurrFormView(revCreateNewOrganization);
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
      revCallBackFunc: revInitNewProdLineForm,
    },
    {
      revTabId: 3,
      revLabel: 3,
      revCallBackFunc: revInitCreateNewAdDetailsForm,
    },
    {
      revTabId: 4,
      revLabel: 'Preview',
      revCallBackFunc: revInitCreateNewAdPreview,
    },
    {
      revTabId: 5,
      revLabel: 'Check out',
      revCallBackFunc: handleRevCreateNewAdCheckOutTabPressed,
    },
  ];

  const revInitTabsArr = () => {
    let revLatArrowPointerItem = (
      <FontAwesome
        style={[
          revSiteStyles.revSiteTxtColorLight_X,
          revSiteStyles.revSiteTxtMedium,
        ]}
        name="long-arrow-right"
      />
    );

    let revTabsArr = revTabsDataArr.map(revCurrTabData => (
      <RevFormsNavTab
        key={revCurrTabData.revTabId}
        revTabData={revCurrTabData}
      />
    ));

    let revRetView = (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revInitTabsArrWrapper,
        ]}>
        {revTabsArr}
        {revLatArrowPointerItem}
      </View>
    );

    return revRetView;
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
    width: 'auto',
    height: 1,
    position: 'relative',
    top: '53%',
  },
  revFormsNavTabWrapper: {
    position: 'relative',
    left: 5,
  },
  revInitTabsArrWrapper: {
    alignItems: 'center',
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

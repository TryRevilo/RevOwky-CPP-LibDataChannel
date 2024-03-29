/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext, memo, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {useSelector} from 'react-redux';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../rev_plugins_loader';

import RevFooterArea from './RevFooterArea';

import {useRevGetConnectionRequests} from '../rev_plugins/rev_plugin_member_connections/rev_actions/rev_get_connection_requests';

import {useRevSiteStyles} from './RevSiteStyles';

const RevSiteContainer = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const revNewConnReqsArr = useSelector(state => state.revNewConnReqsArr);

  const {
    REV_PAGE_HEADER_CONTENT_VIEWER,
    SET_REV_PAGE_HEADER_CONTENT_VIEWER,
    REV_SITE_BODY,
    SET_REV_SITE_BODY,
    REV_SITE_MODAL,
    REV_VIRTUAL_VIEW,
  } = useContext(ReViewsContext);

  const revDynamicViewRefsObj = useRef({});
  const revActiveViewRef = useRef();

  const revSetRef = revRefKey => ref => {
    revDynamicViewRefsObj.current[revRefKey] = ref;
  };

  const revToggleActivePreloadedView = revRefKey => {
    if (revActiveViewRef.current == revRefKey) {
      revRefKey = 'revSiteContentContainer';
    }

    if (
      revActiveViewRef.current &&
      revDynamicViewRefsObj.current.hasOwnProperty(revRefKey)
    ) {
      revDynamicViewRefsObj.current[revActiveViewRef.current].setNativeProps({
        style: {
          zIndex: 0,
        },
      });
    }

    // Access the View and change its style
    if (revDynamicViewRefsObj.current.hasOwnProperty(revRefKey)) {
      revDynamicViewRefsObj.current[revRefKey].setNativeProps({
        style: {
          zIndex: 2,
        },
      });

      revActiveViewRef.current = revRefKey;
    }
  };

  let revSiteContentContainerRef = revSetRef('revSiteContentContainer');
  revActiveViewRef.current = 'revSiteContentContainer';

  const {revGetConnectionRequests} = useRevGetConnectionRequests();

  let revHandleNoticiasTabPress = () => {
    revGetConnectionRequests(revRetData => {});
  };

  let revContacts = revPluginsLoader({
    revPluginName: 'rev_contacts',
    revViewName: 'RevContacts',
    revData: {},
  });

  let revHandleContactsPress = () => {
    revToggleActivePreloadedView('RevContacts');
  };

  let revHandleOnSearchTabPress = () => {
    let RevSearchForm = revPluginsLoader({
      revPluginName: 'rev_plugin_search',
      revViewName: 'RevSearchForm',
      revData: {},
    });

    SET_REV_PAGE_HEADER_CONTENT_VIEWER(RevSearchForm);
  };

  let revHandleMessageNotificationsPress = () => {
    let RevMessageNoticias = revPluginsLoader({
      revPluginName: 'rev_plugin_text_chat',
      revViewName: 'RevChatMessageNotificationsListing',
      revData: {},
    });

    SET_REV_SITE_BODY(RevMessageNoticias);
  };

  return (
    <View style={styles.revSiteContainer}>
      <View style={styles.revPageContainer}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            {flex: 0, alignItems: 'center'},
          ]}>
          <View
            style={[revSiteStyles.revFlexContainer, styles.revHeaderContainer]}>
            <View
              style={[revSiteStyles.revFlexWrapper, styles.revSiteLogoWrapper]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtBold,
                  revSiteStyles.revSiteTxtLarge,
                ]}>
                Owki
              </Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtBold,
                  revSiteStyles.revSiteTxtTiny_X,
                  styles.revSiteVersion,
                ]}>
                {'  '}
                Version{' : '}
              </Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny_X,
                ]}>
                natalie-1.0.0{'  '}
                <FontAwesome
                  name="copyright"
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtTiny_X,
                  ]}
                />
                {'  '}
                2023
              </Text>
            </View>
          </View>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.siteHeaderOptionsTabsWrapper,
            ]}>
            <TouchableOpacity onPress={revHandleNoticiasTabPress}>
              <View
                style={[
                  revSiteStyles.revFlexWrapper,
                  styles.siteHeaderOptionItemTabWrapper,
                  styles.revHeaderOptionTab,
                ]}>
                {Array.isArray(revNewConnReqsArr) &&
                revNewConnReqsArr.length ? (
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtAlertDangerColor,
                      revSiteStyles.revSiteTxtTiny_X,
                      revSiteStyles.revSiteTxtBold,
                      styles.siteHeaderOptionItemTabTxt,
                    ]}>
                    {revNewConnReqsArr.length}
                  </Text>
                ) : null}
                <FontAwesome
                  name="exclamation"
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtMedium,
                  ]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                revHandleContactsPress();
              }}>
              <FontAwesome
                name="group"
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtMedium,
                  styles.revHeaderOptionTab,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                revHandleMessageNotificationsPress();
              }}>
              <FontAwesome
                name="quote-right"
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtMedium,
                  styles.revHeaderOptionTab,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                revHandleOnSearchTabPress();
              }}>
              <FontAwesome
                name="search"
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtMedium,
                  styles.revHeaderOptionTab,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {REV_PAGE_HEADER_CONTENT_VIEWER}

        <View
          ref={revSiteContentContainerRef}
          style={[
            revSiteStyles.revFlexContainer,
            styles.revSiteContentContainer,
            {zIndex: 1},
          ]}>
          {REV_SITE_BODY}
        </View>

        <View
          ref={revSetRef('RevContacts')}
          style={[
            revSiteStyles.revFlexWrapper,
            {
              height: '80%',
              top: 56,
              right: 11,
              position: 'absolute',
              zIndex: 0,
            },
          ]}>
          <View
            style={[
              revSiteStyles.revFlexContainer,
              {
                backgroundColor: '#F7F7F7',
                width: 45,
                height: '105%',
                opacity: 0.9,
              },
            ]}></View>
          <View
            style={[
              revSiteStyles.revFlexContainer,
              styles.revSiteToggleContentContainer,
            ]}>
            {revContacts}
          </View>
        </View>

        <RevFooterArea />
      </View>

      {REV_SITE_MODAL}
      {REV_VIRTUAL_VIEW}
    </View>
  );
};

const styles = StyleSheet.create({
  revSiteContainer: {
    flex: 1,
  },
  revPageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 12,
  },
  revHeaderContainer: {
    width: 'auto',
  },
  revSiteLogoWrapper: {
    alignItems: 'baseline',
  },
  siteHeaderOptionsTabsWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 12,
  },
  siteHeaderOptionItemTabWrapper: {
    alignItems: 'baseline',
    width: 'auto',
  },
  siteHeaderOptionItemTabTxt: {
    paddingRight: 1,
  },
  revHeaderOptionTab: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  revSiteContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    width: '99%',
    height: '100%',
    paddingHorizontal: 5,
  },
  revSiteToggleContentContainer: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    height: 'auto',
    paddingLeft: 10,
  },
});

export default memo(RevSiteContainer);

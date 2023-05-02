/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../rev_plugins_loader';

import RevFooterArea from './RevFooterArea';

import {useRevGetConnectionRequests} from '../rev_plugins/rev_plugin_member_connections/rev_actions/rev_get_connection_requests';
import {useRevUpdateConnectionRequestStatus} from '../rev_plugins/rev_plugin_member_connections/rev_remote_update_actions/rev_update_connection_request_status';

import {useRevSiteStyles} from './RevSiteStyles';

const RevSiteContainer = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const [isRevNoticiasAlert, setIsRevNoticiasAlert] = useState(false);
  const [revNoticiasAlertsCount, setRevNoticiasAlertsCount] = useState(0);

  const {
    REV_PAGE_HEADER_CONTENT_VIEWER,
    SET_REV_PAGE_HEADER_CONTENT_VIEWER,
    REV_SITE_BODY,
    SET_REV_SITE_BODY,
    REV_SITE_MODAL,
  } = useContext(ReViewsContext);

  const {revGetConnectionRequests} = useRevGetConnectionRequests();
  const {revUpdateConnectionRequestStatus} =
    useRevUpdateConnectionRequestStatus();

  let revHandleAllTabPress = () => {
    revGetConnectionRequests(revRetData => {
      let revNoticiasArrFilter = revRetData.filter;

      if (revNoticiasArrFilter.length) {
        setIsRevNoticiasAlert(true);
        setRevNoticiasAlertsCount(revNoticiasArrFilter.length);
      } else {
        setIsRevNoticiasAlert(false);
      }

      let RevNoticias = revPluginsLoader({
        revPluginName: 'rev_plugin_noticias',
        revViewName: 'RevNoticias',
        revVarArgs: revNoticiasArrFilter,
      });

      SET_REV_SITE_BODY(RevNoticias);

      revUpdateConnectionRequestStatus(revRetData => {
        console.log('>>> revRetData ' + JSON.stringify(revRetData));
      });
    });
  };

  let revHandleContactsPress = () => {
    let RevContacts = revPluginsLoader({
      revPluginName: 'rev_contacts',
      revViewName: 'RevContacts',
      revData: {},
    });

    SET_REV_SITE_BODY(RevContacts);
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
      <View style={styles.pageContainer}>
        <View style={[revSiteStyles.revFlexWrapper]}>
          <View
            style={[revSiteStyles.revFlexContainer, styles.revHeaderContainer]}>
            <View
              style={[revSiteStyles.revFlexWrapper, styles.revSiteLogoWrapper]}>
              <Text style={styles.revSiteLogoTxt}>Owki</Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteFontBold,
                  revSiteStyles.revSiteTxtSmall,
                  styles.revSiteVersion,
                ]}>
                {'  '}
                <FontAwesome
                  name="dot-circle-o"
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtTiny,
                  ]}
                />
                <FontAwesome
                  name="long-arrow-right"
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtTiny,
                  ]}
                />{' '}
                Version{' : '}
              </Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny,
                  styles.revSiteVersion,
                ]}>
                natalie-1.0.0{' '}
                <FontAwesome
                  name="copyright"
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtTiny,
                  ]}
                />{' '}
                2023
              </Text>
            </View>
            <Text style={[revSiteStyles.revSiteTxtTiny, styles.revSiteTellTxt]}>
              Chat with people from around the world !
            </Text>
          </View>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.siteHeaderOptionsTabsWrapper,
            ]}>
            <TouchableOpacity
              onPress={() => {
                revHandleAllTabPress();
              }}>
              <View
                style={[
                  revSiteStyles.revFlexWrapper,
                  styles.siteHeaderOptionItemTabWrapper,
                  styles.revHeaderOptionTab,
                ]}>
                {isRevNoticiasAlert ? (
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtAlertDangerColor,
                      revSiteStyles.revSiteTxtTiny,
                      revSiteStyles.revSiteTxtBold,
                      styles.siteHeaderOptionItemTabTxt,
                    ]}>
                    {revNoticiasAlertsCount}
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
          style={[
            revSiteStyles.revFlexContainer,
            styles.revSiteContentContainer,
          ]}>
          {REV_SITE_BODY}
        </View>

        <RevFooterArea />
      </View>

      {REV_SITE_MODAL}
    </View>
  );
};

const styles = StyleSheet.create({
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  revSiteContainer: {
    flex: 1,
  },
  pageContainer: {
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
    alignItems: 'flex-end',
  },
  revSiteLogoTxt: {
    color: '#009688',
    fontSize: 17,
    lineHeight: 17,
    fontWeight: 'bold',
  },
  revSiteVersion: {
    marginBottom: 1,
  },
  revSiteTellTxt: {
    color: '#009688',
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
    flex: 7,
    position: 'relative',
    paddingBottom: 47,
    height: 'auto',
  },
});

export default RevSiteContainer;

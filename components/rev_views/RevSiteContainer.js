/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../rev_plugins_loader';

import RevFooterArea from './RevFooterArea';

const RevSiteContainer = () => {
  const {
    REV_PAGE_HEADER_CONTENT_VIEWER,
    SET_REV_PAGE_HEADER_CONTENT_VIEWER,
    REV_SITE_BODY,
    SET_REV_SITE_BODY,
  } = useContext(ReViewsContext);

  let revHandleContactsPress = () => {
    let RevContacts = revPluginsLoader({
      revPluginName: 'rev_contacts',
      revViewName: 'RevContacts',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevContacts);
  };

  let revHandleOnSearchTabPress = () => {
    let RevSearchForm = revPluginsLoader({
      revPluginName: 'rev_plugin_search',
      revViewName: 'RevSearchForm',
      revData: 'Hello World!',
    });

    SET_REV_PAGE_HEADER_CONTENT_VIEWER(RevSearchForm);
  };

  let revHandleMessageNotificationsPress = () => {
    let RevMessageNoticias = revPluginsLoader({
      revPluginName: 'rev_text_chat',
      revViewName: 'RevChatMessageNotificationsListing',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevMessageNoticias);
  };

  return (
    <View style={styles.revSiteContainer}>
      <View style={styles.pageContainer}>
        <View style={[styles.revFlexWrapper]}>
          <View style={[styles.revFlexContainer, styles.revHeaderContainer]}>
            <View style={[styles.revFlexWrapper, styles.revSiteLogoWrapper]}>
              <Text style={styles.revSiteLogoTxt}>Owki</Text>
              <Text
                style={[
                  styles.revSiteTxtColorLight,
                  styles.revSiteFontBold,
                  styles.revSiteTxtSmall,
                  styles.revSiteVersion,
                ]}>
                {'  '}
                <FontAwesome
                  name="dot-circle-o"
                  style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
                />
                <FontAwesome
                  name="long-arrow-right"
                  style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
                />{' '}
                Version{' : '}
              </Text>
              <Text
                style={[
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtTiny,
                  styles.revSiteVersion,
                ]}>
                natalie-1.0.0{' '}
                <FontAwesome
                  name="copyright"
                  style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
                />{' '}
                2023
              </Text>
            </View>
            <Text style={[styles.revSiteTxtTiny, styles.revSiteTellTxt]}>
              Chat with people from around the world !
            </Text>
          </View>
          <View
            style={[
              styles.revFlexWrapper,
              styles.siteHeaderOptionsTabsWrapper,
            ]}>
            <TouchableOpacity
              onPress={() => {
                revHandleContactsPress();
              }}>
              <FontAwesome
                name="exclamation"
                style={[
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtMedium,
                  styles.revHeaderOptionTab,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                revHandleContactsPress();
              }}>
              <FontAwesome
                name="group"
                style={[
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtMedium,
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
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtMedium,
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
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtMedium,
                  styles.revHeaderOptionTab,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {REV_PAGE_HEADER_CONTENT_VIEWER}

        <View style={[styles.revFlexContainer, styles.revSiteContentContainer]}>
          {REV_SITE_BODY}
        </View>

        <RevFooterArea />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteFontBold: {
    fontWeight: '500',
  },
  revSiteTxtTiny: {
    fontSize: 9,
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
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

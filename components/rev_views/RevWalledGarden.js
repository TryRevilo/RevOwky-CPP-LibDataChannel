import React, {useContext, useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {revPluginsLoader} from '../rev_plugins_loader';

import RevSiteContainer from './RevSiteContainer';

import {useRevSiteStyles} from './RevSiteStyles';
import {
  useRevCreateSiteEntity,
  useRevGetSiteEntity,
} from '../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';
import {revIsEmptyJSONObject} from '../../rev_function_libs/rev_gen_helper_functions';
import {useRevPersGetRevEntities_By_ResolveStatus_SubType} from '../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

const RevWalledGarden = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    REV_LOGGED_IN_ENTITY_GUID,
    SET_REV_LOGGED_IN_ENTITY_GUID,
    SET_REV_SITE_ENTITY_GUID,
  } = useContext(RevSiteDataContext);

  const [revLogInFormState, setRevLogInFormState] = useState(null);

  const {revCreateSiteEntity} = useRevCreateSiteEntity();
  const {revGetSiteEntity} = useRevGetSiteEntity();
  const {revPersGetRevEntities_By_ResolveStatus_SubType} =
    useRevPersGetRevEntities_By_ResolveStatus_SubType();

  useEffect(() => {
    const revLogInForm = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevLogInForm',
      revData: {},
    });

    setRevLogInFormState(revLogInForm);
  }, []);

  const RevLogInPage = () => {
    return (
      <View style={[revSiteStyles.revFlexContainer, styles.revlogInContainer]}>
        <View
          style={[revSiteStyles.revFlexContainer, styles.revHeaderContainer]}>
          <View
            style={[revSiteStyles.revFlexWrapper, styles.revSiteLogoWrapper]}>
            <Text
              style={[revSiteStyles.revSiteTxtColor, styles.revSiteLogoTxt]}>
              Owki
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteFontBold,
                revSiteStyles.revSiteTxtTiny_X,
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
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny_X,
            ]}>
            Chat with people from around the world !
          </Text>
        </View>

        {revLogInFormState}
      </View>
    );
  };

  useEffect(() => {
    if (REV_LOGGED_IN_ENTITY_GUID < 1) {
      let revSiteEntitiesArr = revPersGetRevEntities_By_ResolveStatus_SubType(
        2,
        'rev_site',
      );

      if (!Array.isArray(revSiteEntitiesArr) || !revSiteEntitiesArr.length) {
        return;
      }

      let revSiteEntity = revSiteEntitiesArr[0];

      let revSiteEntityOwnerGUID = revSiteEntity._revEntityOwnerGUID;

      if (revSiteEntityOwnerGUID) {
        SET_REV_LOGGED_IN_ENTITY_GUID(revSiteEntityOwnerGUID);
      }

      return;
    }

    let revSiteEntity = revGetSiteEntity(REV_LOGGED_IN_ENTITY_GUID);

    let revSiteEntityGUID = -1;

    if (revIsEmptyJSONObject(revSiteEntity)) {
      revSiteEntityGUID = revCreateSiteEntity(REV_LOGGED_IN_ENTITY_GUID);
    } else {
      revSiteEntityGUID = revSiteEntity._revEntityGUID;
    }

    SET_REV_SITE_ENTITY_GUID(revSiteEntityGUID);
  }, [REV_LOGGED_IN_ENTITY_GUID]);

  return (
    <SafeAreaView
      style={[revSiteStyles.revFlexContainer, styles.revSiteContainer]}>
      <StatusBar backgroundColor="#F7F7F7" barStyle={'dark-content'} />
      {REV_LOGGED_IN_ENTITY_GUID < 1 ? <RevLogInPage /> : <RevSiteContainer />}
    </SafeAreaView>
  );
};

export default RevWalledGarden;

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revSiteContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  revlogInContainer: {
    alignSelf: 'center',
    width: maxChatMessageContainerWidth,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    position: 'relative',
    top: '10%',
    borderRadius: 4,
  },
  revSiteHeaderWrapper: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  revHeaderContainer: {
    backgroundColor: '#FFF',
    borderBottomColor: '#F7F7F7',
    borderStyle: 'dotted',
    borderBottomWidth: 1,
    width: 'auto',
    height: 'auto',
  },
  revSiteLogoWrapper: {
    alignItems: 'flex-end',
  },
  revSiteLogoTxt: {
    fontSize: 17,
    lineHeight: 17,
    fontWeight: 'bold',
  },
  revSiteVersion: {
    marginBottom: 1,
  },
  revLoginFormContainer: {
    marginTop: 4,
    height: 'auto',
    paddingBottom: 22,
  },
  revUserIdInput: {
    color: '#444',
    fontSize: 11,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 8,
  },
  revLoginFormFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
    marginLeft: 7,
  },
  revLogInTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  revSignUpTab: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

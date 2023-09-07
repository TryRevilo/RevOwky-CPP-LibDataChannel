import React, {useEffect, useContext, useState} from 'react';
import {
  StatusBar,
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules,
} from 'react-native';

var RNFS = require('react-native-fs');

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';

import {useRevSiteStyles} from './RevSiteStyles';

import RevWalledGarden from './RevWalledGarden';
import {useRevGetLoggedInSiteEntity} from '../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';

import {revIsEmptyJSONObject} from '../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibCreate_React} = NativeModules;

const revSettings = require('../../rev_res/rev_settings.json');

const RevSiteLoading = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [revPageReady, setRevPageReady] = useState(false);

  const {SET_REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  let revAppRootDir = revSettings.revAppRootDir;
  const DirectoryPath = revAppRootDir + '/rev_media';
  RNFS.mkdir(DirectoryPath);

  let dbLong = RevPersLibCreate_React.revPersInitReact(revAppRootDir);

  if (dbLong < 1) {
    return (
      <View style={styles.revSiteLoadingContainer}>
        {isLoading && <StatusBar backgroundColor="#F7F7F7" />}
        <Text style={styles.revSiteLoadingTxt}>ERR Loading DB !</Text>
      </View>
    );
  }

  const {revGetLoggedInSiteEntity} = useRevGetLoggedInSiteEntity();

  const [REV_SITE_INIT_VIEW, SET_REV_SITE_INIT_VIEW] = useState(
    <View style={styles.revSiteLoadingContainer}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny_X,
          styles.revSiteLoadingTxt,
        ]}>
        Owki Loading . . .
      </Text>
    </View>,
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#F7F7F7');
    }

    setTimeout(() => {
      let revLoggedInSiteEntity = revGetLoggedInSiteEntity();

      if (!revIsEmptyJSONObject(revLoggedInSiteEntity)) {
        let revLoggedInEntityGUID = revLoggedInSiteEntity._revEntityOwnerGUID;

        if (revLoggedInEntityGUID > 0) {
          SET_REV_LOGGED_IN_ENTITY_GUID(revLoggedInEntityGUID);
        }
      }

      SET_REV_SITE_INIT_VIEW(<RevWalledGarden />);
      setIsLoading(false);
    }, 1000);
  }, [revPageReady]);

  setTimeout(() => {
    setRevPageReady(true);
  }, 1000);

  return REV_SITE_INIT_VIEW;
};

export default RevSiteLoading;

const styles = StyleSheet.create({
  revSiteLoadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  revSiteLoadingTxt: {
    marginTop: '25%',
    textAlign: 'center',
    alignSelf: 'center',
  },
});

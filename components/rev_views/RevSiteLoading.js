import React, {useEffect, useContext, useState} from 'react';
import {StyleSheet, Text, View, NativeModules} from 'react-native';

var RNFS = require('react-native-fs');

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../rev_contexts/ReViewsContext';

import RevWalledGarden from './RevWalledGarden';
import {useRevGetLoggedInSiteEntity} from '../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';

import {revIsEmptyJSONObject} from '../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibCreate_React} = NativeModules;

const revSettings = require('../../rev_res/rev_settings.json');

const RevSiteLoading = () => {
  const {SET_REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {REV_SITE_INIT_VIEW, SET_REV_SITE_INIT_VIEW} =
    useContext(ReViewsContext);

  let revAppRootDir = revSettings.revAppRootDir;

  RNFS.mkdir(revSettings.revPublishedMediaDir);
  RNFS.mkdir(revSettings.revWebRtcLiveChatTempFilesDir);

  let dbLong = RevPersLibCreate_React.revPersInitReact(revAppRootDir);

  if (dbLong < 1) {
    return (
      <View style={styles.revSiteLoadingContainer}>
        <Text style={styles.revSiteLoadingTxt}>ERR Loading DB !</Text>
      </View>
    );
  }

  const {revGetLoggedInSiteEntity} = useRevGetLoggedInSiteEntity();

  useEffect(() => {
    let revLoggedInSiteEntity = revGetLoggedInSiteEntity();

    if (!revIsEmptyJSONObject(revLoggedInSiteEntity)) {
      let revLoggedInEntityGUID = revLoggedInSiteEntity._revOwnerGUID;

      if (revLoggedInEntityGUID > 0) {
        SET_REV_LOGGED_IN_ENTITY_GUID(revLoggedInEntityGUID);
      }
    }

    SET_REV_SITE_INIT_VIEW(<RevWalledGarden />);
  }, []);

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

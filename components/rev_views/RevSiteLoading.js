import React, {useEffect, useContext, useState} from 'react';
import {StatusBar, StyleSheet, Text, View, NativeModules} from 'react-native';

var RNFS = require('react-native-fs');

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';

import {useRevSiteStyles} from './RevSiteStyles';

import RevWalledGarden from './RevWalledGarden';
import {useRevGetLoggedInSiteEntity} from '../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';

import {revIsEmptyJSONObject} from '../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibCreate_React} = NativeModules;

const RevSiteLoading = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [revPageReady, setRevPageReady] = useState(false);

  const {SET_REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const DirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media';
  RNFS.mkdir(DirectoryPath);

  let revDbPath = RNFS.DownloadDirectoryPath;
  let dbLong = RevPersLibCreate_React.revPersInitReact(revDbPath);

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
      {isLoading && <StatusBar backgroundColor="#F7F7F7" />}
      <Text style={styles.revSiteLoadingTxt}>Owki Loading . . .</Text>
    </View>,
  );

  useEffect(() => {
    let revLoggedInSiteEntity = revGetLoggedInSiteEntity();

    if (!revIsEmptyJSONObject(revLoggedInSiteEntity)) {
      let revLoggedInEntityGUID = revLoggedInSiteEntity._revEntityOwnerGUID;

      if (revLoggedInEntityGUID > 0) {
        SET_REV_LOGGED_IN_ENTITY_GUID(revLoggedInEntityGUID);
      }
    }

    setTimeout(() => {
      SET_REV_SITE_INIT_VIEW(<RevWalledGarden />);
      setIsLoading(false);
    }, 3000);
  }, [revPageReady]);

  setTimeout(() => {
    setRevPageReady(true);
  }, 2000);

  return REV_SITE_INIT_VIEW;
};

export default RevSiteLoading;

const styles = StyleSheet.create({
  revSiteLoadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revSiteLoadingTxt: {
    color: 'grey',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, Text, View, StyleSheet} from 'react-native';

import {Provider} from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

import {useRevReduxStoreInit} from './rev_contexts/RevReduxStore';

import {RevRemoteSocketContextProvider} from './rev_contexts/RevRemoteSocketContext';
import {RevSiteDataContextProvider} from './rev_contexts/RevSiteDataContext';
import {ReViewsContextProvider} from './rev_contexts/ReViewsContext';
import {RevWebRTCContextProvider} from './rev_contexts/RevWebRTCContext';
import {RevSiteInitContextProvider} from './rev_contexts/RevSiteInitContext';

import RevSiteLoading from './components/rev_views/RevSiteLoading';

import {revIsEmptyJSONObject} from './rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from './components/rev_views/RevSiteStyles';

function App() {
  const {revSiteStyles} = useRevSiteStyles();

  if (Platform.OS === 'android') {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#F7F7F7');
  }

  const {revReduxStoreInit} = useRevReduxStoreInit();

  const [revReduxStore, setRevReduxStore] = useState(null);

  const revInitRedux = async () => {
    let revRetStore = await revReduxStoreInit();
    setRevReduxStore(revRetStore);
  };

  useEffect(() => {
    revInitRedux();
  }, []);

  return (
    <>
      {!revIsEmptyJSONObject(revReduxStore) ? (
        <Provider store={revReduxStore}>
          <ReViewsContextProvider>
            <RevSiteDataContextProvider>
              <RevRemoteSocketContextProvider>
                <RevWebRTCContextProvider>
                  <RevSiteInitContextProvider>
                    <RevSiteLoading />
                  </RevSiteInitContextProvider>
                </RevWebRTCContextProvider>
              </RevRemoteSocketContextProvider>
            </RevSiteDataContextProvider>
          </ReViewsContextProvider>
        </Provider>
      ) : (
        <LinearGradient
          colors={['#FFFFFF', '#F7F7F7', '#BEB5D4']}
          style={styles.revLinearGradient}>
          <View style={[{flex: 1}]}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtTiny_X,
                {paddingHorizontal: 21, paddingVertical: 10},
              ]}>
              . . . Loading
            </Text>

            <Text
              style={[
                revSiteStyles.revSiteTxtColorWhite,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtTiny_X,
                {position: 'absolute', right: 32, bottom: '5%'},
              ]}>
              CampAnn .inc
            </Text>
          </View>
        </LinearGradient>
      )}
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  revLinearGradient: {
    flex: 1,
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {RemoteSocketContextProvider} from './rev_function_libs/rev_server_lib';
import {SocketContextProvider} from './rev_function_libs/Context';

import SiteContainer from './components/SiteContainer';

const App: () => Node = () => {
  return (
    <RemoteSocketContextProvider>
      <SocketContextProvider>
        <SiteContainer />
      </SocketContextProvider>
    </RemoteSocketContextProvider>
  );
};

export default App;

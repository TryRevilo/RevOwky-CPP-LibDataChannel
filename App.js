/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StatusBar} from 'react-native';

import {RevRemoteSocketContextProvider} from './rev_contexts/RevRemoteSocketContext';
import {RevSiteDataContextProvider} from './rev_contexts/RevSiteDataContext';
import {ReViewsContextProvider} from './rev_contexts/ReViewsContext';

import RevSiteLoading from './components/rev_views/RevSiteLoading';

const App = () => {
  return (
    <RevRemoteSocketContextProvider>
      <StatusBar backgroundColor="#F7F7F7" />
      <RevSiteDataContextProvider>
        <ReViewsContextProvider>
          <RevSiteLoading />
        </ReViewsContextProvider>
      </RevSiteDataContextProvider>
    </RevRemoteSocketContextProvider>
  );
};

export default App;

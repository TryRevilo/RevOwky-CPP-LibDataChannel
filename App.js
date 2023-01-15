/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {RevRemoteSocketContextProvider} from './rev_contexts/RevRemoteSocketContext';
import {RevSiteDataContextProvider} from './rev_contexts/RevSiteDataContext';
import {ReViewsContextProvider} from './rev_contexts/ReViewsContext';

import RevWalledGarden from './components/rev_views/RevWalledGarden';

const App = () => {
  return (
    <RevRemoteSocketContextProvider>
      <RevSiteDataContextProvider>
        <ReViewsContextProvider>
          <RevWalledGarden />
        </ReViewsContextProvider>
      </RevSiteDataContextProvider>
    </RevRemoteSocketContextProvider>
  );
};

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {RevRemoteSocketContextProvider} from './rev_contexts/RevRemoteSocketContext';
import {RevSiteDataContextProvider} from './rev_contexts/RevSiteDataContext';
import {ReViewsContextProvider} from './rev_contexts/ReViewsContext';

import RevSiteLoading from './components/rev_views/RevSiteLoading';

function App(): JSX.Element {
  return (
    <RevRemoteSocketContextProvider>
      <RevSiteDataContextProvider>
        <ReViewsContextProvider>
          <RevSiteLoading />
        </ReViewsContextProvider>
      </RevSiteDataContextProvider>
    </RevRemoteSocketContextProvider>
  );
}

export default App;

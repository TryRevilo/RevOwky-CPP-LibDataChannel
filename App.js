/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Platform, StatusBar} from 'react-native';

import {RevRemoteSocketContextProvider} from './rev_contexts/RevRemoteSocketContext';
import {RevSiteDataContextProvider} from './rev_contexts/RevSiteDataContext';
import {ReViewsContextProvider} from './rev_contexts/ReViewsContext';
import {RevWebRTCContextProvider} from './rev_contexts/RevWebRTCContext';
import {RevSiteInitContextProvider} from './rev_contexts/RevSiteInitContext';

import RevSiteLoading from './components/rev_views/RevSiteLoading';

function App() {
  if (Platform.OS === 'android') {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#F7F7F7');
  }

  return (
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
  );
}

export default App;

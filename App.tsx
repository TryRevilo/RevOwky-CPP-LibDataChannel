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
import { RevWebRTCContextProvider } from './rev_contexts/RevWebRTCContext';

import RevSiteLoading from './components/rev_views/RevSiteLoading';

function App(): JSX.Element {
  return (
    <ReViewsContextProvider>
        <RevSiteDataContextProvider>
            <RevRemoteSocketContextProvider>
                <RevWebRTCContextProvider>
                    <RevSiteLoading />
                </RevWebRTCContextProvider>
            </RevRemoteSocketContextProvider>
        </RevSiteDataContextProvider>
    </ReViewsContextProvider>
  );
}

export default App;

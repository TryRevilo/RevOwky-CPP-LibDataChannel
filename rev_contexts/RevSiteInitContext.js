import React, {createContext, useContext, useState, useEffect} from 'react';

import {RevWebRTCContext} from './RevWebRTCContext';

import {useRevPersSyncDataComponent} from '../components/rev_libs_pers/rev_server/RevPersSyncDataComponent';

const RevSiteInitContext = createContext();

const RevSiteInitContextProvider = ({children}) => {
  const {isRevSocketServerUp} = useContext(RevWebRTCContext);

  const [IS_REV_LOCAL_DATA_IN_SYNC, SET_IS_REV_LOCAL_DATA_IN_SYNC] =
    useState(true);

  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();

  useEffect(() => {
    if (!IS_REV_LOCAL_DATA_IN_SYNC || isRevSocketServerUp) {
      revPersSyncDataComponent();
    }
  }, [IS_REV_LOCAL_DATA_IN_SYNC, isRevSocketServerUp]);

  return (
    <RevSiteInitContext.Provider
      value={{
        IS_REV_LOCAL_DATA_IN_SYNC,
        SET_IS_REV_LOCAL_DATA_IN_SYNC,
      }}>
      {children}
    </RevSiteInitContext.Provider>
  );
};

export {RevSiteInitContextProvider, RevSiteInitContext};

import React, {createContext, useContext, useState, useEffect} from 'react';

import {RevRemoteSocketContext} from './RevRemoteSocketContext';

import {useRevPersSyncDataComponent} from '../components/rev_libs_pers/rev_server/RevPersSyncDataComponent';

const RevSiteInitContext = createContext();

const RevSiteInitContextProvider = ({children}) => {
  const {isRevSocketServerUp} = useContext(RevRemoteSocketContext);

  const [IS_REV_LOCAL_DATA_IN_SYNC, SET_IS_REV_LOCAL_DATA_IN_SYNC] =
    useState(true);

  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();

  useEffect(() => {
    SET_IS_REV_LOCAL_DATA_IN_SYNC(false);
  }, []);

  useEffect(() => {
    if (isRevSocketServerUp && !IS_REV_LOCAL_DATA_IN_SYNC) {
      revPersSyncDataComponent().then(revretData => {
        console.log('+++ revretData', revretData);
        SET_IS_REV_LOCAL_DATA_IN_SYNC(true);
      });
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

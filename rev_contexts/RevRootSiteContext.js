import React, {createContext, useState, useEffect} from 'react';
import {Provider} from 'react-redux';
import revReduxStoreInit from 'path-to-your-revReduxStoreInit';

// Create a custom context
const RevRootSiteContext = createContext();

// Create the custom context provider
const RevRootSiteContextProvider = ({children}) => {
  const [customValue, setCustomValue] = useState(null);

  return (
    <RevRootSiteContext.Provider value={customValue}>
      {children}
    </RevRootSiteContext.Provider>
  );
};

export {RevRootSiteContext, RevRootSiteContextProvider};

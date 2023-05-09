import React, {createContext, useState} from 'react';

const revSettings = require('../rev_res/rev_settings.json');

const RevLocalAPIContext = createContext();

const RevLocalAPIContextProvider = ({children}) => {
  const [REV_API_FUNC_CAL, SET_REV_API_FUNC_CAL] = useState({});

  return (
    <RevLocalAPIContext.Provider
      value={{
        REV_API_FUNC_CAL,
        SET_REV_API_FUNC_CAL,
      }}>
      {children}
    </RevLocalAPIContext.Provider>
  );
};

export {RevLocalAPIContextProvider, RevLocalAPIContext};

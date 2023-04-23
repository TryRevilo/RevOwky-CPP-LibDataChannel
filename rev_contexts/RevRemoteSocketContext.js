import React, {createContext, useState} from 'react';

const revSettings = require('../rev_res/rev_settings.json');

const RevRemoteSocketContext = createContext();

const RevRemoteSocketContextProvider = ({children}) => {
  const [REV_PORT, setREV_PORT] = useState(revSettings.revPort);
  const [REV_IP, setREV_IP] = useState(revSettings.revIP);
  const [REV_ROOT_URL, setREV_ROOT_URL] = useState(revSettings.revSiteURL);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState();

  return (
    <RevRemoteSocketContext.Provider
      value={{
        REV_PORT,
        setREV_PORT,
        REV_IP,
        setREV_IP,
        REV_WEB_SOCKET_SERVER,
        SET_REV_WEB_SOCKET_SERVER,
        REV_ROOT_URL,
        setREV_ROOT_URL,
      }}>
      {children}
    </RevRemoteSocketContext.Provider>
  );
};

export {RevRemoteSocketContextProvider, RevRemoteSocketContext};

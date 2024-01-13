import React, {createContext, useEffect, useState} from 'react';

import NetInfo from '@react-native-community/netinfo';
import {
  revPingServer,
  revSetStateData,
} from '../rev_function_libs/rev_gen_helper_functions';

const revSettings = require('../rev_res/rev_settings.json');

const RevRemoteSocketContext = createContext();

const RevRemoteSocketContextProvider = ({children}) => {
  const [REV_PORT, setREV_PORT] = useState(revSettings.revPort);
  const [REV_IP, setREV_IP] = useState(revSettings.revIP);
  const [REV_ROOT_URL, setREV_ROOT_URL] = useState(revSettings.revSiteURL);

  const [REV_WEB_SOCKET_SERVER, SET_REV_WEB_SOCKET_SERVER] = useState();

  const [isRevInternetOn, setIsRevInternetOn] = useState(false);
  const [isRevSocketServerUp, setIsRevSocketServerUp] = useState(false);

  NetInfo.addEventListener(revNetState => {
    const {isConnected: isRevConnected = false} = revNetState;

    revSetStateData(setIsRevInternetOn, isRevConnected);
  });

  useEffect(() => {
    if (isRevInternetOn) {
      let revPingVarArgs = {
        revInterval: 1000,
        revIP: REV_ROOT_URL,
      };

      const revScheduleNextInvocation = () => {
        let revTimeoutId = setTimeout(async () => {
          let revPingRes = await revPingServer(revPingVarArgs);

          const {revServerStatus} = revPingRes;

          if (revServerStatus == 200 && isRevInternetOn) {
            revSetStateData(setIsRevSocketServerUp, true);
            return clearTimeout(revTimeoutId);
          } else if (revServerStatus !== 200 && !isRevInternetOn) {
            revSetStateData(setIsRevSocketServerUp, false);
            return clearTimeout(revTimeoutId);
          }

          revScheduleNextInvocation();
        }, 1000);
      };

      revScheduleNextInvocation();
    } else {
      revSetStateData(setIsRevSocketServerUp, false);
    }
  }, [isRevInternetOn]);

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
        isRevSocketServerUp,
        setIsRevSocketServerUp,
      }}>
      {children}
    </RevRemoteSocketContext.Provider>
  );
};

export {RevRemoteSocketContextProvider, RevRemoteSocketContext};

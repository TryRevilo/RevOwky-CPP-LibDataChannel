import React, {createContext, useState, useEffect} from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibRead_React, RevPersLibUpdate_React} = NativeModules;

import {
  revCreateSiteEntity,
  revGetSiteEntity,
} from '../components/rev_libs_pers/rev_pers_rev_entity/rev_site_entity';

const RevSiteDataContext = createContext();

const RevSiteDataContextProvider = ({children}) => {
  const [REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS] = useState({
    revRemoteEntityGUID: 0,
  });

  const [REV_LOGGED_IN_ENTITY_GUID, SET_REV_LOGGED_IN_ENTITY_GUID] =
    useState(0);

  const [REV_LOGGED_IN_ENTITY, SET_REV_LOGGED_IN_ENTITY] = useState(null);

  useEffect(() => {
    if (REV_LOGGED_IN_ENTITY_GUID > 0) {
      let revSiteEntityGUID = -1;
      let revSiteEntityOwnerGUID = -1;

      let revLoggedInEntityStr = RevPersLibRead_React.revPersGetRevEntityByGUID(
        REV_LOGGED_IN_ENTITY_GUID,
      );

      let revLoggedInEntity = JSON.parse(revLoggedInEntityStr);

      SET_REV_LOGGED_IN_ENTITY(revLoggedInEntity);

      let revSiteEntity = revGetSiteEntity();

      if (revSiteEntity && revSiteEntity.hasOwnProperty('_revEntityGUID')) {
        revSiteEntityGUID = revSiteEntity._revEntityGUID;
        revSiteEntityOwnerGUID = revSiteEntity._revEntityOwnerGUID;
      } else {
        revSiteEntityGUID = revCreateSiteEntity(REV_LOGGED_IN_ENTITY_GUID);
        revSiteEntityOwnerGUID =
          RevPersLibRead_React.getRevEntityByRevEntityOwnerGUID_Subtype(
            REV_LOGGED_IN_ENTITY_GUID,
            'rev_site',
          );
      }

      if (
        revSiteEntityGUID > 0 &&
        revSiteEntityOwnerGUID !== REV_LOGGED_IN_ENTITY_GUID
      ) {
        RevPersLibUpdate_React.resetRevEntityOwnerGUID(
          revSiteEntityGUID,
          REV_LOGGED_IN_ENTITY_GUID,
        );
      }
    }
  }, [REV_LOGGED_IN_ENTITY_GUID]);

  return (
    <RevSiteDataContext.Provider
      value={{
        REV_SITE_VAR_ARGS,
        SET_REV_SITE_VAR_ARGS,
        REV_LOGGED_IN_ENTITY_GUID,
        SET_REV_LOGGED_IN_ENTITY_GUID,
        REV_LOGGED_IN_ENTITY,
        SET_REV_LOGGED_IN_ENTITY,
      }}>
      {children}
    </RevSiteDataContext.Provider>
  );
};

export {RevSiteDataContextProvider, RevSiteDataContext};

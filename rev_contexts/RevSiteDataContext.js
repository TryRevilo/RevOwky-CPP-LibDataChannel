import React, {createContext, useState, useEffect} from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibRead_React} = NativeModules;

import {
  useRevCreateSiteEntity,
  useRevGetSiteEntity,
} from '../components/rev_libs_pers/rev_pers_rev_entity/rev_site_entity';
import {
  revIsEmptyVar,
  revIsEmptyJSONObject,
} from '../rev_function_libs/rev_gen_helper_functions';

const RevSiteDataContext = createContext();

const RevSiteDataContextProvider = ({children}) => {
  const [REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS] = useState({
    revRemoteEntityGUID: 0,
  });

  const [REV_LOGGED_IN_ENTITY_GUID, SET_REV_LOGGED_IN_ENTITY_GUID] =
    useState(0);
  const [REV_SITE_ENTITY_GUID, SET_REV_SITE_ENTITY_GUID] = useState(0);

  const [REV_LOGGED_IN_ENTITY, SET_REV_LOGGED_IN_ENTITY] = useState(null);

  const {revGetSiteEntity} = useRevGetSiteEntity();
  const {revCreateSiteEntity} = useRevCreateSiteEntity();

  useEffect(() => {
    if (
      !revIsEmptyVar(REV_LOGGED_IN_ENTITY_GUID) &&
      REV_LOGGED_IN_ENTITY_GUID > 0
    ) {
      let revSiteEntityGUID = -1;
      let revSiteEntityOwnerGUID = -1;

      let revLoggedInEntityStr = RevPersLibRead_React.revPersGetRevEntityByGUID(
        REV_LOGGED_IN_ENTITY_GUID,
      );

      let revLoggedInEntity = JSON.parse(revLoggedInEntityStr);

      SET_REV_LOGGED_IN_ENTITY(revLoggedInEntity);

      /** START SET UP SITE */
      let revSiteEntity = revGetSiteEntity(REV_LOGGED_IN_ENTITY_GUID);

      if (
        !revIsEmptyJSONObject(revSiteEntity) &&
        revSiteEntity.hasOwnProperty('_revEntityGUID')
      ) {
        revSiteEntityGUID = revSiteEntity._revEntityGUID;
        revSiteEntityOwnerGUID = revSiteEntity._revEntityOwnerGUID;
      } else {
        revSiteEntityGUID = revCreateSiteEntity(REV_LOGGED_IN_ENTITY_GUID);
        let revSiteEntity = revGetSiteEntity(REV_LOGGED_IN_ENTITY_GUID);

        revSiteEntityOwnerGUID = revSiteEntity._revEntityOwnerGUID;
      }

      if (revSiteEntityOwnerGUID === REV_LOGGED_IN_ENTITY_GUID) {
        SET_REV_SITE_ENTITY_GUID(revSiteEntityGUID);
      }
      /** END SET UP SITE */
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
        REV_SITE_ENTITY_GUID,
        SET_REV_SITE_ENTITY_GUID,
      }}>
      {children}
    </RevSiteDataContext.Provider>
  );
};

export {RevSiteDataContextProvider, RevSiteDataContext};

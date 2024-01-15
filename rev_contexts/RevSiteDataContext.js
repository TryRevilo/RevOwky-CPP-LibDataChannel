import React, {createContext, useContext, useState, useEffect} from 'react';
import {NativeModules} from 'react-native';

import {ReViewsContext} from './ReViewsContext';

const {RevPersLibRead_React, RevPersLibUpdate_React} = NativeModules;

import {
  useRevCreateSiteEntity,
  useRevGetSiteEntity,
} from '../components/rev_libs_pers/rev_pers_rev_entity/rev_site_entity';
import {
  revIsEmptyVar,
  revIsEmptyJSONObject,
} from '../rev_function_libs/rev_gen_helper_functions';
import {
  revGetEntityInfo,
  useRevGetEntityPictureAlbums,
} from '../components/rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import RevWalledGarden from '../components/rev_views/RevWalledGarden';

const RevSiteDataContext = createContext();

const RevSiteDataContextProvider = ({children}) => {
  const {SET_REV_SITE_INIT_VIEW} = useContext(ReViewsContext);

  const [REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS] = useState({
    revRemoteEntityGUID: 0,
  });

  const [REV_LOGGED_IN_ENTITY_GUID, SET_REV_LOGGED_IN_ENTITY_GUID] =
    useState(0);
  const [REV_SITE_ENTITY_GUID, SET_REV_SITE_ENTITY_GUID] = useState(0);

  const [REV_LOGGED_IN_ENTITY, SET_REV_LOGGED_IN_ENTITY] = useState({});

  const {revGetSiteEntity} = useRevGetSiteEntity();
  const {revCreateSiteEntity} = useRevCreateSiteEntity();
  const {revGetEntityPictureAlbums} = useRevGetEntityPictureAlbums();

  useEffect(() => {
    if (
      !revIsEmptyVar(REV_LOGGED_IN_ENTITY_GUID) &&
      REV_LOGGED_IN_ENTITY_GUID > 0
    ) {
      let revSiteEntityGUID = -1;
      let revSiteEntityOwnerGUID = -1;

      let revLoggedInEntityStr = RevPersLibRead_React.revPersGetEntity_By_GUID(
        REV_LOGGED_IN_ENTITY_GUID,
      );

      let revLoggedInEntity = JSON.parse(revLoggedInEntityStr);
      revLoggedInEntity['_revInfoEntity'] = revGetEntityInfo(
        REV_LOGGED_IN_ENTITY_GUID,
      );

      let revEntityPicsAlbumArr = revGetEntityPictureAlbums(
        REV_LOGGED_IN_ENTITY_GUID,
      );
      revLoggedInEntity['revEntityPicsAlbum'] = revEntityPicsAlbumArr[0];

      SET_REV_LOGGED_IN_ENTITY(revLoggedInEntity);

      /** START SET UP SITE */
      let revSiteEntity = revGetSiteEntity(REV_LOGGED_IN_ENTITY_GUID);

      if (
        !revIsEmptyJSONObject(revSiteEntity) &&
        revSiteEntity.hasOwnProperty('_revGUID')
      ) {
        revSiteEntityGUID = revSiteEntity._revGUID;
        revSiteEntityOwnerGUID = revSiteEntity._revOwnerGUID;
      } else {
        revSiteEntityGUID = revCreateSiteEntity(REV_LOGGED_IN_ENTITY_GUID);
        let revSiteEntity = revGetSiteEntity(REV_LOGGED_IN_ENTITY_GUID);

        revSiteEntityOwnerGUID = revSiteEntity._revOwnerGUID;
      }

      if (
        revSiteEntityGUID._revResolveStatus > -1 &&
        revSiteEntityOwnerGUID === REV_LOGGED_IN_ENTITY_GUID
      ) {
        let revEntityResolveStatusByRevEntityGUID =
          RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
            2,
            revSiteEntityGUID,
          );
      }

      SET_REV_SITE_ENTITY_GUID(revSiteEntityGUID);
      /** END SET UP SITE */
    } else {
      SET_REV_SITE_INIT_VIEW(<RevWalledGarden />);
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

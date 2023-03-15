import {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../rev_contexts/RevRemoteSocketContext';

export const revGetServerData_Async = async revURL => {
  let revResponse;
  try {
    revResponse = await fetch(revURL);
  } catch (err) {
    revResponse = JSON.stringify({revError: err});
  }

  return revResponse;
};

export const revGetServerData = async revURL => {
  let revResponseData = null;

  try {
    let revResponse = await revGetServerData_Async(revURL);

    if (revResponse !== null) {
      revResponseData = await revResponse.json();
    }
  } catch (error) {
    revResponseData = {revError: error};
  }

  return revResponseData;
};

export const useRevGetServerData_JSON_Async = revURL => {
  const [revRetData, setRevRetData] = useState({});

  useEffect(() => {
    let revGetData = async () => {
      try {
        let revData = await revGetServerData(revURL);
        setRevRetData(revData);
      } catch (e) {
        setError(e);
        setRevRetData({revError: e});
      } finally {
      }
    };

    revGetData();
  }, [revURL]);

  return {revRetData};
};

export const revGetServerData_JSON = async (revURL, revCallBack) => {
  let revResponseData = null;

  try {
    let revResponse = await revGetServerData_Async(revURL);

    if (revResponse !== null) {
      revResponseData = await revResponse.json();
    }
  } catch (error) {
    revResponseData = {revError: error};
  }

  revCallBack(revResponseData);
};

export const useRevGetRemoteEntity_By_RemoteEntityGUID =
  revRemoteEntityGUID => {
    const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
    const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

    let revPath = `${REV_ROOT_URL}/rev_api/get_flat_entity?remote_rev_entity_guid=${revRemoteEntityGUID}&rev_logged_in_entity_guid=${REV_LOGGED_IN_ENTITY_GUID}`;

    const {revRetData} = useRevGetServerData_JSON_Async(revPath);

    return revRetData;
  };

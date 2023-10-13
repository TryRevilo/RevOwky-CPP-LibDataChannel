import {NativeModules} from 'react-native';

const {RevPersLibRead_React} = NativeModules;

export const userevPersGetAnn_By_Name_EntityGUID_OwnerGUID = () => {
  const revPersGetAnn_By_Name_EntityGUID_OwnerGUID = (
    revAnnotationName,
    revEntityGUID,
    revOwnerGUID,
  ) => {
    let revEntityAnnDataStr =
      RevPersLibRead_React.revPersGetAnn_By_Name_EntityGUID_OwnerGUID(
        revAnnotationName,
        revEntityGUID,
        revOwnerGUID,
      );

    return JSON.parse(revEntityAnnDataStr);
  };

  return {revPersGetAnn_By_Name_EntityGUID_OwnerGUID};
};

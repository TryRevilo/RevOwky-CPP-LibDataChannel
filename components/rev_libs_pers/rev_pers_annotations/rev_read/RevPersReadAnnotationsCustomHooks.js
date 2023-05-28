import {NativeModules} from 'react-native';

const {RevPersLibRead_React} = NativeModules;

export const useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID = () => {
  const revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID = (
    revAnnotationName,
    revEntityGUID,
    revOwnerGUID,
  ) => {
    let revEntityAnnDataStr =
      RevPersLibRead_React.revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID(
        revAnnotationName,
        revEntityGUID,
        revOwnerGUID,
      );

    return JSON.parse(revEntityAnnDataStr);
  };

  return {revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID};
};

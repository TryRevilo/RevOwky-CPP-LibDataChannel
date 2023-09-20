import React from 'react';
import {} from 'react-native';

import {useRevSaveNewAnnotation} from '../../../rev_libs_pers/rev_pers_annotations/rev_pers_lib_create/revPersLibCreateAnnCustomHooks';

export const useRevLikeInlineFormAction = () => {
  const {revSaveNewAnnotation} = useRevSaveNewAnnotation();

  const revLikeInlineFormAction = (
    revAnnotationName,
    revAnnotationValue,
    revEntityGUID,
    revOwnerEntityGUID,
  ) => {
    let revAnnID = revSaveNewAnnotation({
      revAnnotationName,
      revAnnotationValue,
      revEntityGUID,
      revOwnerEntityGUID,
      revAnnMetadataStatsName: 'rev_tot_likes_stats',
    });

    return revAnnID;
  };

  return {revLikeInlineFormAction};
};

import {SET_PUBLISHER_ENTITIES_ARR} from '../_rev_data';

export const revSetPublisherEntitiesArrAction = revPublisherEntitiesArr => {
  return {
    type: SET_PUBLISHER_ENTITIES_ARR,
    payload: revPublisherEntitiesArr,
  };
};

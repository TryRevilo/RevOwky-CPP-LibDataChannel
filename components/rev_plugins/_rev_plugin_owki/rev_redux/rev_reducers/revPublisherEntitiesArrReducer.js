import {SET_PUBLISHER_ENTITIES_ARR} from '../_rev_data';

export const revPublisherEntitiesArrReducer = (state = [], action) => {
  switch (action.type) {
    case SET_PUBLISHER_ENTITIES_ARR:
      return action.payload;
    default:
      return state;
  }
};

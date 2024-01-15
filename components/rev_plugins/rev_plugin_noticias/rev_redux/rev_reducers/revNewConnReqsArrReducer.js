import {SET_MESSAGE} from '../rev_data';

export const revNewConnReqsArrReducer = (state = [], action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

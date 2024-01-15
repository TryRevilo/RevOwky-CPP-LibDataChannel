import {SET_MESSAGE} from '../rev_data';

export const revSetNewConnReqsArrAction = revNewConnReqsArr => {
  return {
    type: SET_MESSAGE,
    payload: revNewConnReqsArr,
  };
};

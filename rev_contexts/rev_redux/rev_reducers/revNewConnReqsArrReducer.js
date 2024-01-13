export const SET_MESSAGE = 'SET_MESSAGE';

export const revNewConnReqsArrReducer = (state = [], action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

export const revSetNewConnReqsArr = revNewConnReqsArr => ({
  type: SET_MESSAGE,
  payload: revNewConnReqsArr,
});

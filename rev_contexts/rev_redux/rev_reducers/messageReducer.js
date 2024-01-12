export const SET_MESSAGE = 'SET_MESSAGE';

export const messageReducer = (state = 'Hello World', action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

export const setMessage = message => ({
  type: SET_MESSAGE,
  payload: message,
});

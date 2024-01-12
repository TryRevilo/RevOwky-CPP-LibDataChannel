export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

export const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    default:
      return state;
  }
};

export const incrementCounter = () => ({
  type: INCREMENT_COUNTER,
});

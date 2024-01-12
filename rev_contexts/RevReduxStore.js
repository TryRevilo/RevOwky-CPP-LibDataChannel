import {createStore} from 'redux';
import {combineReducers} from 'redux';

import thunk from 'redux-thunk';

import {messageReducer} from './rev_redux/rev_reducers/messageReducer';
import {counterReducer} from './rev_redux/rev_reducers/counterReducer';

const revRootReducer = combineReducers({
  message: messageReducer,
  counter: counterReducer,
});

const RevReduxStore = createStore(revRootReducer);
export default RevReduxStore;

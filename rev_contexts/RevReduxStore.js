import {createStore} from 'redux';
import {combineReducers} from 'redux';

import thunk from 'redux-thunk';

import {revNewConnReqsArrReducer} from './rev_redux/rev_reducers/revNewConnReqsArrReducer';
import {counterReducer} from './rev_redux/rev_reducers/counterReducer';

const revRootReducer = combineReducers({
  revNewConnReqsArr: revNewConnReqsArrReducer,
  counter: counterReducer,
});

const RevReduxStore = createStore(revRootReducer);
export default RevReduxStore;

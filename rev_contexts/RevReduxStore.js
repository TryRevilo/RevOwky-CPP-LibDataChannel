import {createStore} from 'redux';
import {combineReducers} from 'redux';

import thunk from 'redux-thunk';

import {revGetPluginsReduxReducers} from '../components/rev_plugins_loader';

import {counterReducer} from './rev_redux/rev_reducers/counterReducer';

export const useRevReduxStoreInit = () => {
  const revReduxStoreInit = async () => {
    let revPluginsReducers = await revGetPluginsReduxReducers();

    const revRootReducer = combineReducers({
      ...revPluginsReducers,
      counter: counterReducer,
    });

    const RevReduxStore = createStore(revRootReducer);

    return RevReduxStore;
  };

  return {revReduxStoreInit};
};

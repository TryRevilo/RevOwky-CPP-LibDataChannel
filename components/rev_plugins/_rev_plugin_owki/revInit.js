import React, {useContext} from 'react';
import {} from 'react-native';

import {useDispatch} from 'react-redux';

import {revPublisherEntitiesArrReducer} from './rev_redux/rev_reducers/revPublisherEntitiesArrReducer';
import {revSetPublisherEntitiesArrAction} from './rev_redux/rev_actions/revSetPublisherEntitiesArrAction';

export const useRevStart = () => {
  const dispatch = useDispatch();

  const revInit = ({revVarArgs}) => {};

  const revPluginContextViewsArr = ({revVarArgs}) => {
    const {revContextName} = revVarArgs;

    switch (revContextName) {
      case 'revObjectViews':
        return [{}];

      case 'revFormViews':
        return [];

      case 'revWidgetViews':
        return [{}];

      case 'revListingViews':
        return [];

      case 'revListingWidgetViews':
        return [];

      default:
        break;
    }
  };

  const useRevHookNewPublishersArr = (revNewPublisherEntitiesArr = []) => {
    if (revNewPublisherEntitiesArr.length) {
      dispatch(revSetPublisherEntitiesArrAction(revNewPublisherEntitiesArr));
    }

    return null;
  };

  const revPluginHooks = ({revVarArgs = {}}) => {
    const {revPluginHookName = ''} = revVarArgs;

    switch (revPluginHookName) {
      case 'revPublishersArr':
        return useRevHookNewPublishersArr;

      default:
        break;
    }
  };

  return {
    revInit,
    revPluginHooks,
    revReduxReducers,
  };
};

export const revReduxReducers = () => {
  return {
    revPublisherEntitiesArr: revPublisherEntitiesArrReducer,
  };
};

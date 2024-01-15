import React, {useContext} from 'react';
import {} from 'react-native';

import {useDispatch} from 'react-redux';

import {revPluginsLoader} from '../../rev_plugins_loader';

import {ReViewsContext} from '../../../rev_contexts/ReViewsContext';
import {useRevUpdateConnectionRequestStatus} from '../rev_plugin_member_connections/rev_remote_update_actions/rev_update_connection_request_status';

import {revNewConnReqsArrReducer} from './rev_redux/rev_reducers/revNewConnReqsArrReducer';
import {revSetNewConnReqsArrAction} from './rev_redux/rev_actions/revNewConnReqsArrAction';

export const useRevStart = () => {
  const dispatch = useDispatch();

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const {revUpdateConnectionRequestStatus} =
    useRevUpdateConnectionRequestStatus();

  const revInit = ({revVarArgs}) => {};

  const revUpcommingFeatures = () => [
    {
      revFeatureId: 'rev_sticky_notes',
      revName: 'Sticky Notes',
      revDescription: 'Sticky Notes for you . . . Lest you forget',
      revStatus: 'in development',
      revEstDelivery: '~Aug 2',
    },
    {
      revFeatureId: 'rev_search',
      revName: 'Search added items',
      revDescription: 'Search added items by Code, Name, Description . etc',
      revStatus: 'in development',
      revEstDelivery: '~Aug 2',
    },
    {
      revFeatureId: 'rev_qr_code_builder',
      revName: 'QR Code / Bar Code Builder',
      revDescription: 'Build your own custom QR and Bar Codes',
      revStatus: 'in development',
      revEstDelivery: '~Aug 2',
    },
    {
      revFeatureId: 'rev_camera_picture',
      revName: 'Take Pictures',
      revDescription: 'Take relevant pictures related to an item',
      revStatus: 'in development',
      revEstDelivery: '~Aug 2',
    },
    {
      revFeatureId: 'rev_star_rate',
      revName: 'Star Ratings',
      revDescription: 'Rate a listed item by Stars',
      revStatus: 'in development',
      revEstDelivery: '~Aug 2',
    },
    {
      revFeatureId: 'rev_flag',
      revName: 'Flag an Item',
      revDescription: 'Tag Flags on an item to alert others',
      revStatus: 'in development',
      revEstDelivery: '~Aug 2',
    },
  ];

  const revPluginContextViewsArr = ({revVarArgs}) => {
    const {revContextName} = revVarArgs;

    switch (revContextName) {
      case 'revObjectViews':
        return [{}];

      case 'revFormViews':
        return [
          {
            revEntitySubType: 'rev_listing_item',
            RevComponent: null,
          },
        ];

      case 'revWidgetViews':
        return [{}];

      case 'revListingViews':
        return [
          {
            revEntitySubType: 'rev_listing_item',
            RevComponent: null,
          },
        ];

      case 'revListingWidgetViews':
        return [
          {
            revEntitySubType: 'rev_listing_item',
            RevComponent: null,
          },
        ];

      default:
        break;
    }
  };

  const useRevHookNewNoticias = (revConnRequests = []) => {
    if (revConnRequests.length) {
      dispatch(revSetNewConnReqsArrAction(revConnRequests));
    }

    let revNoticias = revPluginsLoader({
      revPluginName: 'rev_plugin_noticias',
      revViewName: 'RevNoticias',
      revVarArgs: revConnRequests,
    });

    SET_REV_SITE_BODY(revNoticias);

    revUpdateConnectionRequestStatus(revRetData => {
      console.log('>>> revRetData ' + JSON.stringify(revRetData));
    });

    return null;
  };

  const revPluginHooks = ({revVarArgs = {}}) => {
    const {revPluginHookName = ''} = revVarArgs;

    switch (revPluginHookName) {
      case 'revNewConnReqRelsArr':
        return useRevHookNewNoticias;

      case 'revConnRequests':
        return useRevHookNewNoticias;

      default:
        break;
    }
  };

  return {
    revInit,
    revUpcommingFeatures,
    revPluginContextViewsArr,
    revPluginHooks,
    revReduxReducers,
  };
};

export const revReduxReducers = () => {
  return {
    revNewConnReqsArr: revNewConnReqsArrReducer,
  };
};

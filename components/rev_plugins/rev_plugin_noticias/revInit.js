import React, {useContext, useState, memo, useRef} from 'react';
import {} from 'react-native';

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';

export const useRevStart = () => {
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

  const revPluginHooks = ({revVarArgs}) => {
    const {revPluginHookName = ''} = revVarArgs;

    switch (revPluginHookName) {
      case 'rev_new_msgs':
        return revVarArgs => {
          console.log('>>> revVarArgs', JSON.stringify(revVarArgs));
        };

      default:
        break;
    }
  };

  return {
    revInit,
    revUpcommingFeatures,
    revPluginContextViewsArr,
    revPluginHooks,
  };
};

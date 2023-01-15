import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {RevCreateNewStoreForm} from './rev_views/rev_forms/RevCreateNewStoreForm';
import {RevStoresListingView} from './rev_views/rev_listing_views/RevStoresListingView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevStoresListingView':
      RevView = <RevStoresListingView revVarArgs={revVarArgs} />;
      break;

    case 'RevCreateNewStoreForm':
      RevView = <RevCreateNewStoreForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

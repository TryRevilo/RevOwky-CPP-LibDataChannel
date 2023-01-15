import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {RevTaggedPostsListing} from './rev_views/rev_listing_views/RevTaggedPostsListing';
import {RevSitePublisherForm} from './rev_views/rev_forms/RevSitePublisherForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevTaggedPostsListing':
      RevView = <RevTaggedPostsListing revVarArgs={revVarArgs} />;
      break;

    case 'RevSitePublisherForm':
      RevView = <RevSitePublisherForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

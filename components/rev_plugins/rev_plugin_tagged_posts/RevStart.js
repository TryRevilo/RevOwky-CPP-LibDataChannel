import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {RevSitePublisherForm} from './rev_views/rev_forms/RevSitePublisherForm';
import {RevTaggedPostsListing} from './rev_views/rev_listing_views/RevTaggedPostsListing';
import {RevKiwiObjectView} from './rev_views/rev_object_views/RevKiwiObjectView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevSitePublisherForm':
      RevView = <RevSitePublisherForm revVarArgs={revVarArgs} />;
      break;

    case 'rev_object_views':
      RevView = <RevKiwiObjectView revVarArgs={revVarArgs} />;
      break;

    case 'RevTaggedPostsListing':
      RevView = <RevTaggedPostsListing revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

import React from 'react';

import {RevCallPeersListing} from './rev_views/rev_listing_views/RevCallPeersListing';
import {RevVideoCall} from './rev_views/rev_object_views/RevVideoCall';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCallPeersListing':
      RevView = <RevCallPeersListing revVarArgs={revVarArgs} />;
      break;

    case 'RevVideoCall':
      RevView = <RevVideoCall revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

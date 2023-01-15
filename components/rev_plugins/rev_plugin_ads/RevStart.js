import React from 'react';

import {RevAdEntityListingView} from './rev_views/rev_listing_views/RevAdEntityListingView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevAdEntityListingView':
      RevView = <RevAdEntityListingView />;
      break;

    default:
      break;
  }

  return RevView;
}

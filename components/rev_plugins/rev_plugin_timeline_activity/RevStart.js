import React, {useState} from 'react';

import {RevTimelineActivityListingView} from './rev_views/rev_listing_views/RevTimelineActivityListingView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevTimelineActivityListingView':
      RevView = <RevTimelineActivityListingView revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

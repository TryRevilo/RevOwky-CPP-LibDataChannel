import React from 'react';

import {RevInlineVideoPlayer} from './rev_views/rev_listing_views/RevInlineVideoPlayer';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevInlineVideoPlayer':
      RevView = <RevInlineVideoPlayer revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

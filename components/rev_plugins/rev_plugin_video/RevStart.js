import React from 'react';

import {RevInlineVideoPlayer} from './rev_views/rev_listing_views/RevInlineVideoPlayer';
import {RevCustomVideoPlayer} from './rev_object_views/RevCustomVideoPlayer';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevInlineVideoPlayer':
      RevView = <RevInlineVideoPlayer revVarArgs={revVarArgs} />;
      break;

    case 'RevCustomVideoPlayer':
      RevView = <RevCustomVideoPlayer revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

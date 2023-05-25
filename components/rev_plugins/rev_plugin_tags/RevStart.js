import React from 'react';

import {RevTagItemView} from './rev_views/rev_listing_views/RevTagItemView';
import {RevTagEntitiesInlineListing} from './rev_views/rev_listing_views/RevTagEntitiesInlineListing';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevTagItemView':
      RevView = <RevTagItemView revVarArgs={revVarArgs} />;
      break;

    case 'RevTagEntitiesInlineListing':
      RevView = <RevTagEntitiesInlineListing revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

import React from 'react';

import {RevCreateNewTagForm} from './rev_views/rev_forms/RevCreateNewTagForm';
import {RevTagItemView} from './rev_views/rev_listing_views/RevTagItemView';
import {RevTagEntitiesInlineListing} from './rev_views/rev_listing_views/RevTagEntitiesInlineListing';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCreateNewTagForm':
      RevView = <RevCreateNewTagForm revVarArgs={revVarArgs} />;
      break;

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

import React, {lazy} from 'react';

import {RevFooter1} from './rev_views/RevFooter1';
import {RevCreateFlagForm} from './rev_views/rev_forms/RevCreateFlagForm';
import {RevFlagItemView} from './rev_views/rev_listing_item_views/RevFlagItemView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevFooter1':
      RevView = <RevFooter1 revVarArgs={revVarArgs} />;
      break;

    case 'RevCreateFlagForm':
      RevView = <RevCreateFlagForm revVarArgs={revVarArgs} />;
      break;

    case 'RevFlagItemView':
      RevView = <RevFlagItemView revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

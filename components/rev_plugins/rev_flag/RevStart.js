import React, {lazy} from 'react';

import {RevFooter1} from './rev_views/RevFooter1';
import {RevFlagForm} from './rev_views/rev_forms/RevFlagForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevFooter1':
      RevView = <RevFooter1 revVarArgs={revVarArgs} />;
      break;

    case 'RevFlagForm':
      RevView = <RevFlagForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

import React, {lazy} from 'react';

import {RevFooter1} from './rev_views/RevFooter1';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevFooter1':
      RevView = <RevFooter1 revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

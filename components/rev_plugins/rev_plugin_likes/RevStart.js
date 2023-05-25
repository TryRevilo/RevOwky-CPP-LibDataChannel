import React from 'react';

import {RevLikeInlineForm} from './rev_views/rev_forms/RevLikeInlineForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevLikeInlineForm':
      RevView = <RevLikeInlineForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

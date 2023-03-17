import React from 'react';

import {RevCommentForm} from './rev_views/rev_forms/RevCommentForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCommentForm':
      RevView = <RevCommentForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

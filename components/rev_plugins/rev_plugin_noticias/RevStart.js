import React from 'react';

import {RevNoticias} from './rev_views/rev_object_views/RevNoticias';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevNoticias':
      RevView = <RevNoticias revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

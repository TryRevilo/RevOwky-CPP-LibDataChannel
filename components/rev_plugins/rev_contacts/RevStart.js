import React from 'react';

import {RevContacts} from './rev_views/rev_listing_views/RevContacts';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevContacts':
      RevView = <RevContacts revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

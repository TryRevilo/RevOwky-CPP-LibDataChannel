import React from 'react';

import {RevCreateSiteMessageForm} from './rev_views/rev_forms/RevCreateSiteMessageForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCreateSiteMessageForm':
      RevView = <RevCreateSiteMessageForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

import React from 'react';

import {RevMemberConnectionRequests} from './rev_views/rev_forms/RevMemberConnectionRequests';
import {RevMemberConnectionRequestItem} from './rev_views/rev_forms/RevMemberConnectionRequestItem';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevMemberConnectionRequests':
      RevView = <RevMemberConnectionRequests revVarArgs={revVarArgs} />;
      break;

    case 'RevMemberConnectionRequestItem':
      RevView = <RevMemberConnectionRequestItem revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

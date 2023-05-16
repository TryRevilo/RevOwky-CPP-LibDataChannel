import React from 'react';

import {RevCreateNewOrganization} from './rev_views/rev_forms/RevCreateNewOrganization';
import {RevCreateProductLine} from './rev_views/rev_forms/RevCreateProductLine';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCreateNewOrganization':
      RevView = <RevCreateNewOrganization revVarArgs={revVarArgs} />;
      break;

    case 'RevCreateProductLine':
      RevView = <RevCreateProductLine revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

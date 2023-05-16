import React from 'react';

import {RevCreateNewAdForm} from './rev_views/rev_forms/RevCreateNewAdForm';
import {RevCreateNewAdDetailsForm} from './rev_views/rev_forms/RevCreateNewAdDetailsForm';
import {RevAdEntityListingView} from './rev_views/rev_listing_views/RevAdEntityListingView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCreateNewAdForm':
      RevView = <RevCreateNewAdForm revVarArgs={revVarArgs} />;
      break;

    case 'RevCreateNewAdDetailsForm':
      RevView = <RevCreateNewAdDetailsForm revVarArgs={revVarArgs} />;
      break;

    case 'RevAdEntityListingView':
      RevView = <RevAdEntityListingView revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

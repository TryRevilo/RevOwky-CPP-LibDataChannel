import React from 'react';

import {RevSearchForm} from './rev_views/rev_forms/RevSearchForm';
import {RevSearchEntitiesListing} from './rev_views/rev_listing_views/RevSearchEntitiesListing';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevSearchForm':
      RevView = <RevSearchForm />;
      break;

    case 'RevSearchEntitiesListing':
      RevView = <RevSearchEntitiesListing />;
      break;

    default:
      break;
  }

  return RevView;
}

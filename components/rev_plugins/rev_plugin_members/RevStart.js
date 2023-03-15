import React from 'react';

import {RevMembersEntitiesListing} from './rev_views/rev_listing_views/RevMembersEntitiesListing';
import {RevMembersListingItem} from './rev_views/rev_listing_views/RevMembersListingItem';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevMembersEntitiesListing':
      RevView = <RevMembersEntitiesListing revVarArgs={revVarArgs} />;
      break;

    case 'RevMembersListingItem':
      RevView = <RevMembersListingItem revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

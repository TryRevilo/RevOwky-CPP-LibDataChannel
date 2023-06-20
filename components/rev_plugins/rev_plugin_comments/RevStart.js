import React from 'react';

import {RevCommentForm} from './rev_views/rev_forms/RevCommentForm';
import {RevCommentItemListingView} from './rev_views/rev_listing_views/RevCommentItemListingView';
import {RevCommentItemsListingView} from './rev_views/rev_listing_views/RevCommentItemsListingView';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCommentForm':
      RevView = <RevCommentForm revVarArgs={revVarArgs} />;
      break;

    case 'RevCommentItemListingView':
      RevView = <RevCommentItemListingView revVarArgs={revVarArgs} />;
      break;

    case 'RevCommentItemsListingView':
      RevView = <RevCommentItemsListingView revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

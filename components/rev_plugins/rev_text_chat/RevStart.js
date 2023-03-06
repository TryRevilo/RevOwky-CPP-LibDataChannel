import React, {useState} from 'react';

import {RevFooter1Left} from '../../rev_views/rev_site_footer_views/RevFooter1Left';
import {RevFooter2} from '../../rev_views/rev_site_footer_views/RevFooter2';
import {RevFooter3} from '../../rev_views/rev_site_footer_views/RevFooter3';
import {RevChatMessageNotificationsListing} from './rev_views/rev_listing_views/RevChatMessageNotificationsListing';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevFooter1Left':
      RevView = <RevFooter1Left revVarArgs={revVarArgs} />;
      break;

    case 'RevFooter2':
      RevView = <RevFooter2 revVarArgs={revVarArgs} />;
      break;

    case 'RevFooter3':
      RevView = <RevFooter3 revVarArgs={revVarArgs} />;
      break;

    case 'RevChatMessageNotificationsListing':
      RevView = <RevChatMessageNotificationsListing revVarArgs={revVarArgs} />;
      break;

    case 'RevChatMessageNotificationsListingItem':
      RevView = (
        <RevChatMessageNotificationsListingItem revVarArgs={revVarArgs} />
      );
      break;

    default:
      break;
  }

  return RevView;
}

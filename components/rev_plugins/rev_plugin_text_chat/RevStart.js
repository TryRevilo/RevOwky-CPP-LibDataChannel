import React, {useState} from 'react';

import {RevFooter1} from '../../rev_views/rev_site_footer_views/rev_footer_1/RevFooter1';
import {RevFooter1Left} from '../../rev_views/rev_site_footer_views/rev_footer_1/RevFooter1Left';
import {RevFooter2} from '../../rev_views/rev_site_footer_views/RevFooter2';
import {RevFooter3} from '../../rev_views/rev_site_footer_views/RevFooter3';
import {RevChatMessageNotificationsListing} from './rev_views/rev_listing_views/RevChatMessageNotificationsListing';
import {RevChatMessageNotificationsListingItem} from './rev_views/rev_listing_views/rev_entity_views/RevChatMessageNotificationsListingItem';
import {RevChatMessagesConversationsListing} from './rev_views/rev_listing_views/RevChatMessagesConversationsListing';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevFooter1':
      RevView = <RevFooter1 revVarArgs={revVarArgs} />;
      break;

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

    case 'RevChatMessagesConversationsListing':
      RevView = <RevChatMessagesConversationsListing revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

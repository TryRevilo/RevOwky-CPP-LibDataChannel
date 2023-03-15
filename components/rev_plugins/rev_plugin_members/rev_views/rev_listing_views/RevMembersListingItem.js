import React from 'react';

import {RevMembersListingItemWidget} from './rev_widget_views/RevMembersListingItemWidget';

export const RevMembersListingItem = ({revVarArgs}) => {
  return <RevMembersListingItemWidget revVarArgs={revVarArgs} />;
};

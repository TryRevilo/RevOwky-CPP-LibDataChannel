import React from 'react';

import {RevAdObjectViewWidget} from './rev_widget_views/RevAdObjectViewWidget';

export const RevAdObjectView = ({revVarArgs}) => {
  return <RevAdObjectViewWidget revVarArgs={revVarArgs} />;
};

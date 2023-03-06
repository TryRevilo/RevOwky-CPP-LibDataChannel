import React, {useState} from 'react';

import {RevUserProfileObjectView_Widget} from './rev_views/rev_object_views/rev_widget_views/RevUserProfileObjectView_Widget';
import {RevUserInfo} from './rev_views/rev_object_views/RevUserInfo';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'rev_object_views':
      RevView = <RevUserProfileObjectView_Widget revVarArgs={revVarArgs} />;
      break;

    case 'RevUserInfo':
      RevView = <RevUserInfo revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

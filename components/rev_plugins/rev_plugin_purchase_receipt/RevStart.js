import React from 'react';

import {RevPurchaseReceipt} from './rev_views/rev_object_views/RevPurchaseReceipt';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevPurchaseReceipt':
      RevView = <RevPurchaseReceipt revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

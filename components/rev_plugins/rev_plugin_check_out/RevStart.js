import React from 'react';

import {RevCheckOutForm} from './rev_views/rev_forms/RevCheckOutForm';
import {RevOrderDetails} from './rev_views/rev_object_views/RevOrderDetails';
import {RevPurchaseReceipt} from './rev_views/rev_object_views/RevPurchaseReceipt';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevCheckOutForm':
      RevView = <RevCheckOutForm revVarArgs={revVarArgs} />;
      break;

    case 'RevOrderDetails':
      RevView = <RevOrderDetails revVarArgs={revVarArgs} />;
      break;

    case 'RevPurchaseReceipt':
      RevView = <RevPurchaseReceipt revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

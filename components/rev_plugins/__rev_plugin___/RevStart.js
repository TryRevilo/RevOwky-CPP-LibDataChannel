import React from 'react';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevEditUserInfoForm':
      RevView = <RevEditUserInfoForm />;
      break;

    default:
      break;
  }

  return RevView;
}

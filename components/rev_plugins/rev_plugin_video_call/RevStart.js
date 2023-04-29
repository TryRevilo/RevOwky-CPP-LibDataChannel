import React from 'react';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevEditUserInfoForm':
      RevView = <RevEditUserInfoForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

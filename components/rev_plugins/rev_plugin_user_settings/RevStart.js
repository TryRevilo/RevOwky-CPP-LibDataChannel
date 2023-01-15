import React from 'react';

import {RevEditUserInfoForm} from './rev_views/rev_forms/RevEditUserInfoForm';
import {RevUserSettings} from './rev_views/rev_object_views/RevUserSettings';
import {RevSignUpForm} from './rev_views/rev_forms/RevSignUpForm';
import {RevLogInForm} from './rev_views/rev_forms/RevLogInForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevEditUserInfoForm':
      RevView = <RevEditUserInfoForm />;
      break;

    case 'RevUserSettings':
      RevView = <RevUserSettings />;
      break;

    case 'RevSignUpForm':
      RevView = <RevSignUpForm />;
      break;

    case 'RevLogInForm':
      RevView = <RevLogInForm />;
      break;

    default:
      break;
  }

  return RevView;
}

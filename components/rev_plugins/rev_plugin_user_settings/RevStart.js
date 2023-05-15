import React from 'react';

import {RevEditUserInfoForm} from './rev_views/rev_forms/RevEditUserInfoForm';
import {RevEditAccountSettingsForm} from './rev_views/rev_forms/RevEditAccountSettingsForm';
import {RevUserSettings} from './rev_views/rev_object_views/RevUserSettings';
import {RevSignUpForm} from './rev_views/rev_forms/RevSignUpForm';
import {RevLogInForm} from './rev_views/rev_forms/RevLogInForm';

export default function RevStart({revVarArgs}) {
  let RevView = null;

  let revViewName = revVarArgs.revViewName;

  switch (revViewName) {
    case 'RevEditUserInfoForm':
      RevView = <RevEditUserInfoForm revVarArgs={revVarArgs} />;
      break;

    case 'RevEditAccountSettingsForm':
      RevView = <RevEditAccountSettingsForm revVarArgs={revVarArgs} />;
      break;

    case 'RevUserSettings':
      RevView = <RevUserSettings revVarArgs={revVarArgs} />;
      break;

    case 'RevSignUpForm':
      RevView = <RevSignUpForm revVarArgs={revVarArgs} />;
      break;

    case 'RevLogInForm':
      RevView = <RevLogInForm revVarArgs={revVarArgs} />;
      break;

    default:
      break;
  }

  return RevView;
}

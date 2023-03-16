import React from 'react';

import {RevNoticiasWidget} from './rev_wideget_views/RevNoticiasWidget';

export const RevNoticias = ({revVarArgs}) => {
  return <RevNoticiasWidget revVarArgs={revVarArgs.revVarArgs} />;
};

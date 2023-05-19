import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {RevOrderDetailsWidget} from './rev_wideget_views/RevOrderDetailsWidget';

export const RevOrderDetails = ({revVarArgs}) => {
  return <RevOrderDetailsWidget revVarArgs={revVarArgs} />;
};

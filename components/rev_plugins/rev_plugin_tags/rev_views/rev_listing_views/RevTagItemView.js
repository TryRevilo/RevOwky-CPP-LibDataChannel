import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {RevTagItemViewWidget} from './rev_widget_views/RevTagItemViewWidget';

export const RevTagItemView = ({revVarArgs}) => {
  return <RevTagItemViewWidget revVarArgs={revVarArgs} />;
};

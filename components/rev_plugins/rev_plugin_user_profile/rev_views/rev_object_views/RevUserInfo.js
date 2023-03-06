import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {RevUserInfo_Widget} from './rev_widget_views/RevUserInfo_Widget';

export const RevUserInfo = ({revVarArgs}) => {
  return <RevUserInfo_Widget revVarArgs={revVarArgs} />;
};

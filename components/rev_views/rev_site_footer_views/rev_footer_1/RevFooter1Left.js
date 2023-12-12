import React, {useContext} from 'react';

import {StyleSheet, View} from 'react-native';

import RevNextStrangerChatTab from '../../../rev_plugins/rev_plugin_text_chat/rev_views/rev_menu_areas/RevNextStrangerChatTab';

import {useRevSiteStyles} from '../../RevSiteStyles';

export function RevFooter1Left() {
  const {revSiteStyles} = useRevSiteStyles();

  let revRetView = (
    <View style={[revSiteStyles.revFlexWrapper_WidthAuto]}>
      <RevNextStrangerChatTab revVarArgs={{_revRemoteGUID: 1055}} />
    </View>
  );

  return revRetView;
}

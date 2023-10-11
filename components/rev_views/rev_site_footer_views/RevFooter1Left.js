import React, {useContext} from 'react';

import {StyleSheet, View} from 'react-native';

import {useRevSiteStyles} from '../RevSiteStyles';

import {ReViewsContext} from '../../../rev_contexts/ReViewsContext';

import RevFooter_1_Right from './rev_footer_1/RevFooter_1_Right';

import RevNextStrangerChatTab from '../../rev_plugins/rev_plugin_text_chat/rev_views/rev_menu_areas/RevNextStrangerChatTab';

export function RevFooter1Left() {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_FOOTER_1_CENTER} = useContext(ReViewsContext);

  return (
    <View style={[revSiteStyles.revFlexWrapper, {alignItems: 'flex-end'}]}>
      <RevNextStrangerChatTab revVarArgs={{_revRemoteEntityGUID: 1055}} />

      {REV_FOOTER_1_CENTER}

      <RevFooter_1_Right />
    </View>
  );
}

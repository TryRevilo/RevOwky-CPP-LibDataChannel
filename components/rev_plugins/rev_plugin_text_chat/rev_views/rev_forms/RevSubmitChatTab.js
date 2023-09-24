import React, {useContext} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';

import {useRevHandleSendMsgAction} from '../../rev_actions.js/rev_stranger_chat_submit_actions';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export function RevSubmitChatTab({
  revGetCurrentChatTarget,
  revGetChatTextImput,
  revCallback,
}) {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {revHandleSendMsgAction} = useRevHandleSendMsgAction();

  const handleRevSendChatMsg = () => {
    let revPassVaArgs = {
      revTargetEntityGUID: revGetCurrentChatTarget(),
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityDescVal: revGetChatTextImput(),
    };

    revHandleSendMsgAction(revPassVaArgs).then(revRetData => {
      revCallback(revRetData);
    });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleRevSendChatMsg();
      }}>
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revSubmitChatTabWrapper]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorWhite,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
            styles.revSubmitChatTab,
          ]}>
          Send
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  revSubmitChatTabWrapper: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginRight: 5,
  },
  revSubmitChatTab: {
    backgroundColor: '#444',
    paddingHorizontal: 17,
    paddingVertical: 3,
    marginTop: 2,
    borderRadius: 8,
  },
});

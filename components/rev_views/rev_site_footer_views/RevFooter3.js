import React, {useContext, useEffect, useState} from 'react';

import {StyleSheet, Text, View} from 'react-native';

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';

import RevNextStrangerChatTab from '../../rev_plugins/rev_plugin_text_chat/rev_views/rev_menu_areas/RevNextStrangerChatTab';

export function RevFooter3() {
  const {REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);
  [isRevFooter3StrangerChat, setIsRevFooter3StrangerChat] = useState(true);

  useEffect(() => {
    if (REV_SITE_VAR_ARGS.revRemoteEntityGUID < 1) {
      setIsRevFooter3StrangerChat(false);
    } else {
      setIsRevFooter3StrangerChat(true);
    }
  }, [REV_SITE_VAR_ARGS]);

  let RevStrangerInfo = () => {
    return (
      <View style={styles.recipientProfileWrapper}>
        <View style={styles.recipientProfileIcon}></View>
        <View style={styles.recipientProfileInfoContainer}>
          <Text style={styles.recipientProfileInfoNames}>Oliver Muchai</Text>
          <Text style={styles.recipientProfileInfoDetails}>M, 23, US NY</Text>
        </View>
      </View>
    );
  };

  let RevChatFooter3 = () => {
    return (
      <View style={styles.loggedInPeopleWrapper}>
        {isRevFooter3StrangerChat ? <RevStrangerInfo /> : null}
        {isRevFooter3StrangerChat ? (
          <View style={styles.recipientNextTab}>
            <RevNextStrangerChatTab
              revVarArgs={{_remoteRevEntityGUID: 98876}}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return <View>{isRevFooter3StrangerChat ? <RevChatFooter3 /> : null}</View>;
}

const styles = StyleSheet.create({
  loggedInPeopleWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  recipientProfileWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
  },
  recipientProfileIcon: {
    backgroundColor: '#F7F7F7',
    width: 42,
    height: 32,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 55,
  },
  recipientProfileInfoContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    marginLeft: 4,
  },
  recipientProfileInfoNames: {
    color: '#757575',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 11,
  },
  recipientProfileInfoDetails: {
    color: '#757575',
    fontSize: 10,
    lineHeight: 10,
  },
  recipientNextTab: {
    display: 'flex',
    marginRight: 12,
    marginLeft: 'auto',
  },
});

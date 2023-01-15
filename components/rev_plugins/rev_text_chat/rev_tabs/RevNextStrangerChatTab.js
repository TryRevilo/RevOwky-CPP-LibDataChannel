import React, {useContext, useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../rev_contexts/ReViewsContext';

import RevNullMessagesView from '../../../rev_views/RevNullMessagesView';

import ChatMessages from '../rev_views/rev_listing_views/ChatMessages';

export default function RevNextStrangerChatTab() {
  const {REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);

  const {REV_SITE_BODY, SET_REV_SITE_BODY} = useContext(ReViewsContext);

  [isRevNextStrangerChatTab, setIsRevNextStrangerChatTab] = useState(true);

  useEffect(() => {
    if (REV_SITE_VAR_ARGS.revRemoteEntityGUID < 1) {
      setIsRevNextStrangerChatTab(false);
    }
  }, [REV_SITE_VAR_ARGS]);

  let revHandleNextStrangerChat = () => {
    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 1,
    });

    if (REV_SITE_VAR_ARGS.revRemoteEntityGUID > 0) {
      setIsRevNextStrangerChatTab(true);
    }

    if (isRevNextStrangerChatTab) {
      SET_REV_SITE_BODY(<ChatMessages />);
    } else {
      SET_REV_SITE_BODY(<RevNullMessagesView />);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        revHandleNextStrangerChat();
      }}
      style={styles.recipientNextWrapperTouchable}>
      <View style={styles.recipientNextWrapper}>
        <Text style={styles.recipientNextTxt}>NExT</Text>
        <View style={styles.recipientNextUserIconWrapper}>
          <FontAwesome name="user" style={styles.recipientNextUserIcon} />
        </View>
        <FontAwesome
          name="arrow-right"
          style={styles.recipientNextpointerIcon}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteFontBold: {
    fontWeight: '500',
  },
  revSiteTxtTiny: {
    fontSize: 9,
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  recipientNextWrapperTouchable: {
    display: 'flex',
    marginRight: 22,
    marginLeft: 12,
  },
  recipientNextWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientNextTxt: {
    color: '#757575',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 7,
  },
  recipientNextUserIconWrapper: {
    backgroundColor: '#FFF',
  },
  recipientNextUserIcon: {
    color: '#757575',
    fontSize: 22,
    textAlign: 'center',
    marginLeft: 1,
  },
  recipientNextpointerIcon: {
    color: '#757575',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },
});

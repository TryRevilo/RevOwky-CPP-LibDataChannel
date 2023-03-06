import React, {useContext, useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';

import RevNullMessagesView from '../../../../rev_views/RevNullMessagesView';
import {RevSubmitChatTab} from '../rev_forms/RevSubmitChatTab';

import ChatMessages from '../rev_listing_views/ChatMessages';
import {ChatMessageInputComposer} from '../rev_forms/ChatMessageInputComposer';

export default function RevNextStrangerChatTab() {
  const {
    REV_SITE_BODY,
    SET_REV_SITE_BODY,
    REV_SITE_FOOTER_1_CONTENT_VIEWER,
    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER,
  } = useContext(ReViewsContext);

  const [isRevNextStrangerChatTab, setIsRevNextStrangerChatTab] =
    useState(false);
  const [isRevComposing, setIsRevComposing] = useState(true);

  const revHandleNextStrangerChat = revChatStatus => {
    setIsRevComposing(revChatStatus);
    setIsRevNextStrangerChatTab(revChatStatus);
  };

  const RevNextStrangerChatTabArea = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          revHandleNextStrangerChat(true);
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
  };

  const [RevNextChatTab, setRevNextChatTab] = useState(
    <RevNextStrangerChatTabArea />,
  );

  useEffect(() => {
    if (isRevNextStrangerChatTab) {
      SET_REV_SITE_BODY(<ChatMessages />);
      setRevNextChatTab(<RevChatSubmitOptions />);
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(<ChatMessageInputComposer />);
    }

    if (isRevNextStrangerChatTab && isRevComposing == false) {
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }

    if (!isRevNextStrangerChatTab && isRevComposing == false) {
      setRevNextChatTab(<RevNextStrangerChatTabArea />);
      SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
    }
  }, [isRevNextStrangerChatTab, isRevComposing]);

  let revChatMessageTxt = '';

  let revSetChatMessageTxt = revText => {
    revChatMessageTxt = revText;
  };

  var revTarget;

  var revSetTargetId = _revTarget => {
    revTarget = _revTarget;
  };

  const revHandleHideComposingForm = revComposingStatus => {
    if (!isRevComposing) {
      setIsRevNextStrangerChatTab(false);
    }

    setIsRevComposing(revComposingStatus);
  };

  let RevChatSubmitOptions = () => {
    return (
      <View style={styles.footerSubmitOptionsLeftWrapper}>
        {isRevNextStrangerChatTab && isRevComposing ? (
          <RevSubmitChatTab
            revTargetId={revTarget}
            revMsg={() => {
              return revChatMessageTxt;
            }}
            revInputFieldCallback={() => {
              revSetChatMessageTxt('');
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              revHandleNextStrangerChat(true);
            }}>
            <View style={[styles.cancelComposeChatMsg]}>
              <FontAwesome
                name="quote-left"
                style={[
                  styles.revSiteTxtColor,
                  styles.revSiteTxtMedium,
                ]}></FontAwesome>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={async () => {
            revWebRTCSendFile(2);
          }}>
          <View style={[styles.cancelComposeChatMsg]}>
            <FontAwesome
              name="image"
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            revHandleHideComposingForm(false);
          }}>
          <View style={[styles.cancelComposeChatMsg]}>
            <FontAwesome
              name="times"
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtMedium,
              ]}></FontAwesome>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return RevNextChatTab;
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
  chatFooterWrapper: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  footerSubmitOptionsLeftWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelComposeChatMsg: {
    fontWeight: 'bold',
    marginTop: 2,
    paddingHorizontal: 8,
  },
  rightFooterSubmitOptionsWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginRight: 14,
    marginLeft: 'auto',
  },
});

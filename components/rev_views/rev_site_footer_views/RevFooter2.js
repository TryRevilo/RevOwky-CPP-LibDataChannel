import React, {useContext, useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../rev_contexts/RevSiteDataContext';

export function RevFooter2() {
  const {REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);
  [isRevFooter2StrangerChat, setIsRevFooter2StrangerChat] = useState(true);

  useEffect(() => {
    if (REV_SITE_VAR_ARGS.revRemoteEntityGUID < 1) {
      setIsRevFooter2StrangerChat(false);
    } else {
      setIsRevFooter2StrangerChat(true);
    }
  }, [REV_SITE_VAR_ARGS]);

  let RevChatEntityProfileMedia = () => {
    return (
      <View style={styles.recipientProfileMediaContainer}>
        <View style={styles.recipientProfileMediaPicsWrapper}>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <FontAwesome
              name="photo"
              style={styles.recipientProfileMediaPicItem}
            />
            <FontAwesome
              name="photo"
              style={styles.recipientProfileMediaPicItem}
            />
            <FontAwesome
              name="photo"
              style={styles.recipientProfileMediaPicItem}
            />
            <FontAwesome
              name="photo"
              style={styles.recipientProfileMediaPicItem}
            />
            <FontAwesome
              name="photo"
              style={styles.recipientProfileMediaPicItem}
            />
            <FontAwesome
              name="photo"
              style={styles.recipientProfileMediaPicItem}
            />
          </ScrollView>
        </View>
        <View style={styles.recipientProfileMediaVideoContainer}>
          <Text style={styles.recipientProfileMediaVideoPlayBtnWrapper}>
            <FontAwesome
              name="play"
              style={styles.recipientProfileMediaVideoPlay}
            />
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View>
      {isRevFooter2StrangerChat ? <RevChatEntityProfileMedia /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  recipientProfileMediaContainer: {
    backgroundColor: '#b2ebf2',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    paddingVertical: 2,
    marginTop: 1,
    position: 'relative',
    borderRadius: 3,
    opacity: 0.4,
  },
  recipientProfileMediaPicsWrapper: {
    backgroundColor: 'transparent',
    display: 'flex',
    flex: 3,
    flexDirection: 'row',
    paddingRight: 4,
    marginLeft: 2,
    overflow: 'scroll',
  },
  recipientProfileMediaPicItem: {
    color: '#CCC',
    fontSize: 32,
    textAlign: 'center',
    width: 40,
    height: 32,
    borderRadius: 2,
  },

  recipientProfileMediaVideoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#b2ebf2',
    borderRadius: 2,
    padding: 2,
    marginRight: 8,
    marginLeft: 8,
  },
  recipientProfileMediaVideoPlayBtnWrapper: {
    alignItems: 'center',
  },
  recipientProfileMediaVideoPlay: {
    color: '#CCC',
    fontSize: 24,
    textAlign: 'center',
  },
});

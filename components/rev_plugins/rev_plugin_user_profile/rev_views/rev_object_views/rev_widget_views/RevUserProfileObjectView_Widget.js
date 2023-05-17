import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';
import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevConnectUser_Action} from '../../../rev_actions/rev_connect_user_action';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

const {RevPersLibRead_React} = NativeModules;

export const RevUserProfileObjectView_Widget = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;
  let revUserEntity = revVarArgs.revEntity;

  if (
    revIsEmptyJSONObject(revUserEntity) ||
    revUserEntity._revEntityType !== 'rev_user_entity'
  ) {
    return null;
  }

  const {revSiteStyles} = useRevSiteStyles();

  let revAddPageHeader = true;

  if (
    'revAddPageHeader' in revVarArgs &&
    (revVarArgs.revAddPageHeader || !revVarArgs.revAddPageHeader)
  ) {
    revAddPageHeader = revVarArgs.revAddPageHeader;
  }

  const {revConnectUser_Action} = useRevConnectUser_Action();

  let RevInfo = revPluginsLoader({
    revPluginName: 'rev_plugin_user_profile',
    revViewName: 'RevUserInfo',
    revVarArgs: revUserEntity,
  });

  const handleRevConnectTabPressed = revVarArgs => {
    let revRemoteGUID = revVarArgs._remoteRevEntityGUID;

    let revTargetEntityStr =
      RevPersLibRead_React.revPersGetRevEntity_By_RemoteRevEntityGUID(
        revRemoteGUID,
      );

    let revConnectUser = JSON.parse(revTargetEntityStr);

    if (
      revIsEmptyJSONObject(revConnectUser) ||
      revConnectUser._revEntityType !== 'rev_user_entity'
    ) {
      console.log('>>> ERR - No User <<<');
      return null;
    }

    revConnectUser_Action(revConnectUser, revRetData => {
      console.log('>>> revRetData ' + revRetData);
    });
  };

  const RevConnectionProfileTab = ({revVarArgs}) => {
    let revConnectionEntityGUID = revVarArgs;

    const handleRevConnectionProfileTabPressed = revVarArgs => {
      console.log('>>> CLicked ' + revVarArgs);
    };

    return (
      <TouchableOpacity
        key={revConnectionEntityGUID + '_RevConnectionProfileTab'}
        onPress={() => {
          handleRevConnectionProfileTabPressed(revVarArgs);
        }}
        style={styles.revConnectionProfileTab}></TouchableOpacity>
    );
  };

  const RevConnectionsView = ({revVarArgs}) => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revConnectionsWrapper]}>
        <TouchableOpacity
          onPress={() => {
            handleRevConnectTabPressed(revVarArgs);
          }}>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revConnectTabButtonWrapper,
            ]}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorWhite,
                revSiteStyles.revSiteTxtTiny,
                revSiteStyles.revSiteTxtBold,
                styles.revConnectTabButton,
              ]}>
              connect
            </Text>
            <FontAwesome
              name="long-arrow-right"
              style={revSiteStyles.revSiteTxtColor}
            />
          </View>
        </TouchableOpacity>

        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revConnectedUsersContainer,
          ]}>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.rev_H_UstoWidthScroller}>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revConnectedUsersIconWrapper,
              ]}>
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1,
                2, 3, 4, 5, 6, 7, 8, 9, 0,
              ].map(revCurrConnection => {
                return (
                  <RevConnectionProfileTab
                    key={
                      revGetRandInteger() +
                      '_revCurrConnection_' +
                      revCurrConnection
                    }
                    revVarArgs={revCurrConnection}
                  />
                );
              })}
            </View>
          </ScrollView>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              revSiteStyles.revSiteTxtTiny,
              styles.revConnectionsCountTxt,
            ]}>
            + 122 connections
          </Text>
        </View>
      </View>
    );
  };

  let revRetView = (
    <View style={revSiteStyles.revFlexContainer}>
      {!revAddPageHeader ? null : (
        <RevPageContentHeader revVarArgs={{revIsIndented: false}} />
      )}
      <ScrollView style={revSiteStyles.revFlexContainer}>
        <View style={styles.revPublisherMainNonIconArea}>
          <FontAwesome name="user" style={styles.revPublisherMainNonIcon} />
        </View>
        <View style={[revSiteStyles.revFlexContainer, styles.revInfoContainer]}>
          {RevInfo}
        </View>

        <RevConnectionsView revVarArgs={revUserEntity} />
      </ScrollView>
    </View>
  );

  return <RevScrollView_V revScrollViewContent={revRetView} />;
};

const styles = StyleSheet.create({
  revPublisherMainNonIconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE',
    width: '100%',
    height: 100,
    marginTop: 1,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  revPublisherMainNonIcon: {
    color: '#CCC',
    fontSize: 22,
    paddingVertical: 2,
  },
  revInfoContainer: {
    marginTop: 4,
  },
  revConnectionsWrapper: {
    borderStyle: 'dotted',
    borderTopColor: '#F7F7F7',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 8,
  },
  revConnectTabButtonWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginTop: 2,
  },
  revConnectTabButton: {
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  rev_H_UstoWidthScroller: {
    flexGrow: 0,
  },
  revConnectedUsersIconWrapper: {
    width: 'auto',
  },
  revConnectedUsersContainer: {
    marginLeft: 4,
  },
  revConnectionProfileTab: {
    backgroundColor: '#EEE',
    width: 22,
    height: 22,
    marginRight: 1,
    borderRadius: 2,
  },
  revConnectionsCountTxt: {
    padding: 5,
  },
});

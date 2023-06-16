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

import {
  RevImageView,
  RevScrollView_V,
} from '../../../../../rev_views/rev_page_views';
import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevConnectUser_Action} from '../../../rev_actions/rev_connect_user_action';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevCenteredImage} from '../../../../../rev_views/rev_page_views';
import {revStringEmpty} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {useRevGetEntityIcon} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

const {RevPersLibRead_React} = NativeModules;

export const RevUserProfileObjectView_Widget = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;
  let revUserEntity = revVarArgs.revEntity;
  let revInfoEntity = revUserEntity._revInfoEntity;

  if (
    revIsEmptyJSONObject(revUserEntity) ||
    revUserEntity._revEntityType !== 'rev_user_entity'
  ) {
    return null;
  }

  const {revSiteStyles} = useRevSiteStyles();

  const {revGetEntityIcon} = useRevGetEntityIcon();

  let revAddPageHeader = true;

  if (
    'revAddPageHeader' in revVarArgs &&
    (revVarArgs.revAddPageHeader || !revVarArgs.revAddPageHeader)
  ) {
    revAddPageHeader = revVarArgs.revAddPageHeader;
  }

  const {revConnectUser_Action} = useRevConnectUser_Action();

  let revUserInfo = revPluginsLoader({
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
              {flex: 0},
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
            revSiteStyles.revFlexWrapper,
            {flex: 1, alignItems: 'center', marginLeft: 4},
          ]}>
          <View style={{flex: 1}}>
            <ScrollView
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View
                style={[
                  revSiteStyles.revFlexWrapper,
                  styles.revConnectedUsersIconWrapper,
                ]}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(revCurrConnection => {
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
          </View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              {flex: 0, paddingHorizontal: 8},
            ]}>
            + 122 connections
          </Text>
        </View>
      </View>
    );
  };

  const revMainEntityBannerIconLocalPath = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_main_entity_banner_icon_val',
  );

  let revProfileBannerIconView = !revStringEmpty(
    revMainEntityBannerIconLocalPath,
  ) ? (
    <RevCenteredImage
      revImageURI={revMainEntityBannerIconLocalPath}
      revImageDimens={{revWidth: '100%', revHeight: '100%'}}
    />
  ) : (
    <FontAwesome
      name="user"
      style={[
        styles.revPublisherMainNonIcon,
        {marginTop: '10%', marginLeft: '47%'},
      ]}
    />
  );

  let revRetView = (
    <View style={revSiteStyles.revFlexContainer}>
      {!revAddPageHeader ? null : (
        <RevPageContentHeader revVarArgs={{revIsIndented: false}} />
      )}
      <View style={styles.revPublisherMainIconArea}>
        {revProfileBannerIconView}
      </View>

      <RevConnectionsView revVarArgs={revUserEntity} />

      <View style={[revSiteStyles.revFlexContainer, styles.revInfoContainer]}>
        {revUserInfo}
      </View>
    </View>
  );

  return <RevScrollView_V revScrollViewContent={revRetView} />;
};

const styles = StyleSheet.create({
  revPublisherMainIconArea: {
    backgroundColor: '#EEE',
    height: 100,
    marginTop: 1,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
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
  revConnectedUsersIconWrapper: {
    width: 'auto',
  },
  revConnectionProfileTab: {
    backgroundColor: '#EEE',
    width: 22,
    height: 22,
    marginRight: 1,
    borderRadius: 2,
  },
});

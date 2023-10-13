import React, {useContext, useState} from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {
  RevPasswordInput,
  RevTextInput,
} from '../../../../../rev_views/rev_input_form_views';

import {useRevLogin} from '../../../rev_actions/rev_log_in_action';

import {
  useRevCreateSiteEntity,
  useRevGetSiteEntity,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';
import {useRevPersGetRevEntities_By_ResolveStatus_SubType} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibRead_React, RevPersLibUpdate_React} = NativeModules;

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevLogInFormWidgetView = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {SET_REV_LOGGED_IN_ENTITY_GUID, SET_REV_SITE_ENTITY_GUID} =
    useContext(RevSiteDataContext);

  const {revLogin} = useRevLogin();
  const {revCreateSiteEntity} = useRevCreateSiteEntity();
  const {revGetSiteEntity} = useRevGetSiteEntity();
  const {revPersGetRevEntities_By_ResolveStatus_SubType} =
    useRevPersGetRevEntities_By_ResolveStatus_SubType();

  const revHandleTermsTabPress = () => {};

  const revHandleLogInTabPress = async (revUserId, revPassword) => {
    revUserId = revUserId.trim();
    revPassword = revPassword.trim();

    let revLoggedInEntityGUID = await revLogin(revUserId, revPassword);

    let revSiteEntityGUID = -1;

    if (revLoggedInEntityGUID > 0) {
      let revSiteEntity = revGetSiteEntity(revLoggedInEntityGUID);

      if (revIsEmptyJSONObject(revSiteEntity)) {
        revSiteEntityGUID = revCreateSiteEntity(revLoggedInEntityGUID);
      } else {
        revSiteEntityGUID = revSiteEntity._revGUID;
      }

      if (revSiteEntityGUID > 0) {
        let revRemoteSiteEntityGUID =
          RevPersLibRead_React.revPersGetRemoteEntityGUID_BY_LocalEntityGUID(
            revSiteEntityGUID,
          );

        let revSiteEntityResStatus = 2;

        if (revRemoteSiteEntityGUID < 0) {
          revSiteEntityResStatus = 2;
        }

        let revEntityResolveStatusByRevEntityGUID =
          RevPersLibUpdate_React.revPersSetEntityResStatus_By_EntityGUID(
            revSiteEntityResStatus,
            revSiteEntityGUID,
          );

        if (revEntityResolveStatusByRevEntityGUID) {
          SET_REV_LOGGED_IN_ENTITY_GUID(revLoggedInEntityGUID);
        }
      }
    } else {
      let revSiteEntitiesArr = revPersGetRevEntities_By_ResolveStatus_SubType(
        2,
        'rev_site',
      );

      let revSiteEntity = revSiteEntitiesArr[0];

      let revSiteEntityOwnerGUID = revSiteEntity._revOwnerGUID;

      if (revSiteEntityOwnerGUID) {
        SET_REV_LOGGED_IN_ENTITY_GUID(revSiteEntityOwnerGUID);
      }
    }

    SET_REV_SITE_ENTITY_GUID(revSiteEntityGUID);
  };

  const RevLogInPage = () => {
    const [revUserId, setRevUserId] = useState('');
    const [revPassword, setPassword] = useState('');

    return (
      <View
        style={[revSiteStyles.revFlexContainer, styles.revLoginFormContainer]}>
        <RevTextInput
          revVarArgs={{
            revPlaceHolderTxt: 'EMail / Phone #',
            revTextInputOnChangeCallBack: newText => {
              setRevUserId(newText);
            },
            revDefaultText: revUserId,
          }}
        />

        <RevPasswordInput revVarArgs={{revSetPasswordInput: setPassword}} />

        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revLoginFormFooterWrapper,
          ]}>
          <TouchableOpacity
            onPress={() => {
              revHandleLogInTabPress(revUserId, revPassword);
            }}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
                revSiteStyles.revSaveTab,
              ]}>
              Log in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={revHandleSignUpTabPress}
            style={[
              revSiteStyles.revFlexWrapper_WidthAuto,
              styles.revFooterOptionsTab,
              {alignItems: 'center'},
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />
            <Text
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
                revSiteStyles.revSiteFontBold,
              ]}>
              {' Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              revHandleTermsTabPress();
            }}
            style={[
              revSiteStyles.revFlexWrapper_WidthAuto,
              styles.revFooterOptionsTab,
              {alignItems: 'center'},
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />
            <Text
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
                revSiteStyles.revSiteFontBold,
              ]}>
              {' Terms'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [RevLoggedOutView, setRevLoggedOutView] = useState(<RevLogInPage />);

  const revHandleSignUpTabPress = () => {
    let RevSignUpForm = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevSignUpForm',
      revData: 'Hello World!',
    });

    setRevLoggedOutView(RevSignUpForm);
  };

  return RevLoggedOutView;
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revSiteContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  revlogInContainer: {
    alignSelf: 'center',
    width: maxChatMessageContainerWidth,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    position: 'relative',
    top: '10%',
    borderRadius: 4,
  },
  revSiteHeaderWrapper: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  revHeaderContainer: {
    backgroundColor: '#FFF',
    borderBottomColor: '#F7F7F7',
    borderStyle: 'dotted',
    borderBottomWidth: 1,
    width: 'auto',
    height: 'auto',
  },
  revSiteLogoWrapper: {
    alignItems: 'flex-end',
  },
  revSiteLogoTxt: {
    fontSize: 17,
    lineHeight: 17,
    fontWeight: 'bold',
  },
  revSiteVersion: {
    marginBottom: 1,
  },
  revLoginFormContainer: {
    marginTop: 4,
    height: 'auto',
    paddingBottom: 22,
  },
  revLoginFormFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
    marginLeft: 7,
  },
  revFooterOptionsTab: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

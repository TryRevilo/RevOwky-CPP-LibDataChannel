import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useContext, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../../../../../rev_contexts/RevRemoteSocketContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {revGetServerData} from '../../../../../rev_libs_pers/rev_server/rev_pers_lib_read';

import {useRevLogin} from '../../../rev_actions/rev_log_in_action';

export const RevLogInFormWidgetView = () => {
  const {SET_REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {revLogin} = useRevLogin();

  const revHandleTermsTabPress = () => {};

  const revHandleLogInTabPress = async (revUserId, revPassword) => {
    let revLoggedInEntityGUID = revLogin(revUserId.trim(), revPassword.trim());

    if (revLoggedInEntityGUID > 0) {
      console.log('>>> revLoggedInEntityGUID ' + revLoggedInEntityGUID);
      SET_REV_LOGGED_IN_ENTITY_GUID(revLoggedInEntityGUID);
    } else {
      let revLogInURL =
        REV_ROOT_URL +
        '/rev_api?' +
        'rev_entity_unique_id=' +
        revUserId +
        '&revPluginHookContextsRemoteArr=revHookRemoteHandlerLogIn,revHookRemoteSendLoggedInPresenceToConnections,revHookRemoteHandlerProfile,revHookRemoteHandlerProfileStats';

      let revData = await revGetServerData(revLogInURL);
      console.log('>>> revData ' + JSON.stringify(revData));
    }
  };

  const RevLogInPage = () => {
    const [revUserId, setRevUserId] = useState('');
    const [revPassword, setPassword] = useState('');

    return (
      <View style={[styles.revFlexContainer, styles.revLoginFormContainer]}>
        <TextInput
          style={styles.revUserIdInput}
          placeholder=" EMail / Phone #"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevUserId(newText);
          }}
          defaultValue={revUserId}
        />

        <TextInput
          style={styles.revUserIdInput}
          placeholder=" Password"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setPassword(newText);
          }}
          defaultValue={revPassword}
        />

        <View style={[styles.revFlexWrapper, styles.revLoginFormFooterWrapper]}>
          <TouchableOpacity
            onPress={() => {
              revHandleLogInTabPress(revUserId, revPassword);
            }}>
            <Text style={[styles.revSiteTxtSmall, styles.revLogInTab]}>
              Log in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={revHandleSignUpTabPress}>
            <Text
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtSmall,
                styles.revSiteFontBold,
                styles.revSignUpTab,
              ]}>
              <FontAwesome
                name="dot-circle-o"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />
              <FontAwesome
                name="long-arrow-right"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />{' '}
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              revHandleTermsTabPress();
            }}>
            <Text
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtSmall,
                styles.revSiteFontBold,
                styles.revSignUpTab,
              ]}>
              <FontAwesome
                name="dot-circle-o"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />
              <FontAwesome
                name="long-arrow-right"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />{' '}
              Terms
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
  },
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
  revUserIdInput: {
    color: '#444',
    fontSize: 11,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 8,
  },
  revLoginFormFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
    marginLeft: 7,
  },
  revLogInTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  revSignUpTab: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

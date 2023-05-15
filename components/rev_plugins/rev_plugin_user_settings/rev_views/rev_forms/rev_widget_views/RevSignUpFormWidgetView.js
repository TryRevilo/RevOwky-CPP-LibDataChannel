import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revRegisterUserEntity} from '../../../rev_actions/rev_sign_up_action';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

export const RevSignUpFormWidgetView = () => {
  const RevSignUpPage = () => {
    const [revUserId, setRevUserId] = useState('');
    const [revFullNames, setRevFullNames] = useState('');
    const [revPassword1, setRevPassword1] = useState('');
    const [revPassword2, setRevUPassword2] = useState('');
    const [revEMail, setRevEMail] = useState('');

    const revHandleSignUpInTabPress = () => {
      revRegisterUserEntity({
        revUserId: revUserId.trim(),
        revFullNames: revFullNames.trim(),
        revPassword1: revPassword1.trim(),
        revPassword2: revPassword2.trim(),
        revEMail: revEMail.trim(),
      });
    };

    return (
      <View style={[styles.revFlexContainer, styles.revLoginFormContainer]}>
        <TextInput
          style={styles.revUserIdInput}
          placeholder=" Phone #"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevUserId(newText);
          }}
          defaultValue={revUserId}
        />

        <TextInput
          style={styles.revUserIdInput}
          placeholder=" Full names"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevFullNames(newText);
          }}
          defaultValue={revFullNames}
        />

        <TextInput
          style={styles.revUserIdInput}
          placeholder=" Password"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevPassword1(newText);
          }}
          defaultValue={revPassword1}
        />

        <TextInput
          style={styles.revUserIdInput}
          placeholder=" Confirm password"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevUPassword2(newText);
          }}
          defaultValue={revPassword2}
        />

        <TextInput
          style={styles.revUserIdInput}
          placeholder=" EMail (optional)"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevEMail(newText);
          }}
          defaultValue={revEMail}
        />

        <View style={[styles.revFlexWrapper, styles.revLoginFormFooterWrapper]}>
          <TouchableOpacity onPress={revHandleSignUpInTabPress}>
            <Text style={[styles.revSiteTxtSmall, styles.revSignUpTab]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={revHandleLogInTabPress}>
            <Text
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtSmall,
                styles.revSiteFontBold,
                styles.revFooterOptionsTab,
              ]}>
              <FontAwesome
                name="dot-circle-o"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />
              <FontAwesome
                name="long-arrow-right"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />{' '}
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={revHandleTermsTabPress}>
            <Text
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtSmall,
                styles.revSiteFontBold,
                styles.revFooterOptionsTab,
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

  const [RevLoggedOutView, setRevLoggedOutView] = useState(<RevSignUpPage />);

  const revHandleLogInTabPress = () => {
    let RevLogInForm = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevLogInForm',
      revData: 'Hello World!',
    });

    setRevLoggedOutView(RevLogInForm);
  };

  const revHandleTermsTabPress = () => {};

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
  revSignUpTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 55,
  },
  revFooterOptionsTab: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

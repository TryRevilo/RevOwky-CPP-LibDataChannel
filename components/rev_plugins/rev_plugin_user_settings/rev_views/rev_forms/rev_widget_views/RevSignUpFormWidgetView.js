import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revRegisterUserEntity} from '../../../rev_actions/rev_sign_up_action';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {
  RevPasswordInput,
  RevTextInput,
} from '../../../../../rev_views/rev_input_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevSignUpFormWidgetView = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const RevSignUpPage = () => {
    const [revUserId, setRevUserId] = useState('');
    const [revFullNames, setRevFullNames] = useState('');
    const [revPassword1, setRevPassword1] = useState('');
    const [revPassword2, setRevUPassword2] = useState('');
    const [revEMail, setRevEMail] = useState('');
    const [revPhoneNu, setRevPhoneNu] = useState('');

    const revHandleSignUpInTabPress = () => {
      revRegisterUserEntity({
        revUserId: revUserId.trim(),
        revFullNames: revFullNames.trim(),
        revPassword1: revPassword1.trim(),
        revPassword2: revPassword2.trim(),
        revEMail: revEMail.trim(),
        revPhoneNu: revPhoneNu.trim(),
      });
    };

    return (
      <View
        style={[revSiteStyles.revFlexContainer, styles.revLoginFormContainer]}>
        <RevTextInput
          revVarArgs={{
            revPlaceHolderTxt: 'username',
            revTextInputOnChangeCallBack: newText => {
              setRevUserId(newText);
            },
            revDefaultText: revUserId,
          }}
        />

        <View style={{marginTop: 8}}>
          <RevTextInput
            revVarArgs={{
              revPlaceHolderTxt: 'Full names',
              revTextInputOnChangeCallBack: newText => {
                setRevFullNames(newText);
              },
              revDefaultText: revFullNames,
            }}
          />
        </View>

        <RevPasswordInput
          revVarArgs={{
            revSetPasswordInput: setRevPassword1,
            revPlaceHolderTxt: 'Password',
          }}
        />

        <RevPasswordInput
          revVarArgs={{
            revSetPasswordInput: setRevUPassword2,
            revPlaceHolderTxt: 'Confirm password',
          }}
        />

        <View style={{marginTop: 8}}>
          <RevTextInput
            revVarArgs={{
              revPlaceHolderTxt: 'EMail (optional)',
              revTextInputOnChangeCallBack: newText => {
                setRevEMail(newText);
              },
              revDefaultText: revEMail,
            }}
          />
        </View>

        <View style={{marginTop: 8}}>
        <RevTextInput
            revVarArgs={{
            revPlaceHolderTxt: 'Phone # (optional)',
            revTextInputOnChangeCallBack: newText => {
                setRevPhoneNu(newText);
            },
            revDefaultText: revPhoneNu,
            }}
        />
        </View>

        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revLoginFormFooterWrapper,
          ]}>
          <TouchableOpacity onPress={revHandleSignUpInTabPress}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
                revSiteStyles.revSaveTab,
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={revHandleLogInTabPress}
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
                styles.revSiteFontBold,
              ]}>
              {' Log In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={revHandleTermsTabPress}
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
                styles.revSiteFontBold,
              ]}>
              {' Terms'}
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

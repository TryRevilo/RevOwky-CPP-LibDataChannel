import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {
  RevTextInputWithCount,
  RevDateTimePicker,
} from '../../../../../rev_views/rev_input_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevEditAccountSettingsForm_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revBriefInfoTxt, setRevBriefInfoTxt] = useState('');
  const [revSelectedDateOfBirth, setRevSelectedDateOfBirth] = useState(null);

  const {SET_REV_SITE_VAR_ARGS} = useContext(RevSiteDataContext);

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const [revSearchText, setRevSearchText] = useState('');

  const handleRevCancelTabPress = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevUserSettings);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });
  };

  const revHandleSearchTabPress = () => {
    SET_REV_SITE_BODY(null);

    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevUserSettings);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });
  };

  return (
    <View
      style={[revSiteStyles.revFlexContainer, styles.revFormInputContainer]}>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revPasswordInputsAreaContainer,
        ]}>
        <TextInput
          style={revSiteStyles.revSiteTextInput}
          placeholder=" confirm password"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revIdInputsAreaContainer,
        ]}>
        <TextInput
          style={revSiteStyles.revSiteTextInput}
          placeholder=" @-EMail.com"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />

        <TextInput
          style={[revSiteStyles.revSiteTextInput]}
          placeholder=" Phone #"
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />

        <RevTextInputWithCount
          revVarArgs={{
            revPlaceHolderTxt: ' sex . . .',
            revTextInputOnChangeCallBack: revNewTxt => {
              setRevBriefInfoTxt(revNewTxt);
            },
            revMaxTxtCount: 17,
          }}
        />

        <RevTextInputWithCount
          revVarArgs={{
            revPlaceHolderTxt: ' Age . . .',
            revTextInputOnChangeCallBack: revNewTxt => {
              setRevBriefInfoTxt(revNewTxt);
            },
            revMaxTxtCount: 3,
          }}
        />

        <View
          style={[styles.revInputArea, styles.revDateOfBirthDatePickerWrapper]}>
          <RevDateTimePicker
            revVarArgs={{
              revDatePickerTxt: 'Select D.O. Birth',
              revSelectedDateOnChange: revSelectedDate => {
                setRevSelectedDateOfBirth(
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtColor,
                      revSiteStyles.revSiteTxtTiny,
                      styles.revSelectedDateOfBirthTxt,
                    ]}>
                    {revSelectedDate.toString()}
                  </Text>,
                );
              },
            }}
          />

          {revSelectedDateOfBirth}
        </View>
      </View>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
        ]}>
        <TouchableOpacity onPress={revHandleSearchTabPress}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSaveTab,
            ]}>
            Save
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRevCancelTabPress}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revCancelTab,
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
            />{' '}
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 32;

const styles = StyleSheet.create({
  revFormInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
    marginVertical: 8,
  },
  revPasswordInputsAreaContainer: {
    paddingHorizontal: 8,
  },
  revIdInputsAreaContainer: {
    backgroundColor: '#F9F9F9',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 22,
    marginTop: 1,
    borderRadius: 3,
  },
  revInputArea: {
    marginTop: 8,
  },
  revDateOfBirthDatePickerWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  revSelectedDateOfBirthTxt: {
    marginTop: 4,
  },
});
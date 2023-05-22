/**
 *  default: The default keyboard, which can vary depending on the platform and locale.
    numeric: A keyboard for entering numeric values.
    email-address: A keyboard optimized for entering email addresses.
    phone-pad: A numeric keyboard with additional symbols commonly used in phone numbers.
    number-pad: A numeric keyboard without symbols or decimal point.
    decimal-pad: A numeric keyboard with a decimal point.
    url: A keyboard optimized for entering URLs.
    ascii-capable: A keyboard capable of entering ASCII characters only.
    visible-password: A keyboard where the entered characters are visible (intended for password input fields).
 * 
 */

import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

import {revTruncateString} from '../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from './RevSiteStyles';

export const RevTagsInput = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revTagsInputValsArr = [], revTagsInputUpdater = null} = revVarArgs;

  if (revTagsInputUpdater == null) {
    return null;
  }

  const [revTagsArray, setRevTagsArray] = useState(revTagsInputValsArr);
  const [revTagsInputText, setRevTagsInputText] = useState('');

  const revHandleTextSubmit = () => {
    if (revTagsInputText.trim() !== '') {
      let revNewTagsArray = [...revTagsArray, revTagsInputText.trim()];

      revTagsInputUpdater(revNewTagsArray);
      setRevTagsArray(revNewTagsArray);

      setRevTagsInputText('');
    }
  };

  const revrevHandleTextChange = text => {
    const revSpacedStringArray = text.split(' ');

    if (revSpacedStringArray.length > 2) {
      setRevTagsInputText('');
      return;
    }

    const lastCharacter = text.slice(-1); // Extract last character
    const isSpace = lastCharacter === ' '; // Check if it is a space

    setRevTagsInputText(text);

    if (isSpace) {
      revHandleTextSubmit();
    }
  };

  const revHandleKeyPress = ({nativeEvent}) => {
    if (
      (nativeEvent.key === ' ' || nativeEvent.key === 'Enter') &&
      revTagsInputText.trim() !== ''
    ) {
      revHandleTextSubmit();
    }
  };

  return (
    <View
      style={[revSiteStyles.revFlexWrapper, revSiteStyles.revTagsInputWrapper]}>
      <TextInput
        value={revTagsInputText}
        onChangeText={revrevHandleTextChange}
        onSubmitEditing={revHandleTextSubmit}
        onKeyPress={revHandleKeyPress}
        placeholder=" #tags"
        placeholderTextColor={revSiteStyles.revSiteTextInputNoBorder}
        style={revSiteStyles.revTagsInput}
      />

      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtSmall,
          revSiteStyles.revEnteredTags,
        ]}>
        {`# ${revTagsArray.length} tags entered`}
      </Text>
    </View>
  );
};

export const RevTextInput = React.memo(({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revDefaultText = '',
    revTextInputOnChangeCallBack = null,
    revPlaceHolderTxt = '',
    revKeyboardType = 'default',
  } = revVarArgs;

  const [revInputText, setRevInputText] = useState(revDefaultText);

  const revHandleTextChange = newText => {
    setRevInputText(newText);

    if (revTextInputOnChangeCallBack) {
      revTextInputOnChangeCallBack(newText);
    }
  };

  return (
    <View style={revSiteStyles.revFlexWrapper}>
      <TextInput
        value={revInputText}
        defaultValue={revInputText}
        style={[revSiteStyles.revSiteTextInput, {width: '100%'}]}
        placeholder={revPlaceHolderTxt}
        placeholderTextColor={revSiteStyles.revSiteTextInputNoBorder}
        onChangeText={revHandleTextChange}
        keyboardType={revKeyboardType}
      />
    </View>
  );
});

export const RevTextInputWithCount = React.memo(({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revDefaultText = '',
    revTextInputOnChangeCallBack = null,
    revPlaceHolderTxt = '',
    revMaxTxtCount = 140,
  } = revVarArgs;

  const [revInputText, setRevInputText] = useState(revDefaultText);
  const [revTextCountStatusStyle, setRevTextCountStatusStyle] = useState(
    revSiteStyles.revSiteTxtAlertSafe,
  );

  const revHandleTextChange = newText => {
    setRevInputText(newText);
    revTextInputOnChangeCallBack(newText);

    if (revMaxTxtCount < revInputText.length) {
      setRevTextCountStatusStyle(revSiteStyles.revSiteTxtAlertDangerColor);
    } else {
      setRevTextCountStatusStyle(revSiteStyles.revSiteTxtAlertSafe);
    }
  };

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        revSiteStyles.revTextInputAreaWithCountContainer,
      ]}>
      <TextInput
        onChangeText={revHandleTextChange}
        value={revInputText}
        placeholder={revPlaceHolderTxt}
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revSiteTextInputNoBorder,
        ]}
        placeholderTextColor={revSiteStyles.revSiteTxtColorLight.color}
        defaultValue={revInputText}
      />
      <Text
        style={[
          revTextCountStatusStyle,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revTextInputCountStyle,
        ]}>
        total characters : {revMaxTxtCount - revInputText.length}
      </Text>
    </View>
  );
});

export const RevTextInputAreaWithCount = React.memo(({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revDefaultTxt = '',
    revTextInputOnChangeCallBack = null,
    revPlaceHolderTxt = '',
    revMaxTxtCount = 540,
  } = revVarArgs;

  const [revInputText, setRevInputText] = useState(revDefaultTxt);
  const [revTextCountStatusStyle, setRevTextCountStatusStyle] = useState(
    revSiteStyles.revSiteTxtAlertSafe,
  );

  console.log('>>> revPlaceHolderTxt -', revPlaceHolderTxt);

  const revHandleTextChange = newText => {
    setRevInputText(newText);
    revTextInputOnChangeCallBack(newText);

    if (revMaxTxtCount < revInputText.length) {
      setRevTextCountStatusStyle(revSiteStyles.revSiteTxtAlertDangerColor);
    } else {
      setRevTextCountStatusStyle(revSiteStyles.revSiteTxtAlertSafe);
    }
  };

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        revSiteStyles.revTextInputAreaWithCountContainer,
      ]}>
      <TextInput
        onChangeText={revHandleTextChange}
        value={revInputText}
        placeholder={revPlaceHolderTxt}
        multiline={true}
        numberOfLines={5}
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revTextInputAreaInputWithCount,
        ]}
        placeholderTextColor={revSiteStyles.revSiteTxtColorLight.color}
        defaultValue={revInputText}
      />
      <Text
        style={[
          revTextCountStatusStyle,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revTextInputCountStyle,
        ]}>
        total characters : {revMaxTxtCount - revInputText.length}
      </Text>
    </View>
  );
});

export const RevDropdownListSelector = ({
  revFixedSelectedValue,
  revOptions,
  revOnSelect,
} = {}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revSelectedValue, setRevSelectedValue] = useState('');
  const pickerRef = useRef();

  const handleValueChange = itemValue => {
    setRevSelectedValue(itemValue);
    revOnSelect(itemValue);
  };

  const openPicker = () => {
    pickerRef.current.focus();
  };

  return (
    <View style={revSiteStyles.revFlexWrapper_WidthAuto}>
      <Text
        onPress={openPicker}
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revDropdownListSelectorTab,
        ]}>
        {revTruncateString(revFixedSelectedValue, 12, false)}{' '}
        <FontAwesome
          name="chevron-down"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}
        />
      </Text>

      <View style={{height: 0, width: 0}}>
        <Picker
          ref={pickerRef}
          selectedValue={revSelectedValue}
          onValueChange={handleValueChange}>
          <Picker.Item label={revFixedSelectedValue} value={null} />

          {revOptions.map(option => (
            <Picker.Item
              key={option.key}
              value={option.key}
              label={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export const RevDateTimePicker = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revDatePickerTxt = 'Select Date and Time',
    revSelectedDateOnChange = null,
  } = revVarArgs;

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, newDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (newDate !== undefined) {
      revSelectedDateOnChange(newDate);
    }
  };

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={showDateTimePicker}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          <FontAwesome name="calendar-plus-o" />
          {' ' + revDatePickerTxt}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export const RevPasswordInput = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revSetPasswordInput} = revVarArgs;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRevOnPasswordInputChange = password => {
    setPassword(password);
    revSetPasswordInput(password);
  };

  return (
    <View
      style={[
        revSiteStyles.revFlexWrapper,
        revSiteStyles.revPasswordInputWrapper,
      ]}>
      <TextInput
        style={[revSiteStyles.revPasswordInput]}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={handleRevOnPasswordInputChange}
        placeholder="Password"
        placeholderTextColor={revSiteStyles.revSiteTextInputNoBorder}
      />
      <TouchableOpacity onPress={toggleShowPassword}>
        <FontAwesome
          name="eye"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtLarge,
            revSiteStyles.revToggleButton,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export const RevUploadFilesTab = ({
  revVarArgs: {
    revLabel = 'Upload',
    revUploadTab = null,
    revStyles = {},
    revMIMETypes = DocumentPicker.types.allFiles,
    revOnSelectedDataCallBack = revSelectedData => revSelectedData,
  },
} = {}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revSelectedData, setRevSelectedData] = useState(null);

  const revHandleOnMediaSelectTab = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [revMIMETypes],
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });

      setRevSelectedData(response);
      revOnSelectedDataCallBack(response);
    } catch (err) {
      revHandleError(err);
    }
  }, [revSelectedData]);

  if (!revUploadTab) {
    revUploadTab = (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          {alignItems: 'center'},
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          <FontAwesome
            name={'plus'}
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtNormal,
              {paddingHorizontal: 8},
            ]}></FontAwesome>
        </Text>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {' ' + revLabel}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[revSiteStyles.revAddMeadiaTab, revStyles]}
      onPress={() => {
        revHandleOnMediaSelectTab();
      }}>
      {revUploadTab}
    </TouchableOpacity>
  );
};

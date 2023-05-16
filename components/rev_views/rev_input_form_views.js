import React, {useState, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity, Platform} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

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
        placeholderTextColor="#999"
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

export const RevTextInputWithCount = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revTextInputOnChangeCallBack = null,
    revPlaceHolderTxt = '',
    revMaxTxtCount = 100,
  } = revVarArgs;

  const [revInputText, setRevInputText] = useState('');
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
        style={revSiteStyles.revSiteTextInputNoBorder}
        placeholderTextColor="#999"
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
};

export const RevTextInputAreaWithCount = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revTextInputOnChangeCallBack = null,
    revPlaceHolderTxt = '',
    revMaxTxtCount = 100,
  } = revVarArgs;

  const [revInputText, setRevInputText] = useState('');
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
        multiline={true}
        numberOfLines={5}
        style={revSiteStyles.revTextInputAreaInputWithCount}
        placeholderTextColor="#999"
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
};

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
        {revFixedSelectedValue}{' '}
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
              label={option.value}
              value={option.value}
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
        placeholderTextColor="#999"
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

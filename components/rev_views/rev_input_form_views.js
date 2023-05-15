import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  Platform,
  TouchableOpacity,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

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

export const DropdownListSelector = ({revVarArgs}) => {
  const [selectedValue, setSelectedValue] = useState('java');

  return (
    <View>
      <Text>Select Programming Language</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="javascript" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="C++" value="cpp" />
      </Picker>
      <Text>You selected: {selectedValue}</Text>
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

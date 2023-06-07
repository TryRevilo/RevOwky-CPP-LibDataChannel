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

import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Platform} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';
import {CheckBox, Icon} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';

import {
  revCompareStrings,
  revTruncateString,
} from '../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from './RevSiteStyles';
import {RevCenteredImage, RevScrollView_H} from './rev_page_views';
import {revGetRandInteger} from '../../rev_function_libs/rev_gen_helper_functions';

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

  const revHandleTextChange = text => {
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
        onChangeText={revHandleTextChange}
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
        placeholderTextColor={revSiteStyles.revSiteTxtColorLight.color}
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
        defaultValue={revInputText}
        placeholder={revPlaceHolderTxt}
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtTiny,
          revSiteStyles.revSiteTextInputNoBorder,
        ]}
        placeholderTextColor={revSiteStyles.revSiteTxtColorLight.color}
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
    revDefaultText = '',
    revTextInputOnChangeCallBack = null,
    revPlaceHolderTxt = '',
    revMaxTxtCount = 540,
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

export const revOpenCropnImagePicker = (
  revOnCropImageSelectCallBack,
  {revCropWidth = 0, revCropHeight = 0},
) => {
  ImagePicker.openPicker({
    width: revCropWidth, // Set the desired width of the cropped image
    height: revCropHeight, // Set the desired height of the cropped image
    cropping: true,
  })
    .then(image => {
      // `image` contains information about the cropped image
      console.log(image);
      revOnCropImageSelectCallBack(image);
    })
    .catch(error => {
      // Handle error if any
      console.log(error);
    });
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
      console.log('*** revHandleOnMediaSelectTab', err);
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

export const RevSelectImagesInput = ({
  revDefaultDataArr = [],
  revOnSelectedDataCallBack,
  revOnRemoveDataCallBack = null,
}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revImagesDataArray, setRevImagesDataArray] =
    useState(revDefaultDataArr);
  const revImagesDataArrayRef = useRef(revDefaultDataArr);
  const [revSelectedPicsArea, setRevSelectedPicsArea] = useState(null);

  const revImagesDataArrayChangeCallBack = revNewDataArr => {
    setRevImagesDataArray(revNewDataArr);
    revOnSelectedDataCallBack(revNewDataArr);

    const handleRevRemoveSelectedImage = revDeletedData => {
      if (revOnRemoveDataCallBack !== null) {
        revOnRemoveDataCallBack(revDeletedData);
      }

      setRevImagesDataArray(revCurrDataArray => {
        let revUpdatedDataArr = revCurrDataArray.filter(
          revCurrFilterItem =>
            revCompareStrings(revDeletedData.uri, revCurrFilterItem.uri) !== 0,
        );

        revImagesDataArrayRef.current = revUpdatedDataArr;

        setRevSelectedPicsArea(
          <RevScrollView_H
            revScrollViewContent={revGetSelectedImagesViewsArr(
              revUpdatedDataArr,
            )}
          />,
        );

        revOnSelectedDataCallBack(revUpdatedDataArr);

        return revUpdatedDataArr;
      });
    };

    let revGetSelectedImagesViewsArr = revNewDataArr =>
      revNewDataArr.map(revCurrData => {
        return (
          <View
            key={'revSelectedPicsArea_' + revGetRandInteger()}
            style={[
              revSiteStyles.revFlexContainer,
              {
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
                overflow: 'hidden',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                handleRevRemoveSelectedImage(revCurrData);
              }}
              style={[{padding: 8}]}>
              <FontAwesome
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtSmall,
                ]}
                name="recycle"
              />
            </TouchableOpacity>

            <RevCenteredImage
              revImageURI={revCurrData.uri}
              revImageDimens={{
                revWidth: 42,
                revHeight: 42,
              }}
              revStyles={{
                overflow: 'hidden',
                marginRight: 2,
                borderRadius: 3,
              }}
            />
          </View>
        );
      });

    setRevSelectedPicsArea(
      <RevScrollView_H
        revScrollViewContent={revGetSelectedImagesViewsArr(revNewDataArr)}
      />,
    );
  };

  let revAddedMediaContainer = {
    borderStyle: 'dotted',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
  };

  let revAddedMediaTitleWrapper = {
    alignItems: 'center',
    marginTop: 8,
  };

  useEffect(() => {
    revImagesDataArrayChangeCallBack(revImagesDataArray);
  }, []);

  return (
    <View style={[revSiteStyles.revFlexContainer, revAddedMediaContainer]}>
      <View style={[revSiteStyles.revFlexWrapper, revAddedMediaTitleWrapper]}>
        <FontAwesome
          name={'camera'}
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtMedium,
          ]}
        />

        <FontAwesome
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}
          name="long-arrow-right"
        />

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
          ]}>
          {' Ad pics'}
        </Text>

        <RevUploadFilesTab
          revVarArgs={{
            revLabel: ' Select pictures',
            revMIMETypes: DocumentPicker.types.images,
            revOnSelectedDataCallBack: revNewDataArr => {
              let revCurrSelectedDataArr = [
                ...revImagesDataArrayRef.current,
                ...revNewDataArr,
              ];

              revImagesDataArrayChangeCallBack(revCurrSelectedDataArr);
            },
          }}
        />
      </View>

      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          {marginTop: 4, marginLeft: 4},
        ]}>
        <Text style={revSiteStyles.revSiteTxtBold}>
          {revImagesDataArray.length}
        </Text>
        {' profile pics selected. You can upload up to 22'}
      </Text>
      {revSelectedPicsArea}
    </View>
  );
};

export const RevEntityIconCropperView = ({
  revCallBackFunc,
  revCropDimensions = {},
  revPreviewDimensions = {},
  revDefaultIconPath = '',
}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revCropWidth = 0, revCropHeight = 0} = revCropDimensions;
  const {revPreviewWidth = 55, revPreviewHeight = 55} = revPreviewDimensions;

  let revDefaultIconView = (
    <RevCenteredImage
      revImageURI={revDefaultIconPath}
      revImageDimens={{revWidth: '100%', revHeight: '100%'}}
      revStyles={{overflow: 'hidden', borderRadius: 3}}
    />
  );

  const [revIconView, setIconView] = useState(revDefaultIconView);

  let revAddedMediaContainer = {
    borderStyle: 'dotted',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
  };

  let revMainProfilePicContainer = {
    width: revPreviewWidth + 6,
    height: revPreviewHeight + 6,
    borderStyle: 'dashed',
    borderColor: '#EEE',
    borderWidth: 1,
    padding: 2,
    overflow: 'hidden',
    borderRadius: 3,
  };

  return (
    <TouchableOpacity
      onPress={() => {
        revOpenCropnImagePicker(
          revCroppedImageData => {
            let revCroppedImageDataPath = revCroppedImageData.path;

            let revNewIconView = (
              <View style={{overflow: 'hidden', borderRadius: 3}}>
                <RevCenteredImage
                  revImageURI={revCroppedImageDataPath}
                  revImageDimens={{
                    revWidth: revPreviewWidth,
                    revHeight: revPreviewHeight,
                  }}
                />
              </View>
            );

            setIconView(revNewIconView);
            revCallBackFunc(revCroppedImageData);
          },
          {revCropWidth: revCropWidth, revCropHeight: revCropHeight},
        );
      }}>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revAddedMediaContainer,
          {alignItems: 'center'},
        ]}>
        <View style={[revMainProfilePicContainer]}>{revIconView}</View>

        <Text>{'  '}</Text>

        <FontAwesome
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}
          name="plus"
        />

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {' Select main profile Pic'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const RevBannerCropperView = ({
  revCallBackFunc,
  revCropDimensions = {},
  revPreviewDimensions = {},
  revDefaultCropBannerIconPath = '',
}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revCropWidth = 600, revCropHeight = 600} = revCropDimensions;
  const {revPreviewWidth = 55, revPreviewHeight = 55} = revPreviewDimensions;

  let revSavedMainEntityBannerIconView = (
    <RevCenteredImage
      revImageURI={revDefaultCropBannerIconPath}
      revImageDimens={{
        revWidth: revPreviewWidth,
        revHeight: revPreviewHeight,
        overflow: 'hidden',
        borderRadius: 3,
      }}
    />
  );

  const [revBannerIcon, setRevBannerIcon] = useState(
    revSavedMainEntityBannerIconView,
  );

  let revAddedMediaContainer = {
    borderStyle: 'dotted',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
    overflow: 'hidden',
    borderRadius: 3,
  };

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <TouchableOpacity
        onPress={() => {
          revOpenCropnImagePicker(
            revCroppedImageData => {
              let revCroppedImageDataPath = revCroppedImageData.path;

              let revMainEntityIconViewView = (
                <View style={{marginTop: 4, overflow: 'hidden'}}>
                  <RevCenteredImage
                    revImageURI={revCroppedImageDataPath}
                    revImageDimens={{
                      revWidth: revPreviewWidth,
                      revHeight: revPreviewHeight,
                    }}
                    revStyles={{
                      overflow: 'hidden',
                      borderRadius: 3,
                    }}
                  />
                </View>
              );

              setRevBannerIcon(revMainEntityIconViewView);
              revCallBackFunc(revCroppedImageData);
            },
            {revCropWidth: revCropWidth, revCropHeight: revCropHeight},
          );
        }}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            revAddedMediaContainer,
            {alignItems: 'center'},
          ]}>
          <FontAwesome
            name={'file-picture-o'}
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtLarge,
            ]}
          />

          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="long-arrow-right"
          />

          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            {' Select banner Pic'}
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={{height: revPreviewHeight, overflow: 'hidden', borderRadius: 3}}>
        {revBannerIcon}
      </View>
    </View>
  );
};

export const RevCheckBox = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revIsChecked, setRevIsChecked] = useState(false);

  const {revOnCheckedStatusChangeCallBack, revCheckBoxText = ''} = revVarArgs;

  const handleCheckBoxToggle = () => {
    setRevIsChecked(!revIsChecked);
    revOnCheckedStatusChangeCallBack(!revIsChecked);
  };

  return (
    <View
      style={[revSiteStyles.revFlexWrapper_WidthAuto, {alignItems: 'center'}]}>
      <CheckBox
        // title={revCheckBoxText}
        checked={revIsChecked}
        onPress={handleCheckBoxToggle}
        size={revSiteStyles.revSiteTxtTiny.fontSize}
        containerStyle={revSiteStyles.revCheckBoxContainer}
        textStyle={revSiteStyles.revCheckBoxText}
        checkedIcon={
          <FontAwesome
            name="check"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny_X,
              {margin: 'auto'},
            ]}
          />
        }
        uncheckedIcon={null}
      />

      {revCheckBoxText ? (
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {revCheckBoxText}
        </Text>
      ) : null}
    </View>
  );
};

export const RevRadioButton = ({revVarArgs}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleOptionSelect('option1')}>
        <Text>{selectedOption === 'option1' ? '●' : '○'}</Text>
        <Text>Option 1</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleOptionSelect('option2')}>
        <Text>{selectedOption === 'option2' ? '●' : '○'}</Text>
        <Text>Option 2</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleOptionSelect('option3')}>
        <Text>{selectedOption === 'option3' ? '●' : '○'}</Text>
        <Text>Option 3</Text>
      </TouchableOpacity>
    </View>
  );
};

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {RevInfoArea} from '../../../../../rev_views/rev_page_views';
import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {
  RevTagsInput,
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
  RevUploadFilesTab,
  revOpenCropnImagePicker,
} from '../../../../../rev_views/rev_input_form_views';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';
import {RevCenteredImage} from '../../../../../rev_views/rev_page_views';

import {revCompareStrings} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevEditUserInfoForm_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {SET_REV_SITE_VAR_ARGS} = useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const [revTagsArr, setRevTagsArr] = useState([]);
  const [revSearchText, setRevSearchText] = useState('');
  const [revBriefInfoTxt, setRevBriefInfoTxt] = useState('');
  const [revAboutEntityInfo, setRevAboutEntityInfo] = useState('');

  const [revSelectedImagesDataArray, setRevSelectedImagesDataArray] = useState(
    [],
  );
  const [revSelectedVideosDataArray, setRevSelectedVideosDataArray] = useState(
    [],
  );

  const [revMainCampaignIconView, setRevMainCampaignIconView] = useState(null);
  const [revMainCampaignIconPath, setRevMainCampaignIconPath] = useState('');
  const [revSelectedMainProfilePicPath, setRevSelectedMainProfilePicPath] =
    useState(null);
  const [revSelectedMainProfilePic, setRevSelectedMainProfilePic] =
    useState(null);

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);

  const revSelectedImagesDataArrayChangeCallBack = revNewDataArr => {
    setRevSelectedImagesDataArray(revNewDataArr);
  };

  const revSelectedVideosDataArrayRefChangeCallBack = revNewDataArr => {
    setRevSelectedVideosDataArray(revNewDataArr);
  };

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

  useEffect(() => {
    setRevTagsOutputView(
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revTagsListingWrapper]}>
        <RevTagsOutputListing
          revVarArgs={{
            revTagsArr: revTagsArr,
            revDelTagItemCallBack: revDelTagItem => {
              console.log('>>> revDelTagItem', revDelTagItem);

              setRevTagsArr(prevState => {
                return prevState.filter(revCurr => {
                  return revCurr !== revDelTagItem;
                });
              });
            },
          }}
        />
      </View>,
    );
  }, [revTagsArr]);

  let revInfoTell =
    'This is the info others will read about you on your profile';

  let revRetView = (
    <View
      style={[revSiteStyles.revFlexContainer, styles.revFormInputContainer]}>
      <RevInfoArea revInfoText={revInfoTell}></RevInfoArea>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          revSiteStyles.revMarginTopSmall,
        ]}>
        <RevTextInputWithCount
          revVarArgs={{
            revDefaultTxt: revSearchText,
            revPlaceHolderTxt: ' Full names . . .',
            revTextInputOnChangeCallBack: setRevSearchText,
            revMaxTxtCount: 140,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputWithCount
            revVarArgs={{
              revPlaceHolderTxt: ' Brief desc . . .',
              revTextInputOnChangeCallBack: revNewTxt => {
                setRevBriefInfoTxt(revNewTxt);
              },
              revMaxTxtCount: 55,
            }}
          />
        </View>

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revPlaceHolderTxt: ' About me . . .',
              revTextInputOnChangeCallBack: revNewTxt => {
                setRevAboutEntityInfo(revNewTxt);
              },
              revMaxTxtCount: 500,
            }}
          />
        </View>

        <View style={[revSiteStyles.revFlexPageContainer]}>
          <RevTagsInput
            revVarArgs={{
              revTagsInputUpdater: revLatestTagsArr => {
                setRevTagsArr(revLatestTagsArr);
              },
            }}
          />

          {revTagsOutputView}
        </View>
      </View>

      <View
        style={[revSiteStyles.revFlexContainer, styles.revAddedMediaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
          ]}>
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
              revOnSelectedDataCallBack:
                revSelectedImagesDataArrayChangeCallBack,
            }}
          />
        </View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revAddedMediaTell,
            {marginLeft: 4},
          ]}>
          <Text style={revSiteStyles.revSiteTxtBold}>
            {revSelectedImagesDataArray.length}
          </Text>
          {' profile pics selected. You can upload up to 22'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          revOpenCropnImagePicker(
            revCroppedImageData => {
              let revCroppedImageDataPath = revCroppedImageData.path;

              setRevSelectedMainProfilePicPath(revCroppedImageDataPath);

              let revNewSelectedImagesArr = revSelectedImagesDataArray.filter(
                revCurrItem =>
                  revCompareStrings(
                    revCurrItem.uri,
                    revSelectedMainProfilePicPath,
                  ) !== 0,
              );

              revNewSelectedImagesArr.push({
                name: revCroppedImageDataPath.substring(
                  revCroppedImageDataPath.lastIndexOf('/') + 1,
                ),
                size: revCroppedImageData.size,
                type: revCroppedImageData.mime,
                uri: revCroppedImageDataPath,
              });

              setRevSelectedImagesDataArray(revNewSelectedImagesArr);

              let revSelectedMainProfilePicView = (
                <View style={{overflow: 'hidden'}}>
                  <RevCenteredImage
                    revImageURI={revCroppedImageDataPath}
                    revImageDimens={{revWidth: 55, revHeight: 55}}
                  />
                </View>
              );

              setRevSelectedMainProfilePic(revSelectedMainProfilePicView);
            },
            {revCropWidth: 600, revCropHeight: 600},
          );
        }}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaContainer,
            {alignItems: 'center'},
          ]}>
          <View style={[styles.revMainProfilePicContainer]}>
            {revSelectedMainProfilePic}
          </View>

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

      <TouchableOpacity
        onPress={() => {
          revOpenCropnImagePicker(
            revCroppedImageData => {
              let revCroppedImageDataPath = revCroppedImageData.path;

              setRevMainCampaignIconPath(revCroppedImageDataPath);

              let revNewSelectedImagesArr = revSelectedImagesDataArray.filter(
                revCurrItem =>
                  revCompareStrings(revCurrItem, revMainCampaignIconPath) !== 0,
              );

              revNewSelectedImagesArr.push({
                name: revCroppedImageDataPath.substring(
                  revCroppedImageDataPath.lastIndexOf('/') + 1,
                ),
                size: revCroppedImageData.size,
                type: revCroppedImageData.mime,
                uri: revCroppedImageDataPath,
              });

              setRevSelectedImagesDataArray(revNewSelectedImagesArr);

              let revMainCampaignIconViewView = (
                <View style={{marginTop: 4, overflow: 'hidden'}}>
                  <RevCenteredImage
                    revImageURI={revCroppedImageDataPath}
                    revImageDimens={{revWidth: '100%', revHeight: 55}}
                  />
                </View>
              );

              setRevMainCampaignIconView(revMainCampaignIconViewView);
            },
            {revCropHeight: 55},
          );
        }}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaContainer,
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

      <>{revMainCampaignIconView}</>

      <View
        style={[revSiteStyles.revFlexContainer, styles.revAddedMediaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
            {marginLeft: 2},
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            <FontAwesome name="dot-circle-o" />
            <FontAwesome name="long-arrow-right" /> Video{'  '}
          </Text>

          <RevUploadFilesTab
            revVarArgs={{
              revLabel: ' Select videos',
              revMIMETypes: DocumentPicker.types.video,
              revOnSelectedDataCallBack:
                revSelectedVideosDataArrayRefChangeCallBack,
            }}
          />
        </View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revAddedMediaTell,
            {marginLeft: 4},
          ]}>
          <Text style={revSiteStyles.revSiteTxtBold}>
            {revSelectedVideosDataArray.length}
          </Text>
          {' profile videos selected'}
        </Text>
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

  return <RevScrollView_V revScrollViewContent={revRetView}></RevScrollView_V>;
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
  },
  revBriefDescInputWrapper: {
    marginTop: 8,
  },
  revTagsListingWrapper: {
    marginTop: 2,
  },
  revMainProfilePicContainer: {
    width: 61,
    height: 61,
    borderStyle: 'dashed',
    borderColor: '#EEE',
    borderWidth: 1,
    padding: 2,
  },
  revAddedMediaContainer: {
    borderStyle: 'dotted',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
  },
  revAddedMediaTitleWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  revAddMeadiaTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 22,
  },
  revAddedMediaTell: {
    marginTop: 4,
  },
});

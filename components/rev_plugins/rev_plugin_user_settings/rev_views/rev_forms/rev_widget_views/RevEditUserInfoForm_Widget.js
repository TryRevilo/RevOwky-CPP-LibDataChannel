import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';
import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';

const {RevPersLibCreate_React, RevPersLibUpdate_React} = NativeModules;

import {
  revGetFileAbsolutePath,
  revGetFileNameFromPath,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {
  RevTagsInput,
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
  RevUploadFilesTab,
  revOpenCropnImagePicker,
  RevEntityIconCropperView,
  RevBannerCropperView,
} from '../../../../../rev_views/rev_input_form_views';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';
import {RevCenteredImage} from '../../../../../rev_views/rev_page_views';

import {
  revCompareStrings,
  revReplaceWiteSpaces,
} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevEditUserInfoFormAction} from '../../../rev_actions/rev_edit_user_info_action';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revGenerateVideoThumbnail} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevEditUserInfoForm_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  let revInfoEntity = REV_LOGGED_IN_ENTITY._revInfoEntity;
  let revInfoEntityGUID = revInfoEntity._revEntityGUID;
  let revInfoEntityMetadataList = revInfoEntity._revEntityMetadataList;

  let revFullNames = revGetMetadataValue(
    revInfoEntityMetadataList,
    'rev_full_names',
  );
  let revEntityDesc = revGetMetadataValue(
    revInfoEntityMetadataList,
    'rev_entity_desc_val',
  );
  let revAboutEntityInfo = revGetMetadataValue(
    revInfoEntityMetadataList,
    'rev_about_entity_info',
  );
  let revMainEntityIconVal = revGetMetadataValue(
    revInfoEntityMetadataList,
    'rev_main_entity_icon_val',
  );
  let revMainEntityBannerIconVal = revGetMetadataValue(
    revInfoEntityMetadataList,
    'rev_main_entity_banner_icon_val',
  );

  const [revEntityNameTxt, setRevEntityNameTxt] = useState(revFullNames);
  const [revEntityDescTxt, setRevEntityDescTxt] = useState(revEntityDesc);
  const [revAboutEntityInfoTxt, setRevAboutEntityInfoTxt] =
    useState(revAboutEntityInfo);
  const [revTagsArr, setRevTagsArr] = useState([]);

  const [revImagesDataArray, setRevImagesDataArray] = useState([]);
  const [revVideosDataArray, setRevVideosDataArray] = useState([]);
  const [revMainEntityIconPath, setRevMainEntityIconPath] =
    useState(revMainEntityIconVal);

  const [revEntityBannerIconPath, setRevEntityBannerIconPath] = useState(
    revMainEntityBannerIconVal,
  );

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);

  const {revEditUserInfoFormAction} = useRevEditUserInfoFormAction();

  const revImagesDataArrayChangeCallBack = revNewDataArr => {
    setRevImagesDataArray(revNewDataArr);
  };

  const revVideosDataArrayChangeCallBack = async revNewDataArr => {
    for (let i = 0; i < revNewDataArr.length; i++) {
      let revCurrData = revNewDataArr[i];

      let revCapturedVidURI = await revGenerateVideoThumbnail({
        url: revCurrData.uri,
        timeStamp: 1,
      });

      const revFileName = revGetFileNameFromPath(revCapturedVidURI.path);

      const revDirectoryPath =
        '/storage/emulated/0/Documents/Owki/rev_media/thumbnails/';
      let revDestFilePath = revDirectoryPath + revFileName + '.jpeg';

      let revSourcePath = revCapturedVidURI.path.replace('file://', '');

      RevPersLibCreate_React.revCopyFile(revSourcePath, revDestFilePath);

      revNewDataArr[i]['revVidThumbnail'] = revDestFilePath;
    }

    setRevVideosDataArray(revNewDataArr);
  };

  const handleRevCancelTabPress = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevUserSettings);
  };

  const handleRevSaveInfoTabPress = () => {
    let revPassVarArgs = {
      _revEntityGUID: revInfoEntityGUID,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityNameVal: revEntityNameTxt,
      revEntityDescVal: revEntityDescTxt,
      revAboutEntityInfo: revAboutEntityInfoTxt,
      revTagsArr: revTagsArr,
      revMainEntityIconPath: revMainEntityIconPath,
      revEntityBannerIconPath: revEntityBannerIconPath,

      revSelectedMedia: [...revImagesDataArray, ...revVideosDataArray],
    };

    revEditUserInfoFormAction(revPassVarArgs, async revPersResData => {
      console.log('>>> revPersResData', revPersResData);
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
            revDefaultText: revEntityNameTxt,
            revPlaceHolderTxt: ' Full names . . .',
            revTextInputOnChangeCallBack: setRevEntityNameTxt,
            revMaxTxtCount: 140,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputWithCount
            revVarArgs={{
              revDefaultText: revEntityDescTxt,
              revPlaceHolderTxt: ' Brief desc . . .',
              revTextInputOnChangeCallBack: setRevEntityDescTxt,
              revMaxTxtCount: 55,
            }}
          />
        </View>

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revDefaultText: revAboutEntityInfoTxt,
              revPlaceHolderTxt: ' About me . . .',
              revTextInputOnChangeCallBack: setRevAboutEntityInfoTxt,
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
              revOnSelectedDataCallBack: revImagesDataArrayChangeCallBack,
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
            {revImagesDataArray.length}
          </Text>
          {' profile pics selected. You can upload up to 22'}
        </Text>
      </View>

      <RevEntityIconCropperView
        revCropDimensions={{revWidth: 600, revHeight: 600}}
        revDefaultIconPath={revMainEntityIconVal}
        revCallBackFunc={revCroppedImageData => {
          let revIconPath = revCroppedImageData.path;

          setRevMainEntityIconPath(revIconPath);

          let revNewSelectedImagesArr = revImagesDataArray.filter(
            revCurrItem =>
              revCompareStrings(revCurrItem.uri, revMainEntityIconPath) !== 0,
          );

          revNewSelectedImagesArr.push({
            name: revIconPath.substring(revIconPath.lastIndexOf('/') + 1),
            size: revCroppedImageData.size,
            type: revCroppedImageData.mime,
            uri: revIconPath,
          });

          setRevImagesDataArray(revNewSelectedImagesArr);
        }}
      />

      <RevBannerCropperView
        revDefaultCropBannerIconPath={revMainEntityBannerIconVal}
        revCropDimensions={{revCropWidth: 1200, revCropHeight: 300}}
        revPreviewDimensions={{revPreviewWidth: '100%', revPreviewHeight: 100}}
        revDefaultIconPath={revMainEntityIconVal}
        revCallBackFunc={revCroppedImageData => {
          let revCroppedBannerIconPath = revCroppedImageData.path;

          setRevEntityBannerIconPath(revCroppedBannerIconPath);

          let revNewSelectedImagesArr = revImagesDataArray.filter(
            revCurrItem =>
              revCompareStrings(revCurrItem, revCroppedBannerIconPath) !== 0,
          );

          revNewSelectedImagesArr.push({
            name: revCroppedBannerIconPath.substring(
              revCroppedBannerIconPath.lastIndexOf('/') + 1,
            ),
            size: revCroppedImageData.size,
            type: revCroppedImageData.mime,
            uri: revCroppedBannerIconPath,
          });

          setRevImagesDataArray(revNewSelectedImagesArr);
        }}
      />

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
              revOnSelectedDataCallBack: revVideosDataArrayChangeCallBack,
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
            {revVideosDataArray.length}
          </Text>
          {' profile videos selected'}
        </Text>
      </View>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
        ]}>
        <TouchableOpacity onPress={handleRevSaveInfoTabPress}>
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

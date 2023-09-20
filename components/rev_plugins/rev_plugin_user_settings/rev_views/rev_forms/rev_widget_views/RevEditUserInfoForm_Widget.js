import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';
import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';

const {RevPersLibCreate_React, RevPersLibUpdate_React, RevPersLibDelete_React} =
  NativeModules;

import {
  revGetFileNameFromPath,
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {
  RevTagsInput,
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
  RevUploadFilesTab,
  RevEntityIconCropperView,
  RevBannerCropperView,
  RevSelectImagesInput,
} from '../../../../../rev_views/rev_input_form_views';

import {revPersGetRevEntities_By_EntityGUIDsArr} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {
  revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID,
  useRevGetEntityIcon,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';

import {revCompareStrings} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevEditUserInfoFormAction} from '../../../rev_actions/rev_edit_user_info_action';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revGenerateVideoThumbnail} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
const rev_settings = require('../../../../../../rev_res/rev_settings.json');

export const RevEditUserInfoForm_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY, REV_LOGGED_IN_ENTITY_GUID} =
    useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const {revGetEntityIcon} = useRevGetEntityIcon();

  let revInfoEntity = REV_LOGGED_IN_ENTITY._revInfoEntity;

  if (revIsEmptyJSONObject(revInfoEntity)) {
    return null;
  }

  let revInfoEntityMetadataList = revInfoEntity._revEntityMetadataList;

  let revEntityPicsAlbum = REV_LOGGED_IN_ENTITY.revEntityPicsAlbum;

  let revEntityPicsAlbumDataArr = [];

  if (
    !revIsEmptyJSONObject(revEntityPicsAlbum) &&
    revEntityPicsAlbum.hasOwnProperty('revPicsArray')
  ) {
    let revPicsArray = revEntityPicsAlbum.revPicsArray;

    for (let i = 0; i < revPicsArray.length; i++) {
      let revCurrPic = revPicsArray[i];

      if (revIsEmptyJSONObject(revCurrPic)) {
        continue;
      }

      let revPicMetadataArr = revCurrPic._revEntityMetadataList;
      let revRemoteFileName = revGetMetadataValue(
        revPicMetadataArr,
        'rev_remote_file_name',
      );

      let revEntityIconValPath =
        'file://' + rev_settings.revPublishedMediaDir + '/' + revRemoteFileName;

      revEntityPicsAlbumDataArr.push({
        _revEntityGUID: revCurrPic._revEntityGUID,
        uri: revEntityIconValPath,
      });
    }
  }

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

  const {revMainEntityIconLocalPath = ''} = revGetEntityIcon({
    revEntityGUID: REV_LOGGED_IN_ENTITY_GUID,
  });

  let revMainEntityBannerIconVal = revGetMetadataValue(
    revInfoEntityMetadataList,
    'rev_main_entity_banner_icon_val',
  );

  let revTagRelsArr =
    revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_tag_of',
      REV_LOGGED_IN_ENTITY_GUID,
    );

  let revTagEntitiesArr =
    revPersGetRevEntities_By_EntityGUIDsArr(revTagRelsArr);

  let revTagValsArr = [];

  for (let i = 0; i < revTagEntitiesArr.length; i++) {
    let revTagVal = revGetMetadataValue(
      revTagEntitiesArr[i]._revInfoEntity._revEntityMetadataList,
      'rev_entity_name_val',
    );
    revTagValsArr.push(revTagVal);
  }

  const [revEntityNameTxt, setRevEntityNameTxt] = useState(revFullNames);
  const [revEntityDescTxt, setRevEntityDescTxt] = useState(revEntityDesc);
  const [revAboutEntityInfoTxt, setRevAboutEntityInfoTxt] =
    useState(revAboutEntityInfo);
  const [revTagsArr, setRevTagsArr] = useState(revTagValsArr);

  const [revImagesDataArray, setRevImagesDataArray] = useState(
    revEntityPicsAlbumDataArr,
  );
  const [revVideosDataArray, setRevVideosDataArray] = useState([]);
  const [revMainEntityIconPath, setRevMainEntityIconPath] = useState(
    revMainEntityIconLocalPath,
  );

  const [revEntityBannerIconPath, setRevEntityBannerIconPath] = useState(
    revMainEntityBannerIconVal,
  );

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);

  const {revEditUserInfoFormAction} = useRevEditUserInfoFormAction();

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
      _revEntityGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityNameVal: revEntityNameTxt,
      revEntityDescVal: revEntityDescTxt,
      revAboutEntityInfo: revAboutEntityInfoTxt,
      revTagsArr: revTagsArr,
      revMainEntityIconPath: revMainEntityIconPath,
      revEntityBannerIconPath: revEntityBannerIconPath,

      revSelectedMedia: [...revImagesDataArray, ...revVideosDataArray],

      revTagsArr: revTagsArr.map(revVal => ({revEntityNameVal: revVal})),
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

      <RevSelectImagesInput
        revDefaultDataArr={revImagesDataArray}
        revOnSelectedDataCallBack={revNewSelectedDataArr => {
          setRevImagesDataArray(revNewSelectedDataArr);
        }}
        revOnRemoveDataCallBack={revDeletedData => {
          console.log('>>> revDeletedData', revDeletedData);

          let revFilePath = revDeletedData.uri.replace('file://', '');
          console.log('>>> revFilePath', revFilePath);

          let revDelFileGUID =
            '_revEntityGUID' in revDeletedData && revDeletedData._revEntityGUID
              ? revDeletedData._revEntityGUID
              : -1;

          console.log('>>> revDelFileGUID', revDelFileGUID);

          let revDeleteParams = [
            {
              revFileGUID: revDelFileGUID,
              revFilePath: revFilePath,
            },
          ];

          RevPersLibDelete_React.revAsyDeleteFilesFromPathsStrArr(
            JSON.stringify({revRoot: revDeleteParams}),
          ).then(revRes => {
            console.log('>>> revRes', revRes);
          });
        }}
      />

      <RevEntityIconCropperView
        revCropDimensions={{revWidth: 600, revHeight: 600}}
        revDefaultIconPath={revMainEntityIconPath}
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
            revEntityIcon: 'revEntityIcon',
          });

          setRevImagesDataArray(revNewSelectedImagesArr);
        }}
      />

      <RevBannerCropperView
        revDefaultCropBannerIconPath={revEntityBannerIconPath}
        revCropDimensions={{revCropWidth: 1200, revCropHeight: 300}}
        revPreviewDimensions={{revPreviewWidth: '100%', revPreviewHeight: 100}}
        revDefaultIconPath={revEntityBannerIconPath}
        revCallBackFunc={revCroppedImageData => {
          let revCroppedBannerIconPath = revCroppedImageData.path;

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
            revEntityBannerIcon: true,
          });

          setRevEntityBannerIconPath(revCroppedBannerIconPath);
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

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
  RevTagsInput,
  RevUploadFilesTab,
  revOpenCropnImagePicker,
} from '../../../../../rev_views/rev_input_form_views';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';

import {
  RevInfoArea,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

import {useRevCreateNewAdDetailsForm} from '../../../rev_actions/rev_create_new_ad_details_form_action';
import {useRevCreateNewTagFormAction} from '../../../../rev_plugin_tags/rev_actions/rev_create_new_tag_form_action';

import {revCompareStrings} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCreateNewAdDetailsFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (!('revVarArgs' in revVarArgs)) {
    return null;
  }

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const {revCreateNewAdDetailsForm} = useRevCreateNewAdDetailsForm();
  const {revCreateNewTagFormAction} = useRevCreateNewTagFormAction();

  revVarArgs = revVarArgs.revVarArgs;

  const {
    revData = {},
    revOnSaveCallBack = revRetData => {
      console.log('*** ERR -revRetData unset', revRetData);
    },
  } = revVarArgs;

  const {revOrganizationEntityGUID = -1, revProductLineGUID = -1} = revData;

  const [revTagsArr, setRevTagsArr] = useState([]);

  const [revEntityNameText, setRevEntityNameText] = useState('');
  const [revEntityDescText, setRevEntityDescText] = useState('');

  const [revSelectedImagesDataArray, setRevSelectedImagesDataArray] = useState(
    [],
  );
  const [revSelectedVideosDataArray, setRevSelectedVideosDataArray] = useState(
    [],
  );

  const [revMainCampaignIconView, setRevMainCampaignIconView] = useState(null);
  const [revMainCampaignIconPath, setRevMainCampaignIconPath] = useState('');

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);

  const revSelectedImagesDataArrayChangeCallBack = revNewDataArr => {
    setRevSelectedImagesDataArray(revNewDataArr);
  };

  const revSelectedVideosDataArrayRefChangeCallBack = revNewDataArr => {
    setRevSelectedVideosDataArray(revNewDataArr);
  };

  const revSaveAdTags = async revEntityGUID => {
    let revSavedTagsGUIDsArr = [];

    for (let i = 0; i < revTagsArr.length; i++) {
      let revPersVarArgs = {
        revEntityNameVal: revTagsArr[i],
        revEntityGUID: revEntityGUID,
      };

      let revPersRes = await revCreateNewTagFormAction(revPersVarArgs);
      revSavedTagsGUIDsArr.push(revPersRes);
    }

    return revSavedTagsGUIDsArr;
  };

  const handleRevSaveAdDetailsTabPressed = async () => {
    let revPassVarArgs = {
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityNameVal: revEntityNameText,
      revEntityDescVal: revEntityDescText,
      revOrganizationEntityGUID: revOrganizationEntityGUID,
      revProductLineGUID: revProductLineGUID,
      revMainCampaignIconPath: revMainCampaignIconPath,

      revSelectedMedia: [
        ...revSelectedImagesDataArray,
        ...revSelectedVideosDataArray,
      ],
    };
    revCreateNewAdDetailsForm(revPassVarArgs, async revPersEntityGUID => {
      let revSavedTagsGUIDsArr = await revSaveAdTags(revPersEntityGUID);
      revOnSaveCallBack(revPersEntityGUID, revSavedTagsGUIDsArr);
    });
  };

  let revAdBudgetInputForm = revPluginsLoader({
    revPluginName: 'rev_plugin_ads',
    revViewName: 'RevAdBudgetInputForm',
    revVarArgs: {},
  });

  let revAdCampaignTeamInputForm = revPluginsLoader({
    revPluginName: 'rev_plugin_ads',
    revViewName: 'RevAdCampaignTeamInputForm',
    revVarArgs: {},
  });

  let revInfoTell = 'Finally set up your Ad here';

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
            revDefaultTxt: revEntityNameText,
            revPlaceHolderTxt: ' Ad Tag line . . .',
            revTextInputOnChangeCallBack: setRevEntityNameText,
            revMaxTxtCount: 140,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revDefaultTxt: revEntityDescText,
              revPlaceHolderTxt: ' Ad details . . .',
              revTextInputOnChangeCallBack: setRevEntityDescText,
              revMaxTxtCount: 555,
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
          {' Ad pictures selected. You can upload up to 22'}
        </Text>
      </View>

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
            {' Select main campaign Pic'}
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
          {' videos selected for this Ad'}
        </Text>
      </View>

      <View style={[revSiteStyles.revFlexContainer]}>
        {revAdBudgetInputForm}
      </View>

      <View>{revAdCampaignTeamInputForm}</View>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
          {
            paddingTop: 12,
            marginTop: 12,
            borderTopColor: '#EEE',
            borderStyle: 'dotted',
            borderTopWidth: 1,
          },
        ]}>
        <TouchableOpacity onPress={handleRevSaveAdDetailsTabPressed}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSaveTab,
            ]}>
            Save
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
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
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

  return revRetView;
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revFormInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
  },
  revIndustrySelectorWrapper: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  revBriefDescInputWrapper: {
    marginTop: 8,
  },
  revTagsListingWrapper: {
    marginTop: 2,
  },
  revAddedMediaContainer: {
    borderStyle: 'dotted',
    borderColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingLeft: 8,
    marginTop: 8,
  },
  revAddedMediaTitleWrapper: {
    alignItems: 'center',
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

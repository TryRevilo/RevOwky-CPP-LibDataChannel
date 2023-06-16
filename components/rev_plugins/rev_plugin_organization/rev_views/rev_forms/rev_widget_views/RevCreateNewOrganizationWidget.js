import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useState, useRef, useContext, useEffect} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {useRevCreateNewTagFormAction} from '../../../../rev_plugin_tags/rev_actions/rev_create_new_tag_form_action';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {
  RevDropdownListSelector,
  RevUploadFilesTab,
} from '../../../../../rev_views/rev_input_form_views';
import {
  RevInfoArea,
  RevSectionPointedContent,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

import {useRevPersGetRevEntities_By_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revCompareStrings} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevCreateNewOrganizationAction} from '../../../rev_actions/rev_create_new_organization_action';

import {
  RevTagsInput,
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
  revOpenCropnImagePicker,
} from '../../../../../rev_views/rev_input_form_views';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevCreateNewOrganizationWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revPersGetRevEntities_By_RevVarArgs} =
    useRevPersGetRevEntities_By_RevVarArgs();

  revVarArgs = revVarArgs.revVarArgs;

  const {revOnSaveCallBack} = revVarArgs;

  const {revCreateNewOrganizationAction} = useRevCreateNewOrganizationAction();
  const {revCreateNewTagFormAction} = useRevCreateNewTagFormAction();

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const [revSelectedOrganizationGUID, setRevSelectedOrganizationGUID] =
    useState(-1);

  const [revSelectedImagesDataArray, setRevSelectedImagesDataArray] = useState(
    [],
  );
  const [revSelectedVideosDataArray, setRevSelectedVideosDataArray] = useState(
    [],
  );

  const [revMainOrganizationIcon, setRevMainOrganizationIcon] = useState(null);
  const [revMainOrganizationIconPath, setRevMainOrganizationIconPath] =
    useState('');

  const revEntityNameTextRef = useRef('');
  const revEntityDescTextRef = useRef('');

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);
  const [revTagsArr, setRevTagsArr] = useState([]);

  let revPassVarArgs = {
    revSelect: [
      '_revEntityGUID',
      '_revOwnerEntityGUID',
      '_revContainerEntityGUID',
      '_revEntitySiteGUID',
      '_revEntityAccessPermission',
      '_revEntityType',
      '_revEntitySubType',
      '_revTimeCreated',
    ],
    revWhere: {
      _revEntityType: 'rev_object',
      _revEntitySubType: 'rev_organization',
      _revOwnerEntityGUID: REV_LOGGED_IN_ENTITY_GUID,
    },
    revLimit: 20,
  };
  let revMyOrganizationsArr = revPersGetRevEntities_By_RevVarArgs(
    JSON.stringify(revPassVarArgs),
  );

  let revOrgsSelectionOptionsArr = [];

  for (let i = 0; i < revMyOrganizationsArr.length; i++) {
    let revMyCurrOrganization = revMyOrganizationsArr[i];
    let revEntityMetadataList =
      revMyCurrOrganization._revInfoEntity._revEntityMetadataList;

    let revEntityNameVal = revGetMetadataValue(
      revEntityMetadataList,
      'rev_entity_name_val',
    );

    revOrgsSelectionOptionsArr.push({
      key: revMyCurrOrganization._revEntityGUID,
      value: revEntityNameVal,
    });
  }

  let revNullOrgsView = (
    <Text
      style={[
        revSiteStyles.revSiteTxtColorLight,
        revSiteStyles.revSiteTxtTiny,
        {marginTop: -12, marginLeft: 8},
      ]}>
      You do not have any Organizations / Business set up to select from
    </Text>
  );

  let revOrgSelectView = () => (
    <View style={revSiteStyles.revFlexContainer}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          {marginTop: -12, marginLeft: 7},
        ]}>
        Select a Business / Organization you had created earlier
      </Text>
      <View style={{paddingTop: 12}}>
        <RevDropdownListSelector
          revFixedSelectedValue={revOrgsSelectionOptionsArr[0].value}
          revOptions={revOrgsSelectionOptionsArr}
          revOnSelect={revOnSelectRetData => {
            setRevSelectedOrganizationGUID(revOnSelectRetData);
            revOnSaveCallBack(revOnSelectRetData);
          }}
        />
      </View>
    </View>
  );

  let revOrganizationDropdownListSelector = revOrgsSelectionOptionsArr.length
    ? revOrgSelectView()
    : revNullOrgsView;

  const handleRevCancelTabPress = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevUserSettings);
  };

  const revSaveAdTags = async revEntityGUID => {
    let revSavedTagsGUIDsArr = [];

    for (let i = 0; i < revTagsArr.length; i++) {
      let revPersVarArgs = {
        revEntityNameVal: revTagsArr[i],
        revContainerEntityGUID: revEntityGUID,
        revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      };

      let revPersRes = await revCreateNewTagFormAction(revPersVarArgs);
      revSavedTagsGUIDsArr.push(revPersRes);
    }

    return revSavedTagsGUIDsArr;
  };

  const handleRevSaveOrgTabPressed = async () => {
    let revPassVarArgs = {
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityNameVal: revEntityNameTextRef.current,
      revEntityDescVal: revEntityDescTextRef.current,
      revMainOrganizationIconPath: revMainOrganizationIconPath,

      revSelectedMedia: [
        ...revSelectedImagesDataArray,
        ...revSelectedVideosDataArray,
      ],
    };
    revCreateNewOrganizationAction(revPassVarArgs, async revPersResData => {
      try {
        let revSavedTagsGUIDsArr = await revSaveAdTags(revPersResData);
        revOnSaveCallBack(revPersResData, revSavedTagsGUIDsArr);
      } catch (error) {
        console.log('*** revSavedTagsGUIDsArr', error);
      }
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

  let revInfoTell = 'Business / Organization details';

  const revEntityNameTextChangeCallBack = revNewtxtVal => {
    revEntityNameTextRef.current = revNewtxtVal;
  };

  const revEntityDescTextChangeCallBack = revNewtxtVal => {
    revEntityDescTextRef.current = revNewtxtVal;
  };

  const revSelectedImagesDataArrayChangeCallBack = revNewDataArr => {
    setRevSelectedImagesDataArray([
      ...revSelectedImagesDataArray,
      ...revNewDataArr,
    ]);
  };

  const revSelectedVideosDataArrayChangeCallBack = revNewDataArr => {
    setRevSelectedVideosDataArray([
      ...revSelectedVideosDataArray,
      ...revNewDataArr,
    ]);
  };

  let revCreateNewOrgForm = (
    <View
      key={'revCreateNewOrgForm_' + revGetRandInteger()}
      style={[revSiteStyles.revFlexContainer, styles.revFormInputContainer]}>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          revSiteStyles.revMarginTopSmall,
        ]}>
        <RevTextInputWithCount
          revVarArgs={{
            revDefaultText: revEntityNameTextRef.current,
            revPlaceHolderTxt: ' Business name',
            revTextInputOnChangeCallBack: revEntityNameTextChangeCallBack,
            revMaxTxtCount: 140,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revDefaultText: revEntityDescTextRef.current,
              revPlaceHolderTxt: ' Brief desc . . .',
              revTextInputOnChangeCallBack: revEntityDescTextChangeCallBack,
              revMaxTxtCount: 255,
            }}
          />
        </View>

        <View style={[revSiteStyles.revFlexPageContainer]}>
          <RevTagsInput
            revVarArgs={{
              revTagsInputValsArr: revTagsArr,
              revTagsInputUpdater: setRevTagsArr,
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
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="camera"
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
            {' '}
            Company pics
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
          ]}>
          <Text style={revSiteStyles.revSiteTxtBold}>
            {revSelectedImagesDataArray.length}
          </Text>
          {
            ' pictures selected for this business profile. You can upload up to 22'
          }
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          revOpenCropnImagePicker(
            revCroppedImageData => {
              let revCroppedImageDataPath = revCroppedImageData.path;

              setRevMainOrganizationIconPath(revCroppedImageDataPath);

              revSelectedImagesDataArray = revSelectedImagesDataArray.filter(
                revCurrItem =>
                  revCompareStrings(
                    revCurrItem,
                    revMainOrganizationIconPath,
                  ) !== 0,
              );

              revSelectedImagesDataArray.push({
                name: revCroppedImageDataPath.substring(
                  revCroppedImageDataPath.lastIndexOf('/') + 1,
                ),
                size: revCroppedImageData.size,
                type: revCroppedImageData.mime,
                uri: revCroppedImageDataPath,
              });

              let revMainOrganizationIconView = (
                <View style={{marginTop: 4, overflow: 'hidden'}}>
                  <RevCenteredImage
                    revImageURI={revCroppedImageDataPath}
                    revImageDimens={{revWidth: '100%', revHeight: 55}}
                  />
                </View>
              );

              setRevMainOrganizationIcon(revMainOrganizationIconView);
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
            {' Select main Icon'}
          </Text>
        </View>
      </TouchableOpacity>

      <>{revMainOrganizationIcon}</>

      <View
        style={[revSiteStyles.revFlexContainer, styles.revAddedMediaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
            {marginLeft: 1},
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
                revSelectedVideosDataArrayChangeCallBack,
            }}
          />
        </View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revAddedMediaTell,
          ]}>
          <Text style={revSiteStyles.revSiteTxtBold}>
            {revSelectedVideosDataArray.length}
          </Text>
          {" videos selected for this business' profile"}
        </Text>
      </View>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
        ]}>
        <TouchableOpacity onPress={handleRevSaveOrgTabPressed}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSaveTab,
            ]}>
            NexT
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
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  let revSelectOrganizationViewContent = (
    <View
      key={'revSelectOrganizationViewContent_' + revGetRandInteger()}
      style={[revSiteStyles.revFlexContainer]}>
      <View style={[{paddingVertical: 12}]}>
        {revOrganizationDropdownListSelector}
      </View>
      <Text
        style={{
          paddingHorizontal: 8,
        }}>
        {revOrgsSelectionOptionsArr.length ? (
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtMedium,
            ]}>
            OR
          </Text>
        ) : null}

        <Text
          key={'revSelectOrganizationViewPointed_' + revGetRandInteger()}
          onPress={() => {
            setRevSelectedOrganizationGUID(-1);
          }}
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {'  . . . Create a new one below'}
        </Text>
      </Text>
    </View>
  );

  let revSelectOrganizationViewPointed = (
    <RevSectionPointedContent
      revContent={revSelectOrganizationViewContent}
      revStyles={{marginLeft: -1}}
    />
  );

  let revCreateNewOrgFormPointed = (
    <RevSectionPointedContent
      revContent={revCreateNewOrgForm}
      revStyles={{marginTop: 15, marginLeft: -1}}
    />
  );

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      {<RevInfoArea revInfoText={revInfoTell}></RevInfoArea>}
      {revSelectOrganizationViewPointed}
      {revSelectedOrganizationGUID > 0 ? null : revCreateNewOrgFormPointed}
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 32;

const styles = StyleSheet.create({
  revFormInputContainer: {
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
  revAddedMediaTell: {
    marginTop: 4,
    marginLeft: 3,
  },
});

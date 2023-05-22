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

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {
  RevTextInput,
  RevDropdownListSelector,
  RevUploadFilesTab,
} from '../../../../../rev_views/rev_input_form_views';
import {
  RevScrollView_V,
  RevInfoArea,
  RevSectionPointedContent,
} from '../../../../../rev_views/rev_page_views';

import {useRevPersGetALLRevEntity_By_SubType_RevVarArgs} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {useRevCreateNewOrganizationAction} from '../../../rev_actions/rev_create_new_organization_action';

import {
  RevTagsInput,
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
} from '../../../../../rev_views/rev_input_form_views';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevCreateNewOrganizationWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {RevPersLibRead_React} = NativeModules;
  const {revPersGetALLRevEntity_By_SubType_RevVarArgs} =
    useRevPersGetALLRevEntity_By_SubType_RevVarArgs();

  revVarArgs = revVarArgs.revVarArgs;

  const {revOnSaveCallBack} = revVarArgs;

  const {revCreateNewOrganizationAction} = useRevCreateNewOrganizationAction();

  const {REV_LOGGED_IN_ENTITY_GUID, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const [revSelectedOrganizationGUID, setRevSelectedOrganizationGUID] =
    useState(-1);

  const [revEntityNameText, setRevEntityNameText] = useState('');
  const [revEntityDescText, setRevEntityDescText] = useState('');
  const [revSelectedImagesDataArray, setRevSelectedImagesDataArray] = useState(
    [],
  );
  const [revSelectedVideosDataArray, setRevSelectedVideosDataArray] = useState(
    [],
  );

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
  let revMyOrganizationsArr = revPersGetALLRevEntity_By_SubType_RevVarArgs(
    JSON.stringify(revPassVarArgs),
  );

  console.log(revMyOrganizationsArr.length);

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
        ]}>
        Select a Business / Organization you had created earlier
      </Text>
      <RevDropdownListSelector
        revFixedSelectedValue={revOrgsSelectionOptionsArr[0].value}
        revOptions={revOrgsSelectionOptionsArr}
        revOnSelect={revOnSelectRetData => {
          setRevSelectedOrganizationGUID(revOnSelectRetData);
        }}
      />
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

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });
  };

  const handleRevSaveOrgTabPressed = async () => {
    let revPassVarArgs = {
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityNameVal: revEntityNameText,
      revEntityDescVal: revEntityDescText,

      revSelectedMedia: [
        ...revSelectedImagesDataArray,
        ...revSelectedVideosDataArray,
      ],
    };
    revCreateNewOrganizationAction(revPassVarArgs, revPersResData => {
      revOnSaveCallBack(revPersResData);
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
            revPlaceHolderTxt: ' Business name',
            revTextInputOnChangeCallBack: setRevEntityNameText,
            revMaxTxtCount: 140,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revPlaceHolderTxt: ' Brief desc . . .',
              revDefaultTxt: revEntityDescText,
              revTextInputOnChangeCallBack: setRevEntityDescText,
              revMaxTxtCount: 255,
            }}
          />
        </View>

        <View style={[revSiteStyles.revFlexPageContainer]}>
          <RevTagsInput
            revVarArgs={{
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
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            <FontAwesome name="camera" />
            <FontAwesome name="long-arrow-right" /> Company pics
          </Text>

          <RevUploadFilesTab
            revVarArgs={{
              revMIMETypes: DocumentPicker.types.images,
              revOnSelectedDataCallBack: setRevSelectedImagesDataArray,
            }}
          />
        </View>
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddedMediaTell,
            ]}>
            {`You have selected ${revSelectedImagesDataArray.length} pictures for this business' profile. You can upload up to 22`}
          </Text>
        </View>
      </View>

      <View
        style={[revSiteStyles.revFlexContainer, styles.revAddedMediaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
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
              revMIMETypes: DocumentPicker.types.video,
              revOnSelectedDataCallBack: setRevSelectedVideosDataArray,
            }}
          />
        </View>
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddedMediaTell,
            ]}>
            {`You have selected ${revSelectedVideosDataArray.length} a videos for this business' profile`}
          </Text>
        </View>
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
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtMedium,
          ]}>
          OR
        </Text>
        <Text
          key={'revSelectOrganizationViewPointed_' + revGetRandInteger()}
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
    <RevSectionPointedContent revContent={revSelectOrganizationViewContent} />
  );

  let revCreateNewOrgFormPointed = (
    <RevSectionPointedContent
      revContent={revCreateNewOrgForm}
      revStyles={{marginTop: 15}}
    />
  );

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      {<RevInfoArea revInfoText={revInfoTell}></RevInfoArea>}
      {revSelectOrganizationViewPointed}
      {revCreateNewOrgFormPointed}
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
  revTagsListingWrapper: {marginTop: 2},
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
  revAddedMediaTell: {
    marginTop: 4,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {RevTextInputWithCount} from '../../../../../rev_views/rev_input_form_views';
import {RevTextInputAreaWithCount} from '../../../../../rev_views/rev_input_form_views';
import {RevTagsInput} from '../../../../../rev_views/rev_input_form_views';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';

import {useRevCreateNewAdDetailsForm} from '../../../rev_actions/rev_create_new_ad_details_form_action';
import {useRevCreateNewTagFormAction} from '../../../../rev_plugin_tags/rev_actions/rev_create_new_tag_form_action';

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

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);

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
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            <FontAwesome name="camera" />
            <FontAwesome name="long-arrow-right" /> Ad pics
          </Text>
          <TouchableOpacity style={[styles.revAddMeadiaTab]}>
            <FontAwesome
              name="plus"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtSmall,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddedMediaTell,
            ]}>
            You have 0 Ad pictures. You can upload up to 22
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
          <TouchableOpacity style={[styles.revAddMeadiaTab]}>
            <FontAwesome
              name="plus"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtSmall,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddedMediaTell,
            ]}>
            You haven't uploaded a video for this Ad yet
          </Text>
        </View>
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

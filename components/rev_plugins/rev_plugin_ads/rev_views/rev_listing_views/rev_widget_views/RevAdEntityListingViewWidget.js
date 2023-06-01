import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

const {RevPersLibRead_React} = NativeModules;

import {
  useRevPersGetRevEnty_By_EntityGUID,
  useRevGetEntityPictureAlbums,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revPersGetRevEntities_By_EntityGUIDsArr} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {
  RevCenteredImage,
  RevSectionPointedContent,
  RevInfoArea,
} from '../../../../../rev_views/rev_page_views';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {
  revStringEmpty,
  revTruncateString,
} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevAdEntityListingViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const handleRevCreateNewAdTabPressed = () => {
    let revCreateNewAdForm = revPluginsLoader({
      revPluginName: 'rev_plugin_ads',
      revViewName: 'RevCreateNewAdForm',
      revVarArgs: {},
    });

    SET_REV_SITE_BODY(revCreateNewAdForm);
  };

  let revAdHeaderView = () => {
    return (
      <View style={[revSiteStyles.revFlexWrapper, styles.revAdHeaderWrapper]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          Promoted
        </Text>

        <TouchableOpacity
          onPress={handleRevCreateNewAdTabPressed}
          style={[styles.revAddAdTab]}>
          <FontAwesome
            name="plus"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRevCreateNewAdTabPressed}
          style={[styles.revAddAdTab]}>
          <FontAwesome
            name="flag-o"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  let revNullAdRetView = (
    <View style={revSiteStyles.revFlexContainer}>
      {revAdHeaderView()}

      <View style={revSiteStyles.revFlexWrapper}>
        <RevSectionPointedContent
          revContent={<RevInfoArea revInfoText={'Error Loading Ad'} />}
          revStyles={{
            marginTop: 10,
            with: '100%',
          }}
        />
      </View>
    </View>
  );

  if (revIsEmptyJSONObject(revVarArgs)) {
    return <>{revNullAdRetView}</>;
  }

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !('revData' in revVarArgs) ||
    revIsEmptyJSONObject(revVarArgs.revData)
  ) {
    return <>{revNullAdRetView}</>;
  }

  const {revData} = revVarArgs;

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const {revGetEntityPictureAlbums} = useRevGetEntityPictureAlbums();

  if (!('_revEntityGUID' in revData || revIsEmptyVar(revData._revEntityGUID))) {
    return <>{revNullAdRetView}</>;
  }

  let revAdEntityGUID = revData._revEntityGUID;

  if (revAdEntityGUID < 1) {
    return <>{revNullAdRetView}</>;
  }

  const revSettings = require('../../../../../../rev_res/rev_settings.json');

  let revInfoEntity = revData._revInfoEntity;

  let revAdTitleTxtVal = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_entity_name_val',
  );

  let revAdDescriptionTxtVal = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_entity_desc_val',
  );

  let revMainCampaignIconPath = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'revMainCampaignIconPath',
  );

  let revAdPicsArr = revGetEntityPictureAlbums(revAdEntityGUID);

  if (
    revStringEmpty(revAdTitleTxtVal) ||
    revStringEmpty(revAdDescriptionTxtVal) ||
    revStringEmpty(revMainCampaignIconPath) ||
    !revAdPicsArr.length
  ) {
    return <>{revNullAdRetView}</>;
  }

  let revOrganizationGUID =
    RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      'rev_organization_of',
      revAdEntityGUID,
    );

  if (revOrganizationGUID < 1) {
    return <>{revNullAdRetView}</>;
  }

  let revOrganizationEntity =
    revPersGetRevEnty_By_EntityGUID(revOrganizationGUID);
  let revOrganizationEntityInfo = revOrganizationEntity._revInfoEntity;

  let revOrganizationEntityTitleTxtVal = revGetMetadataValue(
    revOrganizationEntityInfo._revEntityMetadataList,
    'rev_entity_name_val',
  );

  let revLikeInlineForm = revPluginsLoader({
    revPluginName: 'rev_plugin_likes',
    revViewName: 'RevLikeInlineForm',
    revVarArgs: revData,
  });

  // Get TAGS
  let revTagEntityGUIDsStr =
    RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_tag_of',
      revOrganizationEntity._revEntityGUID,
    );

  let revTagEntitiesArr = revPersGetRevEntities_By_EntityGUIDsArr(
    JSON.parse(revTagEntityGUIDsStr),
  );

  let revTagEntitiesInlineListing = revPluginsLoader({
    revPluginName: 'rev_plugin_tags',
    revViewName: 'RevTagEntitiesInlineListing',
    revVarArgs: {revTagItemsArr: revTagEntitiesArr},
  });

  return (
    <View
      key={
        'RevAdEntityListingViewWidget_' +
        revAdEntityGUID +
        '_' +
        revGetRandInteger()
      }
      style={[revSiteStyles.revFlexContainer]}>
      {revAdHeaderView()}
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revAdPublisherInfoWrapper,
        ]}>
        <View style={[styles.revPublisherIconContainer]}>
          <RevCenteredImage
            revImageURI={revMainCampaignIconPath}
            revImageDimens={{revWidth: 25, revHeight: 22}}
          />
        </View>
        <TouchableOpacity
          style={[
            revSiteStyles.revFlexContainer,
            styles.revAdContentBodyContainer,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny,
              styles.revPublisherInfoDescWrapper,
            ]}>
            {revOrganizationEntityTitleTxtVal}
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtTiny,
              styles.revAdDescTxt,
            ]}>
            {revTruncateString(revAdTitleTxtVal, 140)}
          </Text>
          <View style={[styles.revAdMeadia]}>
            <RevCenteredImage
              revImageURI={revMainCampaignIconPath}
              revImageDimens={{revWidth: '100%', revHeight: 55}}
            />
          </View>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revPostTagsListWrapper,
            ]}>
            <FontAwesome
              name="hashtag"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
                {marginLeft: 2},
              ]}
            />

            {revTagEntitiesInlineListing}
          </View>

          {revLikeInlineForm}
        </TouchableOpacity>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revAdHeaderWrapper: {
    alignItems: 'center',
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
  },
  revAddAdTab: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 17,
  },
  revAdPublisherInfoWrapper: {
    marginLeft: 0,
  },
  revPublisherIconContainer: {
    marginTop: -1,
  },
  revPostTagsListWrapper: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  revAdContentBodyContainer: {
    width: maxChatMessageContainerWidth - 12,
    marginLeft: 10,
  },
  revPublisherInfoDescWrapper: {
    marginTop: 2,
  },
  revAdDescTxt: {
    marginTop: 2,
  },
  revAdMeadia: {
    backgroundColor: '#F7F7F7',
    height: 55,
    marginTop: 4,
  },
});

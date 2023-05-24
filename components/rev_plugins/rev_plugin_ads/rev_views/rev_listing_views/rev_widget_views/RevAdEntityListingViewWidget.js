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

import {
  RevScrollView_H,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

const {RevPersLibRead_React} = NativeModules;

import {
  useRevPersGetRevEnty_By_EntityGUID,
  useRevGetEntityPictureAlbums,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevAdEntityListingViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  if (revIsEmptyJSONObject(revVarArgs) || !('revData' in revVarArgs)) {
    return null;
  }

  const {revData} = revVarArgs;

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const {revGetEntityPictureAlbums} = useRevGetEntityPictureAlbums();

  if (!('_revEntityGUID' in revData || revIsEmptyVar(revData._revEntityGUID))) {
    return null;
  }

  let revAdEntityGUID = revData._revEntityGUID;

  if (revAdEntityGUID < 1) {
    return null;
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

  if (!revAdTitleTxtVal || !revAdDescriptionTxtVal) {
    return null;
  }

  let revEntityPictureAlbumsArr = revGetEntityPictureAlbums(revAdEntityGUID);
  let revPicsArray = revEntityPictureAlbumsArr[0].revPicsArray;

  let revOrgMainPicURI = revGetMetadataValue(
    revPicsArray[0]._revEntityMetadataList,
    'rev_remote_file_name',
  );
  revOrgMainPicURI =
    'file:///' + revSettings.revPublishedMediaDir + '/' + revOrgMainPicURI;

  let revOrganizationGUID =
    RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      'rev_organization_of',
      revAdEntityGUID,
    );

  if (revOrganizationGUID < 1) {
    return null;
  }

  let revOrganizationEntity =
    revPersGetRevEnty_By_EntityGUID(revOrganizationGUID);
  let revOrganizationEntityInfo = revOrganizationEntity._revInfoEntity;

  let revOrganizationEntityTitleTxtVal = revGetMetadataValue(
    revOrganizationEntityInfo._revEntityMetadataList,
    'rev_entity_name_val',
  );

  let RevLikes = () => {
    return (
      <View
        key={revGetRandInteger(100, 1000)}
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revLikesTabsWrapper,
        ]}>
        <TouchableOpacity key={revGetRandInteger(100, 1000)}>
          <FontAwesome
            name="arrow-up"
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              revSiteStyles.revSiteTxtTiny,
              styles.revLikesTab,
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorBlueLink,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          {revGetRandInteger(1, 100)}
        </Text>
        <TouchableOpacity key={revGetRandInteger(100, 1000)}>
          <FontAwesome
            name="arrow-down"
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              revSiteStyles.revSiteTxtTiny,
              styles.revLikesTab,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  let revPostTagsArr = [1, 2, 3, 4];

  let RevPostTagItem = () => {
    return (
      <TouchableOpacity key={revGetRandInteger(100, 1000)}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revPostTagsListItem,
          ]}>
          hello_world
        </Text>
      </TouchableOpacity>
    );
  };

  let revCommentUsersArr = [1, 2, 3, 4, 5];

  const RevCommentEntityIcon = () => {
    return (
      <TouchableOpacity key={'RevCommentEntityIcon_' + revGetRandInteger()}>
        <View style={[styles.revCommentUserIcon]}>
          <RevCenteredImage
            revImageURI={revOrgMainPicURI}
            revImageDimens={{revWidth: 20, revHeight: 20}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const handleRevCreateNewAdTabPressed = () => {
    let revCreateNewAdForm = revPluginsLoader({
      revPluginName: 'rev_plugin_ads',
      revViewName: 'RevCreateNewAdForm',
      revVarArgs: {},
    });

    SET_REV_SITE_BODY(revCreateNewAdForm);
  };

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
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
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revAdPublisherInfoWrapper,
        ]}>
        <View style={[styles.revPublisherIconContainer]}>
          <RevCenteredImage
            revImageURI={revOrgMainPicURI}
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
              revImageURI={revOrgMainPicURI}
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
            <View style={[revSiteStyles.revFlexWrapper]}>
              {revPostTagsArr.map(revItem => {
                let revKey =
                  'RevPostTagItem_' +
                  revItem +
                  '_' +
                  revGetRandInteger(10, 1000);
                return <RevPostTagItem key={revKey} />;
              })}
            </View>
          </View>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revAdStatsFooterWrapper,
            ]}>
            <RevLikes key={'RevLikes_' + revGetRandInteger()} />
            <View style={[revSiteStyles.revFlexWrapper_WidthAuto, {flex: 1}]}>
              <RevScrollView_H
                revScrollViewContent={revCommentUsersArr.map(
                  revCommentEntity => {
                    return (
                      <RevCommentEntityIcon
                        key={
                          revCommentEntity +
                          'RevCommentEntityIcon_' +
                          revGetRandInteger()
                        }
                      />
                    );
                  },
                )}
              />
            </View>
            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                {
                  flex: 0,
                  alignItems: 'center',
                  marginRight: 'auto',
                  paddingHorizontal: 12,
                },
              ]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorBlueLink,
                  revSiteStyles.revSiteTxtTiny,
                ]}>
                View all
              </Text>
              <FontAwesome
                name="long-arrow-right"
                style={[
                  revSiteStyles.revSiteTxtColorBlueLink,
                  revSiteStyles.revSiteTxtTiny,
                  {marginLeft: 2},
                ]}
              />
            </View>
          </View>
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
  revPostTagsListItem: {
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 4,
  },
  revAdStatsFooterWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  revLikesArea: {
    marginLeft: -6,
  },
  revLikesTabsWrapper: {
    flex: 0,
    alignItems: 'center',
    marginLeft: -6,
  },
  revLikesTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  revCommentUserIcon: {
    backgroundColor: '#F7F7F7',
    width: 20,
    height: 20,
    marginLeft: 2,
    borderRadius: 7,
    overflow: 'hidden',
  },
});

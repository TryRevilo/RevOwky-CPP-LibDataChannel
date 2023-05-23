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

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

export const RevAdEntityListingViewWidget = ({revVarArgs}) => {
  let revData = revVarArgs.revData;

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  let revAdEntityGUID = revData._revEntityGUID;
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

  let revOrganizationGUID =
    RevPersLibRead_React.revPersGetSubjectGUID_BY_RelStr_TargetGUID(
      'rev_organization_of',
      revAdEntityGUID,
    );

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
        style={[styles.revFlexWrapper, styles.revLikesTabsWrapper]}>
        <TouchableOpacity key={revGetRandInteger(100, 1000)}>
          <FontAwesome name="arrow-up" style={styles.revLikesTab} />
        </TouchableOpacity>
        <Text style={styles.revLikesText}>{revGetRandInteger(1, 100)}</Text>
        <TouchableOpacity key={revGetRandInteger(100, 1000)}>
          <FontAwesome name="arrow-down" style={styles.revLikesTab} />
        </TouchableOpacity>
      </View>
    );
  };

  let revPostTagsArr = [1, 2, 3, 4];

  let RevPostTagItem = () => {
    return (
      <TouchableOpacity key={revGetRandInteger(100, 1000)}>
        <Text style={styles.revPostTagsListItem}>hello_world</Text>
      </TouchableOpacity>
    );
  };

  let revCommentUsersArr = [1, 2, 3, 4, 5, 6, 7];

  const RevCommentEntityIcon = () => {
    return (
      <TouchableOpacity key={revGetRandInteger(100, 1000)}>
        <View style={[styles.revCommentUserIcon]}></View>
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
    <View style={[styles.revFlexContainer]}>
      <View style={[styles.revFlexWrapper, styles.revAdHeaderWrapper]}>
        <Text style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}>
          Promoted
        </Text>

        <TouchableOpacity
          onPress={handleRevCreateNewAdTabPressed}
          style={[styles.revAddAdTab]}>
          <FontAwesome
            name="plus"
            style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRevCreateNewAdTabPressed}
          style={[styles.revAddAdTab]}>
          <FontAwesome
            name="flag-o"
            style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.revFlexWrapper, styles.revAdPublisherInfoWrapper]}>
        <View style={styles.revPublisherIcon}></View>
        <TouchableOpacity
          style={[styles.revFlexContainer, styles.revAdContentBodyContainer]}>
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteFontBold,
              styles.revSiteTxtSmall,
              styles.revPublisherInfoDescWrapper,
            ]}>
            {revOrganizationEntityTitleTxtVal}
          </Text>
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteTxtTiny,
              styles.revSiteTxtColorLight,
              styles.revAdDescTxt,
            ]}>
            {revTruncateString(revAdTitleTxtVal, 140)}
          </Text>
          <View style={[styles.revAdMeadia]}></View>
          <View style={[styles.revFlexWrapper, styles.revPostTagsListWrapper]}>
            <FontAwesome name="hashtag" style={styles.revPostTagsListIcon} />
            <View style={[styles.revFlexWrapper]}>
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
          <View style={[styles.revFlexWrapper, styles.revAdStatsFooterWrapper]}>
            <RevLikes />
            <TouchableOpacity>
              <Text
                style={[
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtTiny,
                  styles.revSiteTxtColorLight,
                  styles.revCommentsTxtCount,
                ]}>
                22 comments
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.revFlexWrapper, styles.revCommentUsersWrapper]}>
            {revCommentUsersArr.map(revCommentEntity => {
              return <RevCommentEntityIcon key={revCommentEntity} />;
            })}
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
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteFontBold: {
    fontWeight: '500',
  },
  revSiteTxtTiny: {
    fontSize: 9,
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
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
  revPublisherIcon: {
    backgroundColor: '#999',
    width: 22,
    height: 22,
    marginTop: -1,
  },
  revPostTagsListWrapper: {
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  revPostTagsListIcon: {
    color: '#999',
    fontSize: 10,
  },
  revAdContentBodyContainer: {
    width: maxChatMessageContainerWidth - 12,
    marginLeft: 17,
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
    color: '#999',
    fontSize: 10,
    lineHeight: 10,
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
    alignItems: 'center',
  },
  revLikesTab: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  revLikesText: {
    color: '#999',
    fontSize: 10,
  },
  revCommentsTxtCount: {
    marginLeft: 10,
  },
  revCommentUsersWrapper: {
    marginTop: 4,
  },
  revCommentUserIcon: {
    backgroundColor: '#F7F7F7',
    width: 20,
    height: 20,
    marginLeft: 2,
  },
});

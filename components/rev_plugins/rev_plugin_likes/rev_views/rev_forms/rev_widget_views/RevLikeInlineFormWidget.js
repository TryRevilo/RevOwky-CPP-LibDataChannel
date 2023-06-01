import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useContext, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

const {
  RevPersLibCreate_React,
  RevPersLibRead_React,
  RevPersLibUpdate_React,
  RevGenLibs_Server_React,
} = NativeModules;

import {
  RevScrollView_H,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

import {REV_METADATA_FILLER} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID} from '../../../../../rev_libs_pers/rev_pers_annotations/rev_read/RevPersReadAnnotationsCustomHooks';
import {useRevGetEntityPictureAlbums} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

import {revStringEmpty} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevLikeInlineFormAction} from '../../../rev_actions/rev_like_inline_form_action';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevLikeInlineFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();
  const revSettings = require('../../../../../../rev_res/rev_settings.json');

  revVarArgs = revVarArgs.revVarArgs;

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  if (revEntityGUID < 1) {
    return null;
  }

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  let revLikesStatsVal =
    RevPersLibRead_React.revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(
      'rev_tot_likes_stats',
      revEntityGUID,
    );

  console.log(
    revStringEmpty(revLikesStatsVal),
    '>>>',
    revEntityGUID,
    'revLikesStatsVal',
    revLikesStatsVal,
  );

  if (revStringEmpty(revLikesStatsVal)) {
    let revTotLikesStatsMetadata = REV_METADATA_FILLER(
      'rev_tot_likes_stats',
      '0',
    );
    revTotLikesStatsMetadata._revMetadataEntityGUID = revEntityGUID;

    let revTotLikesStatsMetadataID =
      RevPersLibCreate_React.revPersSaveEntityMetadataJSONStr(
        JSON.stringify(revTotLikesStatsMetadata),
      );

    console.log('>>> revTotLikesStatsMetadataID', revTotLikesStatsMetadataID);
  }

  const [revLikesCount, setRevLikesCount] = useState(
    revStringEmpty(revLikesStatsVal) ? 0 : revLikesStatsVal,
  );

  const {revLikeInlineFormAction} = useRevLikeInlineFormAction();

  const {revPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID} =
    useRevPersGetRevEntityAnn_By_AnnName_EntityGUID_OwnerGUID();
  const {revGetEntityPictureAlbums} = useRevGetEntityPictureAlbums();

  let revEntityPictureAlbumsArr = revGetEntityPictureAlbums(revEntityGUID);

  let revOrgMainPicURI = '';

  if (
    Array.isArray(revEntityPictureAlbumsArr) &&
    revEntityPictureAlbumsArr.length > 0
  ) {
    if (
      !revIsEmptyJSONObject(revEntityPictureAlbumsArr[0]) &&
      'revPicsArr' in revEntityPictureAlbumsArr[0]
    ) {
      let revPicsArray = revEntityPictureAlbumsArr[0].revPicsArray;

      revOrgMainPicURI = revGetMetadataValue(
        revPicsArray[0]._revEntityMetadataList,
        'rev_remote_file_name',
      );
      revOrgMainPicURI =
        'file:///' + revSettings.revPublishedMediaDir + '/' + revOrgMainPicURI;
    }
  }

  let revLikeEntityGUIDsArr = [];

  for (let i = 0; i < revGetRandInteger(0, 5); i++) {
    revLikeEntityGUIDsArr.push(i);
  }

  const RevUserEntityIcon = () => {
    return (
      <TouchableOpacity key={'RevUserEntityIcon_' + revGetRandInteger()}>
        <View style={[styles.revCommentUserIcon]}>
          <RevCenteredImage
            revImageURI={revOrgMainPicURI}
            revImageDimens={{revWidth: 20, revHeight: 20}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const handleRevLikeTabPressed = revLikeVal => {
    let revRetVal = revLikeInlineFormAction(
      'rev_like',
      revLikeVal,
      revVarArgs._revEntityGUID,
      REV_LOGGED_IN_ENTITY_GUID,
    );

    console.log('>>> ', revRetVal);

    if (revRetVal) {
      let revLikesStatsVal =
        RevPersLibRead_React.revGetRevEntityMetadataValue_By_RevMetadataName_RevEntityGUID(
          'rev_tot_likes_stats',
          revEntityGUID,
        );

      setRevLikesCount(revLikesStatsVal);
    }
  };

  let RevLikes = () => {
    return (
      <View
        key={revGetRandInteger(100, 1000)}
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revLikesTabsWrapper,
        ]}>
        <TouchableOpacity
          key={'RevLikes_' + revGetRandInteger(100, 1000)}
          onPress={() => {
            handleRevLikeTabPressed(1);
          }}>
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
          {revLikesCount}
        </Text>
        <TouchableOpacity
          key={'RevLikes_' + revGetRandInteger(100, 1000)}
          onPress={() => {
            handleRevLikeTabPressed(-1);
          }}>
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

  let revViewAllTab = (
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
  );

  return (
    <View
      key={'RevLikeInlineFormWidget_' + revGetRandInteger(10, 1000)}
      style={[revSiteStyles.revFlexWrapper, styles.revAdStatsFooterWrapper]}>
      <RevLikes key={'RevLikes_' + revGetRandInteger()} />
      <View style={[revSiteStyles.revFlexWrapper_WidthAuto, {flex: 1}]}>
        <RevScrollView_H
          revScrollViewContent={revLikeEntityGUIDsArr.map(revCommentEntity => {
            return (
              <RevUserEntityIcon
                key={
                  revCommentEntity + 'RevUserEntityIcon_' + revGetRandInteger()
                }
              />
            );
          })}
        />
      </View>

      {revLikeEntityGUIDsArr.length > 2 ? <>{revViewAllTab}</> : null}
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  revAdStatsFooterWrapper: {
    alignItems: 'center',
    marginTop: 4,
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

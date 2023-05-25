import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  RevScrollView_H,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {useRevGetEntityPictureAlbums} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevLikeInlineFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();
  const revSettings = require('../../../../../../rev_res/rev_settings.json');

  const {revGetEntityPictureAlbums} = useRevGetEntityPictureAlbums();

  let revEntityPictureAlbumsArr = revGetEntityPictureAlbums(100);
  let revPicsArray = revEntityPictureAlbumsArr[0].revPicsArray;

  let revOrgMainPicURI = revGetMetadataValue(
    revPicsArray[0]._revEntityMetadataList,
    'rev_remote_file_name',
  );
  revOrgMainPicURI =
    'file:///' + revSettings.revPublishedMediaDir + '/' + revOrgMainPicURI;

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
          {revLikeEntityGUIDsArr.length > 2
            ? revGetRandInteger(1, 100)
            : revLikeEntityGUIDsArr.length}
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

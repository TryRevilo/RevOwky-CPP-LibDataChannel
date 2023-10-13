import React, {useContext} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {
  revGetRandInteger,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

export const RevMembersListingItemWidget = ({revVarArgs}) => {
  if (revIsEmptyJSONObject(revVarArgs)) {
    return null;
  }

  let revOwkiMemberEntity = revVarArgs.revVarArgs;

  if (revIsEmptyJSONObject(revOwkiMemberEntity)) {
    return null;
  }

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revOwkiMemberEntity);

  if (revEntityGUID < 1) {
    return null;
  }

  if (!revOwkiMemberEntity.hasOwnProperty('_revInfoEntity')) {
    return null;
  }

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  let revUserTimeCreated = revOwkiMemberEntity._revTimeCreated;

  let revUserInfoEntity = revOwkiMemberEntity._revInfoEntity;

  let revUserEntityNames = revGetMetadataValue(
    revUserInfoEntity._revMetadataList,
    'rev_full_names',
  );
  let revUserEntityNames_Trunc = revTruncateString(revUserEntityNames, 22);

  const {revSiteStyles} = useRevSiteStyles();

  let revPostTagsArr = [1, 2, 3, 4];

  let RevPostTagItem = () => {
    let revKey = 'RevPostTagItem_' + revGetRandInteger(10, 1000);

    return (
      <TouchableOpacity key={revKey}>
        <Text style={styles.revPostTagsListItem}>hello_world</Text>
      </TouchableOpacity>
    );
  };

  const handleRevUserProfileClick = () => {
    let RevUserProfileObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_user_profile',
      revViewName: 'rev_object_views',
      revVarArgs: revOwkiMemberEntity,
    });

    SET_REV_SITE_BODY(RevUserProfileObjectView);
  };

  return (
    <View
      key={
        'RevMembersListingItemWidget_' +
        revEntityGUID +
        '_' +
        revGetRandInteger(10, 1000)
      }
      style={revSiteStyles.revFlexWrapper}>
      <TouchableOpacity
        onPress={() => {
          handleRevUserProfileClick();
        }}>
        <View style={styles.chatMsgUserIcon}>
          <FontAwesome name="user" style={styles.availableChatPeopleNonIcon} />
        </View>
      </TouchableOpacity>
      <View style={styles.chatMsgContentWrapper}>
        <View style={styles.chatMsgContentCarretView}>
          <FontAwesome name="caret-left" style={styles.chatMsgContentCarret} />
        </View>
        <View style={styles.chatMsgContentContainer}>
          <View style={styles.chatMsgHeaderWrapper}>
            <Text style={styles.chatMsgOwnerTxt}>
              {revUserEntityNames_Trunc}
            </Text>
            <Text style={styles.chatMsgSendTime}>
              {'joined ' + revUserTimeCreated}
            </Text>
            <View style={styles.chatMsgOptionsWrapper}>
              <Text style={styles.chatMsgOptions}>
                <FontAwesome name="flag-o" />
              </Text>
            </View>
          </View>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revPostTagsListWrapper,
            ]}>
            <FontAwesome name="hashtag" style={styles.revPostTagsListIcon} />
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
        </View>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revFlexWrapperTouchable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
  },
  chatMsgUserIcon: {
    width: 22,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableChatPeopleNonIcon: {
    color: '#c5e1a5',
    fontSize: 17,
  },
  chatMsgContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  chatMsgContentWrapperInbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 2,
  },
  chatMsgContentCarretView: {
    backgroundColor: '#FFF',
    height: 'auto',
    marginTop: 6,
    marginRight: 1,
    marginLeft: 1,
    zIndex: 1,
  },
  chatMsgContentCarret: {
    color: '#CCC',
    textAlign: 'center',
    fontSize: 15,
  },
  chatMsgContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: maxChatMessageContainerWidth - 7,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  chatMsgHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomColor: '#rgba(27, 31, 35, 0.06)',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginTop: 4,
    position: 'relative',
  },
  chatMsgOwnerTxt: {
    color: '#444',
    fontSize: 10,
    lineHeight: 10,
    fontWeight: 'bold',
  },
  chatMsgSendTime: {
    color: '#8d8d8d',
    fontSize: 9,
    lineHeight: 9,
    marginRight: 12,
    marginLeft: 5,
  },
  chatMsgOptionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
    position: 'relative',
  },
  chatMsgOptions: {
    color: '#bdbdbd',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  revPostTagsListWrapper: {
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  revPostTagsListIcon: {
    color: '#999',
    fontSize: 10,
  },
  revPostTagsListItem: {
    color: '#999',
    fontSize: 10,
    lineHeight: 10,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 4,
  },
  chatMsgContentTxtContainer: {
    color: '#444',
    fontSize: 10,
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingRight: 5,
    marginTop: 2,
  },
  chatMsgContentTxt: {
    color: '#444',
    fontSize: 10,
  },
  readMoreTextTab: {
    color: '#009688',
    fontWeight: 'bold',
    fontSize: 9,
    width: 'auto',
    paddingTop: 5,
  },
  revLikesArea: {
    marginLeft: -6,
  },
  revLikesTabsWrapper: {
    alignItems: 'center',
    marginTop: 4,
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
  revCommentsContainer: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 3,
    paddingVertical: 5,
    marginTop: 8,
    marginHorizontal: -4,
  },
  revPostCommentTab: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 9,
    backgroundColor: '#FFF',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  revCommentItemWrapper: {
    marginTop: 4,
  },
  revCommentMsgUserIcon: {
    width: 17,
    height: 27,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revChatCommentNonIcon: {
    color: '#c5e1a5',
    fontSize: 15,
  },
  revChatMsgCommentContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: maxChatMessageContainerWidth - 32,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  revChatMsgCommentContentTxtContainer: {
    color: '#444',
    fontSize: 8,
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingRight: 5,
    marginTop: 2,
  },
  revChatMsgCommentContentTxt: {
    color: '#444',
    fontSize: 9,
  },
  revImagesMediaViewContainer: {
    flex: 1,
    marginTop: 7,
    borderRadius: 3,
    overflow: 'hidden',
  },
  revProfileImagesScroller: {
    backgroundColor: '#444',
    flexGrow: 0,
    marginBottom: 1,
  },
  revProfileMediaWrapper: {
    alignItems: 'center',
  },
  revImageTouchableOpacity: {
    backgroundColor: '#444',
    borderStyle: 'solid',
    borderRightColor: '#FFFFFF',
    borderRightWidth: 1,
  },
  revEntityImageStyle: {
    width: 75,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revVideoPlayerContainer: {
    height: 'auto',
  },
});

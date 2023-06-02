import React, {useContext, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {RevReadMoreTextView} from '../../../../../rev_views/rev_page_views';

import {
  revIsEmptyJSONObject,
  revIsEmptyVar,
  revGetRandInteger,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {
  revGetLocal_OR_RemoteGUID,
  revGetEntityChildren_By_Subtype,
} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {
  revTruncateString,
  revSplitStringToArray,
} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {revFormatLongDate} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {
  useRevPersGetRevEnty_By_EntityGUID,
  revPersGetRevEntities_By_EntityGUIDsArr,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {useRevDeleteEntity} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_update/rev_pers_entity';

const {RevPersLibRead_React} = NativeModules;

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
const revSettings = require('../../../../../../rev_res/rev_settings.json');

export const RevTaggedPostsListingItemWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  if (revEntityGUID < 1) {
    return null;
  }

  if (
    !revVarArgs.hasOwnProperty('_revPublisherEntity') ||
    revIsEmptyJSONObject(revVarArgs._revPublisherEntity)
  ) {
    return null;
  }

  let revPublisherEntity = revVarArgs._revPublisherEntity;

  if (revPublisherEntity._revEntityType !== 'rev_user_entity') {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    revPublisherEntity._revInfoEntity._revEntityMetadataList,
    'rev_full_names',
  );
  let revPublisherEntityNamesArr = revSplitStringToArray(
    revPublisherEntityNames,
  );
  let revPublisherEntityNamesFirst = revPublisherEntityNamesArr[0];
  let revPublisherEntityNamesSecondInitial =
    revPublisherEntityNamesArr[1].split('')[0];
  let revPublisherEntityNames_Trunc =
    revTruncateString(revPublisherEntityNamesFirst, 3, false) +
    ' .' +
    revPublisherEntityNamesSecondInitial;

  const [revIsCommetForm, setRevIsCommetForm] = useState(false);

  const {revDeleteEntity} = useRevDeleteEntity();

  if (
    !revVarArgs.hasOwnProperty('_revInfoEntity') ||
    revIsEmptyJSONObject(revVarArgs._revInfoEntity)
  ) {
    console.log('>>> revIsEmptyJSONObject(revInfoEntity) - TRUE \n');
    revDeleteEntity(revVarArgs);
    return null;
  }

  let revInfoEntity = revVarArgs._revInfoEntity;
  let revTimePublished = revFormatLongDate(revVarArgs._revTimePublished);

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY, revInitSiteModal, revCloseSiteModal} =
    useContext(ReViewsContext);

  let revMaxMessageLen = 200;

  let revKiwiTxtVal = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'revPostText',
  );

  if (!revKiwiTxtVal) {
    return null;
  }

  let revChatMessageText = _revKiwiTxtVal => {
    return (
      <View
        key={'revChatMessageText_' + revEntityGUID + '_' + revGetRandInteger()}
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revChatMsgContentTxtContainer,
        ]}>
        <RevReadMoreTextView
          revText={_revKiwiTxtVal}
          revMaxLength={revMaxMessageLen}
        />
      </View>
    );
  };

  let revTagEntitiesInlineListingView = () => {
    let revTagEntityGUIDsStr =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_tag_of',
        revEntityGUID,
      );

    let revTagEntitiesArr = revPersGetRevEntities_By_EntityGUIDsArr(
      JSON.parse(revTagEntityGUIDsStr),
    );

    if (!revTagEntitiesArr.length) {
      return null;
    }

    let revTagEntitiesInlineListing = revPluginsLoader({
      revPluginName: 'rev_plugin_tags',
      revViewName: 'RevTagEntitiesInlineListing',
      revVarArgs: {revTagItemsArr: []},
    });

    return (
      <>
        {revTagEntitiesInlineListing !== null ? (
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revPostTagsListWrapper,
            ]}>
            <FontAwesome name="hashtag" style={styles.revPostTagsListIcon} />

            {revTagEntitiesInlineListing}
          </View>
        ) : null}
      </>
    );
  };

  let revLikeInlineForm = revPluginsLoader({
    revPluginName: 'rev_plugin_likes',
    revViewName: 'RevLikeInlineForm',
    revVarArgs: revVarArgs,
  });

  let RevCommentItem = ({revVarArgs}) => {
    if (
      !revVarArgs.hasOwnProperty('_revInfoEntity') ||
      revIsEmptyJSONObject(revVarArgs._revInfoEntity)
    ) {
      return null;
    }

    let revCommentInfoEntity = revVarArgs._revInfoEntity;

    let revCommentTxtVal = revGetMetadataValue(
      revCommentInfoEntity._revEntityMetadataList,
      'rev_comment_value',
    );

    if (revIsEmptyVar(revCommentTxtVal)) {
      return null;
    }

    if (
      !revVarArgs.hasOwnProperty('_revPublisherEntity') ||
      revIsEmptyJSONObject(revVarArgs._revPublisherEntity)
    ) {
      return null;
    }

    let revPublisherEntity = revVarArgs._revPublisherEntity;

    if (revPublisherEntity._revEntityType !== 'rev_user_entity') {
      return null;
    }

    let revPublisherEntityNames = revGetMetadataValue(
      revPublisherEntity._revInfoEntity._revEntityMetadataList,
      'rev_full_names',
    );
    let revPublisherEntityNames_Trunc = revTruncateString(
      revSplitStringToArray(revPublisherEntityNames)[0],
      3,
      false,
    );

    return (
      <TouchableOpacity
        key={'RevCommentItem_' + revGetRandInteger(100, 1000)}
        style={[revSiteStyles.revFlexWrapper, styles.revCommentItemWrapper]}>
        <TouchableOpacity>
          <View style={styles.revCommentMsgUserIcon}>
            <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
          </View>
        </TouchableOpacity>
        <View style={styles.revChatMsgCommentContentContainer}>
          <View style={styles.chatMsgHeaderWrapper}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorDark,
                revSiteStyles.revSiteTxtTiny,
                revSiteStyles.revSiteTxtBold,
              ]}>
              {revPublisherEntityNames_Trunc}
            </Text>
            <Text
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny_X,
                styles.revChatMsgSendTime,
              ]}>
              {revFormatLongDate(revVarArgs._revTimePublished)}
            </Text>
            <View style={styles.chatMsgOptionsWrapper}>
              <FontAwesome
                name="retweet"
                style={[revSiteStyles.revSiteTxtSmall, styles.chatMsgOptions]}
              />

              <FontAwesome
                name="flag-o"
                style={[revSiteStyles.revSiteTxtSmall, styles.chatMsgOptions]}
              />
              <FontAwesome
                name="list"
                style={[revSiteStyles.revSiteTxtSmall, styles.chatMsgOptions]}
              />
            </View>
          </View>
          <View
            style={[
              revSiteStyles.revFlexContainer,
              styles.revChatMsgCommentContentTxtContainer,
            ]}>
            {revChatMessageText(revCommentTxtVal)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RevCreateImagesMediaView = revPicsAlbum => {
    let revImagesViews = [];

    let revPicsArr = revPicsAlbum._revEntityChildrenList;

    for (let i = 0; i < revPicsArr.length; i++) {
      let revPic = revPicsArr[i];

      let revEntityImageURI = revGetMetadataValue(
        revPic._revEntityMetadataList,
        'rev_remote_file_name',
      );

      if (revVarArgs.hasOwnProperty('_fromRemote')) {
        revEntityImageURI =
          'file://' +
          revSettings.revPublishedMediaDir +
          '/' +
          revEntityImageURI;
      } else {
        revEntityImageURI =
          revSettings.revSiteUploadDirURL + '/' + revEntityImageURI;
      }

      let revLastImageStyle =
        i == revPicsArr.length - 1
          ? {
              borderRightWidth: 0,
            }
          : null;

      let revImageEntityGUID = revGetLocal_OR_RemoteGUID(revPic);

      let RevImage = (
        <TouchableOpacity
          key={
            'RevImage_' + revImageEntityGUID + '_' + revGetRandInteger(10, 1000)
          }
          style={[styles.revImageTouchableOpacity, revLastImageStyle]}>
          <Image
            style={styles.revEntityImageStyle}
            source={{
              uri: revEntityImageURI,
            }}
          />
        </TouchableOpacity>
      );

      revImagesViews.push(RevImage);
    }

    let RevRetView =
      revImagesViews.length < 1 ? null : (
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.revProfileImagesScroller}>
          <View style={[revSiteStyles.revFlexWrapper]}>
            {revImagesViews.map(RevImage => {
              return RevImage;
            })}
          </View>
        </ScrollView>
      );

    return RevRetView;
  };

  let RevImagesMediaView = null;

  if (revVarArgs.hasOwnProperty('_revEntityChildrenList')) {
    let revPicsAlbumArr = revGetEntityChildren_By_Subtype(
      revVarArgs._revEntityChildrenList,
      'rev_pics_album',
    );

    if (revPicsAlbumArr && revPicsAlbumArr.length) {
      RevImagesMediaView = RevCreateImagesMediaView(revPicsAlbumArr[0]);
    }
  }

  const RevVideoPlayer = () => {
    let revVidPathsArr = [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      // '/storage/emulated/0/Documents/Owki/rev_sample_media/1.mp4',
      // '/storage/emulated/0/Documents/Owki/rev_sample_media/2.mp4',
      // '/storage/emulated/0/Documents/Owki/rev_sample_media/3.mp4',
      // '/storage/emulated/0/Documents/Owki/rev_sample_media/4.mp4',
      // '/storage/emulated/0/Documents/Owki/rev_sample_media/5.mp4',
      // '/storage/emulated/0/Documents/Owki/rev_sample_media/6.mp4',
    ];
    const randomIndex = Math.floor(Math.random() * revVidPathsArr.length);
    const randomElement = revVidPathsArr[randomIndex];

    let RevCustomVideoPlayer = revPluginsLoader({
      revPluginName: 'rev_plugin_video',
      revViewName: 'RevCustomVideoPlayer',
      revVarArgs: {
        revURL: randomElement,
      },
    });

    return null; // RevCustomVideoPlayer;
  };

  let RevVideoPlayerView = RevVideoPlayer();

  let RevGenComments = () => {
    let revCommentsArr = [];

    let revCommentGUIDsArrStr =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_comment',
        revEntityGUID,
      );

    let revCommentGUIDsArr = JSON.parse(revCommentGUIDsArrStr);

    for (let i = 0; i < revCommentGUIDsArr.length; i++) {
      let revCurrCommentGUID = revCommentGUIDsArr[i];

      let revCurrCommentStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revCurrCommentGUID);
      let revCurrComment = JSON.parse(revCurrCommentStr);

      let revCommentPublisher = revPersGetRevEnty_By_EntityGUID(
        revCurrComment._revEntityOwnerGUID,
      );
      revCurrComment['_revPublisherEntity'] = revCommentPublisher;

      let revCommentView = <RevCommentItem revVarArgs={revCurrComment} />;

      if (revCommentView == null) {
        continue;
      }

      revCommentsArr.push(revCommentView);
    }

    return (
      <View>
        {revCommentsArr.map(revItem => {
          return (
            <View
              key={'RevGenComments_' + revItem + revGetRandInteger(10, 1000)}>
              {revItem}
            </View>
          );
        })}
      </View>
    );
  };

  const handleRevUserProfileClick = () => {
    let RevUserProfileObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_user_profile',
      revViewName: 'rev_object_views',
      revVarArgs: {revEntity: revPublisherEntity},
    });

    SET_REV_SITE_BODY(RevUserProfileObjectView);
  };

  const handleRevTaggedPostLongPressed = _revVarArgs => {
    let RevKiwiObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'rev_object_views',
      revVarArgs: revVarArgs,
    });

    if (RevKiwiObjectView) {
      SET_REV_SITE_BODY(RevKiwiObjectView);
    } else {
      console.log('Error openning object');
    }
  };

  const handleRevCommentFormPressed = () => {
    setRevIsCommetForm(true);
  };

  const handleRevOnFlagTabPressed = () => {
    let revFlagForm = revPluginsLoader({
      revPluginName: 'rev_flag',
      revViewName: 'RevFlagForm',
      revVarArgs: {revCancelFlag: revCloseSiteModal},
    });

    revInitSiteModal(revFlagForm);
  };

  const revGetCommentForm = () => {
    let RevKiwiObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_comments',
      revViewName: 'RevCommentForm',
      revVarArgs: {
        revEntity: revVarArgs,
        revIsCommentUpdate: false,
        revCancel: () => {
          setRevIsCommetForm(false);
        },
      },
    });

    return RevKiwiObjectView;
  };

  return (
    <TouchableOpacity
      key={
        'RevTaggedPostsListingItemWidget_' +
        revEntityGUID +
        '_' +
        revGetRandInteger(10, 1000)
      }
      onLongPress={() => {
        handleRevTaggedPostLongPressed(revVarArgs);
      }}>
      <View style={revSiteStyles.revFlexWrapper}>
        <TouchableOpacity
          onPress={() => {
            handleRevUserProfileClick();
          }}>
          <View style={styles.revChatMsgUserIcon}>
            <FontAwesome
              name="user"
              style={styles.revAvailableChatPeopleNonIcon}
            />
          </View>
        </TouchableOpacity>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revChatMsgContentWrapper,
          ]}>
          <View style={styles.chatMsgContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtLarge,
                styles.chatMsgContentCarret,
              ]}
            />
          </View>
          <View style={styles.chatMsgContentContainer}>
            <View style={styles.chatMsgHeaderWrapper}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorDark,
                  revSiteStyles.revSiteTxtTiny,
                  revSiteStyles.revSiteTxtBold,
                ]}>
                {revPublisherEntityNames_Trunc}
              </Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny_X,
                  styles.revChatMsgSendTime,
                ]}>
                {revTimePublished}
              </Text>
              <View style={styles.chatMsgOptionsWrapper}>
                <FontAwesome
                  name="retweet"
                  style={[revSiteStyles.revSiteTxtSmall, styles.chatMsgOptions]}
                />

                <TouchableOpacity onPress={handleRevOnFlagTabPressed}>
                  <FontAwesome
                    name="flag-o"
                    style={[
                      revSiteStyles.revSiteTxtSmall,
                      styles.chatMsgOptions,
                    ]}
                  />
                </TouchableOpacity>

                <FontAwesome
                  name="list"
                  style={[revSiteStyles.revSiteTxtSmall, styles.chatMsgOptions]}
                />
              </View>
            </View>

            {revTagEntitiesInlineListingView()}

            {revChatMessageText(revKiwiTxtVal)}

            <View
              style={[
                RevImagesMediaView || RevVideoPlayerView
                  ? styles.revImagesMediaViewContainer
                  : null,
              ]}>
              {RevImagesMediaView}
              {RevVideoPlayerView}
            </View>

            {revLikeInlineForm}

            <View
              style={[
                revSiteStyles.revFlexContainer,
                styles.revCommentsContainer,
              ]}>
              {revIsCommetForm ? (
                revGetCommentForm()
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleRevCommentFormPressed();
                  }}>
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtColorLight,
                      revSiteStyles.revSiteTxtBold,
                      revSiteStyles.revSiteTxtTiny,
                      styles.revPostCommentTab,
                    ]}>
                    your comment
                  </Text>
                </TouchableOpacity>
              )}

              <RevGenComments />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revChatMsgUserIcon: {
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
  revAvailableChatPeopleNonIcon: {
    color: '#c5e1a5',
    fontSize: 17,
  },
  revChatMsgContentWrapper: {
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
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
    textAlign: 'center',
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
  revChatMsgSendTime: {
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
  revChatMsgContentTxtContainer: {
    paddingRight: 5,
    marginTop: 2,
  },
  revCommentsContainer: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 3,
    paddingVertical: 5,
    marginTop: 8,
    marginHorizontal: -4,
  },
  revPostCommentTab: {
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
    paddingRight: 5,
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

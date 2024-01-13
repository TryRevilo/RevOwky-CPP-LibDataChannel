import React, {useContext, useState, useEffect} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {setMessage} from '../../../../../../rev_contexts/rev_redux/rev_reducers/revNewConnReqsArrReducer';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {
  RevReadMoreTextView,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {
  revGetLocal_OR_RemoteGUID,
  revGetEntityChildren_By_Subtype,
} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {
  revTruncateFullNamesString,
  revStringEmpty,
} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {revFormatLongDate} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {
  revPersGetRevEntities_By_EntityGUIDsArr,
  useRevGetEntityIcon,
} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {useRevDeleteEntity} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_update/rev_pers_entity';

const {RevPersLibRead_React} = NativeModules;

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {incrementCounter} from '../../../../../../rev_contexts/rev_redux/rev_reducers/counterReducer';
const revSettings = require('../../../../../../rev_res/rev_settings.json');

export const RevTaggedPostsListingItemWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  if (revEntityGUID < 1) {
    return null;
  }

  const {_revPublisherEntity: revPublisherEntity = {}} = revVarArgs;

  if (revIsEmptyJSONObject(revPublisherEntity)) {
    return null;
  }

  const {revGetEntityIcon} = useRevGetEntityIcon();

  let revPublisherInfoEntity = revPublisherEntity._revInfoEntity;
  let revPublisherInfoEntityMetadataList =
    revPublisherInfoEntity._revMetadataList;

  if (revPublisherEntity._revType !== 'rev_user_entity') {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    revPublisherInfoEntityMetadataList,
    'rev_entity_name',
  );

  let revPublisherEntityNames_Trunc = revTruncateFullNamesString(
    revPublisherEntityNames,
  );

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

  let revTimePublished = revFormatLongDate(revVarArgs._revTimeCreated);

  const {SET_REV_SITE_BODY, revInitSiteModal, revCloseSiteModal} =
    useContext(ReViewsContext);

  let revMaxMessageLen = 200;

  let revKiwiTxtVal = revGetMetadataValue(
    revInfoEntity._revMetadataList,
    'rev_entity_desc',
  );

  if (!revKiwiTxtVal) {
    return null;
  }

  let revTagEntitiesInlineListingView = () => {
    let revTagEntityGUIDsStr =
      RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
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

  const RevCreateImagesMediaView = revPicsAlbum => {
    let revImagesViews = [];

    let revPicsArr = revPicsAlbum._revChildrenList;

    for (let i = 0; i < revPicsArr.length; i++) {
      const {_revInfoEntity = {}} = revPicsArr[i];

      if (!_revInfoEntity._revMetadataList) {
        continue;
      }

      let revEntityImageURI = revGetMetadataValue(
        _revInfoEntity._revMetadataList,
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
        i == revPicsArr.length - 1 ? {borderRightWidth: 0} : null;

      let revImage = (
        <TouchableOpacity
          style={[styles.revImageTouchableOpacity, revLastImageStyle]}>
          <Image
            style={styles.revEntityImageStyle}
            source={{
              uri: revEntityImageURI,
            }}
          />
        </TouchableOpacity>
      );

      revImagesViews.push(revImage);
    }

    let revRetView =
      revImagesViews.length < 1 ? null : (
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.revProfileImagesScroller}>
          <View style={[revSiteStyles.revFlexWrapper]}>
            {revImagesViews.map((revImage, index) => {
              return <View key={index}>{revImage}</View>;
            })}
          </View>
        </ScrollView>
      );

    return revRetView;
  };

  let revImagesMediaView = null;

  if (revVarArgs.hasOwnProperty('_revChildrenList')) {
    let revPicsAlbumArr = revGetEntityChildren_By_Subtype(
      revVarArgs._revChildrenList,
      'rev_pics_album',
    );

    if (revPicsAlbumArr && revPicsAlbumArr.length) {
      revImagesMediaView = RevCreateImagesMediaView(revPicsAlbumArr[0]);
    }
  }

  const RevVideoPlayer = () => {
    let revVidPathsArr = [
      '/storage/emulated/0/Documents/rev_sample_media/1.mp4',
    ];
    // const randomIndex = Math.floor(Math.random() * revVidPathsArr.length);
    // const randomElement = revVidPathsArr[randomIndex];

    let RevCustomVideoPlayer = revPluginsLoader({
      revPluginName: 'rev_plugin_video',
      revViewName: 'RevInlineVideoPlayer',
      revVarArgs: {
        revURL: revVidPathsArr[0],
      },
    });

    return RevCustomVideoPlayer;
  };

  let revVideoPlayerView = revEntityGUID % 3 == 0 ? RevVideoPlayer() : null;

  const handleRevUserProfileClick = () => {
    let RevUserProfileObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_user_profile',
      revViewName: 'rev_object_views',
      revVarArgs: {revEntity: revPublisherEntity},
    });

    SET_REV_SITE_BODY(RevUserProfileObjectView);
  };

  const [revPressing, setRevPressing] = useState(false);
  const [revLongPressTimeout, setRevLongPressTimeout] = useState(null);

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

  const handleRevPressIn = _revVarArgs => {
    setRevPressing(true);

    // Long press duration here (in milliseconds)
    const revCustomLongPressDuration = 2500;

    // Set a timeout to trigger the custom long press
    const revTimeoutId = setTimeout(() => {
      if (revPressing) {
        handleRevTaggedPostLongPressed(_revVarArgs);
      }
    }, revCustomLongPressDuration);

    setRevLongPressTimeout(revTimeoutId);
  };

  const handleRevPressOut = () => {
    setRevPressing(false);

    // Clear the timeout if the user releases the button before the custom duration
    clearTimeout(revLongPressTimeout);
  };

  const handleRevCommentFormPressed = () => {
    setRevIsCommetForm(true);
  };

  const handleRevOnFlagTabPressed = () => {
    let revCreateFlagForm = revPluginsLoader({
      revPluginName: 'rev_plugin_flag',
      revViewName: 'RevCreateFlagForm',
      revVarArgs: {revCancelFlag: revCloseSiteModal, revData: revVarArgs},
    });

    revInitSiteModal(<View style={{width: '100%'}}>{revCreateFlagForm}</View>);
  };

  const revGetCommentForm = () => {
    let RevKiwiObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_comments',
      revViewName: 'RevCommentForm',
      revVarArgs: {
        revEntity: revVarArgs,
        revContainerPublisherEntity: revPublisherEntity,
        revIsCommentUpdate: false,
        revCancel: () => {
          setRevIsCommetForm(false);
        },
      },
    });

    return RevKiwiObjectView;
  };

  let revContentBody = (
    <>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revChatMsgContentTxtContainer,
        ]}>
        <RevReadMoreTextView
          revText={revKiwiTxtVal}
          revMaxLength={revMaxMessageLen}
        />
      </View>

      <View
        style={[
          revImagesMediaView || revVideoPlayerView
            ? styles.revImagesMediaViewContainer
            : null,
        ]}>
        {revImagesMediaView}
        {revVideoPlayerView && (
          <View
            style={{
              flex: 0,
            }}>
            {revVideoPlayerView}
          </View>
        )}
      </View>
    </>
  );

  let revFlagEntityGUIDsStr =
    RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_flag_of',
      revEntityGUID,
    );

  let revFlagEntitiesArr = revPersGetRevEntities_By_EntityGUIDsArr(
    JSON.parse(revFlagEntityGUIDsStr),
  );

  const revFlagAreaView = () => {
    let revFlagItemView = revPluginsLoader({
      revPluginName: 'rev_plugin_flag',
      revViewName: 'RevFlagItemView',
      revVarArgs: {
        revFlagEntitiesArr: revFlagEntitiesArr,
        revContentView: revContentBody,
      },
    });

    return revFlagItemView;
  };

  const {revMainEntityIconLocalPath = ''} = revGetEntityIcon({
    revEntityGUID: -1, // revPublisherEntity._revGUID,
  });

  let revMainEntityIconView = !revStringEmpty(revMainEntityIconLocalPath) ? (
    <RevCenteredImage
      revImageURI={revMainEntityIconLocalPath}
      revImageDimens={{revWidth: 19, revHeight: 29}}
      revStyles={{borderRadius: 100}}
    />
  ) : (
    <FontAwesome name="user" style={styles.revAvailableChatPeopleNonIcon} />
  );

  const [revCommentsView, setRevCommentsView] = useState(null);

  const dispatch = useDispatch();
  const message = useSelector(state => state.message);
  const counter = useSelector(state => state.counter);

  const handleChangeMessage = () => {
    dispatch(setMessage(''));
    dispatch(incrementCounter());
  };

  useEffect(() => {
    let revCommentItemsListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_comments',
      revViewName: 'RevCommentItemsListingView',
      revVarArgs: revVarArgs,
    });

    setRevCommentsView(revCommentItemsListingView);
  }, []);

  return (
    <TouchableOpacity
      onLongPress={() => {
        // handleRevTaggedPostLongPressed(revVarArgs);
      }}
      onPress={handleChangeMessage}
      // onPressIn={handleRevPressIn}
      // onPressOut={handleChangeMessage}
    >
      <View style={revSiteStyles.revFlexWrapper}>
        <View style={styles.revChatMsgUserIcon}>
          <TouchableOpacity onPress={handleRevUserProfileClick}>
            {revMainEntityIconView}
          </TouchableOpacity>
        </View>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revChatMsgContentWrapper,
          ]}>
          <View style={styles.revChatMsgContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtLarge,
                styles.revChatMsgContentCarret,
              ]}
            />
          </View>
          <View style={styles.revChatMsgContentContainer}>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revChatMsgHeaderWrapper,
              ]}>
              <View
                style={[
                  revSiteStyles.revFlexWrapper_WidthAuto,
                  {alignItems: 'baseline'},
                ]}>
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
                  {revTimePublished + ' - ' + message + ' - ' + counter}
                </Text>
              </View>

              <View style={[styles.revChatMsgOptionsTabWrapper]}>
                <View
                  style={[
                    {
                      backgroundColor: '#DDD',
                      width: '100%',
                      position: 'relative',
                      height: 1,
                      top: '50%',
                    },
                  ]}
                />

                <View
                  style={[
                    revSiteStyles.revFlexWrapper_WidthAuto,
                    {alignItems: 'center', marginLeft: 8},
                  ]}>
                  <View
                    style={[
                      styles.revChatMsgOptionsTab,
                      {backgroundColor: '#F7F7F7'},
                    ]}>
                    <AntDesign
                      name="retweet"
                      style={[
                        revSiteStyles.revSiteTxtColorLight,
                        revSiteStyles.revSiteTxtNormal,
                      ]}
                    />
                  </View>

                  <View
                    style={[
                      styles.revChatMsgOptionsTab,
                      {backgroundColor: '#F7F7F7'},
                    ]}>
                    <TouchableOpacity onPress={handleRevOnFlagTabPressed}>
                      <MaterialIcons
                        name="emoji-flags"
                        style={[
                          revSiteStyles.revSiteTxtColorLight,
                          revSiteStyles.revSiteTxtSmall,
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {revTagEntitiesInlineListingView()}

            {revFlagEntitiesArr.length ? revFlagAreaView() : revContentBody}

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
                      revSiteStyles.revSiteTxtTiny_X,
                      styles.revPostCommentTab,
                    ]}>
                    your comment
                  </Text>
                </TouchableOpacity>
              )}

              {revCommentsView}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  revChatMsgUserIcon: {
    flex: 0,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  revAvailableChatPeopleNonIcon: {
    color: '#c5e1a5',
    fontSize: 17,
  },
  revChatMsgContentWrapper: {
    flex: 1,
    marginTop: 10,
    marginLeft: 3,
  },
  revChatMsgContentCarretView: {
    flex: 0,
    backgroundColor: '#FFF',
    height: 'auto',
  },
  revChatMsgContentCarret: {
    textAlign: 'center',
  },
  revChatMsgContentContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    marginTop: -2,
  },
  revChatMsgHeaderWrapper: {
    alignItems: 'center',
    marginBottom: 2,
  },
  revChatMsgSendTime: {
    marginRight: 12,
    marginLeft: 5,
  },
  revChatMsgOptionsTabWrapper: {
    width: 'auto',
    position: 'relative',
    top: -3,
    right: 7,
    marginLeft: 'auto',
  },
  revChatMsgOptionsTab: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 2,
    borderRadius: 32,
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
    paddingVertical: 7,
  },
  revCommentItemWrapper: {
    marginTop: 4,
  },
  revImagesMediaViewContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 7,
    borderRadius: 8,
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

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
import React, {useContext, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {
  revFormatLongDate,
  revGetRandInteger,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetEntityChildren_By_Subtype} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {
  revGenLoreumIpsumText,
  revTruncateString,
} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {RevReadMoreTextView} from '../../../../../rev_views/rev_page_views';
import RevChatMessageOptions from '../../../../rev_plugin_text_chat/rev_views/RevChatMessageOptions';

const {RevPersLibRead_React} = NativeModules;

const revSettings = require('../../../../../../rev_res/rev_settings.json');

export const RevKiwiObjectWidgetView = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

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
  let revPublisherEntityNames_Trunc = revTruncateString(
    revPublisherEntityNames,
    22,
  );

  let revInfoEntity = revVarArgs._revInfoEntity;
  let revTimeCreated = revVarArgs._revTimeCreated;

  const [revIsEditting, setRevIsEditting] = useState(false);

  let revMaxMessageLen = 200;

  let chatMsg = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'revPostText',
  );

  if (!chatMsg) {
    return null;
  }

  const revChatMsgOptionsStylesArr = [
    revSiteStyles.revSiteTxtColorLight,
    revSiteStyles.revSiteTxtTiny,
    styles.revChatMsgOptions,
  ];

  let revPostTagsArr = [1, 2, 3, 4];

  let RevPostTagItem = () => {
    return (
      <TouchableOpacity key={revGetRandInteger(100, 1000)}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny_X,
            styles.revPostTagsListItem,
          ]}>
          hello_world
        </Text>
      </TouchableOpacity>
    );
  };

  let RevCommentItem = ({revIndex}) => {
    const revParagraphs = revGenLoreumIpsumText({
      revMinSentences: 1,
      revMaxSentences: 7,
      revMinWordsPerSentence: 2,
      revMaxWordsPerSentence: 12,
      revParagraphLowerBound: 1,
      revParagraphUpperBound: 7,
      revCount: 4,
    });

    let revBackgroundColor = revIndex % 2 == 0 ? '#FFFFFF' : '#F7F7F7';

    return (
      <TouchableOpacity
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revCommentItemWrapper,
          {backgroundColor: revBackgroundColor},
        ]}>
        <TouchableOpacity>
          <View style={styles.revCommentMsgUserIcon}>
            <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
          </View>
        </TouchableOpacity>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revChatMsgCommentContentContainer,
          ]}>
          <View
            style={[
              revSiteStyles.revFlexWrapper,
              styles.revChatMsgHeaderWrapper,
            ]}>
            <Text
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
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
              10:40 Jun 14, 2022
            </Text>
            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                styles.revChatMsgOptionsWrapper,
              ]}>
              <FontAwesome style={revChatMsgOptionsStylesArr} name="reply" />
              <FontAwesome style={revChatMsgOptionsStylesArr} name="retweet" />
              <FontAwesome style={revChatMsgOptionsStylesArr} name="flag-o" />
            </View>
          </View>
          <View
            style={[
              revSiteStyles.revFlexContainer,
              styles.revChatMsgCommentContentTxtContainer,
            ]}>
            <RevReadMoreTextView
              revText={revParagraphs}
              revMaxLength={revMaxMessageLen}
            />
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

  let revImagesMediaView = null;

  if (revVarArgs.hasOwnProperty('_revEntityChildrenList')) {
    let revPicsAlbumArr = revGetEntityChildren_By_Subtype(
      revVarArgs._revEntityChildrenList,
      'rev_pics_album',
    );

    if (revPicsAlbumArr && revPicsAlbumArr.length) {
      revImagesMediaView = RevCreateImagesMediaView(revPicsAlbumArr[0]);
    }
  }

  const RevVideoPlayer = () => {
    let revVidPath = '/storage/emulated/0/Documents/rev_sample_media/1.mp4';
    let RevInlineVideoPlayer = revPluginsLoader({
      revPluginName: 'rev_plugin_video',
      revViewName: 'RevInlineVideoPlayer',
      revVarArgs: {
        revURL: revVidPath,
      },
    });

    return RevInlineVideoPlayer;
  };

  let revVideoPlayerView = RevVideoPlayer();

  let RevGenComments = () => {
    let revCommentsArr = [];
    let revRand = revGetRandInteger(0, 22);

    for (let i = 0; i < revRand; i++) {
      revCommentsArr.push(i);
    }

    return (
      <>
        {revCommentsArr.map((revItem, index) => {
          return <RevCommentItem key={index} revIndex={index} />;
        })}
      </>
    );
  };

  let RevLikes = () => {
    const revLikesStylesArr = [
      revSiteStyles.revSiteTxtColor,
      revSiteStyles.revSiteTxtBold,
      revSiteStyles.revSiteTxtTiny_X,
      styles.revLikesTab,
    ];

    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revLikesTabsWrapper,
        ]}>
        <TouchableOpacity>
          <FontAwesome name="arrow-up" style={revLikesStylesArr} />
        </TouchableOpacity>
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          {revGetRandInteger(1, 100)}
        </Text>
        <TouchableOpacity>
          <FontAwesome name="arrow-down" style={revLikesStylesArr} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleRevHideEditKiwiTabPress = () => {
    setRevIsEditting(!revIsEditting);
  };

  const RevGetKiwiEditForm = () => {
    let revPassVarArgs = JSON.parse(JSON.stringify(revVarArgs));
    revPassVarArgs['revHideKiwiPublisherForm'] = handleRevHideEditKiwiTabPress;

    let RevSitePublisherForm = revPluginsLoader({
      revPluginName: 'rev_plugin_tagged_posts',
      revViewName: 'RevSitePublisherForm',
      revVarArgs: revPassVarArgs,
    });

    return RevSitePublisherForm;
  };

  const RevKiwiContainer = () => {
    return (
      <View style={revSiteStyles.revFlexContainer}>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revPublisherMainNonIconArea,
          ]}>
          <FontAwesome name="user" style={styles.revPublisherMainNonIcon} />
        </View>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revChatMsgContentWrapper,
          ]}>
          <View
            style={[
              revSiteStyles.revFlexContainer,
              styles.revChatMsgContentContainer,
            ]}>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revChatMsgHeaderWrapper,
              ]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColor,
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
                {revFormatLongDate(revTimeCreated)}
              </Text>
              <View
                style={[
                  revSiteStyles.revFlexWrapper_WidthAuto,
                  styles.revChatMsgOptionsWrapper,
                ]}>
                <FontAwesome style={revChatMsgOptionsStylesArr} name="reply" />
                <FontAwesome
                  style={revChatMsgOptionsStylesArr}
                  name="retweet"
                />
                <FontAwesome name="list" />
                <FontAwesome style={revChatMsgOptionsStylesArr} name="flag-o" />
              </View>
            </View>
            <View
              style={[
                revSiteStyles.revFlexWrapper,
                styles.revPostTagsListWrapper,
              ]}>
              <FontAwesome
                name="hashtag"
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtSmall,
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
            <View style={styles.revChatMsgContentTxtContainer}>
              <RevReadMoreTextView
                revText={chatMsg}
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
              {revVideoPlayerView}
            </View>

            <View
              style={[revSiteStyles.revFlexWrapper, {alignItems: 'center'}]}>
              <RevLikes />
              <View
                style={[
                  revSiteStyles.revFlexWrapper_WidthAuto,
                  styles.revLikesTabsWrapper,
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    handleRevHideEditKiwiTabPress();
                  }}>
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtColorLight,
                      revSiteStyles.revSiteTxtBold,
                      revSiteStyles.revSiteTxtTiny_X,
                      styles.revLikesTab,
                    ]}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtColorLight,
                      revSiteStyles.revSiteTxtBold,
                      revSiteStyles.revSiteTxtTiny_X,
                      styles.revLikesTab,
                    ]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {revIsEditting ? RevGetKiwiEditForm() : null}

            <View
              style={[
                revSiteStyles.revFlexContainer,
                styles.revCommentsContainer,
              ]}>
              <TouchableOpacity>
                <Text
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtBold,
                    revSiteStyles.revSiteTxtTiny_X,
                    styles.revPostCommentTab,
                  ]}>
                  Your comment
                </Text>
              </TouchableOpacity>
              <RevGenComments />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <RevPageContentHeader revVarArgs={{revIsIndented: false}} />
      <ScrollView style={revSiteStyles.revFlexContainer}>
        <RevKiwiContainer />
      </ScrollView>
    </>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revPublisherMainNonIconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    width: '100%',
    height: 100,
    marginTop: 1,
    borderRadius: 2,
  },
  revPublisherMainNonIcon: {
    color: '#CCC',
    fontSize: 22,
    paddingVertical: 2,
  },
  revChatMsgContentWrapper: {
    alignItems: 'flex-start',
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  revChatMsgContentContainer: {
    alignSelf: 'flex-start',
    width: maxChatMessageContainerWidth - 7,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  revChatMsgHeaderWrapper: {
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
  revChatMsgOptionsWrapper: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
    position: 'relative',
  },
  revChatMsgOptions: {
    paddingHorizontal: 8,
  },
  revPostTagsListWrapper: {
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  revPostTagsListItem: {
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 4,
  },
  revChatMsgContentTxtContainer: {
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
  revLikesTabsWrapper: {
    alignItems: 'center',
  },
  revLikesTab: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  revCommentsContainer: {
    paddingVertical: 5,
    marginHorizontal: 4,
  },
  revPostCommentTab: {
    backgroundColor: '#FFF',
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  revCommentItemWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 5,
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
    width: maxChatMessageContainerWidth - 32,
    paddingHorizontal: 5,
    marginTop: 3,
    marginBottom: 5,
  },
  revChatMsgCommentContentTxtContainer: {
    alignItems: 'flex-start',
    paddingRight: 5,
    marginTop: 2,
  },
  profileImagesScroller: {
    flexGrow: 0,
    marginTop: 4,
  },
  revProfileMediaWrapper: {
    alignItems: 'center',
  },
  revImageTouchableOpacity: {
    backgroundColor: '#444',
    marginRight: 1,
  },
  revEntityImageStyle: {
    width: 75,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

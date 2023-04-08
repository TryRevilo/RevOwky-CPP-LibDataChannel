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
import {LoremIpsum} from 'lorem-ipsum';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revGetEntityChildren_By_Subtype} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

const {RevPersLibRead_React} = NativeModules;

const revSettings = require('../../../../../../rev_res/rev_settings.json');

export const RevKiwiObjectWidgetView = ({revVarArgs}) => {
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

  const {revSiteStyles} = useRevSiteStyles();

  let revInfoEntity = revVarArgs._revInfoEntity;
  let revTimeCreated = revVarArgs._timeCreated;

  const {
    REV_PAGE_HEADER_CONTENT_VIEWER,
    SET_REV_PAGE_HEADER_CONTENT_VIEWER,
    REV_SITE_BODY,
    SET_REV_SITE_BODY,
  } = useContext(ReViewsContext);

  [revIsEditting, setRevIsEditting] = useState(false);

  let minMessageLen = 1;
  let maxMessageLen = 200;

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: revGetRandInteger(minMessageLen, maxMessageLen),
      min: revGetRandInteger(1, 2),
    },
  });

  let chatMsg = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'revPostText',
  );

  if (!chatMsg) {
    return null;
  }

  let chatMessageText = (chatMsg, revTxtStyle = {}) => {
    let chatMessageView = (
      <Text
        key={revGetRandInteger(100, 1000)}
        style={[styles.chatMsgContentTxt, revTxtStyle]}>
        {chatMsg.length > maxMessageLen
          ? chatMsg.substring(0, maxMessageLen) + ' . . .'
          : chatMsg}
      </Text>
    );

    return (
      <View key={revEntityGUID} style={styles.chatMsgContentTxtContainer}>
        {chatMessageView}
        {chatMsg.length > maxMessageLen ? (
          <Text style={styles.readMoreTextTab}>Read more</Text>
        ) : null}
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

  let RevCommentItem = () => {
    return (
      <TouchableOpacity
        key={revGetRandInteger(100, 1000).toString()}
        style={[revSiteStyles.revFlexWrapper, styles.revCommentItemWrapper]}>
        <TouchableOpacity>
          <View style={styles.revCommentMsgUserIcon}>
            <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
          </View>
        </TouchableOpacity>
        <View style={styles.revChatMsgCommentContentContainer}>
          <View style={styles.chatMsgHeaderWrapper}>
            <Text style={styles.chatMsgOwnerTxt}>
              {revPublisherEntityNames_Trunc}
            </Text>
            <Text style={styles.chatMsgSendTime}>10:40 Jun 14, 2022</Text>
            <View style={styles.chatMsgOptionsWrapper}>
              <Text style={styles.chatMsgOptions}>
                <FontAwesome name="reply" />
              </Text>
              <Text style={styles.chatMsgOptions}>
                <FontAwesome name="retweet" />
              </Text>
              <Text style={styles.chatMsgOptions}>
                <FontAwesome name="list" />
              </Text>
              <Text style={styles.chatMsgOptions}>
                <FontAwesome name="flag-o" />
              </Text>
            </View>
          </View>
          <View style={styles.revChatMsgCommentContentTxtContainer}>
            {chatMessageText(
              lorem.generateSentences(revGetRandInteger(1, 5)),
              styles.revChatMsgCommentContentTxt,
            )}
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
      '/storage/emulated/0/Documents/Owki/rev_sample_media/1.mp4',
      '/storage/emulated/0/Documents/Owki/rev_sample_media/2.mp4',
      '/storage/emulated/0/Documents/Owki/rev_sample_media/3.mp4',
      '/storage/emulated/0/Documents/Owki/rev_sample_media/4.mp4',
      '/storage/emulated/0/Documents/Owki/rev_sample_media/5.mp4',
      '/storage/emulated/0/Documents/Owki/rev_sample_media/6.mp4',
    ];
    const randomIndex = Math.floor(Math.random() * revVidPathsArr.length);
    const randomElement = revVidPathsArr[randomIndex];

    let RevInlineVideoPlayer = revPluginsLoader({
      revPluginName: 'rev_plugin_video',
      revViewName: 'RevInlineVideoPlayer',
      revVarArgs: {
        revURL: randomElement,
      },
    });

    return RevInlineVideoPlayer;
  };

  let RevVideoPlayerView = RevVideoPlayer();

  let RevGenComments = () => {
    let revCommentsArr = [];
    let revRand = revGetRandInteger(0, 4);

    for (let i = 0; i < revRand; i++) {
      revCommentsArr.push(i);
    }

    return (
      <View>
        {revCommentsArr.map(revItem => {
          return <RevCommentItem key={revItem} />;
        })}
      </View>
    );
  };

  let RevLikes = () => {
    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revLikesTabsWrapper,
        ]}>
        <TouchableOpacity>
          <FontAwesome name="arrow-up" style={styles.revLikesTab} />
        </TouchableOpacity>
        <Text style={styles.revLikesText}>{revGetRandInteger(1, 100)}</Text>
        <TouchableOpacity>
          <FontAwesome name="arrow-down" style={styles.revLikesTab} />
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
      <TouchableOpacity key={revEntityGUID.toString()}>
        <View style={revSiteStyles.revFlexContainer}>
          <View style={styles.revPublisherMainNonIconArea}>
            <FontAwesome name="user" style={styles.revPublisherMainNonIcon} />
          </View>
          <View style={styles.chatMsgContentWrapper}>
            <View style={styles.chatMsgContentContainer}>
              <View style={styles.chatMsgHeaderWrapper}>
                <Text style={styles.chatMsgOwnerTxt}>
                  {revPublisherEntityNames_Trunc}
                </Text>
                <Text style={styles.chatMsgSendTime}>{revTimeCreated}</Text>
                <View style={styles.chatMsgOptionsWrapper}>
                  <Text style={styles.chatMsgOptions}>
                    <FontAwesome name="reply" />
                  </Text>
                  <Text style={styles.chatMsgOptions}>
                    <FontAwesome name="retweet" />
                  </Text>
                  <Text style={styles.chatMsgOptions}>
                    <FontAwesome name="list" />
                  </Text>
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
                <FontAwesome
                  name="hashtag"
                  style={styles.revPostTagsListIcon}
                />
                <View style={[revSiteStyles.revFlexWrapper]}>
                  {revPostTagsArr.map(revItem => {
                    return <RevPostTagItem key={revItem.toString()} />;
                  })}
                </View>
              </View>
              <View style={styles.chatMsgContentTxtContainer}>
                {chatMessageText(chatMsg)}
              </View>

              <View
                style={[
                  RevImagesMediaView || RevVideoPlayerView
                    ? styles.revImagesMediaViewContainer
                    : null,
                ]}>
                {RevImagesMediaView}
                {RevVideoPlayerView}
              </View>

              <View style={revSiteStyles.revFlexWrapper_WidthAuto}>
                <RevLikes />
                <View
                  style={[
                    revSiteStyles.revFlexWrapper,
                    styles.revLikesTabsWrapper,
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      handleRevHideEditKiwiTabPress();
                    }}>
                    <Text
                      style={[
                        revSiteStyles.revSiteTxtColorLight,
                        revSiteStyles.revSiteTxtSmall,
                        styles.revLikesTab,
                      ]}>
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text
                      style={[
                        revSiteStyles.revSiteTxtColorLight,
                        revSiteStyles.revSiteTxtSmall,
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
                  <Text style={styles.revPostCommentTab}>your comment</Text>
                </TouchableOpacity>
                <RevGenComments />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={revSiteStyles.revFlexContainer}>
      <RevPageContentHeader revVarArgs={{revIsIndented: false}} />
      <RevKiwiContainer />
    </ScrollView>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revPublisherMainNonIconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444',
    width: '100%',
    height: 100,
    borderStyle: 'solid',
    borderColor: '#F9F9F9',
    borderWidth: 1,
    marginTop: 1,
    borderRadius: 2,
  },
  revPublisherMainNonIcon: {
    color: '#CCC',
    fontSize: 22,
    paddingVertical: 2,
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

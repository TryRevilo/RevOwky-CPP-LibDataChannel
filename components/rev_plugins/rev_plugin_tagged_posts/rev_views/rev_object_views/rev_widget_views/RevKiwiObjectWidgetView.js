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

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

const {RevPersLibRead_React} = NativeModules;

export const RevKiwiObjectWidgetView = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  if (revEntityGUID < 0) {
    return null;
  }

  const {revSiteStyles} = useRevSiteStyles();

  let revInfoEntity = revVarArgs._revInfoEntity;
  let timeCreated = revVarArgs._timeCreated;

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
            <Text style={styles.chatMsgOwnerTxt}>Oliver Muchai</Text>
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

  const RevMedia = revEntityGUID => {
    if (revEntityGUID < 1) {
      return null;
    }

    let revRelSubGUIDs =
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_file_of',
        revEntityGUID,
      );

    let revRelSubGUIDsArr = JSON.parse(revRelSubGUIDs);

    let revImagesViews = [];

    for (let i = 0; i < revRelSubGUIDsArr.length; i++) {
      let revRelSubGUID = revRelSubGUIDsArr[i];

      let revEntityStr =
        RevPersLibRead_React.revPersGetRevEntityByGUID(revRelSubGUID);

      console.log('>>> revEntityStr ' + revEntityStr);

      let revEntity = JSON.parse(revEntityStr);

      let revEntityImageURI = revGetMetadataValue(
        revEntity._revEntityMetadataList,
        'rev_remote_file_name',
      );

      let RevImage = (
        <TouchableOpacity
          key={revGetRandInteger(100, 1000)}
          style={styles.revImageTouchableOpacity}>
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

    return (
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.profileImagesScroller}>
        <View style={[revSiteStyles.revFlexWrapper]}>
          {revImagesViews.map(RevImage => {
            return RevImage;
          })}
        </View>
      </ScrollView>
    );
  };

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
                <Text style={styles.chatMsgOwnerTxt}>Oliver Muchai</Text>
                <Text style={styles.chatMsgSendTime}>{timeCreated}</Text>
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

              {RevMedia(revEntityGUID)}

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
    verticalAlign: 'middle',
  },
});

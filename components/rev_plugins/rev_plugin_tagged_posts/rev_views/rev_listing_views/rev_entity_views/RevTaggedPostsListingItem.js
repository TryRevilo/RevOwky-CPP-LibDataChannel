import React, {createContext, useContext, useState, useEffect} from 'react';

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
import {LoremIpsum} from 'lorem-ipsum';

const {RevPersLibRead_React} = NativeModules;

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {revGetRndInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_string_function_libs';

export const RevTaggedPostsListingItem = ({revVarArgs}) => {
  let revEntityGUID = revVarArgs._revEntityGUID;
  let timeCreated = revVarArgs._timeCreated;

  let revInfoEntityGUIDArrStr =
    RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_entity_info',
      revEntityGUID,
    );

  let revInfoEntityGUIDArr = JSON.parse(revInfoEntityGUIDArrStr);

  if (!Array.isArray(revInfoEntityGUIDArr) || revInfoEntityGUIDArr.length < 1) {
    return null;
  }

  let revInfoEntityGUID = revInfoEntityGUIDArr[0];

  let revInfoEntityStr =
    RevPersLibRead_React.revPersGetRevEntityByGUID(revInfoEntityGUID);

  let revInfoEntity = JSON.parse(revInfoEntityStr);

  if (revIsEmptyJSONObject(revInfoEntity)) {
    return null;
  }

  let minMessageLen = 1;
  let maxMessageLen = 200;

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: revGetRndInteger(minMessageLen, maxMessageLen),
      min: revGetRndInteger(1, 2),
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
        key={revGetRndInteger(100, 1000)}
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
      <TouchableOpacity key={revGetRndInteger(100, 1000)}>
        <Text style={styles.revPostTagsListItem}>hello_world</Text>
      </TouchableOpacity>
    );
  };

  let RevCommentItem = () => {
    return (
      <TouchableOpacity
        key={revGetRndInteger(100, 1000).toString()}
        style={[styles.revFlexWrapper, styles.revCommentItemWrapper]}>
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
              lorem.generateSentences(revGetRndInteger(1, 5)),
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

      let revEntity = JSON.parse(revEntityStr);

      let revEntityImageURI = revGetMetadataValue(
        revEntity._revEntityMetadataList,
        'rev_file_uri',
      );

      let RevImage = (
        <TouchableOpacity
          key={revGetRndInteger(100, 1000)}
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
        <View style={[styles.revFlexWrapper]}>
          {revImagesViews.map(RevImage => {
            return RevImage;
          })}
        </View>
      </ScrollView>
    );
  };

  let RevGenComments = () => {
    let revCommentsArr = [];
    let revRand = revGetRndInteger(0, 4);

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
      <View style={[styles.revFlexWrapper, styles.revLikesTabsWrapper]}>
        <TouchableOpacity>
          <FontAwesome name="arrow-up" style={styles.revLikesTab} />
        </TouchableOpacity>
        <Text style={styles.revLikesText}>{revGetRndInteger(1, 100)}</Text>
        <TouchableOpacity>
          <FontAwesome name="arrow-down" style={styles.revLikesTab} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableOpacity key={revEntityGUID.toString()}>
      <View style={styles.revFlexWrapper}>
        <View style={styles.chatMsgUserIcon}>
          <FontAwesome name="user" style={styles.availableChatPeopleNonIcon} />
        </View>
        <View style={styles.chatMsgContentWrapper}>
          <View style={styles.chatMsgContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={styles.chatMsgContentCarret}
            />
          </View>
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
              style={[styles.revFlexWrapper, styles.revPostTagsListWrapper]}>
              <FontAwesome name="hashtag" style={styles.revPostTagsListIcon} />
              <View style={[styles.revFlexWrapper]}>
                {revPostTagsArr.map(revItem => {
                  return <RevPostTagItem key={revItem.toString()} />;
                })}
              </View>
            </View>
            <View style={styles.chatMsgContentTxtContainer}>
              {chatMessageText(chatMsg)}
            </View>

            {RevMedia(revEntityGUID)}

            <View style={styles.revLikesArea}>
              <RevLikes />
            </View>

            <View
              style={[styles.revFlexContainer, styles.revCommentsContainer]}>
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

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
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

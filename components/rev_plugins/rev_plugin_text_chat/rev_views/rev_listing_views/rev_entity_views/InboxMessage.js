import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {LoremIpsum} from 'lorem-ipsum';

import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

import RevChatMessageOptions from '../../RevChatMessageOptions';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

export default function InboxMessage({revVarArgs}) {
  if (!revVarArgs) {
    return null;
  }

  let revEntityGUID = revVarArgs._revGUID;

  /** START GET PUBLISHER */
  if (
    !revVarArgs.hasOwnProperty('_revPublisherEntity') ||
    revIsEmptyJSONObject(revVarArgs._revPublisherEntity)
  ) {
    return null;
  }

  let revPublisherEntity = revVarArgs._revPublisherEntity;

  if (revPublisherEntity._revType !== 'rev_user_entity') {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    revPublisherEntity._revInfoEntity._revMetadataList,
    'rev_entity_name',
  );
  let revPublisherEntityNames_Trunc = revTruncateString(
    revPublisherEntityNames,
    22,
  );
  /** END GET PUBLISHER */

  let revMsgInfoEntity = revVarArgs._revInfoEntity;

  let revChatMsgStr = revGetMetadataValue(
    revMsgInfoEntity._revMetadataList,
    'rev_entity_desc_val',
  );

  let revTimeCreated = revVarArgs._revInfoEntity._revTimeCreated;

  let minMessageLen = 1;
  let maxMessageLen = 200;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: getRndInteger(minMessageLen, 22),
      min: getRndInteger(1, 2),
    },
  });

  let RevImages = () => {
    let imageBytes = null;

    if (revVarArgs.hasOwnProperty('bytesArrayBuffer')) {
      imageBytes = revVarArgs.bytesArrayBuffer;
    } else return null;

    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageStyle}
          source={{uri: `data:image/jpeg;base64,${imageBytes}`}}
        />
      </View>
    );
  };

  let chatMessageText = _chatMsg => {
    let chatMessageView = (
      <Text style={styles.chatMsgContentTxt}>
        {_chatMsg.length > maxMessageLen
          ? _chatMsg.substring(0, maxMessageLen) + ' . . .'
          : _chatMsg}
      </Text>
    );

    return (
      <View
        key={'chatMessageText_' + revEntityGUID}
        style={styles.chatMsgContentTxtContainer}>
        {chatMessageView}
        {_chatMsg.length > maxMessageLen ? (
          <Text style={styles.readMoreTextTab}>Read more</Text>
        ) : null}
      </View>
    );
  };

  const [revIsChatOptionsModalVissible, setRevIsChatOptionsModalVissible] =
    useState(false);

  let revChatOptions = () => {
    return revIsChatOptionsModalVissible ? (
      <RevChatMessageOptions
        revData={revVarArgs}
        revCallback={() => setRevIsChatOptionsModalVissible(false)}
      />
    ) : null;
  };

  return (
    <TouchableOpacity
      key={'InboxMessage_' + revEntityGUID}
      onLongPress={() => {
        setRevIsChatOptionsModalVissible(true);
      }}>
      <View style={styles.chatMsgWrapper}>
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
              </View>
            </View>
            <View style={styles.chatMsgContentTxtContainer}>
              {chatMessageText(revChatMsgStr)}
              <RevImages />
            </View>
          </View>
        </View>
      </View>

      {revChatOptions()}
    </TouchableOpacity>
  );
}

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#444',
    width: maxChatMessageContainerWidth - 12,
    maxHeight: 200,
    borderRadius: 3,
    marginTop: 4,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  chatMsgWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
  },
  inboxChatMsgWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
    marginLeft: 'auto',
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
  chatMsgUserIconMe: {
    width: 22,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#b2ebf2',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
  },
  chatMsgContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  chatMsgContentWrapperInbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: maxChatMessageContainerWidth,
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
    color: '#c5e1a5',
    textAlign: 'center',
    fontSize: 15,
  },
  chatMsgContentCarretInbox: {
    color: '#dcedc8',
    textAlign: 'center',
    fontSize: 15,
  },
  chatMsgContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    maxWidth: maxChatMessageContainerWidth,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 5,
  },
  chatMsgInboxBlue: {
    backgroundColor: '#b2ebf2',
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
  chatMsgOptionsOutbox: {
    color: '#388e3c',
    fontSize: 12,
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  chatMsgContentTxtContainer: {
    color: '#444',
    fontSize: 10,
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: 4,
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
    marginBottom: 4,
  },
});

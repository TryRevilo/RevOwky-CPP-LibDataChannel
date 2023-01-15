import React, {useState, useEffect, lazy, Suspense} from 'react';
import {
  Button,
  Text,
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revGetMetadataValue} from '../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {revPluginsLoader} from '../../../rev_plugins_loader';

import {RevFooter1} from '../../rev_flag/rev_views/RevFooter1';

export default function RevChatMessageOptions({revData, revCallback}) {
  let revEntityGUID = revData._revEntityGUID;

  let chatMsg = revGetMetadataValue(
    revData._revEntityMetadataList,
    'rev_chat_message_html_value',
  );

  const [isModalVisible, setModalVisible] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    revCallback();
  };

  let RevImages = () => {
    let imageBytes = null;

    if (revData.hasOwnProperty('bytesArrayBuffer')) {
      imageBytes = revData.bytesArrayBuffer;
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

  let maxMessageLen = 200;

  let chatMessageText = _chatMsg => {
    let chatMessageView = (
      <Text style={styles.chatMsgContentTxt}>
        {chatMsg.length > maxMessageLen
          ? chatMsg.substring(0, maxMessageLen) + ' . . .'
          : chatMsg}
      </Text>
    );

    let RevFooter1 = revPluginsLoader({
      revPluginName: 'rev_flag',
      revViewName: 'RevFooter1',
      revData: 'Hello World!',
    });

    return (
      <View key={revEntityGUID} style={styles.chatMsgContentTxtContainer}>
        {chatMessageView}
        {chatMsg.length > maxMessageLen ? (
          <Text style={styles.readMoreTextTab}>Read more</Text>
        ) : null}
        {RevFooter1}
      </View>
    );
  };

  return (
    <Modal
      key={Math.abs(revEntityGUID)}
      isVisible={isModalVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={2000}
      animationOutTiming={2000}
      onSwipeComplete={() => setModalVisible(false)}
      swipeDirection="left">
      <View style={styles.chatMsgContainer}>
        <View style={styles.chatMsgWrapper}>
          <View style={styles.chatMsgUserIcon}>
            <FontAwesome
              name="user"
              style={styles.availableChatPeopleNonIcon}
            />
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
                </View>
              </View>
              <View style={styles.chatMsgContentTxtContainer}>
                {chatMessageText(chatMsg)}
                <RevImages />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.revMsgdetailsModalView}>
          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={[
                styles.revMsgdetailsModalTab,
                styles.revMsgdetailsModalTab_Edit,
              ]}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={[
                styles.revMsgdetailsModalTab,
                styles.revMsgdetailsModalTab_Select,
              ]}>
              Select
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={[
                styles.revMsgdetailsModalTab,
                styles.revMsgdetailsModalTab_Flag,
              ]}>
              Flag
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={[
                styles.revMsgdetailsModalTab,
                styles.revMsgdetailsModalTab_Delete,
              ]}>
              Delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={[
                styles.revMsgdetailsModalTab,
                styles.revMsgdetailsModalTab,
              ]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  chatMsgContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 'auto',
    marginBottom: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 2,
  },
  revMsgdetailsModalView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  revMsgdetailsModalTab: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#444',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#efebe9',
    paddingTop: 3,
    paddingBottom: 2,
    marginLeft: 5,
    borderRadius: 2,
  },
  revMsgdetailsModalTab_Edit: {
    color: '#388e3c',
    backgroundColor: '#FFF',
  },
  revMsgdetailsModalTab_Select: {
    color: '#444',
    backgroundColor: '#c8e6c9',
  },
  revMsgdetailsModalTab_Flag: {
    color: '#444',
    backgroundColor: '#fff59d',
  },
  revMsgdetailsModalTab_Delete: {
    color: '#FFF',
    backgroundColor: '#039be5',
  },
  imageContainer: {
    backgroundColor: '#444',
    width: maxChatMessageContainerWidth - 12,
    maxHeight: 200,
    borderRadius: 2,
    marginTop: 4,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    verticalAlign: 'middle',
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
    backgroundColor: '#dcedc8',
    maxWidth: maxChatMessageContainerWidth,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 2,
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

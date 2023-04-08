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

import {revGetMetadataValue} from '../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

import {revPluginsLoader} from '../../../rev_plugins_loader';

import {revIsEmptyJSONObject} from '../../../../rev_function_libs/rev_gen_helper_functions';
import {revTruncateString} from '../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../rev_views/RevSiteStyles';

export default function RevChatMessageOptions({revData, revCallback}) {
  const {revSiteStyles} = useRevSiteStyles();

  const [revIsSiteMessageForm, setRevIsSiteMessageForm] = useState(false);

  let revEntityGUID = revData._revEntityGUID;
  let revMsgInfoEntity = revData._revInfoEntity;

  /** START GET PUBLISHER */
  if (
    !revData.hasOwnProperty('_revPublisherEntity') ||
    revIsEmptyJSONObject(revData._revPublisherEntity)
  ) {
    return null;
  }

  let revPublisherEntity = revData._revPublisherEntity;

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
  /** END GET PUBLISHER */

  let revTimeCreated = revData._timeCreated;

  let revChatMsgStr = revGetMetadataValue(
    revMsgInfoEntity._revEntityMetadataList,
    'rev_entity_desc_val',
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

  const RevCreateSiteMessageForm = () => {
    let RevCreateSiteMessageFormView = revPluginsLoader({
      revPluginName: 'rev_plugin_site_messages',
      revViewName: 'RevCreateSiteMessageForm',
      revVarArgs: {
        revEntity: revPublisherEntity,
        revIsCommentUpdate: false,
        revCancel: () => {
          setRevIsSiteMessageForm(false);
        },
      },
    });

    return RevCreateSiteMessageFormView;
  };

  const handleCreateSiteMessagePress = () => {
    setRevIsSiteMessageForm(true);
  };

  return (
    <Modal
      key={Math.abs(revEntityGUID)}
      isVisible={isModalVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={2000}
      animationOutTiming={2000}
      onSwipeComplete={() => toggleModal()}
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
                <Text style={styles.chatMsgOwnerTxt}>
                  {revPublisherEntityNames_Trunc}
                </Text>
                <Text style={styles.chatMsgSendTime}>{revTimeCreated}</Text>
                <View style={styles.chatMsgOptionsWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      handleCreateSiteMessagePress();
                    }}>
                    <Text style={styles.chatMsgOptions}>
                      <FontAwesome name="reply" />
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.chatMsgOptions}>
                    <FontAwesome name="retweet" />
                  </Text>

                  <Text style={styles.chatMsgOptions}>
                    <FontAwesome name="list" />
                  </Text>
                </View>
              </View>
              <View style={styles.chatMsgContentTxtContainer}>
                <Text style={styles.chatMsgContentTxt}>{revChatMsgStr}</Text>
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

        {revIsSiteMessageForm ? (
          <View
            style={[
              revSiteStyles.revFlexContainer,
              styles.revComposeMessageFormContainer,
            ]}>
            {RevCreateSiteMessageForm()}
          </View>
        ) : null}
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
    borderRadius: 8,
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
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingTop: 1,
    paddingBottom: 2,
    marginLeft: 5,
    borderRadius: 22,
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
    width: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  chatMsgContentWrapperInbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: maxChatMessageContainerWidth,
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
    color: '#EEE',
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
    backgroundColor: '#F7F7F7',
    width: maxChatMessageContainerWidth,
    paddingHorizontal: 5,
    paddingVertical: 4,
    paddingBottom: 22,
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
  revComposeMessageFormContainer: {
    width: '100%',
    marginTop: 8,
  },
});

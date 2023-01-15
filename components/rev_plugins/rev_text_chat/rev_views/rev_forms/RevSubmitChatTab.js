import React, {useContext} from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {REV_ENTITY_STRUCT} from '../../../../rev_libs_pers/rev_db_struct_models/revEntity';

import {
  REV_ENTITY_METADATA_STRUCT,
  REV_METADATA_FILLER,
} from '../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {REV_ENTITY_RELATIONSHIP_STRUCT} from '../../../../rev_libs_pers/rev_db_struct_models/revEntityRelationship';

const {RevPersLibCreate_React, RevWebRTCReactModule} = NativeModules;

import {RevRemoteSocketContext} from '../../../../../rev_contexts/RevRemoteSocketContext';

var revHandleSendMsg = (revTargetId, revMsg, revCallBack) => {
  if (!revTargetId || !revMsg) {
    return null;
  }

  let revPersEntity = REV_ENTITY_STRUCT();

  revPersEntity._revEntityResolveStatus = 0;
  revPersEntity._revEntityChildableStatus = 301;
  revPersEntity._revEntityType = 'revObject';
  revPersEntity._revEntitySubType = 'rev_chat_message';
  revPersEntity._remoteRevEntityGUID = -1;
  revPersEntity._revEntityOwnerGUID = 1;
  revPersEntity._revEntityContainerGUID = 1;
  revPersEntity._revTimeCreated = new Date().getTime();
  revPersEntity._revTimePublished = new Date().getTime();

  revPersEntity._revEntityMetadataList.push(
    REV_METADATA_FILLER('rev_chat_message_html_value', revMsg),
  );

  let revChatMessageRel = REV_ENTITY_RELATIONSHIP_STRUCT();
  revChatMessageRel._revEntityRelationshipType = 'rev_chat_message';
  revChatMessageRel._remoteRevEntityTargetGUID = -1;
  revChatMessageRel._remoteRevEntitySubjectGUID = -1;

  revPersEntity._revSubjectEntityRelationships.push(revChatMessageRel);

  let revSaveMessageStatus = RevPersLibCreate_React.revPersInitJSON(
    JSON.stringify(revPersEntity),
  );

  console.log('>>> revSaveMessageStatus : ' + revSaveMessageStatus);

  let revSendMessageStatus = RevWebRTCReactModule.revSendMessage(
    revTargetId,
    JSON.stringify(revPersEntity),
  );

  revCallBack(revSendMessageStatus);
};

export default function RevSubmitChatTab({
  revTargetId,
  revMsg,
  revInputFieldCallback,
}) {
  const {revHandleMsgSentEvent} = useContext(RevRemoteSocketContext);

  let minMessageLen = 1;
  let maxMessageLen = 200;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let rendNu = getRndInteger(minMessageLen, maxMessageLen);

  let revMsgSendCallback = revSendStatus => {
    if (revSendStatus) {
      const myPromise = new Promise((resolve, reject) => {
        let revData = {
          revMessageId: getRndInteger(minMessageLen, maxMessageLen),
          revMessageType: 'outbox',
          revData: revMsg(),
        };

        revHandleMsgSentEvent(revData);

        revInputFieldCallback();

        setTimeout(() => {
          resolve('foo');
        }, 300);
      });

      myPromise.then(revVal => {
        let revInBox = {
          revMessageId: getRndInteger(minMessageLen, maxMessageLen),
          revMessageType: 'inbox',
          revData: revMsg(),
        };

        revHandleMsgSentEvent(revInBox);
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        revHandleSendMsg(revTargetId, revMsg(), revMsgSendCallback);
      }}>
      <View style={styles.revSubmitChatTabWrapper}>
        <Text style={styles.revSubmitChatTab}>Send</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  revSubmitChatTabWrapper: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  revSubmitChatTab: {
    color: '#FFF',
    fontSize: 10,
    backgroundColor: '#444',
    paddingHorizontal: 17,
    paddingVertical: 3,
    marginTop: 2,
    borderRadius: 8,
  },
});

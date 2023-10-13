import React, {useContext} from 'react';
import {NativeModules} from 'react-native';

const {RevPersLibRead_React} = NativeModules;

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {RevSiteDataContext} from '../../../../rev_contexts/RevSiteDataContext';

export const useRevChatMessagesHelperFunctions = () => {
  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const revSetChatMessage = revChatMsgEntity => {
    let revEntityOwnerGUID = revChatMsgEntity._revOwnerGUID;

    if (revEntityOwnerGUID == REV_LOGGED_IN_ENTITY_GUID) {
      revChatMsgEntity['revMessageType'] = 'outbox';
    } else {
      revChatMsgEntity['revMessageType'] = 'inbox';
    }

    return revChatMsgEntity;
  };

  const revGetLocalChatMessages = (revGUID_1, revGUID_2) => {
    let revChatRelsStr =
      RevPersLibRead_React.revPersGetRels_By_Type_LocalEntityGUIDs(
        'rev_stranger_chat_of',
        revGUID_1,
        revGUID_2,
      );

    let revChatRelsArr = JSON.parse(revChatRelsStr);

    let revLocalChatMessagesArr = [];

    for (let i = 0; i < revChatRelsArr.length; i++) {
      let revEntityGUID = revChatRelsArr[i]._revGUID;

      if (revEntityGUID < 1) {
        continue;
      }

      let revChatMsgEntity = revSetChatMessage(
        revPersGetRevEnty_By_EntityGUID(revEntityGUID),
      );

      revLocalChatMessagesArr.push(revChatMsgEntity);
    }

    return revLocalChatMessagesArr;
  };

  return {revGetLocalChatMessages, revSetChatMessage};
};

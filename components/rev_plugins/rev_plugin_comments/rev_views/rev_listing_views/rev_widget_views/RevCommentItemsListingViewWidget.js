import {StyleSheet, View, NativeModules} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibRead_React} = NativeModules;

export const RevCommentItemsListingViewWidget = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  let revCommentsArr = [];

  let revCommentGUIDsArrStr =
    RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_comment',
      revEntityGUID,
    );

  let revCommentGUIDsArr = JSON.parse(revCommentGUIDsArrStr);

  for (let i = 0; i < revCommentGUIDsArr.length; i++) {
    let revCurrCommentGUID = revCommentGUIDsArr[i];

    let revCurrCommentStr =
      RevPersLibRead_React.revPersGetRevEntityByGUID(revCurrCommentGUID);
    let revCurrComment = JSON.parse(revCurrCommentStr);

    let revCommentPublisher = revPersGetRevEnty_By_EntityGUID(
      revCurrComment._revEntityOwnerGUID,
    );
    revCurrComment['_revPublisherEntity'] = revCommentPublisher;

    let revCommentItemListingView = revPluginsLoader({
      revPluginName: 'rev_plugin_comments',
      revViewName: 'RevCommentItemListingView',
      revVarArgs: revCurrComment,
    });

    if (revCommentItemListingView == null) {
      continue;
    }

    revCommentsArr.push(revCommentItemListingView);
  }

  return (
    <>
      {revCommentsArr.map(revItem => {
        return (
          <View key={'RevGenComments_' + revItem + revGetRandInteger(10, 1000)}>
            {revItem}
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({});

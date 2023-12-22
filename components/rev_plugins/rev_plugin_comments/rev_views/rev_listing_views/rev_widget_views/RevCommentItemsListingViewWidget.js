import {StyleSheet, View, NativeModules} from 'react-native';
import React from 'react';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

const {RevPersLibRead_React} = NativeModules;

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCommentItemsListingViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  let revCommentsArr = [];

  let revCommentGUIDsArrStr =
    RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
      'rev_comment',
      revEntityGUID,
    );

  let revCommentGUIDsArr = JSON.parse(revCommentGUIDsArrStr);

  for (let i = 0; i < revCommentGUIDsArr.length; i++) {
    let revCurrCommentGUID = revCommentGUIDsArr[i];

    let revCurrCommentStr =
      RevPersLibRead_React.revPersGetEntity_By_GUID(revCurrCommentGUID);
    let revCurrComment = JSON.parse(revCurrCommentStr);

    let revCommentPublisher = revPersGetRevEnty_By_EntityGUID(
      revCurrComment._revOwnerGUID,
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

    let revBackgroundColor = i % 2 !== 0 || i == 0 ? '#FFFFFF' : '#F7F7F7';

    revCommentsArr.push(
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revCommentItemWrapper,
          {backgroundColor: revBackgroundColor},
        ]}>
        {revCommentItemListingView}
      </View>,
    );
  }

  return (
    <View style={{marginTop: 8}}>
      {revCommentsArr.map((revItem, index) => {
        return <View key={index}>{revItem}</View>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  revCommentItemWrapper: {
    paddingTop: 2,
    paddingLeft: 5,
  },
});

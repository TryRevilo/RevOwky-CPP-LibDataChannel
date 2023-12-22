import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {
  revFormatLongDate,
  revGetRandInteger,
  revIsEmptyJSONObject,
  revIsEmptyVar,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {
  revSplitStringToArray,
  revTruncateString,
} from '../../../../../../rev_function_libs/rev_string_function_libs';
import {RevReadMoreTextView} from '../../../../../rev_views/rev_page_views';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

export const RevCommentItemListingViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revVarArgs);

  if (revEntityGUID < 1) {
    return null;
  }

  if (
    !revVarArgs.hasOwnProperty('_revInfoEntity') ||
    revIsEmptyJSONObject(revVarArgs._revInfoEntity)
  ) {
    return null;
  }

  let revCommentInfoEntity = revVarArgs._revInfoEntity;

  let revCommentTxtVal = revGetMetadataValue(
    revCommentInfoEntity._revMetadataList,
    'rev_entity_desc',
  );

  if (revIsEmptyVar(revCommentTxtVal)) {
    return null;
  }

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

  let revPublisherInfoEntity = revPublisherEntity._revInfoEntity;
  let revPublisherInfoEntityMetadataList =
    revPublisherInfoEntity._revMetadataList;

  if (revPublisherEntity._revType !== 'rev_user_entity') {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    revPublisherInfoEntityMetadataList,
    'rev_entity_name',
  );
  let revPublisherEntityNames_Trunc = revTruncateString(
    revSplitStringToArray(revPublisherEntityNames)[0],
    3,
    false,
  );

  let revMaxMessageLen = 200;

  let revChatMessageText = _revKiwiTxtVal => {
    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revChatMsgContentTxtContainer,
        ]}>
        <RevReadMoreTextView
          revText={_revKiwiTxtVal}
          revMaxLength={revMaxMessageLen}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity style={revSiteStyles.revFlexWrapper}>
      <TouchableOpacity style={styles.revCommentMsgUserIcon}>
        <FontAwesome name="user" style={styles.revChatCommentNonIcon} />
      </TouchableOpacity>

      <View style={styles.revChatMsgCommentContentContainer}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revChatMsgHeaderWrapper,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorDark,
              revSiteStyles.revSiteTxtTiny,
              revSiteStyles.revSiteTxtBold,
            ]}>
            {revPublisherEntityNames_Trunc}
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny_X,
              styles.revChatMsgSendTime,
            ]}>
            {revFormatLongDate(revVarArgs._revTimeCreated)}
          </Text>

          <View
            style={[
              styles.revChatMsgOptionsTabWrapper,
              {width: 'auto', position: 'relative', top: -3},
            ]}>
            <View
              style={[
                {
                  backgroundColor: '#DDD',
                  width: '100%',
                  position: 'relative',
                  height: 1,
                  top: '50%',
                },
              ]}
            />

            <View
              style={[revSiteStyles.revFlexWrapper_WidthAuto, {marginLeft: 8}]}>
              <View
                style={[
                  styles.revChatMsgOptionsTab,
                  {backgroundColor: '#F7F7F7'},
                ]}>
                <AntDesign
                  name="retweet"
                  style={[
                    revSiteStyles.revSiteTxtColorLight,
                    revSiteStyles.revSiteTxtNormal,
                  ]}
                />
              </View>

              <View
                style={[
                  styles.revChatMsgOptionsTab,
                  {backgroundColor: '#F7F7F7'},
                ]}>
                <TouchableOpacity>
                  <MaterialIcons
                    name="emoji-flags"
                    style={[
                      revSiteStyles.revSiteTxtColorLight,
                      revSiteStyles.revSiteTxtSmall,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revChatMsgCommentContentTxtContainer,
          ]}>
          {revChatMessageText(revCommentTxtVal)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  revCommentMsgUserIcon: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 27,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    paddingHorizontal: 2,
    marginTop: 2,
    borderRadius: 2,
  },
  revChatCommentNonIcon: {
    color: '#c5e1a5',
    fontSize: 15,
  },
  revChatMsgCommentContentContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  revChatMsgHeaderWrapper: {
    alignItems: 'baseline',
    marginBottom: 2,
  },
  revChatMsgSendTime: {
    marginRight: 12,
    marginLeft: 5,
  },
  revChatMsgOptionsTabWrapper: {
    alignItems: 'center',
    marginLeft: 'auto',
  },
  revChatMsgOptionsTab: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 2,
    borderRadius: 32,
  },
  revChatMsgCommentContentTxtContainer: {
    paddingRight: 5,
  },
  revChatMsgContentTxtContainer: {
    paddingRight: 5,
  },
});

import React, {useContext, useState, useCallback} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import DocumentPicker, {isInProgress} from 'react-native-document-picker';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {useRevCreateCommentAction} from '../../../rev_actions/rev_create_comment_action';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

const {RevPersLibRead_React} = NativeModules;

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCommentFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  let revIsCommentUpdate = false;

  if (revVarArgs.hasOwnProperty('revIsCommentUpdate')) {
    revIsCommentUpdate = revVarArgs.revIsCommentUpdate;
  }

  let revCommentTxtVal = '';

  let revCancelFunc;

  if (!revVarArgs.hasOwnProperty('revCancel')) {
    return null;
  }

  if (!revVarArgs.hasOwnProperty('revEntity')) {
    return null;
  }

  let revCommentContainerEntity = revVarArgs.revEntity;
  let revCommentContainerEntityGUID = revCommentContainerEntity._revGUID;

  revCancelFunc = revVarArgs.revCancel;

  var handleRevSitePublisherCancelTab = () => {
    revCancelFunc();
  };

  if (
    !revIsEmptyJSONObject(revVarArgs) &&
    revVarArgs.hasOwnProperty('revEntity') &&
    revIsCommentUpdate
  ) {
    let revInfoEntityGUIDArrStr =
      RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_entity_info',
        revCommentContainerEntityGUID,
      );

    let revInfoEntityGUIDArr = JSON.parse(revInfoEntityGUIDArrStr);

    if (
      !Array.isArray(revInfoEntityGUIDArr) ||
      revInfoEntityGUIDArr.length < 1
    ) {
      return null;
    }

    let revInfoEntityGUID = revInfoEntityGUIDArr[0];

    let revInfoEntityStr =
      RevPersLibRead_React.revPersGetEntity_By_GUID(revInfoEntityGUID);

    let revInfoEntity = JSON.parse(revInfoEntityStr);

    revCommentTxtVal = revGetMetadataValue(
      revInfoEntity._revMetadataList,
      'revPostText',
    );
  }

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const [revCommentText, setRevCommentText] = useState(revCommentTxtVal);

  const [revSelectedMedia, setRevSelectedMedia] = useState(null);

  const {revCreateCommentAction} = useRevCreateCommentAction();

  const revHandleCreateCommentTab = () => {
    let revPassVaArgs = {
      revCommentContainerGUID: revCommentContainerEntityGUID,
      revIsCommentUpdate: revIsCommentUpdate,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revCommentText: revCommentText,
      revSelectedMedia: revSelectedMedia,
    };

    revCreateCommentAction(revPassVaArgs, revRetData => {
      if (revRetData) {
        setRevCommentText('');
        handleRevSitePublisherCancelTab();
      }
    });
  };

  const revHandleError = err => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const revHandleOnMediaSelectTab = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });

      setRevSelectedMedia(response);
    } catch (err) {
      revHandleError(err);
    }
  }, [revSelectedMedia]);

  let revBtnTxt = revIsCommentUpdate ? 'Update' : 'Publish';

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        styles.revSitePublisherContainer,
      ]}>
      <TextInput
        style={styles.revCommentTextInput}
        placeholder=" . . ."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={3}
        onChangeText={revNewText => {
          setRevCommentText(revNewText);
        }}
        defaultValue={revCommentText}
      />

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revSitePublisherFooterWrapper,
        ]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revSitePublisherSubmitTabWrapper,
          ]}>
          <TouchableOpacity
            onPress={() => {
              revHandleCreateCommentTab();
            }}>
            <Text
              style={[
                revSiteStyles.revSiteTxtTiny_X,
                styles.revSitePublisherSubmitTab,
              ]}>
              {revBtnTxt}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[{marginLeft: 5}]}
          onPress={() => {
            revHandleOnMediaSelectTab();
          }}>
          <Feather
            name="upload"
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              styles.revSiteTxtMedium,
              styles.revSitePublisherUpload,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleRevSitePublisherCancelTab();
          }}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              styles.revSitePublisherCancelTab,
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
                revSiteStyles.revSiteTxtTiny_X,
              ]}
            />{' '}
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatFooterWrapper: {
    backgroundColor: '#FFF',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  revSitePublisherTabWrapper: {
    marginLeft: 'auto',
  },
  revSitePublisherTab: {
    color: '#FFF',
    fontSize: 12,
    backgroundColor: '#757575',
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginLeft: 1,
    borderRadius: 1,
  },
  footerSubmitOptionsLeftWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelComposeChatMsg: {
    fontWeight: 'bold',
    marginTop: 2,
    paddingHorizontal: 8,
  },
  rightFooterSubmitOptionsWrapper: {
    alignItems: 'center',
    width: 'auto',
    marginRight: 14,
    marginLeft: 'auto',
  },
  rightFooterOptionTab: {
    paddingHorizontal: 10,
    paddingBottom: 3,
  },
  rightFooterHelpTab: {
    paddingBottom: 1,
  },
  revSitePublisherContainer: {
    borderColor: '#EEE',
    borderWidth: 1,
    marginTop: 4,
    marginHorizontal: 4,
  },
  revSitePublisherTagsInput: {
    color: '#444',
    fontSize: 11,
    paddingHorizontal: 5,
    padding: 0,
  },
  revCommentTextInput: {
    color: '#444',
    fontSize: 10,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
  },
  revSitePublisherFooterWrapper: {
    alignItems: 'center',
    borderTopColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingLeft: 4,
    paddingBottom: 8,
  },
  revSitePublisherSubmitTabWrapper: {
    width: 'auto',
  },
  revSitePublisherSubmitTab: {
    color: '#FFF',
    backgroundColor: '#444',
    width: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 32,
  },
  revSitePublisherUpload: {
    paddingHorizontal: 8,
  },
  revSitePublisherCancelTab: {
    paddingHorizontal: 5,
  },
});

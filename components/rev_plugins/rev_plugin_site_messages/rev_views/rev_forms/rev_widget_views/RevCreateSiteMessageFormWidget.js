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

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {useRevCreateCommentAction} from '../../../rev_actions/rev_create_site_message_action';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

const {RevPersLibRead_React} = NativeModules;

export const RevCreateSiteMessageFormWidget = ({revVarArgs}) => {
  revVarArgs = revVarArgs.revVarArgs;

  let revIsCommentUpdate = false;

  if (revVarArgs.hasOwnProperty('revIsCommentUpdate')) {
    revIsCommentUpdate = revVarArgs.revIsCommentUpdate;
  }

  let revEntityDescInputTextVal = '';

  let revCancelFunc;

  if (!revVarArgs.hasOwnProperty('revCancel')) {
    return null;
  }

  if (!revVarArgs.hasOwnProperty('revEntity')) {
    return null;
  }

  let revContainerEntity = revVarArgs.revEntity;
  let revContainerRemoteEntityGUID = revContainerEntity._revRemoteEntityGUID;

  if (revContainerRemoteEntityGUID < 1) {
    return null;
  }

  let revContainerLocalEntityGUID =
    RevPersLibRead_React.revGetLocalEntityGUID_BY_RemoteEntityGUID(
      revContainerRemoteEntityGUID,
    );

  if (revContainerLocalEntityGUID < 1) {
    return null;
  }

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
      RevPersLibRead_React.revPersGetALLRevEntityRelationshipsSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_entity_info',
        revContainerLocalEntityGUID,
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
      RevPersLibRead_React.revPersGetRevEntityByGUID(revInfoEntityGUID);

    let revInfoEntity = JSON.parse(revInfoEntityStr);

    revEntityDescInputTextVal = revGetMetadataValue(
      revInfoEntity._revEntityMetadataList,
      'rev_entity_desc_val',
    );
  }

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const [revEntityDescValText, setRevEntityDescValText] = useState(
    revEntityDescInputTextVal,
  );

  const [revSelectedMedia, setRevSelectedMedia] = useState(null);

  const {revCreateCommentAction} = useRevCreateCommentAction();

  const revHandleCreateCommentTab = () => {
    let revPassVaArgs = {
      revCommentContainerGUID: revContainerLocalEntityGUID,
      revIsCommentUpdate: revIsCommentUpdate,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revEntityDescVal: revEntityDescValText,
      revSelectedMedia: revSelectedMedia,
    };

    revCreateCommentAction(revPassVaArgs, revRetData => {
      if (revRetData) {
        setRevEntityDescValText('');
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
    <View style={[styles.revFlexContainer, styles.revSitePublisherContainer]}>
      <TextInput
        style={styles.revEntityDescValTextInput}
        placeholder=" Your message"
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={3}
        onChangeText={revNewText => {
          setRevEntityDescValText(revNewText);
        }}
        defaultValue={revEntityDescValText}
      />

      <View
        style={[styles.revFlexWrapper, styles.revSitePublisherFooterWrapper]}>
        <View
          style={[
            styles.revFlexWrapper,
            styles.revSitePublisherSubmitTabWrapper,
          ]}>
          <TouchableOpacity
            onPress={() => {
              revHandleCreateCommentTab();
            }}>
            <Text
              style={[
                styles.revSiteTxtSmall,
                styles.revSitePublisherSubmitTab,
              ]}>
              {revBtnTxt}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            revHandleOnMediaSelectTab();
          }}>
          <FontAwesome
            name="upload"
            style={[
              styles.revSiteTxtColor,
              styles.revSiteTxtMedium,
              styles.revSitePublisherUpload,
            ]}></FontAwesome>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleRevSitePublisherCancelTab();
          }}>
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteTxtTiny,
              styles.revSiteFontBold,
              styles.revSitePublisherCancelTab,
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteTxtTiny,
                styles.revSiteFontWeightNormal,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteTxtTiny,
                styles.revSiteFontWeightNormal,
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
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteFontBold: {
    fontWeight: '500',
  },
  revSiteFontWeightNormal: {
    fontWeight: '100',
  },
  revSiteTxtTiny: {
    fontSize: 9,
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revSiteTxtMediumLarge: {
    fontSize: 14,
  },
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
    borderColor: '#F7F7F7',
    borderWidth: 1,
    marginTop: 4,
  },
  revSitePublisherTagsInput: {
    color: '#444',
    fontSize: 11,
    paddingHorizontal: 5,
    padding: 0,
  },
  revEntityDescValTextInput: {
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
    borderTopColor: '#F7F7F7',
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
    marginLeft: 5,
  },
  revSitePublisherCancelTab: {
    paddingHorizontal: 5,
  },
});

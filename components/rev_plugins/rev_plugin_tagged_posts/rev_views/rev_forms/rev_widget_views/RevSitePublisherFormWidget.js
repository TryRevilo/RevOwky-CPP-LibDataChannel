import React, {useContext, useState, useCallback, useRef} from 'react';

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
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {useRevCreateSitePostAction} from '../../../rev_actions/rev_create_site_post_action';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';

const {RevPersLibRead_React} = NativeModules;

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevSitePublisherFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  let revEntityGUID = -1;
  let revKiwiTxtVal = '';

  var handleRevSitePublisherCancelTab = () => {
    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER(null);
  };

  if (
    !revIsEmptyJSONObject(revVarArgs) &&
    revVarArgs.hasOwnProperty('revVarArgs')
  ) {
    revVarArgs = revVarArgs.revVarArgs;
    const {_revGUID: revEntityGUID = -1} = revVarArgs;

    let revInfoEntityGUIDArrStr =
      RevPersLibRead_React.revPersGetSubjectGUIDs_BY_RelStr_TargetGUID(
        'rev_entity_info',
        revEntityGUID,
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

    revKiwiTxtVal = revGetMetadataValue(
      revInfoEntity._revMetadataList,
      'rev_entity_desc',
    );

    if (revVarArgs.hasOwnProperty('revHideKiwiPublisherForm')) {
      handleRevSitePublisherCancelTab = revVarArgs.revHideKiwiPublisherForm;
    }
  }

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {SET_REV_SITE_FOOTER_1_CONTENT_VIEWER} = useContext(ReViewsContext);

  const [revTagText, setRevTagText] = useState('');
  const [revSitePostText, setRevSitePostText] = useState(revKiwiTxtVal);

  const revSelectedMediaRef = useRef([]);

  const {revCreateSitePostAction} = useRevCreateSitePostAction();

  const revHandleCreateSitePostTab = () => {
    let revVaArgs = {
      _revGUID: revEntityGUID,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revSitePostText,
      revSelectedMedia: revSelectedMediaRef.current,
    };

    revCreateSitePostAction(revVaArgs, revRetData => {
      if (revRetData) {
        setRevSitePostText('');
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

  const revHandleOnMediaSelectTab = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });

      revSelectedMediaRef.current = response;
    } catch (err) {
      revHandleError(err);
    }
  };

  let revBtnTxt = revEntityGUID < 0 ? 'Publish' : 'Update';

  return (
    <View style={[styles.revFlexContainer, styles.revSitePublisherContainer]}>
      <TextInput
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtTiny,
          styles.revSitePublisherTagsInput,
        ]}
        placeholder=" #tags"
        placeholderTextColor="#999"
        onChangeText={newText => {
          setRevTagText(newText);
        }}
        defaultValue={revTagText}
      />

      <TextInput
        style={styles.revSitePostTextInput}
        placeholder=" What's on your mind . . ."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={5}
        onChangeText={newText => {
          setRevSitePostText(newText);
        }}
        defaultValue={revSitePostText}
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
              revHandleCreateSitePostTab();
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
          onPress={revHandleOnMediaSelectTab}>
          <Feather
            name="upload"
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              styles.revSiteTxtMedium,
              styles.revSitePublisherUpload,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={revHandleOnMediaSelectTab}>
          <FontAwesome
            name="flag-o"
            style={[
              revSiteStyles.revSiteTxtColor,
              styles.revSiteTxtSmall,
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
              revSiteStyles.revSiteTxtTiny_X,
              revSiteStyles.revSiteTxtBold,
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
    borderColor: '#F7F7F7',
    borderWidth: 1,
    marginTop: 4,
    marginHorizontal: 4,
  },
  revSitePublisherTagsInput: {
    paddingHorizontal: 5,
    padding: 0,
  },
  revSitePostTextInput: {
    color: '#444',
    fontSize: 8,
    textAlignVertical: 'top',
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
    borderTopColor: '#F7F7F7',
    borderTopWidth: 1,
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
  },
  revSitePublisherCancelTab: {
    paddingHorizontal: 5,
  },
});

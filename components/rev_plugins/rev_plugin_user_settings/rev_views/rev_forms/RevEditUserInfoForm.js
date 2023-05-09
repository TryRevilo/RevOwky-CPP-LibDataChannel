import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../rev_plugins_loader';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

export const RevEditUserInfoForm = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_SITE_VAR_ARGS, SET_REV_SITE_VAR_ARGS} =
    useContext(RevSiteDataContext);

  const {
    REV_PAGE_HEADER_CONTENT_VIEWER,
    SET_REV_PAGE_HEADER_CONTENT_VIEWER,
    REV_SITE_BODY,
    SET_REV_SITE_BODY,
  } = useContext(ReViewsContext);

  const [revTagText, setRevTagText] = useState('');
  const [revSearchText, setRevSearchText] = useState('');

  const handleRevCancelTabPress = () => {
    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevUserSettings);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });
  };

  const revHandleSearchTabPress = () => {
    SET_REV_SITE_BODY(null);

    let RevUserSettings = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevUserSettings',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevUserSettings);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });
  };

  return (
    <View
      style={[revSiteStyles.revFlexContainer, styles.revSearchInputContainer]}>
      <View>
        <TextInput
          style={revSiteStyles.revSiteTextInput}
          placeholder=" Full names . . ."
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />
        <TextInput
          style={styles.revAnoutMeContentInput}
          placeholder=" About me . . ."
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={5}
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />
        <View
          style={[revSiteStyles.revFlexWrapper, styles.revTagsInputWrapper]}>
          <TextInput
            style={styles.revSearchTagsInput}
            placeholder=" #tags"
            placeholderTextColor="#999"
            onChangeText={newText => {
              setRevTagText(newText);
            }}
            defaultValue={revTagText}
          />
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
              styles.revEnteredTags,
            ]}>
            # 0 entered
          </Text>
        </View>
      </View>

      <View
        style={[revSiteStyles.revFlexContainer, styles.revAddedMediaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            <FontAwesome name="camera" />
            <FontAwesome name="long-arrow-right" /> Profile pics
          </Text>
          <TouchableOpacity style={[styles.revAddMeadiaTab]}>
            <FontAwesome
              name="plus"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtSmall,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddedMediaTell,
            ]}>
            You have 0 pictures on your profile. You can upload up to 7
          </Text>
        </View>
      </View>

      <View
        style={[revSiteStyles.revFlexContainer, styles.revAddedMediaContainer]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtSmall,
            ]}>
            <FontAwesome name="dot-circle-o" />
            <FontAwesome name="long-arrow-right" /> Profile Vid{'  '}
          </Text>
          <TouchableOpacity style={[styles.revAddMeadiaTab]}>
            <FontAwesome
              name="plus"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtSmall,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddedMediaTell,
            ]}>
            You haven't uploaded a profile video
          </Text>
        </View>
      </View>

      <View
        style={[revSiteStyles.revFlexWrapper, styles.revSerachFooterWrapper]}>
        <TouchableOpacity onPress={revHandleSearchTabPress}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSaveTab,
            ]}>
            Save
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRevCancelTabPress}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revCancelTab,
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
            />{' '}
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 32;

const styles = StyleSheet.create({
  revSearchInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
    marginBottom: 8,
  },
  revTagsInputWrapper: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  revSearchTagsInput: {
    color: '#444',
    fontSize: 11,
    lineHeight: 12,
    textAlignVertical: 'bottom',
    flex: 1,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingTop: 2,
    paddingBottom: 2,
    height: 22,
  },
  revEnteredTags: {
    flex: 2,
    paddingBottom: 2,
    marginLeft: 4,
  },
  revAnoutMeContentInput: {
    color: '#444',
    fontSize: 11,
    textAlignVertical: 'top',
    borderTopColor: '#F7F7F7',
    borderTopWidth: 1,
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 12,
    marginTop: 8,
  },
  revAddedMediaContainer: {
    borderStyle: 'dotted',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginTop: 8,
    paddingLeft: 8,
  },
  revAddedMediaTitleWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  revAddMeadiaTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 22,
  },
  revAddedMediaTell: {
    marginTop: 4,
  },
  revSerachFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
  },
});

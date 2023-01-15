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

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

export const RevCreateNewStoreFormWidget = () => {
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

  let RevHeaderLink = ({revLinkText}) => {
    return (
      <TouchableOpacity>
        <Text
          style={[
            styles.revSiteTxtColorLight,
            styles.revSiteTxtSmall,
            styles.revHeaderTextLink,
          ]}>
          / {'   '}
          {revLinkText}
        </Text>
      </TouchableOpacity>
    );
  };

  let RevHeaderLinks = () => {
    return (
      <View style={styles.revFlexWrapper}>
        <RevHeaderLink revLinkText={'My Stores'} />
        <RevHeaderLink revLinkText={'Products'} />
      </View>
    );
  };

  let RevHeader = () => {
    return (
      <View style={[styles.revFlexWrapper, styles.revPageHeaderAreaWrapper]}>
        <Text style={styles.revContentBodyTtlTellTxt}>
          <FontAwesome name="dot-circle-o" />
          <FontAwesome name="long-arrow-right" /> All
        </Text>
        <View>
          <RevHeaderLinks />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.revFlexContainer]}>
      <RevHeader />
      <View style={[styles.revFlexContainer, styles.revSearchInputContainer]}>
        <View>
          <TextInput
            style={styles.revSiteSearchInput}
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
          <View style={[styles.revFlexWrapper, styles.revTagsInputWrapper]}>
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
                styles.revSiteTxtColorLight,
                styles.revSiteTxtSmall,
                styles.revEnteredTags,
              ]}>
              # 0 entered
            </Text>
          </View>
        </View>

        <View style={[styles.revFlexContainer, styles.revAddedMediaContainer]}>
          <View
            style={[styles.revFlexWrapper, styles.revAddedMediaTitleWrapper]}>
            <Text style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}>
              <FontAwesome name="camera" />
              <FontAwesome name="long-arrow-right" /> Profile pics
            </Text>
            <TouchableOpacity style={[styles.revAddMeadiaTab]}>
              <FontAwesome
                name="plus"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteTxtTiny,
                styles.revAddedMediaTell,
              ]}>
              You have 0 pictures on your profile. You can upload up to 7
            </Text>
          </View>
        </View>

        <View style={[styles.revFlexContainer, styles.revAddedMediaContainer]}>
          <View
            style={[styles.revFlexWrapper, styles.revAddedMediaTitleWrapper]}>
            <Text style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}>
              <FontAwesome name="dot-circle-o" />
              <FontAwesome name="long-arrow-right" /> Profile Vid{'  '}
            </Text>
            <TouchableOpacity style={[styles.revAddMeadiaTab]}>
              <FontAwesome
                name="plus"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteTxtTiny,
                styles.revAddedMediaTell,
              ]}>
              You haven't uploaded a profile video
            </Text>
          </View>
        </View>

        <View style={[styles.revFlexWrapper, styles.revSerachFooterWrapper]}>
          <TouchableOpacity onPress={revHandleSearchTabPress}>
            <Text
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtSmall,
                styles.revSearchTab,
              ]}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRevCancelTabPress}>
            <Text
              style={[
                styles.revSiteTxtColor,
                styles.revSiteTxtSmall,
                styles.revCancelTab,
              ]}>
              <FontAwesome
                name="dot-circle-o"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />
              <FontAwesome
                name="long-arrow-right"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />{' '}
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 32;

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
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
    alignItems: 'flex-start',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 8,
  },
  revPageHeaderAreaWrapper: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revHeaderTextLink: {
    marginLeft: 4,
  },
  revSearchInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
    marginTop: 8,
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
  revSiteSearchInput: {
    color: '#444',
    fontSize: 11,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
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
  revSearchTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    width: 'auto',
    paddingHorizontal: 22,
    paddingVertical: 3,
    marginLeft: 5,
  },
  revCancelTab: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});

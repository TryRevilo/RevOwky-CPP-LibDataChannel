import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../rev_plugins_loader';

export const RevSearchForm = () => {
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
    SET_REV_PAGE_HEADER_CONTENT_VIEWER(null);
  };

  const revHandleSearchTabPress = () => {
    let RevSearchEntitiesListing = revPluginsLoader({
      revPluginName: 'rev_plugin_search',
      revViewName: 'RevSearchEntitiesListing',
      revData: 'Hello World!',
    });

    SET_REV_SITE_BODY(RevSearchEntitiesListing);

    SET_REV_SITE_VAR_ARGS({
      revRemoteEntityGUID: 0,
    });

    SET_REV_PAGE_HEADER_CONTENT_VIEWER(null);
  };

  return (
    <View style={[styles.revFlexContainer, styles.revSearchInputContainer]}>
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
      <View>
        <TextInput
          style={styles.revSiteSearchInput}
          placeholder=" Search text . . ."
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />
      </View>
      <View style={[styles.revFlexWrapper, styles.revSerachFooterWrapper]}>
        <TouchableOpacity onPress={revHandleSearchTabPress}>
          <Text
            style={[
              styles.revSiteTxtColor,
              styles.revSiteTxtSmall,
              styles.revSearchTab,
            ]}>
            Search
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
  );
};

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
  revSearchInputContainer: {
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
    marginTop: 8,
    marginBottom: 8,
  },
  revTagsInputWrapper: {
    alignItems: 'flex-end',
  },
  revSearchTagsInput: {
    color: '#444',
    fontSize: 11,
    lineHeight: 12,
    textAlignVertical: 'bottom',
    flex: 1,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    borderBottomWidth: 0,
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
  revSerachFooterWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  revSearchTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    width: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 5,
    borderRadius: 22,
  },
  revCancelTab: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});

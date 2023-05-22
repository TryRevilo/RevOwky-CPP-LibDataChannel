import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {RevInfoArea} from '../../../../../rev_views/rev_page_views';
import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {
  RevTagsInput,
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
} from '../../../../../rev_views/rev_input_form_views';

import {RevTagsOutputListing} from '../../../../../rev_views/rev_output_form_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevEditUserInfoForm_Widget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {SET_REV_SITE_VAR_ARGS} = useContext(RevSiteDataContext);
  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  const [revTagsOutputView, setRevTagsOutputView] = useState(null);
  const [revTagsArr, setRevTagsArr] = useState([]);
  const [revSearchText, setRevSearchText] = useState('');
  const [revBriefInfoTxt, setRevBriefInfoTxt] = useState('');
  const [revAboutEntityInfo, setRevAboutEntityInfo] = useState('');

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

  useEffect(() => {
    setRevTagsOutputView(
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revTagsListingWrapper]}>
        <RevTagsOutputListing
          revVarArgs={{
            revTagsArr: revTagsArr,
            revDelTagItemCallBack: revDelTagItem => {
              console.log('>>> revDelTagItem', revDelTagItem);

              setRevTagsArr(prevState => {
                return prevState.filter(revCurr => {
                  return revCurr !== revDelTagItem;
                });
              });
            },
          }}
        />
      </View>,
    );
  }, [revTagsArr]);

  let revInfoTell =
    'This is the info others will read about you on your profile';

  let revRetView = (
    <View
      style={[revSiteStyles.revFlexContainer, styles.revFormInputContainer]}>
      <RevInfoArea revInfoText={revInfoTell}></RevInfoArea>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          revSiteStyles.revMarginTopSmall,
        ]}>
        <TextInput
          style={revSiteStyles.revSiteTextInput}
          placeholder=" Full names . . ."
          placeholderTextColor="#999"
          onChangeText={newText => {
            setRevSearchText(newText);
          }}
          defaultValue={revSearchText}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputWithCount
            revVarArgs={{
              revPlaceHolderTxt: ' Brief desc . . .',
              revTextInputOnChangeCallBack: revNewTxt => {
                setRevBriefInfoTxt(revNewTxt);
              },
              revMaxTxtCount: 55,
            }}
          />
        </View>

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revPlaceHolderTxt: ' About me . . .',
              revTextInputOnChangeCallBack: revNewTxt => {
                setRevAboutEntityInfo(revNewTxt);
              },
              revMaxTxtCount: 255,
            }}
          />
        </View>

        <View style={[revSiteStyles.revFlexPageContainer]}>
          <RevTagsInput
            revVarArgs={{
              revTagsInputUpdater: revLatestTagsArr => {
                setRevTagsArr(revLatestTagsArr);
              },
            }}
          />

          {revTagsOutputView}
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
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
        ]}>
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

  return <RevScrollView_V revScrollViewContent={revRetView}></RevScrollView_V>;
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 32;

const styles = StyleSheet.create({
  revFormInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
  },
  revBriefDescInputWrapper: {
    marginTop: 8,
  },
  revTagsListingWrapper: {marginTop: 2},
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
});

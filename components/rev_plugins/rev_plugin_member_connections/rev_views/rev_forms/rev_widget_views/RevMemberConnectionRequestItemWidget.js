import React, {useState, useContext} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {LoremIpsum} from 'lorem-ipsum';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';
import {
  revFormatLongDate,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetLocal_OR_RemoteGUID} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';
import {revTruncateString} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevMemberConnectionRequestItemWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (revIsEmptyJSONObject(revVarArgs)) {
    return null;
  }

  let revOwkiMemberEntity = revVarArgs.revVarArgs;

  if (revIsEmptyJSONObject(revOwkiMemberEntity)) {
    return null;
  }

  let revEntityGUID = revGetLocal_OR_RemoteGUID(revOwkiMemberEntity);

  if (revEntityGUID < 1) {
    return null;
  }

  if (!revOwkiMemberEntity.hasOwnProperty('_revInfoEntity')) {
    return null;
  }

  const [revIsSiteMessageForm, setRevIsSiteMessageForm] = useState(false);

  const {SET_REV_SITE_BODY} = useContext(ReViewsContext);

  let revUserTimeCreated = revOwkiMemberEntity._revTimeCreated;
  revUserTimeCreated = revFormatLongDate(revUserTimeCreated);

  let revUserInfoEntity = revOwkiMemberEntity._revInfoEntity;

  let revUserEntityNames = revGetMetadataValue(
    revUserInfoEntity._revMetadataList,
    'rev_entity_name',
  );
  let revUserEntityNames_Trunc = revTruncateString(revUserEntityNames, 22);

  const handleRevUserProfileClick = () => {
    let RevUserProfileObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_user_profile',
      revViewName: 'rev_object_views',
      revVarArgs: revOwkiMemberEntity,
    });

    SET_REV_SITE_BODY(RevUserProfileObjectView);
  };

  let minMessageLen = 10;
  let maxMessageLen = 55;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 2,
      min: 1,
    },
    wordsPerSentence: {
      max: getRndInteger(minMessageLen, maxMessageLen),
      min: getRndInteger(1, 2),
    },
  });

  let revUserInfoDescTxt = lorem.generateSentences(getRndInteger(1, 2));
  let revUserInfoDescTxt_Trunc = revTruncateString(revUserInfoDescTxt, 140);

  const revCreateSiteMessageForm = () => {
    let revCreateSiteMessageFormView = revPluginsLoader({
      revPluginName: 'rev_plugin_site_messages',
      revViewName: 'revCreateSiteMessageForm',
      revVarArgs: {
        revEntity: revOwkiMemberEntity,
        revIsCommentUpdate: false,
        revCancel: () => {
          setRevIsSiteMessageForm(false);
        },
      },
    });

    return revCreateSiteMessageFormView;
  };

  const handleCreateSiteMessagePress = () => {
    setRevIsSiteMessageForm(true);
  };

  let revOptionTab = [
    revSiteStyles.revSiteTxtColorLight,
    revSiteStyles.revSiteTxtTiny_X,
    {
      backgroundColor: '#F7F7F7',
      borderStyle: 'dotted',
      borderBottomColor: '#EEE',
      borderBottomWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginRight: 1,
      marginBottom: -1,
    },
  ];

  return (
    <View style={revSiteStyles.revFlexWrapper}>
      <TouchableOpacity
        onPress={() => {
          handleRevUserProfileClick();
        }}>
        <View style={styles.revUserIconTab}>
          <FontAwesome
            name="user"
            style={[revSiteStyles.revSiteTxtLarge, {color: '#c5e1a5'}]}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.revBodyWrapper}>
        <View style={styles.revBodyCarretView}>
          <FontAwesome
            name="caret-left"
            style={[
              revSiteStyles.revSiteTxtColorLight_X,
              revSiteStyles.revSiteTxtMedium,
            ]}
          />
        </View>
        <View style={styles.revContentContainer}>
          <View
            style={
              (revSiteStyles.revFlexWrapper, styles.revContentHeaderWrapper)
            }>
            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                {alignItems: 'baseline'},
              ]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtTiny_X,
                  revSiteStyles.revSiteTxtBold,
                ]}>
                {revUserEntityNames_Trunc}
              </Text>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny_X,
                  styles.revTime,
                ]}>
                {revUserTimeCreated}
              </Text>
            </View>
            <View
              style={[
                revSiteStyles.revFlexWrapper_WidthAuto,
                styles.revOptionsWrapper,
                {marginTop: -15},
              ]}>
              <FontAwesome name="plus" style={revOptionTab} />

              <TouchableOpacity onPress={handleCreateSiteMessagePress}>
                <FontAwesome name="envelope-o" style={revOptionTab} />
              </TouchableOpacity>

              <FontAwesome
                name="times"
                style={[
                  ...revOptionTab,
                  revSiteStyles.revSiteTxtAlertDangerColor_Light,
                ]}
              />
            </View>
          </View>

          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtTiny,
              styles.revPostTagsListWrapper,
            ]}>
            {revUserInfoDescTxt_Trunc}
          </Text>

          {revIsSiteMessageForm ? revCreateSiteMessageForm() : null}
        </View>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revUserIconTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 'auto',
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 5,
    marginTop: 2,
    borderRadius: 100,
  },
  revBodyWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginLeft: 3,
  },
  revBodyCarretView: {
    height: 'auto',
    marginTop: 8,
    marginRight: 1,
    marginLeft: 1,
    zIndex: 1,
  },
  revContentContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  revContentHeaderWrapper: {
    alignItems: 'baseline',
    borderBottomColor: '#rgba(27, 31, 35, 0.06)',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  revTime: {
    marginRight: 12,
    marginLeft: 5,
  },
  revOptionsWrapper: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
  },
  revPostTagsListWrapper: {
    alignItems: 'flex-end',
    paddingVertical: 4,
  },
});

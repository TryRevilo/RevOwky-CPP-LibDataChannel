import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';
import React, {useState, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {useRevPersGetRevEnty_By_EntityGUID} from '../../../../../rev_libs_pers/rev_pers_rev_entity/rev_pers_lib_read/rev_pers_entity_custom_hooks';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

const {RevPersLibUpdate_React} = NativeModules;

export const RevUserSettingsWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    REV_SITE_ENTITY_GUID,
    REV_LOGGED_IN_ENTITY_GUID,
    REV_LOGGED_IN_ENTITY,
    SET_REV_LOGGED_IN_ENTITY_GUID,
  } = useContext(RevSiteDataContext);

  if (
    revIsEmptyJSONObject(REV_LOGGED_IN_ENTITY) ||
    !REV_LOGGED_IN_ENTITY.hasOwnProperty('_revInfoEntity')
  ) {
    return null;
  }

  if (REV_LOGGED_IN_ENTITY_GUID < 1) {
    return null;
  }

  const {revPersGetRevEnty_By_EntityGUID} =
    useRevPersGetRevEnty_By_EntityGUID();

  const [revIsEditView, setRevIsEditView] = useState(false);

  let RevHeaderLink = ({revLinkText, revOnPress}) => {
    return (
      <TouchableOpacity onPress={revOnPress}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revHeaderTextLink,
          ]}>
          / {'  '}
          {revLinkText}
        </Text>
      </TouchableOpacity>
    );
  };

  const revHandleEditAccountSettingsTabPressed = () => {
    let revEditAccountSettingsForm = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevEditAccountSettingsForm',
      revData: {},
    });

    setRevIsEditView(false);
    setRevSettingsBody(revEditAccountSettingsForm);
  };

  let RevHeaderLinks = () => {
    return (
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revHeaderLinksWrapper]}>
        <RevHeaderLink
          revLinkText={'info'}
          revOnPress={() => {
            setRevSettingsBody(<RevInfoSettings />);
          }}
        />
        <RevHeaderLink
          revLinkText={'account'}
          revOnPress={revHandleEditAccountSettingsTabPressed}
        />

        {revIsEditView ? <RevGetBackTab /> : <RevGetEditTab />}
      </View>
    );
  };

  const revHandleOnLogOutTabPressed = () => {
    let revSiteEntity = revPersGetRevEnty_By_EntityGUID(REV_SITE_ENTITY_GUID);

    if (revSiteEntity && revSiteEntity._revEntityResolveStatus > -1) {
      RevPersLibUpdate_React.setRevEntityResolveStatusByRevEntityGUID(
        0,
        revSiteEntity._revEntityGUID,
      );

      SET_REV_LOGGED_IN_ENTITY_GUID(-1);
    }
  };

  let RevHeader = () => {
    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revPageHeaderAreaWrapper,
        ]}>
        <TouchableOpacity onPress={revHandleOnLogOutTabPressed}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revContentBodyTtlTellTxt,
            ]}>
            <FontAwesome
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
              name="dot-circle-o"
            />
            <FontAwesome
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
              name="long-arrow-right"
            />{' '}
            Log out
          </Text>
        </TouchableOpacity>

        <RevHeaderLinks />
      </View>
    );
  };

  const RevInfoSettings = () => {
    let revUserProfileObjectView = revPluginsLoader({
      revPluginName: 'rev_plugin_user_profile',
      revViewName: 'rev_object_views',
      revVarArgs: {revEntity: REV_LOGGED_IN_ENTITY, revAddPageHeader: false},
    });

    return revUserProfileObjectView;
  };

  const [RevSettingsBody, setRevSettingsBody] = useState(<RevInfoSettings />);

  const revHandleEditInfoTabPressed = () => {
    let RevEditUserInfoForm = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevEditUserInfoForm',
      revData: {},
    });

    setRevIsEditView(!revIsEditView);

    if (!revIsEditView) {
      setRevSettingsBody(RevEditUserInfoForm);
    } else {
      setRevSettingsBody(<RevInfoSettings />);
    }
  };

  const RevGetEditTab = () => {
    return (
      <TouchableOpacity onPress={revHandleEditInfoTabPressed}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtBold,
            revSiteStyles.revSiteTxtTiny,
            styles.revEditTab,
          ]}>
          <FontAwesome name="edit" style={revSiteStyles.revSiteTxtTiny} /> -
          Edit
        </Text>
      </TouchableOpacity>
    );
  };

  const RevGetBackTab = () => {
    return (
      <TouchableOpacity onPress={revHandleEditInfoTabPressed}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtSmall,
            styles.revEditTab,
          ]}>
          <FontAwesome
            name="long-arrow-left"
            style={[
              revSiteStyles.revSiteTxtSmall,
              styles.revSiteTxtWeightNormal,
            ]}
          />
          <FontAwesome
            name="dot-circle-o"
            style={[
              revSiteStyles.revSiteTxtSmall,
              styles.revSiteTxtWeightNormal,
            ]}
          />{' '}
          BacK
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        styles.revSearchResultsContainer,
      ]}>
      <RevHeader />
      <View style={[revSiteStyles.revFlexContainer]}>{RevSettingsBody}</View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revHeaderLinksWrapper: {
    alignItems: 'baseline',
  },
  revHeaderTextLink: {
    paddingLeft: 12,
  },
  revContentBodyTtlTellTxt: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 15,
  },
  revSearchResultsContainer: {
    width: maxChatMessageContainerWidth,
  },
  revUserInfoSettingsContainer: {
    marginTop: 0,
  },
  revEditTab: {
    paddingHorizontal: 15,
  },
  revUserInfoWrapper: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  revUserInfoLabel: {
    textAlign: 'right',
    width: 55,
  },
  revUserInfoVal: {
    width: maxChatMessageContainerWidth - 55,
    marginLeft: 4,
  },
});

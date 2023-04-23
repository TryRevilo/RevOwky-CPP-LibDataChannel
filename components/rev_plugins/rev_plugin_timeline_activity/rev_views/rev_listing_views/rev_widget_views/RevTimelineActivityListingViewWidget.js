import {StyleSheet, Text, View, NativeModules} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';
import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {RevRemoteSocketContext} from '../../../../../../rev_contexts/RevRemoteSocketContext';
import RevNullMessagesView from '../../../../../rev_views/RevNullMessagesView';

import {revPluginsLoader} from '../../../../../rev_plugins_loader';
import {revGetServerData_JSON} from '../../../../../rev_libs_pers/rev_server/rev_pers_lib_read';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevTimelineActivityListingViewWidget = () => {
  const {revSiteStyles} = useRevSiteStyles();

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const {REV_SITE_BODY, SET_REV_SITE_BODY, REV_SITE_FOOTER_1_CONTENT_VIEWER} =
    useContext(ReViewsContext);

  const revPostsStateTxt = revTxt => {
    return (
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtSmall,
          revSiteStyles.revSiteTxtBold,
          styles.revActivityContentCountTxt,
        ]}>
        {revTxt}
      </Text>
    );
  };

  const [revActivityContentCount, revSetActivityContentCount] = useState(
    revPostsStateTxt(' Loading . . .'),
  );

  useEffect(() => {
    let revErrTxt = '';

    let revGetServerData = async () => {
      try {
        let revURL =
          REV_ROOT_URL +
          '/rev_api?' +
          'rev_logged_in_entity_guid=' +
          REV_LOGGED_IN_ENTITY_GUID +
          '&rev_entity_guid=' +
          -1 +
          '&revPluginHookContextsRemoteArr=revHookRemoteHandlerReadOwkyTimelineEntities';

        revGetServerData_JSON(revURL, revRetData => {
          if (
            revRetData.hasOwnProperty('revError') ||
            revRetData.hasOwnProperty('revServerStatus') ||
            revRetData.revServerStatus == 'Network Request Failed'
          ) {
            revErrTxt = JSON.stringify(revRetData);
            revSetActivityContentCount(revPostsStateTxt(revErrTxt));

            return;
          }

          if (revRetData && revRetData.hasOwnProperty('revTimelineEntities')) {
            let RevTaggedPostsListing = revPluginsLoader({
              revPluginName: 'rev_plugin_tagged_posts',
              revViewName: 'RevTaggedPostsListing',
              revVarArgs: revRetData,
            });

            SET_REV_SITE_BODY(RevTaggedPostsListing);
          }
        });
      } catch (error) {
        let revErrTxt = 'Error connecting to Owki ! - ';

        if (error) {
          revErrTxt = revErrTxt + JSON.stringify(error);
        }

        revSetActivityContentCount(revPostsStateTxt(revErrTxt));
      }
    };

    // revGetServerData();
  }, []);

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      {revActivityContentCount}
    </View>
  );
};

const styles = StyleSheet.create({
  revActivityContentCountTxt: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

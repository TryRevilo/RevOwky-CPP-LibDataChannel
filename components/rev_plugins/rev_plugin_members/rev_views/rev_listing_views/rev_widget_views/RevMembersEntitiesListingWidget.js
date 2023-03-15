import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import RevPageContentHeader from '../../../../../rev_views/RevPageContentHeader';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {revGetRandInteger} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revPluginsLoader} from '../../../../../rev_plugins_loader';

export const RevMembersEntitiesListingWidget = ({revVarArgs}) => {
  if (revIsEmptyJSONObject(revVarArgs)) {
    return null;
  }

  revVarArgs = revVarArgs.revVarArgs;

  if (!revVarArgs.hasOwnProperty('revOwkiMemberEntitiesArr')) {
    return null;
  }

  let revOwkiMemberEntitiesArr = revVarArgs.revOwkiMemberEntitiesArr;

  if (!revOwkiMemberEntitiesArr.length) {
    return null;
  }

  const {revSiteStyles} = useRevSiteStyles();

  const RevGetMembersViews = () => {
    let revViewsArr = [];

    for (let i = 0; i < revOwkiMemberEntitiesArr.length; i++) {
      let revOwkiMemberEntity = revOwkiMemberEntitiesArr[i];

      let RevMembersListingItem = revPluginsLoader({
        revPluginName: 'rev_plugin_members',
        revViewName: 'RevMembersListingItem',
        revVarArgs: revOwkiMemberEntity,
      });

      revViewsArr.push(
        <View key={'RevGetMembersViews_' + revGetRandInteger(10, 1000)}>
          {RevMembersListingItem}
        </View>,
      );
    }

    return revViewsArr;
  };

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      <RevPageContentHeader revVarArgs={{revIsIndented: true}} />
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revSearchResultsContainer,
        ]}>
        <View style={revSiteStyles.revFlexContainer}>
          {RevGetMembersViews().map(RevView => {
            return RevView;
          })}
        </View>
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  revSearchResultsContainer: {
    marginTop: 8,
    width: pageWidth - 10,
  },
});

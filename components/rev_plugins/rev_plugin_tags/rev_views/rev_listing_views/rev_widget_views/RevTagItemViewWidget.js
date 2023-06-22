import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {revGetMetadataValue} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevTagItemViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !('revVarArgs' in revVarArgs) ||
    revIsEmptyJSONObject(revVarArgs.revVarArgs)
  ) {
    return null;
  }

  revVarArgs = revVarArgs.revVarArgs;

  if (
    !('_revInfoEntity' in revVarArgs) ||
    revIsEmptyJSONObject(revVarArgs._revInfoEntity)
  ) {
    return null;
  }

  let revInfoEntity = revVarArgs._revInfoEntity;

  let revTagEntityTitleTxtVal = revGetMetadataValue(
    revInfoEntity._revEntityMetadataList,
    'rev_entity_name_val',
  );

  return (
    <TouchableOpacity>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
          styles.revPostTagsListItem,
        ]}>
        {revTagEntityTitleTxtVal}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  revPostTagsListItem: {
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 4,
  },
});

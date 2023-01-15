import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';

import {RevRemoteSocketContext} from '../../../../../../rev_contexts/RevRemoteSocketContext';
import {revGetServerData_JSON_Async} from '../../../../../rev_libs_pers/rev_server/rev_pers_lib_read';

export const RevTimelineActivityListingViewWidget = () => {
  const {REV_ROOT_URL} = useContext(RevRemoteSocketContext);

  const revPostsStateTxt = revTxt => {
    return (
      <Text
        style={[
          styles.revSiteTxtColorLight,
          styles.revSiteTxtSmall,
          styles.revSiteTxtBold,
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
    (async function revGetServerData() {
      try {
        let revURL =
          REV_ROOT_URL +
          '/rev_api?' +
          'rev_logged_in_entity_guid=' +
          1 +
          '&rev_entity_guid=' +
          1 +
          '&revPluginHookContextsRemoteArr=revHookRemoteReadTimelineEntities';

        let revData = await revGetServerData_JSON_Async(revURL);

        if (revData && revData.hasOwnProperty('revTimelineEntities')) {
          revSetActivityContentCount(
            revPostsStateTxt('Posts    -' + revData.revTimelineEntities.length),
          );
        } else {
          revSetActivityContentCount(
            revPostsStateTxt('Error connecting to Owki !'),
          );
        }
      } catch (error) {
        console.log('>>> error ' + error);
      }
    })();
  }, []);

  return (
    <View style={[styles.revFlexContainer]}>{revActivityContentCount}</View>
  );
};

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtNormal: {
    fontSize: 11,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revSiteTxtLarge: {
    fontSize: 14,
  },
  revSiteTxtBold: {
    fontWeight: 'bold',
  },
  revSiteTxtWeightNormal: {
    fontWeight: '100',
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
  revActivityContentCountTxt: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

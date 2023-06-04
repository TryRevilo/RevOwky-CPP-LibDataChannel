import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  RevScrollView_H,
  RevInfoArea,
  RevCenteredImage,
} from '../../../../../rev_views/rev_page_views';

import {
  revGetMetadataValue,
  revGetMetadataValuesArr,
} from '../../../../../rev_libs_pers/rev_db_struct_models/revEntityMetadata';

import {
  revGetRandInteger,
  revHexToRgba,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {revIsStringEqual} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revStringEmpty} from '../../../../../../rev_function_libs/rev_string_function_libs';

export const RevFlagItemViewWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const {
    revEntity = null,
    revFlagEntitiesArr = [],
    revContentView = null,
  } = revVarArgs;

  const [revIsReadContent, setRevIsReadContent] = useState(false);

  let revFlagValsTabsArr = [];

  let revFlagEntity = revFlagEntitiesArr[0];

  let revFlagValsMetadataArr = revGetMetadataValuesArr(
    revFlagEntity._revInfoEntity._revEntityMetadataList,
    'rev_flag_val',
  );

  let revSetFlagsArr = [];

  for (let i = 0; i < revFlagValsMetadataArr.length; i++) {
    let revCurrFlagVal = revFlagValsMetadataArr[i];

    if (revSetFlagsArr.includes(revCurrFlagVal)) {
      continue;
    } else {
      revSetFlagsArr.push(revCurrFlagVal);
    }

    if (revIsStringEqual(revCurrFlagVal, 'rev_nudity_flag')) {
      revFlagValsTabsArr.push(
        <Text
          key={'rev_nudity_flag_' + revGetRandInteger()}
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {' Nudity / '}
        </Text>,
      );
    }

    if (revIsStringEqual(revCurrFlagVal, 'rev_violence_flag')) {
      revFlagValsTabsArr.push(
        <Text
          key={'rev_violence_flag_' + revGetRandInteger()}
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {' Inciting Violence / '}
        </Text>,
      );
    }

    if (revIsStringEqual(revCurrFlagVal, 'rev_misleading_flag')) {
      revFlagValsTabsArr.push(
        <Text
          key={'rev_misleading_flag_' + revGetRandInteger()}
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {' Misleading / '}
        </Text>,
      );
    }
  }

  let revFlagLinkValsMetadataArr = revGetMetadataValuesArr(
    revFlagEntity._revInfoEntity._revEntityMetadataList,
    'rev_flag_ref_link',
  );

  let revFlagLinkTabsArr = revFlagLinkValsMetadataArr.map(
    revFlagLinkValMetadata => (
      <TouchableOpacity key={'rev_flag_ref_link_' + revGetRandInteger()}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorBlueLink,
            revSiteStyles.revSiteTxtTiny,
            styles.revFlagLinkTab,
          ]}>
          <FontAwesome
            name={'external-link'}
            style={[revSiteStyles.revSiteTxtTiny]}
          />
          {'    ' + revFlagLinkValMetadata}
        </Text>
      </TouchableOpacity>
    ),
  );

  let revFlagContextVal = revGetMetadataValue(
    revFlagEntitiesArr[0]._revInfoEntity._revEntityMetadataList,
    'rev_entity_desc_val',
  );

  let revFlagContextView = revStringEmpty(revFlagContextVal) ? null : (
    <Text
      style={[
        revSiteStyles.revSiteTxtColor,
        revSiteStyles.revSiteTxtTiny,
        {
          backgroundColor: '#FFF',
          paddingHorizontal: 10,
          paddingVertical: 4,
          marginTop: 4,
        },
      ]}>
      {revFlagContextVal}
    </Text>
  );

  const RevUserEntityIcon = () => {
    return (
      <TouchableOpacity key={'RevUserEntityIcon_' + revGetRandInteger()}>
        <View style={[styles.revLikerUserIcon]}>
          <RevCenteredImage
            revImageURI={''}
            revImageDimens={{revWidth: 20, revHeight: 20}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor: revHexToRgba('#728C00', 0.1), marginTop: 1}}>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revFlagContentContainer,
        ]}>
        <RevInfoArea
          revInfoText={'This item has been Flagged !'}
          revStyles={{borderRadius: 0}}></RevInfoArea>

        <View
          style={[
            revSiteStyles.revFlexWrapper_WidthAuto,
            styles.revFlaggersWrapper,
          ]}>
          <View style={{flex: 0}}>
            <RevScrollView_H
              revScrollViewContent={[1, 2, 3].map(revCommentEntity => {
                return (
                  <RevUserEntityIcon
                    key={
                      revCommentEntity +
                      'RevUserEntityIcon_' +
                      revGetRandInteger()
                    }
                  />
                );
              })}
            />
          </View>

          <FontAwesome
            name="long-arrow-right"
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              {marginLeft: -2},
            ]}
          />

          {revFlagValsTabsArr}
        </View>

        {revFlagLinkTabsArr.length ? (
          <View style={{marginTop: 4}}>{revFlagLinkTabsArr}</View>
        ) : null}

        {revFlagContextView}

        <TouchableOpacity
          onPress={() => {
            setRevIsReadContent(!revIsReadContent);
          }}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorBlueLink,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny,
              {paddingHorizontal: 10, paddingVertical: 8},
            ]}>
            {revIsReadContent ? 'Hide' : 'continue reading'}
          </Text>
        </TouchableOpacity>

        {revIsReadContent ? (
          <View style={styles.revReadContentView}>{revContentView}</View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revFlagContentContainer: {
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  revFlaggersWrapper: {
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 2,
  },
  revLikerUserIcon: {
    marginRight: 2,
  },
  revReadContentView: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 7,
  },
  revFlagLinkTab: {
    paddingVertical: 2,
    paddingLeft: 9,
  },
});

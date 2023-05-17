import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevTextInputWithCount} from '../../../../../rev_views/rev_input_form_views';
import {RevTextInputAreaWithCount} from '../../../../../rev_views/rev_input_form_views';
import {RevDropdownListSelector} from '../../../../../rev_views/rev_input_form_views';
import {RevTagsInput} from '../../../../../rev_views/rev_input_form_views';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCreateProductLineWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [revSelectedIndustry, setRevSelectedIndustry] = useState('');
  const [revTagsOutputView, setRevTagsOutputView] = useState(null);
  const [revTagsArr, setRevTagsArr] = useState([]);
  const [revSearchText, setRevSearchText] = useState('');
  const [revBriefInfoTxt, setRevBriefInfoTxt] = useState('');

  let revInfoTell = 'List some of the products your business deals in';

  let revProductLineSelectionOptions = require('../../../rev_resources/rev_industries_list.json');

  let revOnSelect = revSelection => {
    setRevSelectedIndustry(revSelection);
  };

  let revIndustrySelector = (
    <RevDropdownListSelector
      revFixedSelectedValue={'Select industry'}
      revOptions={revProductLineSelectionOptions}
      revOnSelect={revOnSelect}
    />
  );

  let revRetView = (
    <View
      style={[revSiteStyles.revFlexContainer, styles.revFormInputContainer]}>
      <RevInfoArea revInfoText={revInfoTell}></RevInfoArea>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revIndustrySelectorWrapper,
        ]}>
        {revIndustrySelector}
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {revSelectedIndustry}
        </Text>
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          revSiteStyles.revMarginTopSmall,
        ]}>
        <RevTextInputWithCount
          revVarArgs={{
            revPlaceHolderTxt: ' Product line title . . .',
            revTextInputOnChangeCallBack: revNewTxt => {
              setRevBriefInfoTxt(revNewTxt);
            },
            revMaxTxtCount: 17,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revPlaceHolderTxt: ' Product line desc . . .',
              revTextInputOnChangeCallBack: revNewTxt => {
                setRevBriefInfoTxt(revNewTxt);
              },
              revMaxTxtCount: 155,
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
            <FontAwesome name="long-arrow-right" /> Products pics
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
            You have 0 product line pictures. You can upload up to 22
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
            <FontAwesome name="long-arrow-right" /> Video{'  '}
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
            You haven't uploaded a product line video yet
          </Text>
        </View>
      </View>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
        ]}>
        <TouchableOpacity>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSaveTab,
            ]}>
            NexT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
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
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return revRetView;
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revFormInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
  },
  revIndustrySelectorWrapper: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  revBriefDescInputWrapper: {
    marginTop: 8,
  },
  revTagsListingWrapper: {
    marginTop: 2,
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
});

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useContext, useRef} from 'react';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {
  RevTextInput,
  RevTextInputAreaWithCount,
  RevCheckBox,
} from '../../../../../rev_views/rev_input_form_views';
import {
  RevInfoArea,
  RevScrollView_V,
} from '../../../../../rev_views/rev_page_views';

import {useRevCreateFlagFormAction} from '../../../rev_actions/rev_create_flag_form_action';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {
  revCompareStrings,
  revRemoveAllWhiteSpaces,
} from '../../../../../../rev_function_libs/rev_string_function_libs';

export const RevCreateFlagFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const [revFlagsArr, setRevFlagsArr] = useState([]);
  const revFlagRefLinkValRef = useRef('');
  const revFlagRefLinkValsArrRef = useRef([]);
  const revEntityDescTextRef = useRef('');

  const {revCancelFlag, revData} = revVarArgs;

  let revEntityGUID = revData._revGUID;

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const {revCreateFlagFormAction} = useRevCreateFlagFormAction();

  const handleRevSaveTabPressed = () => {
    let revPassVarArgs = {
      revContainerEntityGUID: revEntityGUID,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revFlagValsArr: revFlagsArr,
      revFlagRefLinkValsArr: revFlagRefLinkValsArrRef.current,
      revEntityDescVal: revEntityDescTextRef.current,
    };

    revCreateFlagFormAction(revPassVarArgs);
  };

  const handleRevCancelTabPressed = () => {
    revCancelFlag();
  };

  const handleRevAddLinkTabPressed = () => {
    let revNewLink = revRemoveAllWhiteSpaces(revFlagRefLinkValRef.current);
    revFlagRefLinkValsArrRef.current = revFlagRefLinkValsArrRef.current.filter(
      revCurrLink => revCompareStrings(revCurrLink, revNewLink),
    );

    revFlagRefLinkValsArrRef.current.push(revNewLink);
    revFlagRefLinkValRef.current = '';
  };

  const revFlagIsSet = revFlag => {
    return revFlagsArr.includes(revFlag);
  };

  const revAddOrUnsetFlag = (revCheckStatus, revFlag) => {
    if (revCheckStatus && !revFlagIsSet(revFlag)) {
      setRevFlagsArr(revCurrFlags => [...revCurrFlags, revFlag]);
    } else {
      setRevFlagsArr(revCurrFlags =>
        revCurrFlags.filter(element => element !== revFlag),
      );
    }
  };

  let revNudityCheckBoxParams = {
    revCheckBoxText: 'Nudity',
    revOnCheckedStatusChangeCallBack: revCheckStatus => {
      revAddOrUnsetFlag(revCheckStatus, 'rev_nudity_flag');
    },
  };

  let revViolenceCheckBoxParams = {
    revCheckBoxText: 'Inciting violence',
    revOnCheckedStatusChangeCallBack: revCheckStatus => {
      revAddOrUnsetFlag(revCheckStatus, 'rev_violence_flag');
    },
  };

  let revMisleadingCheckBoxParams = {
    revCheckBoxText: 'Misleading',
    revOnCheckedStatusChangeCallBack: revCheckStatus => {
      revAddOrUnsetFlag(revCheckStatus, 'rev_misleading_flag');
    },
  };

  let revCheckBoxesSection = (
    <View>
      <RevCheckBox revVarArgs={revNudityCheckBoxParams} />
      <RevCheckBox revVarArgs={revViolenceCheckBoxParams} />
      <RevCheckBox revVarArgs={revMisleadingCheckBoxParams} />
    </View>
  );

  let RevFlagContextSection = () => {
    let revLink = (
      <View
        style={[revSiteStyles.revFlexWrapper, {width: '100%', marginTop: 4}]}>
        <View style={{flex: 1}}>
          <RevTextInput
            revVarArgs={{
              revDefaultTxt: revFlagRefLinkValRef.current,
              revPlaceHolderTxt: ' Enter a link',
              revTextInputOnChangeCallBack: revNewLinkVal => {
                revFlagRefLinkValRef.current = revNewLinkVal;
              },
            }}
          />
        </View>

        <TouchableOpacity onPress={handleRevAddLinkTabPressed}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
              styles.revAddLinkTab,
              {flex: 0},
            ]}>
            Add Link
          </Text>
        </TouchableOpacity>
      </View>
    );

    let revDescInput = (
      <View style={[{marginTop: 4}]}>
        <RevTextInputAreaWithCount
          revVarArgs={{
            revDefaultTxt: revEntityDescTextRef.current,
            revPlaceHolderTxt: ' Details . . .',
            revTextInputOnChangeCallBack: revNewTxtVal => {
              revEntityDescTextRef.current = revNewTxtVal;
            },
            revMaxTxtCount: 555,
          }}
        />
      </View>
    );

    let revContent = (
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.RevFlagContextSectionContainer,
        ]}>
        {revLink}

        {revDescInput}
      </View>
    );

    return <>{revContent}</>;
  };

  let revInfoTell = 'Flag item';

  let revRetView = (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        {backgroundColor: '#FFF', width: '100%', padding: 10},
      ]}>
      <RevInfoArea revInfoText={revInfoTell}></RevInfoArea>

      {revCheckBoxesSection}
      <RevFlagContextSection />

      <View style={[revSiteStyles.revFlexWrapper, styles.revFlagFooterWrapper]}>
        <TouchableOpacity onPress={handleRevSaveTabPressed}>
          <Text
            style={[revSiteStyles.revSiteTxtTiny, revSiteStyles.revSaveTab]}>
            Flag
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRevCancelTabPressed}>
          <Text
            style={[revSiteStyles.revSiteTxtTiny, revSiteStyles.revCancelTab]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return <RevScrollView_V revScrollViewContent={revRetView} />;
};

const styles = StyleSheet.create({
  RevFlagContextSectionContainer: {
    width: '100%',
  },
  revAddLinkTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    width: 'auto',
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 4,
    marginTop: 7,
    marginLeft: -4,
  },
  revFlagFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
  },
});

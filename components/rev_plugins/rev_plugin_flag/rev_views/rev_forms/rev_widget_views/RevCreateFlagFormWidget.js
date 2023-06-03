import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useContext} from 'react';

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

export const RevCreateFlagFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const [revFlagsArr, setRevFlagsArr] = useState([]);
  const [revFlagRefLinkValsArr, setRevFlagRefLinkValsArr] = useState([]);
  const [revEntityNameText, setRevEntityNameText] = useState('');
  const [revEntityDescText, setRevEntityDescText] = useState('');

  const {revCancelFlag, revData} = revVarArgs;

  let revEntityGUID = revData._revEntityGUID;

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  const {revCreateFlagFormAction} = useRevCreateFlagFormAction();

  const handleRevSaveTabPressed = () => {
    let revPassVarArgs = {
      _revEntityGUID: revEntityGUID,
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revFlagValsArr: revFlagsArr,
      revFlagRefLinkValsArr: revFlagRefLinkValsArr,
      revEntityNameVal: revEntityNameText,
      revEntityDescVal: revEntityDescText,
    };

    revCreateFlagFormAction(revPassVarArgs);
  };

  const handleRevCancelTabPressed = () => {
    revCancelFlag();
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

  let revFlagContextSection = () => {
    let revLink = (
      <View style={[{marginTop: 4}]}>
        <RevTextInput
          revVarArgs={{
            revDefaultTxt: '',
            revPlaceHolderTxt: ' links [ separated by comma ]',
            revTextInputOnChangeCallBack: revNewLinkTxt => {
              console.log('>>> revNewLinkTxt', revNewLinkTxt);
            },
            revMaxTxtCount: 140,
          }}
        />
      </View>
    );

    let revDescInput = (
      <View style={[{marginTop: 4}]}>
        <RevTextInputAreaWithCount
          revVarArgs={{
            revDefaultTxt: revEntityDescText,
            revPlaceHolderTxt: ' Details . . .',
            revTextInputOnChangeCallBack: setRevEntityDescText,
            revMaxTxtCount: 555,
          }}
        />
      </View>
    );

    let revContent = (
      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revFlagContextSectionContainer,
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
      {revFlagContextSection()}

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
  revFlagContextSectionContainer: {
    width: '100%',
  },
  revFlagFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
  },
});

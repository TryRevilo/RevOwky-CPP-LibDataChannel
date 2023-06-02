import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {
  RevTextInput,
  RevTextInputAreaWithCount,
  RevCheckBox,
} from '../../../../../rev_views/rev_input_form_views';
import {
  RevInfoArea,
  RevScrollView_V,
} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevFlagFormWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  revVarArgs = revVarArgs.revVarArgs;

  const [revEntityDescText, setRevEntityDescText] = useState('');

  const {revCancelFlag} = revVarArgs;

  const handleRevCancelTabPressed = () => {
    revCancelFlag();
  };

  let revNudityCheckBoxParams = {
    revCheckBoxText: 'Nudity',
    revOnCheckedStatusChangeCallBack: revCheckStatus => {
      console.log('>>> revNudityCheckBoxParams', revCheckStatus);
    },
  };

  let revViolenceCheckBoxParams = {
    revCheckBoxText: 'Inciting violence',
    revOnCheckedStatusChangeCallBack: revCheckStatus => {
      console.log('>>> revViolenceCheckBoxParams', revCheckStatus);
    },
  };

  let revMisleadingCheckBoxParams = {
    revCheckBoxText: 'Misleading',
    revOnCheckedStatusChangeCallBack: revCheckStatus => {
      console.log('>>> revMisleadingCheckBoxParams', revCheckStatus);
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

  let revInfoTell = 'Tag item';

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
        <Text style={[revSiteStyles.revSiteTxtTiny, revSiteStyles.revSaveTab]}>
          Flag
        </Text>

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

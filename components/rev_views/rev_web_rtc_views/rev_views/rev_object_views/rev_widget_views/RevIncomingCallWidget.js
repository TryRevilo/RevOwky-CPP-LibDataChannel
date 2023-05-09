import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {useRevSiteStyles} from '../../../../RevSiteStyles';
import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevIncomingCallWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    'revLocalVideoStream' in revVarArgs ||
    revVarArgs.revLocalVideoStream == null
  ) {
    return;
  }

  const {revCloseSiteModal} = useContext(ReViewsContext);

  const [currentSequence, setCurrentSequence] = useState([1]);
  const dotColors = ['red', 'green', 'blue'];

  let revCancelCallBackFunc = revVarArgs.revCancelCallBackFunc;
  let revAcceptCallBackFunc = revVarArgs.revAcceptCallBackFunc;

  const handleRevAcceptVideoCall = () => {
    revAcceptCallBackFunc();
  };

  const handleRevCancelVideoCall = () => {
    revCancelCallBackFunc();
    revCloseSiteModal();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSequence(prevSequence => {
        console.log('>>> prevSequence', JSON.stringify(prevSequence));

        if (prevSequence[prevSequence.length - 1] === 3) {
          return [1];
        } else {
          return [...prevSequence, prevSequence[prevSequence.length - 1] + 1];
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        styles.revDialingCallingContainer,
      ]}>
      <View
        style={[revSiteStyles.revFlexWrapper, styles.revVideoTargetWrapper]}>
        <View style={styles.revTargetIcon}></View>
        <View
          style={[
            revSiteStyles.revFlexContainer,
            styles.revVideoTargetInfoContainer,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtNormal,
            ]}>
            Oliver Muchai
          </Text>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            Incoming calling . . . 22
          </Text>
        </View>

        <View
          style={[
            revSiteStyles.revFlexWrapper_WidthAuto,
            styles.revVideoCallActionOptionsWrapper,
          ]}>
          <TouchableOpacity
            onPress={async () => {
              await handleRevAcceptVideoCall();
            }}>
            <FontAwesome
              name="check"
              style={[
                revSiteStyles.revSiteTxtColorWhite,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtNormal,
                styles.revAcceptCallTab,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleRevCancelVideoCall();
            }}>
            <FontAwesome
              name="times"
              style={[
                revSiteStyles.revSiteTxtColorWhite,
                revSiteStyles.revSiteTxtBold,
                revSiteStyles.revSiteTxtNormal,
                styles.revEndCallTab,
              ]}
            />
          </TouchableOpacity>

          <View
            style={[
              revSiteStyles.revFlexWrapper_WidthAuto,
              styles.revCallDialingDotsWrapper,
            ]}>
            {currentSequence.map((num, index) => (
              <React.Fragment key={index}>
                <Text
                  style={[
                    revSiteStyles.revSiteTxtTiny,
                    revSiteStyles.revSiteTxtBold,
                    {color: dotColors[num - 1]},
                  ]}>
                  {num}
                </Text>
                {index < currentSequence.length - 1 && (
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtMedium,
                      revSiteStyles.revSiteTxtBold,
                      {color: dotColors[num - 1]},
                    ]}>
                    .
                  </Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  revDialingCallingContainer: {
    backgroundColor: '#F7F7F7',
    padding: 10,
    borderRadius: 5,
  },
  revVideoTargetWrapper: {
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderColor: '#EEE',
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    paddingVertical: 4,
    marginTop: 8,
  },
  revTargetIcon: {
    backgroundColor: '#F7F7F7',
    width: 55,
    height: 25,
    borderColor: '#EEE',
    borderWidth: 1,
  },
  revVideoTargetInfoContainer: {
    marginLeft: 4,
  },
  revVideoTargetInfoContainer: {
    marginLeft: 4,
  },
  revVideoCallActionOptionsWrapper: {
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  revAcceptCallTab: {
    textAlign: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 100,
  },
  revEndCallTab: {
    textAlign: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginLeft: 5,
    borderRadius: 22,
  },
  revCallDialingDotsWrapper: {
    alignItems: 'center',
    marginLeft: 4,
  },
});

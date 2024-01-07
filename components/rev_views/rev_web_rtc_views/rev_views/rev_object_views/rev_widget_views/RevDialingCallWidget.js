import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RTCView} from 'react-native-webrtc';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {useRevSiteStyles} from '../../../../RevSiteStyles';
import {revTimeoutAsync} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevDialingCallWidget = ({revVarArgs = {}}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {
    revLocalVideoStream = {},
    revCancelCallBackFunc = null,
    revMaxDialTime = 60000,
    revEndDialCallBack,
  } = revVarArgs;
  const {revStream = {}} = revLocalVideoStream;

  if (!revCancelCallBackFunc) {
    return <Text style={revSiteStyles.revSiteTxtColor}>Error Dialing</Text>;
  }

  const [revCurrentSequence, setRevCurrentSequence] = useState([1]);
  const revDotColors = ['#F26871', 'green', 'blue', '#999', '#BF64E8'];

  revTimeoutAsync({
    revTimeDelay: revMaxDialTime,
    revCallback: revEndDialCallBack,
  });

  const handleRevCancelVideoCall = () => {
    revCancelCallBackFunc();
  };

  useEffect(() => {
    const revInterval = setInterval(() => {
      setRevCurrentSequence(revPrev => {
        if (revPrev[revPrev.length - 1] === 6) {
          return [1];
        } else {
          return [...revPrev, revPrev[revPrev.length - 1] + 1];
        }
      });
    }, 200);

    return () => clearInterval(revInterval);
  }, []);

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        styles.revDialingCallingContainer,
      ]}>
      <View style={styles.revMyVideoStreamContainer}>
        {revStream && (
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={revStream.toURL()}
            zOrder={0}
            style={styles.revVideoStyle}
          />
        )}
      </View>
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
            Video calling . . . 22
          </Text>
        </View>

        <View
          style={[
            revSiteStyles.revFlexWrapper_WidthAuto,
            styles.revVideoCallActionOptionsWrapper,
          ]}>
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
              styles.revCallDialingDotsTextWrapper,
            ]}>
            {revCurrentSequence.map((num, index) => (
              <React.Fragment key={index}>
                {index < revCurrentSequence.length - 1 && (
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtLarge,
                      revSiteStyles.revSiteTxtBold,
                      {color: revDotColors[num - 1]},
                      styles.revCallDialingDotsText,
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
    height: '55%',
    padding: 10,
    borderRadius: 5,
    position: 'relative',
  },
  revVideoTargetWrapper: {
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingVertical: 4,
    position: 'relative',
    top: '5%',
  },
  revTargetIcon: {
    backgroundColor: '#444',
    width: 55,
    height: 32,
  },
  revVideoTargetInfoContainer: {
    marginLeft: 4,
  },
  revVideoCallActionOptionsWrapper: {
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  revEndCallTab: {
    textAlign: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginLeft: 5,
    borderRadius: 22,
    borderTopRightRadius: 0,
  },
  revMyVideoStreamContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 3,
  },
  revVideoStyle: {
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  revCallDialingDotsTextWrapper: {
    alignItems: 'center',
    width: 22,
    marginLeft: 4,
  },
  revCallDialingDotsText: {
    marginLeft: 2,
  },
});

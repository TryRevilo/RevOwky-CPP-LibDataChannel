import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RTCView} from 'react-native-webrtc';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';

import {revIsEmptyJSONObject} from '../../../../../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from '../../../../RevSiteStyles';

export const RevDialingCallWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  if (
    revIsEmptyJSONObject(revVarArgs) ||
    !('revCancelCallBackFunc' in revVarArgs)
  ) {
    return (
      <Text style={revSiteStyles.revSiteTxtColor}>NULL - RevDialingCall</Text>
    );
  }

  const [currentSequence, setCurrentSequence] = useState([1]);
  const dotColors = ['#F26871', 'green', 'blue', '#999', '#BF64E8'];

  let revLocalVideoStream = revVarArgs.revLocalVideoStream;
  let revCancelCallBackFunc = revVarArgs.revCancelCallBackFunc;

  const {revCloseSiteModal} = useContext(ReViewsContext);

  const handleRevCancelVideoCall = () => {
    revCancelCallBackFunc();
    revCloseSiteModal();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSequence(prevSequence => {
        if (prevSequence[prevSequence.length - 1] === 6) {
          return [1];
        } else {
          return [...prevSequence, prevSequence[prevSequence.length - 1] + 1];
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[
        revSiteStyles.revFlexContainer,
        styles.revDialingCallingContainer,
      ]}>
      <View style={styles.revMyVideoStreamContainer}>
        {revLocalVideoStream && (
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={revLocalVideoStream.toURL()}
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
            {currentSequence.map((num, index) => (
              <React.Fragment key={index}>
                {index < currentSequence.length - 1 && (
                  <Text
                    style={[
                      revSiteStyles.revSiteTxtLarge,
                      revSiteStyles.revSiteTxtBold,
                      {color: dotColors[num - 1]},
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
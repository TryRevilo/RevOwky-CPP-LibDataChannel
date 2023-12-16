import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {ReViewsContext} from '../../../../../../rev_contexts/ReViewsContext';
import {RevWebRTCContext} from '../../../../../../rev_contexts/RevWebRTCContext';

import RevVideoCallModal from '../../rev_object_views/rev_widget_views/RevVideoCallModal';
import {RevScrollView_V} from '../../../../../rev_views/rev_page_views';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCallPeersListingWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revCallBack} = revVarArgs;

  const {revCloseSiteModal} = useContext(ReViewsContext);
  const {revPeerConnsData} = useContext(RevWebRTCContext);

  let revPeerConnsDataObj = {};

  for (let i = 0; i < revPeerConnsData.length; i++) {
    const {revPeerId = -1} = revPeerConnsData[i];
    revPeerConnsDataObj[revPeerId] = {revPeerId};
  }

  const [revPeersObjs, setRevPeersObjs] = useState(revPeerConnsDataObj);
  const revSelectedPeerIdsArrRef = useRef([]);

  const [revTotSelected, setRevTotSelected] = useState(0);
  const [revContactPeerViewsArr, setRevContactPeerViewsArr] = useState([]);

  const handleRevContactItemViewPressed = revPeerId => {
    let revCurrSelected = !revPeersObjs[revPeerId].isRevSelected;

    let revNewSelectedPeerIdsArr = revSelectedPeerIdsArrRef.current;

    if (revCurrSelected && !revNewSelectedPeerIdsArr.includes(revPeerId)) {
      revSelectedPeerIdsArrRef.current.push(revPeerId);
    } else if (!revCurrSelected) {
      revSelectedPeerIdsArrRef.current =
        revSelectedPeerIdsArrRef.current.filter(
          revCurr => revCurr !== revPeerId,
        );
    }

    let revNewPeerObjs = {...revPeersObjs};
    revNewPeerObjs[revPeerId] = {
      revPeerId,
      isRevSelected: revCurrSelected,
    };

    setRevTotSelected(revPrev => {
      setRevPeersObjs(revNewPeerObjs);

      let revNewCount = revCurrSelected ? 1 : -1;
      return revPrev + revNewCount;
    });
  };

  const handleRevResetSelectedPeersPressed = () => {
    revSelectedPeerIdsArrRef.current = [];

    let revNewPeerObjs = {};

    Object.entries(revPeersObjs).forEach(([revCurrKey, revCurrVal]) => {
      revNewPeerObjs[revCurrKey] = {...revCurrVal, isRevSelected: false};
    });

    setRevTotSelected(() => {
      setRevPeersObjs(revNewPeerObjs);
      return 0;
    });
  };

  const RevContactItemView = ({revIndex, revPeer}) => {
    const {revPeerId, isRevSelected = false} = revPeer;

    let revBorderTopWidth = revIndex ? 1 : 0;

    let revRet = (
      <TouchableOpacity
        onPress={() => {
          handleRevContactItemViewPressed(revPeerId);
        }}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            {
              backgroundColor: isRevSelected ? '#F7F7F7' : '#FFFFFF',
              paddingHorizontal: 10,
              paddingTop: 2,
              paddingBottom: 5,
              borderStyle: 'dotted',
              borderTopColor: '#EEEEEE',
              borderTopWidth: revBorderTopWidth,
            },
          ]}>
          <View style={styles.revCommentMsgUserIcon}>
            <FontAwesome
              name="user"
              style={[
                revSiteStyles.revSiteColorIconGreen,
                revSiteStyles.revSiteTxtLarge,
              ]}
            />
          </View>

          <View
            style={[
              revSiteStyles.revFlex_1_Container,
              {marginTop: 10, marginLeft: 5},
            ]}>
            <View style={[revSiteStyles.revFlexWrapper]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtTiny_X,
                  revSiteStyles.revSiteTxtBold,
                ]}>
                {'Oliver Muchai Githire'}
              </Text>

              <Entypo
                name="circular-graph"
                style={[
                  revSiteStyles.revSiteColorIconGreen,
                  revSiteStyles.revSiteTxtBold,
                  revSiteStyles.revSiteTxtSmall,
                  {marginLeft: 'auto'},
                ]}
              />
            </View>
            <View style={[revSiteStyles.revFlexWrapper]}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColor,
                  revSiteStyles.revSiteTxtTiny_X,
                ]}>
                {'Hello World ! ! !'}
              </Text>
            </View>

            <Text
              style={[
                revSiteStyles.revSiteTxtItalics,
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtTiny_X,
              ]}>
              <Text>{'conn` type : '}</Text>
              <Text>{'stranger'}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    return revRet;
  };

  useEffect(() => {
    // let revNewPeerObjs = {};
    // for (i = 0; i < 15; i++) {
    //   revNewPeerObjs[i] = {revPeerId: i, isRevSelected: false};
    // }
    // setRevPeersObjs(revNewPeerObjs);
  }, []);

  useEffect(() => {
    let revIndex = 0;
    let revNewContactPeerViewsArr = [];

    Object.entries(revPeersObjs).forEach(([revCurrKey, revCurrVal]) => {
      revNewContactPeerViewsArr.push(
        <RevContactItemView
          key={revIndex}
          revPeer={revCurrVal}
          revIndex={revIndex}
        />,
      );

      revIndex = revIndex + 1;
    });

    setRevContactPeerViewsArr(revNewContactPeerViewsArr);
  }, [revPeersObjs]);

  return (
    <View style={[revSiteStyles.revFlexContainer]}>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          {alignItems: 'center', marginLeft: 5},
        ]}>
        <RevVideoCallModal
          revVarArgs={{
            revSelectedPeerIdsArr: revSelectedPeerIdsArrRef.current,
          }}
        />

        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtTiny_X,
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
            ]}>
            {'*** '}
          </Text>
          <Text>{'Select up to 5 peers'}</Text>
        </Text>

        <View
          style={[
            revSiteStyles.revFlexWrapper_WidthAuto,
            {
              alignItems: 'center',
              marginLeft: 'auto',
              paddingTop: 1,
            },
          ]}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              {paddingHorizontal: 12},
            ]}>
            {revTotSelected}
          </Text>

          <TouchableOpacity
            onPress={revCloseSiteModal}
            style={{
              paddingHorizontal: 12,
            }}>
            <AntDesign
              name="closecircleo"
              style={[
                revSiteStyles.revSiteTxtAlertDangerColor_Light,
                revSiteStyles.revSiteTxtLarge,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRevResetSelectedPeersPressed}
            style={{
              paddingHorizontal: 12,
            }}>
            <MaterialCommunityIcons
              name="reload"
              style={[
                revSiteStyles.revSiteTxtColor,
                revSiteStyles.revSiteTxtLarge,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          revSiteStyles.revFlexContainer,
          {marginTop: 5, marginBottom: 22},
        ]}>
        <RevScrollView_V revScrollViewContent={revContactPeerViewsArr} />
      </View>
    </View>
  );
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  revCommentMsgUserIcon: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 27,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    paddingHorizontal: 2,
    marginTop: 2,
    borderRadius: 2,
  },
});

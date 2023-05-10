import React, {createContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';

const ReViewsContext = createContext();

import RevNullMessagesView from '../components/rev_views/RevNullMessagesView';
import RevFooter1_Center from '../components/rev_views/rev_site_footer_views/RevFooter1_Center';

const ReViewsContextProvider = ({children}) => {
  const [REV_PAGE_HEADER_CONTENT_VIEWER, SET_REV_PAGE_HEADER_CONTENT_VIEWER] =
    useState(null);

  const [REV_SITE_BODY, SET_REV_SITE_BODY] = useState(<RevNullMessagesView />);

  const [
    REV_SITE_FOOTER_1_CONTENT_VIEWER,
    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER,
  ] = useState(null);

  const [REV_FOOTER_1_CENTER, SET_REV_FOOTER_1_CENTER] = useState(
    <RevFooter1_Center />,
  );

  const [revIsModalVisible, setRevIsModalVisible] = useState(false);
  const [revModalContent, setRevModalContent] = useState(<View />);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-3000));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Check if horizontal swipe is more than vertical swipe
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2 &&
          gestureState.dy < 10
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        // Set the x-coordinate of the modal to match the gesture
        Animated.event([null, {dx: fadeAnim}], {
          useNativeDriver: false,
        })(evt, gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If the modal has been swiped more than 50% of the screen width, close it
        if (
          Math.abs(gestureState.dx) >
          Dimensions.get('window').width / 2 - 50
        ) {
          closeModal();
        } else {
          // Otherwise, animate the modal back to its original position
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (revIsModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -3000,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(() => setRevIsModalVisible(false));
    }
  }, [fadeAnim, revIsModalVisible, slideAnim]);

  let revSiteModal = (
    <Modal
      isVisible={revIsModalVisible}
      animationType="none"
      transparent={true}
      onSwipeComplete={() => setRevIsModalVisible(false)}
      onRequestClose={revCloseSiteModal}
      swipeDirection="left">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}
          {...panResponder.panHandlers}>
          {revModalContent}
        </Animated.View>
      </View>
    </Modal>
  );

  const revCloseSiteModal = () => {
    setRevIsModalVisible(false);
  };

  const revInitSiteModal = revContentView => {
    setRevModalContent(revContentView);
    setRevIsModalVisible(true);
  };

  const revToggleSiteModal = (revContentView, revIsVisble) => {
    setRevModalContent(revContentView);
    setRevIsModalVisible(revIsVisble);
  };

  useEffect(() => {
    revToggleSiteModal(revModalContent, revIsModalVisible);
  }, [revIsModalVisible, revModalContent]);

  return (
    <ReViewsContext.Provider
      value={{
        REV_PAGE_HEADER_CONTENT_VIEWER,
        SET_REV_PAGE_HEADER_CONTENT_VIEWER,
        REV_SITE_BODY,
        SET_REV_SITE_BODY,
        REV_SITE_FOOTER_1_CONTENT_VIEWER,
        SET_REV_SITE_FOOTER_1_CONTENT_VIEWER,
        REV_FOOTER_1_CENTER,
        SET_REV_FOOTER_1_CENTER,
        REV_SITE_MODAL: revSiteModal,
        revInitSiteModal,
        revCloseSiteModal,
      }}>
      {children}
    </ReViewsContext.Provider>
  );
};

export {ReViewsContextProvider, ReViewsContext};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    height: '100%',
    opacity: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

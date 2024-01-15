import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Text,
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

const ReViewsContext = createContext();

import RevPageContentHeader from '../components/rev_views/RevPageContentHeader';
import RevNullMessagesView from '../components/rev_views/RevNullMessagesView';
import RevFooter1_Center from '../components/rev_views/rev_site_footer_views/rev_footer_1/RevFooter1_Center';

import {useRevSiteStyles} from '../components/rev_views/RevSiteStyles';

const ReViewsContextProvider = ({children}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [REV_VIRTUAL_VIEW, setRevVirtualView] = useState(null);

  const SET_REV_VIRTUAL_VIEW = revView => {
    setRevVirtualView(
      <View style={{width: 0, height: 0, overflow: 'hidden'}}>{revView}</View>,
    );
  };

  const [REV_PAGE_HEADER_CONTENT_VIEWER, SET_REV_PAGE_HEADER_CONTENT_VIEWER] =
    useState(null);

  const [REV_SITE_INIT_VIEW, SET_REV_SITE_INIT_VIEW] = useState(
    <View style={styles.revSiteLoadingContainer}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColor,
          revSiteStyles.revSiteTxtBold,
          revSiteStyles.revSiteTxtTiny,
          styles.revSiteLoadingTxt,
        ]}>
        Owki Loading . . .
      </Text>
    </View>,
  );

  const [REV_SITE_BODY, setRevSiteBody] = useState(<RevNullMessagesView />);

  const SET_REV_SITE_BODY = useCallback(revNewView => {
    setTimeout(() => {
      setRevSiteBody(revNewView);
    }, 0);

    setRevSiteBody(
      <LinearGradient
        colors={['#FFFFFF', '#F7F7F7', '#BEB5D4']}
        style={styles.revLinearGradient}>
        <View style={[{flex: 1}]}>
          <RevPageContentHeader />

          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              {paddingHorizontal: 21, paddingVertical: 10},
            ]}>
            . . . Loading
          </Text>

          <Text
            style={[
              revSiteStyles.revSiteTxtColorWhite,
              revSiteStyles.revSiteTxtBold,
              revSiteStyles.revSiteTxtTiny_X,
              {position: 'absolute', right: 32, bottom: '5%'},
            ]}>
            CampAnn .inc
          </Text>
        </View>
      </LinearGradient>,
    );
  }, []);

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

  const revPanResponder = useRef(
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
          {...revPanResponder.panHandlers}>
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
        REV_SITE_INIT_VIEW,
        SET_REV_SITE_INIT_VIEW,
        REV_SITE_BODY,
        SET_REV_SITE_BODY,
        REV_SITE_FOOTER_1_CONTENT_VIEWER,
        SET_REV_SITE_FOOTER_1_CONTENT_VIEWER,
        REV_FOOTER_1_CENTER,
        SET_REV_FOOTER_1_CENTER,
        REV_SITE_MODAL: revSiteModal,
        revInitSiteModal,
        revCloseSiteModal,
        REV_VIRTUAL_VIEW,
        SET_REV_VIRTUAL_VIEW,
      }}>
      {children}
    </ReViewsContext.Provider>
  );
};

// Helper function to use ReViewsContext
const useReViewsContext = () => {
  const reViewsContext = useContext(ReViewsContext);

  if (!reViewsContext) {
    throw new Error(
      'useReViewsContext must be used within a ReViewsContextProvider',
    );
  }

  return reViewsContext;
};

export {ReViewsContextProvider, ReViewsContext, useReViewsContext};

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
  revLinearGradient: {
    flex: 1,
  },
});

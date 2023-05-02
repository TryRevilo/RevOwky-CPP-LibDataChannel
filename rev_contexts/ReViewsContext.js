import React, {createContext, useEffect, useState} from 'react';
import {View} from 'react-native';

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
  const [revModalContent, setModalContent] = useState(<View />);

  let revSiteModal = (
    <Modal
      isVisible={revIsModalVisible}
      onSwipeComplete={() => setRevIsModalVisible(false)}
      swipeDirection="left">
      {revModalContent}
    </Modal>
  );

  const revInitSiteModal = revContentView => {
    setRevIsModalVisible(true);
    setModalContent(revContentView);
  };

  const revCloseSiteModal = () => {
    setRevIsModalVisible(false);
  };

  useEffect(() => {
    setModalContent(revModalContent);
  }, [revIsModalVisible]);

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

import React, {createContext, useState} from 'react';

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
      }}>
      {children}
    </ReViewsContext.Provider>
  );
};

export {ReViewsContextProvider, ReViewsContext};

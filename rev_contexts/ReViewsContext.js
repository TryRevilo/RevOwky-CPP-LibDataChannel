import React, {createContext, useState} from 'react';

const ReViewsContext = createContext();

import RevNullMessagesView from '../components/rev_views/RevNullMessagesView';

const ReViewsContextProvider = ({children}) => {
  const [REV_PAGE_HEADER_CONTENT_VIEWER, SET_REV_PAGE_HEADER_CONTENT_VIEWER] =
    useState(null);

  const [REV_SITE_BODY, SET_REV_SITE_BODY] = useState(<RevNullMessagesView />);

  const [
    REV_SITE_FOOTER_1_CONTENT_VIEWER,
    SET_REV_SITE_FOOTER_1_CONTENT_VIEWER,
  ] = useState(null);

  return (
    <ReViewsContext.Provider
      value={{
        REV_PAGE_HEADER_CONTENT_VIEWER,
        SET_REV_PAGE_HEADER_CONTENT_VIEWER,
        REV_SITE_BODY,
        SET_REV_SITE_BODY,
        REV_SITE_FOOTER_1_CONTENT_VIEWER,
        SET_REV_SITE_FOOTER_1_CONTENT_VIEWER,
      }}>
      {children}
    </ReViewsContext.Provider>
  );
};

export {ReViewsContextProvider, ReViewsContext};

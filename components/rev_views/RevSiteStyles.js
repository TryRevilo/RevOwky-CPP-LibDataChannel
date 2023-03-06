import {StyleSheet} from 'react-native';

export const useRevSiteStyles = () => {
  const revSiteStyles = StyleSheet.create({
    revSiteTxtColor: {
      color: '#757575',
    },
    revSiteTxtColorLight: {
      color: '#999',
    },
    revSiteTxtColorWhite: {
      color: '#FFF',
    },
    revSiteTxtSmall: {
      fontSize: 10,
    },
    revSiteTxtNormal: {
      fontSize: 11,
    },
    revSiteTxtMedium: {
      fontSize: 12,
    },
    revSiteTxtBold: {
      fontWeight: 'bold',
    },
    revSiteTxtWeightNormal: {
      fontWeight: '100',
    },
    revFlexWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
    },
    revFlexWrapper_WidthAuto: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: 'auto',
    },
    revFlexContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    revFlexWrapperTouchable: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: 'auto',
    },
    revNullNoticias: {
      color: '#90a4ae',
      fontSize: 10,
      alignSelf: 'flex-start',
    },
  });

  return {revSiteStyles};
};

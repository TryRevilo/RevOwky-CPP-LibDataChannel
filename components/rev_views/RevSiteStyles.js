import {StyleSheet} from 'react-native';

export const useRevSiteStyles = () => {
  const revSiteStyles = StyleSheet.create({
    revSiteTxtAlertDangerColor: {
      color: 'red',
    },
    revSiteTxtAlertSafe: {
      color: 'green',
    },
    revSiteTxtColor: {
      color: '#757575',
    },
    revSiteTxtColorLight: {
      color: '#999',
    },
    revSiteTxtColorWhite: {
      color: '#FFF',
    },
    revSiteTxtTiny: {
      fontSize: 9,
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
    revSiteTxtLarge: {
      fontSize: 15,
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
    revFlexPageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
      marginTop: 5,
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

    /** TABS */
    revSaveTab: {
      color: '#F7F7F7',
      backgroundColor: '#444',
      width: 'auto',
      paddingHorizontal: 22,
      paddingVertical: 3,
      marginLeft: 5,
      borderRadius: 100,
    },
    revCancelTab: {
      fontWeight: 'bold',
      paddingHorizontal: 8,
    },

    /** REV TEXT INPUT */
    revSiteTextInput: {
      color: '#444',
      fontSize: 11,
      borderColor: '#F7F7F7',
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
  });

  return {revSiteStyles};
};

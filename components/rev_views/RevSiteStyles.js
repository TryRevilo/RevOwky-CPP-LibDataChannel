import {StyleSheet, Dimensions} from 'react-native';

export const useRevSiteStyles = () => {
  var pageWidth = Dimensions.get('window').width - 12;
  var height = Dimensions.get('window').height;

  var maxChatMessageContainerWidth = pageWidth - 17;

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
    revSiteTxtColorDark: {
      color: '#444',
    },
    revSiteTxtColorWhite: {
      color: '#FFF',
    },
    revSiteTxtColorBlueLink: {
      color: '#5c6bc0',
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
      fontWeight: 'normal',
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
    revSiteTextInputNoBorder: {
      color: '#444',
      fontSize: 11,
      borderWidth: 0,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },

    revTagsInputWrapper: {
      alignItems: 'flex-end',
      marginTop: 8,
    },
    revTagsInput: {
      color: '#444',
      fontSize: 11,
      lineHeight: 12,
      textAlignVertical: 'bottom',
      flex: 1,
      borderColor: '#F7F7F7',
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingTop: 2,
      paddingBottom: 2,
      height: 22,
    },
    revEnteredTags: {
      flex: 2,
      paddingBottom: 2,
      marginLeft: 4,
    },

    /** Text Input With Count */
    revTextInputAreaWithCountContainer: {
      borderColor: '#F7F7F7',
      borderWidth: 1,
      borderTopWidth: 0,
      paddingBottom: 8,
    },
    revTextInputCountStyle: {
      marginLeft: 8,
    },
    revTextInputAreaInputWithCount: {
      color: '#444',
      fontSize: 11,
      textAlignVertical: 'top',
      borderTopColor: '#F7F7F7',
      borderTopWidth: 1,
      paddingHorizontal: 5,
      paddingTop: 7,
    },

    revFormFooterWrapper: {
      alignItems: 'center',
      marginTop: 8,
    },

    /** REV FORM OUTPUT */
    revTagsOutputListingWrapper: {
      alignItems: 'center',
    },
    revTagOutputTabWrapper: {
      alignItems: 'center',
      backgroundColor: '#F7F7F7',
      paddingHorizontal: 4,
      paddingVertical: 2,
      marginRight: 4,
      borderRadius: 22,
    },
    revDeleteOutputTabItem: {
      paddingVertical: 4,
      paddingHorizontal: 4,
    },

    revInfoArea: {
      backgroundColor: '#fffde7',
      paddingHorizontal: 9,
      paddingVertical: 4,
      marginTop: 3,
      borderRadius: 5,
    },

    /** REV PAGE HEADER */
    revPageHeaderAreaWrapper: {
      alignItems: 'center',
      width: maxChatMessageContainerWidth,
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
      borderStyle: 'dotted',
    },

    /** MARGINS */
    revMarginTopSmall: {
      marginTop: 4,
    },
  });

  return {revSiteStyles};
};

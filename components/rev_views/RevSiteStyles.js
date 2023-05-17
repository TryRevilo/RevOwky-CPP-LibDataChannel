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
      paddingBottom: 8,
    },
    revTextInputCountStyle: {
      marginLeft: 8,
    },
    revTextInputAreaInputWithCount: {
      color: '#444',
      fontSize: 11,
      textAlignVertical: 'top',
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

    /** START TABLE */

    table: {
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableHeader: {
      flex: 1,
      padding: 10,
      fontWeight: 'bold',
      backgroundColor: '#f2f2f2',
    },
    tableCell: {
      flex: 1,
      padding: 10,
    },
    addButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    addButtonLabel: {
      color: '#fff',
      fontWeight: 'bold',
    },

    /** END TABLE */

    /** START TEXT INPUT */
    revTextInput: {
      color: '#444',
      fontSize: 11,
      borderColor: '#F7F7F7',
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 2,
      marginTop: 8,
    },
    /** END TEXT INPUT */

    /** START PASSWORD INPUT */
    revPasswordInputWrapper: {
      alignItems: 'center',
      borderColor: '#F7F7F7',
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 2,
      marginTop: 8,
    },
    revPasswordInput: {
      color: '#444',
      fontSize: 11,
      flex: 1,
      paddingVertical: 0,
    },
    revToggleButton: {
      padding: 5,
    },
    /** END PASSWORD INPUT */

    /** START DROP-DOWN PICKER */
    revDropdownListSelectorTab: {
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    /** END DROP-DOWN PICKER */

    /** START REV PAGE VIEWS */
    revDescriptiveTitleViewContainer: {
      marginTop: 8,
    },
    revDescriptiveTitleViewTitleWrapper: {
      alignItems: 'center',
      backgroundColor: '#ede7f6',
      paddingHorizontal: 5,
      paddingVertical: 2,
      marginTop: 10,
    },
    revTagTab: {
      paddingHorizontal: 4,
    },
    revDescriptiveTitleViewContentWrapper: {
      alignItems: 'flex-start',
      marginLeft: 12,
    },
    revDescriptiveTitleViewContentNullContent: {
      paddingTop: 3,
      marginLeft: 1,
    },
    revRightBorderedArrowPointerWrapper: {
      alignItems: 'center',
      borderLeftColor: '#ede7f6',
      borderLeftWidth: 1,
      paddingTop: 4,
    },
    /** END REV PAGE VIEWS */

    /** START REV IMAGES */
    revUserIconTinyCircle: {
      alignItems: 'center',
      backgroundColor: '#F7F7F7',
      width: 17,
      height: 17,
      borderColor: '#CCC',
      borderWidth: 1,
      paddingHorizontal: 1,
      paddingVertical: 1,
      borderRadius: 100,
    },
    revUserIconSmallCircle: {
      alignItems: 'center',
      backgroundColor: '#F7F7F7',
      width: 32,
      height: 32,
      borderColor: '#CCC',
      borderWidth: 1,
      paddingHorizontal: 1,
      paddingVertical: 1,
      borderRadius: 100,
    },
    revImageMedium: {
      alignItems: 'center',
      backgroundColor: '#EEE',
      width: 55,
      height: 32,
      borderColor: '#E7E7E7',
      borderWidth: 1,
      paddingHorizontal: 1,
      paddingVertical: 1,
      borderRadius: 2,
    },
    /** END REV IMAGES */
  });

  return {revSiteStyles};
};

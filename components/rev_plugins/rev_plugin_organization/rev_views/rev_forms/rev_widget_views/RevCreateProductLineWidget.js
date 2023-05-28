import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useContext} from 'react';

import DocumentPicker, {isInProgress} from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../../../../../rev_contexts/RevSiteDataContext';

import {
  RevTextInputWithCount,
  RevTextInputAreaWithCount,
  RevDropdownListSelector,
  RevTagsInput,
  RevUploadFilesTab,
} from '../../../../../rev_views/rev_input_form_views';

import {RevInfoArea} from '../../../../../rev_views/rev_page_views';

import {useRevCreateNewProductLineAction} from '../../../rev_actions/rev_create_new_product_line_action';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';

export const RevCreateProductLineWidget = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revCreateNewProductLineAction} = useRevCreateNewProductLineAction();

  const {REV_LOGGED_IN_ENTITY_GUID} = useContext(RevSiteDataContext);

  revVarArgs = revVarArgs.revVarArgs;

  const {revContainerEntityGUID, revOnSaveCallBack} = revVarArgs;

  const [revSelectedIndustry, setRevSelectedIndustry] = useState('');
  const [revTagsOutputView, setRevTagsOutputView] = useState(null);
  const [revTagsArr, setRevTagsArr] = useState([]);

  const [revEntityNameText, setRevEntityNameText] = useState('');
  const [revEntityDescText, setRevEntityDescText] = useState('');

  const [revSelectedImagesDataArray, setRevSelectedImagesDataArray] = useState(
    [],
  );
  const [revSelectedVideosDataArray, setRevSelectedVideosDataArray] = useState(
    [],
  );

  let revInfoTell = 'List some of the products your business deals in';

  let revProductLineSelectionOptions = require('../../../rev_resources/rev_industries_list.json');

  const handleRevSaveProductLineTabPressed = async () => {
    let revPassVarArgs = {
      revEntityOwnerGUID: REV_LOGGED_IN_ENTITY_GUID,
      revContainerEntityGUID: revContainerEntityGUID,
      revEntityNameVal: revEntityNameText,
      revEntityDescVal: revEntityDescText,

      revSelectedMedia: [
        ...revSelectedImagesDataArray,
        ...revSelectedVideosDataArray,
      ],
    };
    revCreateNewProductLineAction(revPassVarArgs, revPersEntityGUID => {
      revOnSaveCallBack(revPersEntityGUID);
    });
  };

  let revOnSelect = revSelection => {
    setRevSelectedIndustry(revSelection);
  };

  let revIndustrySelector = (
    <RevDropdownListSelector
      revFixedSelectedValue={'Select industry'}
      revOptions={revProductLineSelectionOptions}
      revOnSelect={revOnSelect}
    />
  );

  let revRetView = (
    <View
      style={[revSiteStyles.revFlexContainer, styles.revFormInputContainer]}>
      <RevInfoArea revInfoText={revInfoTell}></RevInfoArea>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revIndustrySelectorWrapper,
        ]}>
        {revIndustrySelector}
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {revSelectedIndustry}
        </Text>
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          revSiteStyles.revMarginTopSmall,
        ]}>
        <RevTextInputWithCount
          revVarArgs={{
            revDefaultTxt: revEntityNameText,
            revPlaceHolderTxt: ' Product line title title . . .',
            revTextInputOnChangeCallBack: setRevEntityNameText,
            revMaxTxtCount: 140,
          }}
        />

        <View style={styles.revBriefDescInputWrapper}>
          <RevTextInputAreaWithCount
            revVarArgs={{
              revDefaultTxt: revEntityDescText,
              revPlaceHolderTxt: ' Product line desc . . .',
              revTextInputOnChangeCallBack: setRevEntityDescText,
              revMaxTxtCount: 500,
            }}
          />
        </View>

        <View style={[revSiteStyles.revFlexPageContainer]}>
          <RevTagsInput
            revVarArgs={{
              revTagsInputUpdater: revLatestTagsArr => {
                setRevTagsArr(revLatestTagsArr);
              },
            }}
          />

          {revTagsOutputView}
        </View>
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revAddedMediaContainer,
          {borderTopWidth: 1},
        ]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
          ]}>
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="camera"
          />
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="long-arrow-right"
          />
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            {' '}
            Products pics
          </Text>

          <RevUploadFilesTab
            revVarArgs={{
              revLabel: ' Select pics',
              revMIMETypes: DocumentPicker.types.images,
              revOnSelectedDataCallBack: setRevSelectedImagesDataArray,
            }}
          />
        </View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revAddedMediaTell,
            {marginLeft: 3},
          ]}>
          <Text style={revSiteStyles.revSiteTxtBold}>
            {revSelectedImagesDataArray.length}
          </Text>
          {' product line pictures selected. You can upload up to 22'}
        </Text>
      </View>

      <View
        style={[
          revSiteStyles.revFlexContainer,
          styles.revAddedMediaContainer,
          {paddingTop: 0, paddingLeft: 10},
        ]}>
        <View
          style={[
            revSiteStyles.revFlexWrapper,
            styles.revAddedMediaTitleWrapper,
          ]}>
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="dot-circle-o"
          />
          <FontAwesome
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}
            name="long-arrow-right"
          />
          <Text
            style={[
              revSiteStyles.revSiteTxtColorLight,
              revSiteStyles.revSiteTxtTiny,
            ]}>
            {' '}
            Video{'  '}
          </Text>

          <RevUploadFilesTab
            revVarArgs={{
              revLabel: ' Select videos',
              revMIMETypes: DocumentPicker.types.video,
              revOnSelectedDataCallBack: setRevSelectedVideosDataArray,
            }}
          />
        </View>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            styles.revAddedMediaTell,
            {marginLeft: 2},
          ]}>
          <Text style={revSiteStyles.revSiteTxtBold}>
            {revSelectedVideosDataArray.length}
          </Text>
          {' videos product line videos selected'}
        </Text>
      </View>

      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revFormFooterWrapper,
        ]}>
        <TouchableOpacity onPress={handleRevSaveProductLineTabPressed}>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revSaveTab,
            ]}>
            NexT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={[
              revSiteStyles.revSiteTxtColor,
              revSiteStyles.revSiteTxtSmall,
              revSiteStyles.revCancelTab,
            ]}>
            <FontAwesome
              name="dot-circle-o"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
            />
            <FontAwesome
              name="long-arrow-right"
              style={[
                revSiteStyles.revSiteTxtColorLight,
                revSiteStyles.revSiteTxtTiny,
              ]}
            />{' '}
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return revRetView;
};

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 17;

const styles = StyleSheet.create({
  revFormInputContainer: {
    width: maxChatMessageContainerWidth,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 5,
  },
  revIndustrySelectorWrapper: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  revBriefDescInputWrapper: {
    marginTop: 8,
  },
  revTagsListingWrapper: {
    marginTop: 2,
  },
  revAddedMediaContainer: {
    borderStyle: 'dotted',
    borderColor: '#EEE',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginTop: 8,
    paddingLeft: 8,
  },
  revAddedMediaTitleWrapper: {
    alignItems: 'center',
  },
  revAddedMediaTell: {
    marginTop: 4,
  },
});

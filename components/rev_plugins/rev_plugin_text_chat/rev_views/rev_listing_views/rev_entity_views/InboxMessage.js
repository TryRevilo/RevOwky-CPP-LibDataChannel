import React, {useEffect, useRef, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import RNFS from 'react-native-fs';

import {revGetMetadataValue} from '../../../../../../rev_function_libs/rev_entity_libs/rev_metadata_function_libs';
import {
  RevReadMoreTextView,
  RevScrollView_H,
} from '../../../../../rev_views/rev_page_views';

import RevChatMessageOptions from '../../RevChatMessageOptions';

import {
  revDecode,
  revFormatLongDate,
  revIsEmptyJSONObject,
} from '../../../../../../rev_function_libs/rev_gen_helper_functions';
import {
  revSplitStringToArray,
  revTruncateString,
} from '../../../../../../rev_function_libs/rev_string_function_libs';

import {useRevSiteStyles} from '../../../../../rev_views/RevSiteStyles';
import {revIsEmptyInfo} from '../../../../../../rev_function_libs/rev_entity_libs/rev_entity_function_libs';

function useForceUpdate() {
  const [, forceUpdate] = useState();

  return () => forceUpdate(prevState => !prevState);
}

export default function InboxMessage({revVarArgs, revGetChildFilesArr}) {
  const {revSiteStyles} = useRevSiteStyles();

  if (!revVarArgs) {
    return null;
  }

  const {
    revData,
    _revPublisherEntity = {},
    revPeersArr = [],
    revChildFilesArr = [],
    revDataSetter,
  } = revVarArgs;
  const {revMsgGUID, revType, revMsg = {}} = revData;

  const revImagesArrRef = useRef([]);

  for (let i = 0; i < revChildFilesArr.length; i++) {
    let revChildFile = revChildFilesArr[i];

    const {_revPublisherEntity, revPeersArr, revData} = revChildFile;
    const {revMsgGUID, _revContainerGUID, revType, revMsg = {}} = revData;

    revImagesArrRef.current.push(revMsg);
  }

  const [revImagesView, setRevImagesView] = useState(
    revInitImages(revImagesArrRef.current),
  );

  function RevImageView({revData}) {
    const {
      _revRemoteGUID,
      _revContainerGUID: revFileContainerGUID,
      revFileName,
      revFileObjectSubType,
      revMIME,
      revIsStringArr = false,
      revArrayBuffer,
    } = revData;

    const [revRetImage, setRevRetImage] = useState(null);

    const revInitImage = async () => {
      const revTempFilePath = `${
        RNFS.ExternalStorageDirectoryPath
      }/Documents/temp_image_${_revRemoteGUID}.${revMIME.split('/')[1]}`;

      await RNFS.writeFile(revTempFilePath, revArrayBuffer, 'base64');

      let revRet = (
        <Image
          key={_revRemoteGUID}
          style={[styles.revImageStyle]}
          source={{uri: `file://${revTempFilePath}`}}
        />
      );

      setRevRetImage(revRet);
    };

    useEffect(() => {
      const initializeImage = async () => {
        await revInitImage();
      };
      initializeImage();
    }, []);

    return revRetImage;
  }

  function revInitImages(revImagesArr) {
    if (revImagesArr.length < 1) {
      return null;
    }

    let revUpdatedImagesViewsArr = revImagesArr.map((revCurr, revIndex) => (
      <RevImageView key={revIndex} revData={revCurr} />
    ));

    let revUpdatedImagesView = (
      <View style={[revSiteStyles.revFlexWrapper_WidthAuto]}>
        {revUpdatedImagesViewsArr}
      </View>
    );

    return <RevScrollView_H revScrollViewContent={revUpdatedImagesView} />;
  }

  const revDataSetterCallBack = () => {
    let revChildFilesArr = revGetChildFilesArr(revMsgGUID);

    revImagesArrRef.current = [];

    for (let i = 0; i < revChildFilesArr.length; i++) {
      let revChildFile = revChildFilesArr[i];

      const {_revPublisherEntity, revPeersArr, revData} = revChildFile;
      const {revMsgGUID, _revContainerGUID, revType, revMsg = {}} = revData;

      revImagesArrRef.current.push(revMsg);
    }

    setRevImagesView(revInitImages(revImagesArrRef.current));
  };

  if (revDataSetter) {
    revDataSetter(revDataSetterCallBack);
  }

  /** START GET PUBLISHER */
  if (revIsEmptyInfo(_revPublisherEntity) || revIsEmptyInfo(revMsg)) {
    return null;
  }

  if (_revPublisherEntity._revType !== 'rev_user_entity') {
    return null;
  }

  let revPublisherEntityNames = revGetMetadataValue(
    _revPublisherEntity._revInfoEntity._revMetadataList,
    'rev_entity_name',
  );
  let revPublisherEntityNames_Trunc = revTruncateString(
    revPublisherEntityNames,
    22,
  );
  /** END GET PUBLISHER */

  let revMsgInfoEntity = revMsg._revInfoEntity;

  let revChatMsgStr = revGetMetadataValue(
    revMsgInfoEntity._revMetadataList,
    'rev_entity_desc',
  );

  let revChatMsgStrHTML = revGetMetadataValue(
    revMsgInfoEntity._revMetadataList,
    'rev_entity_desc_html',
  );

  let revTimeCreated = revFormatLongDate(revMsg._revTimeCreated);

  const [revIsChatOptionsModalVissible, setRevIsChatOptionsModalVissible] =
    useState(false);

  let revChatOptions = () => {
    let revPassvarArgs = {
      ...revVarArgs,
      revCallback: () => setRevIsChatOptionsModalVissible(false),
    };

    return revIsChatOptionsModalVissible ? (
      <RevChatMessageOptions revVarArgs={revPassvarArgs} />
    ) : null;
  };

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <View style={styles.chatMsgWrapper}>
        <View style={styles.chatMsgUserIcon}>
          <FontAwesome name="user" style={styles.availableChatPeopleNonIcon} />
        </View>
        <View style={styles.chatMsgContentWrapper}>
          <View style={styles.chatMsgContentCarretView}>
            <FontAwesome
              name="caret-left"
              style={styles.chatMsgContentCarret}
            />
          </View>
          <View style={styles.chatMsgContentContainer}>
            <View style={styles.chatMsgHeaderWrapper}>
              <Text
                style={[
                  revSiteStyles.revSiteTxtColorLight,
                  revSiteStyles.revSiteTxtTiny_X,
                  revSiteStyles.revSiteTxtBold,
                ]}>
                {revPublisherEntityNames_Trunc}
              </Text>
              <Text style={styles.chatMsgSendTime}>{revTimeCreated}</Text>
              <View style={styles.chatMsgOptionsWrapper}>
                <Text style={styles.chatMsgOptions}>
                  <FontAwesome name="reply" />
                </Text>
              </View>
            </View>
            <View style={styles.chatMsgContentTxtContainer}>
              <RevReadMoreTextView
                revText={revChatMsgStr}
                revFullText={revChatMsgStrHTML}
                revMaxLength={255}
              />
            </View>

            {revImagesView}
          </View>
        </View>
      </View>

      {revChatOptions()}
    </View>
  );
}

var pageWidth = Dimensions.get('window').width - 12;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 75;

const styles = StyleSheet.create({
  revImageStyle: {
    width: 37,
    height: 37,
    marginRight: 1,
    borderRadius: 32,
  },
  chatMsgWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 'auto',
  },
  chatMsgUserIcon: {
    width: 22,
    height: 32,
    borderStyle: 'solid',
    borderColor: '#c5e1a5',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableChatPeopleNonIcon: {
    color: '#c5e1a5',
    fontSize: 17,
  },
  chatMsgContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: maxChatMessageContainerWidth,
    marginTop: 2,
    marginLeft: 3,
  },
  chatMsgContentCarretView: {
    backgroundColor: '#FFF',
    height: 'auto',
    marginTop: 6,
    marginRight: 1,
    marginLeft: 1,
    zIndex: 1,
  },
  chatMsgContentCarret: {
    color: '#c5e1a5',
    textAlign: 'center',
    fontSize: 15,
  },
  chatMsgContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    maxWidth: maxChatMessageContainerWidth,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 5,
  },
  chatMsgHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomColor: '#rgba(27, 31, 35, 0.06)',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginTop: 4,
    position: 'relative',
  },
  chatMsgSendTime: {
    color: '#8d8d8d',
    fontSize: 9,
    lineHeight: 9,
    marginRight: 12,
    marginLeft: 5,
  },
  chatMsgOptionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 12,
    position: 'relative',
  },
  chatMsgOptions: {
    color: '#bdbdbd',
    fontSize: 12,
    paddingHorizontal: 8,
  },
  chatMsgContentTxtContainer: {
    paddingBottom: 4,
    marginTop: 2,
  },
});

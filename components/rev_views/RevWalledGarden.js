import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';

var RNFS = require('react-native-fs');

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../rev_contexts/RevRemoteSocketContext';
import {revPluginsLoader} from '../rev_plugins_loader';
import {revGetSiteEntity} from '../rev_libs_pers/rev_pers_rev_entity/rev_site_entity';
import {useRevPersSyncDataComponent} from '../rev_libs_pers/rev_server/RevPersSyncDataComponent';

import {revIsEmptyVar} from '../../rev_function_libs/rev_gen_helper_functions';

import RevSiteContainer from './RevSiteContainer';

const {RevPersLibCreate_React, RevWebRTCReactModule} = NativeModules;

const RevWalledGarden = () => {
  const {
    REV_LOGGED_IN_ENTITY_GUID,
    SET_REV_LOGGED_IN_ENTITY_GUID,
    REV_LOGGED_IN_ENTITY,
  } = useContext(RevSiteDataContext);

  const {REV_IP} = useContext(RevRemoteSocketContext);
  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();

  const [RevLogInForm, setRevLogInForm] = useState(null);

  DeviceEventEmitter.addListener('rev_c_sever_ping', event => {
    console.log('>>> Event - rev_c_sever_ping : ' + event.eventProperty);

    let revPingStatus = event.eventProperty;

    if (revPingStatus > 0) {
      let revInitWSStatus = RevWebRTCReactModule.revInitWS(
        REV_IP,
        REV_LOGGED_IN_ENTITY_GUID.toString(),
      );

      console.log('>>> revInitWSStatus ' + revInitWSStatus);
    }
  });

  DeviceEventEmitter.addListener('rev_curl_file_uoad_retdata', event => {
    let revRetDataStr = event.eventProperty;

    if (revIsEmptyVar(revRetDataStr)) {
      return;
    }

    try {
      let revRetData = JSON.parse(revRetDataStr);

      if (!revRetData.hasOwnProperty('revFilterSuccess')) {
        console.log('>>> revRetDataStr ' + revRetDataStr);
        return;
      }

      let revFilterSuccess = revRetData.revFilterSuccess;
      let revFilterFail = revRetData.revFilterFail;

      for (let i = 0; i < revFilterSuccess.length; i++) {
        let revCurrFile = revFilterSuccess[i];
        console.log('>>> FILE : ' + revCurrFile);
      }
    } catch (error) {
      console.log('>>> ' + error);
    }
  });

  let revLoggedInState = 0;

  DeviceEventEmitter.addListener('revWebServerConnected', event => {
    if (revLoggedInState !== 0) {
      console.log('>>> Already Logged In !');

      return;
    }

    if (REV_LOGGED_IN_ENTITY_GUID > 0 && !revIsEmptyVar(REV_LOGGED_IN_ENTITY)) {
      console.log(
        '>>> Event - revWebServerConnected - STR ' + event.eventProperty,
      );

      let revData;

      try {
        revData = JSON.parse(event.eventProperty);

        console.log(
          '>>> Event - revWebServerConnected - JSON ' + JSON.stringify(revData),
        );
      } catch (error) {
        let revMessage = {
          type: 'login',
          id: REV_LOGGED_IN_ENTITY_GUID + '',
          foo: 'bar',
          revEntity: {
            _remoteRevEntityGUID: REV_LOGGED_IN_ENTITY._revEntityGUID,
          },
        };

        let revLoggedInState = RevWebRTCReactModule.revWebRTCLogIn(
          REV_LOGGED_IN_ENTITY_GUID.toString(),
          JSON.stringify(revMessage),
        );

        console.log('>>> revWebRTCLogIn : revMsgStatus ' + revLoggedInState);
      }
    }
  });

  useEffect(() => {
    const DirectoryPath = '/storage/emulated/0/Documents/Owki/rev_media';
    RNFS.mkdir(DirectoryPath);

    let revDbPath = RNFS.DownloadDirectoryPath;
    let dbLong = RevPersLibCreate_React.revPersInitReact(revDbPath);

    let revSiteEntity = revGetSiteEntity(REV_LOGGED_IN_ENTITY_GUID);

    if (!revIsEmptyVar(revSiteEntity)) {
      SET_REV_LOGGED_IN_ENTITY_GUID(revSiteEntity._revEntityOwnerGUID);
    }

    const RevView = revPluginsLoader({
      revPluginName: 'rev_plugin_user_settings',
      revViewName: 'RevLogInForm',
      revData: 'Hello World!',
    });

    setRevLogInForm(RevView);
  }, []);

  revPersSyncDataComponent(-1, revSynchedGUIDsArr => {
    console.log('>>> revSynchedGUIDsArr ' + JSON.stringify(revSynchedGUIDsArr));
  });

  const RevWalledGarden = () => {
    return (
      <View style={[styles.revFlexContainer, styles.revlogInContainer]}>
        <View style={[styles.revFlexContainer, styles.revHeaderContainer]}>
          <View style={[styles.revFlexWrapper, styles.revSiteLogoWrapper]}>
            <Text style={[styles.revSiteTxtColor, styles.revSiteLogoTxt]}>
              Owki
            </Text>
            <Text
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteFontBold,
                styles.revSiteTxtSmall,
                styles.revSiteVersion,
              ]}>
              {'  '}
              <FontAwesome
                name="dot-circle-o"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />
              <FontAwesome
                name="long-arrow-right"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />{' '}
              Version{' : '}
            </Text>
            <Text
              style={[
                styles.revSiteTxtColorLight,
                styles.revSiteTxtTiny,
                styles.revSiteVersion,
              ]}>
              natalie-1.0.0{' '}
              <FontAwesome
                name="copyright"
                style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}
              />{' '}
              2023
            </Text>
          </View>
          <Text style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}>
            Chat with people from around the world !
          </Text>
        </View>

        {RevLogInForm}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.revFlexContainer, styles.revSiteContainer]}>
      <StatusBar backgroundColor="#00796b" />
      <StatusBar backgroundColor="#F7F7F7" barStyle={'dark-content'} />
      {REV_LOGGED_IN_ENTITY_GUID < 1 ? (
        <RevWalledGarden />
      ) : (
        <RevSiteContainer />
      )}
    </SafeAreaView>
  );
};

export default RevWalledGarden;

var pageWidth = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var maxChatMessageContainerWidth = pageWidth - 52;

const styles = StyleSheet.create({
  revSiteTxtColor: {
    color: '#757575',
  },
  revSiteTxtColorLight: {
    color: '#999',
  },
  revSiteFontBold: {
    fontWeight: '500',
  },
  revSiteTxtTiny: {
    fontSize: 9,
  },
  revSiteTxtSmall: {
    fontSize: 10,
  },
  revSiteTxtMedium: {
    fontSize: 12,
  },
  revFlexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revSiteContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  revlogInContainer: {
    alignSelf: 'center',
    width: maxChatMessageContainerWidth,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    position: 'relative',
    top: '10%',
    borderRadius: 4,
  },
  revSiteHeaderWrapper: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  revHeaderContainer: {
    backgroundColor: '#FFF',
    borderBottomColor: '#F7F7F7',
    borderStyle: 'dotted',
    borderBottomWidth: 1,
    width: 'auto',
    height: 'auto',
  },
  revSiteLogoWrapper: {
    alignItems: 'flex-end',
  },
  revSiteLogoTxt: {
    fontSize: 17,
    lineHeight: 17,
    fontWeight: 'bold',
  },
  revSiteVersion: {
    marginBottom: 1,
  },
  revLoginFormContainer: {
    marginTop: 4,
    height: 'auto',
    paddingBottom: 22,
  },
  revUserIdInput: {
    color: '#444',
    fontSize: 11,
    borderColor: '#F7F7F7',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 8,
  },
  revLoginFormFooterWrapper: {
    alignItems: 'center',
    marginTop: 22,
    marginLeft: 7,
  },
  revLogInTab: {
    color: '#F7F7F7',
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  revSignUpTab: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

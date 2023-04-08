import React, {useContext} from 'react';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  DeviceEventEmitter,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {RevSiteDataContext} from '../../rev_contexts/RevSiteDataContext';
import {RevRemoteSocketContext} from '../../rev_contexts/RevRemoteSocketContext';
import {revPluginsLoader} from '../rev_plugins_loader';
import {useRevPersSyncDataComponent} from '../rev_libs_pers/rev_server/RevPersSyncDataComponent';

import {
  revIsEmptyVar,
  revPingServer,
} from '../../rev_function_libs/rev_gen_helper_functions';

import RevSiteContainer from './RevSiteContainer';

const RevWalledGarden = () => {
  const {
    REV_LOGGED_IN_ENTITY_GUID,
    SET_REV_LOGGED_IN_ENTITY_GUID,
    REV_LOGGED_IN_ENTITY,
  } = useContext(RevSiteDataContext);

  const {REV_IP, REV_ROOT_URL} = useContext(RevRemoteSocketContext);
  const {revPersSyncDataComponent} = useRevPersSyncDataComponent();

  const RevLogInForm = revPluginsLoader({
    revPluginName: 'rev_plugin_user_settings',
    revViewName: 'RevLogInForm',
    revData: 'Hello World!',
  });

  let revPingVarArgs = {
    revInterval: 5000,
    revIP: REV_ROOT_URL,
    revCallBack: revRetDada => {
      let revServerStatus = revRetDada.revServerStatus;

      console.log('>>> revServerStatus ' + JSON.stringify(revServerStatus));

      if (revServerStatus !== 200) {
        return;
      }
    },
  };

  revPingServer(revPingVarArgs);

  DeviceEventEmitter.addListener('revWebServerConnected', event => {
    // console.log('>>> revWebServerConnected ' + event.eventProperty);
  });

  revPersSyncDataComponent(-1, revSynchedGUIDsArr => {
    console.log(
      '>>> LOG IN <<< revSynchedGUIDsArr ' + JSON.stringify(revSynchedGUIDsArr),
    );
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

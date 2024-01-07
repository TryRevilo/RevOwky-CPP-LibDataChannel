import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  FlatList,
  StyleSheet,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Contacts from 'react-native-contacts';

import {RevContact} from './rev_entity_views/RevContact';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

import RevCustomLoadingView from '../../../../rev_views/rev_loaders/RevCustomLoadingView';
import {revConvertNumberToDecimal} from '../../../../../rev_function_libs/rev_string_function_libs';

export function RevContacts({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  const revIncrementals = 100;

  const [revTotDataCount, setRevTotDataCount] = useState(0);
  const [revListingData, setRevListingData] = useState([]);
  const [revPage, setRevPage] = useState(1);
  const [revPageSize, setRevPageSize] = useState(revIncrementals);

  const [revIsLoading, setRevIsLoading] = useState(false);

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'Owki needs access to your contacts ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);

      return false;
    }
  };

  const revAsyncFetchData = async () => {
    let revPermissionGranted = await requestContactsPermission();

    if (revPermissionGranted) {
      try {
        let revContacts = await Contacts.getAll();
        revContacts = revContacts.slice(0, 22);

        if (revContacts.length) {
          setRevIsLoading(true);
        } else {
          return;
        }

        setRevListingData(revContacts);
        setRevTotDataCount(revContacts.length);
      } catch (err) {
        console.warn('*** revAsyncFetchData -ERR', err);
      }
    }
  };

  const revLoadMoreData = () => {
    if (revListingData.length > revPage * revPageSize) {
      setRevPage(revPage + 1);
      setRevPageSize(revPageSize + revIncrementals);
    } else {
      setRevIsLoading(false);
    }
  };

  const handleRevContactPressed = revPhoneNumbers => {
    console.log('>>> handleRevContactPressed', JSON.stringify(revPhoneNumbers));
  };

  let RevContactItemsDraw = ({revContactsArr}) => {
    const {revSiteStyles} = useRevSiteStyles();

    let revContactNumbers = revContactsArr.map(
      (revContactItem, index) =>
        revContactItem.number +
        (index == revContactsArr.length - 1 ? '' : ' / '),
    );

    return (
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
        ]}>
        {revContactNumbers.toString().replace(',', '')}
      </Text>
    );
  };

  const revRenderFLItem = revContactData => {
    const {index: revIndex, item} = revContactData;

    return (
      <RevContact
        revVarArgs={{
          ...item,
          revIndex,
          handleRevContactPressed,
          RevContactItemsDraw,
        }}
      />
    );
  };

  const renderFooter = () => {
    if (!revIsLoading) {
      return null;
    }

    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revFooterLoadingWrapper,
        ]}>
        <RevCustomLoadingView revLoadintText="Loading contacts" />
      </View>
    );
  };

  useEffect(() => {
    revAsyncFetchData();
  }, []);

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          styles.revContentBodyTtlTellTxt,
          {alignItems: 'baseline'},
        ]}>
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          <FontAwesome name="hashtag" style={revSiteStyles.revSiteTxtTiny} />
          {'Phone '}
          {revConvertNumberToDecimal(revTotDataCount) + ' '}
        </Text>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            {paddingHorizontal: 8},
          ]}>
          <FontAwesome
            name="dot-circle-o"
            style={revSiteStyles.revSiteTxtTiny}
          />
          <FontAwesome
            name="long-arrow-right"
            style={revSiteStyles.revSiteTxtTiny}
          />{' '}
          Connections 27{' '}
        </Text>

        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
            {marginLeft: 22},
          ]}>
          <FontAwesome
            name="dot-circle-o"
            style={revSiteStyles.revSiteTxtTiny}
          />
          <FontAwesome
            name="long-arrow-right"
            style={revSiteStyles.revSiteTxtTiny}
          />{' '}
          Find
        </Text>
      </View>
      {revTotDataCount > 0 ? (
        <FlatList
          data={revListingData.slice(0, revPage * revPageSize)}
          renderItem={revRenderFLItem}
          keyExtractor={item => item.recordID}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          onEndReached={revLoadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          initialNumToRender={200}
          maxToRenderPerBatch={revPageSize}
        />
      ) : (
        <RevCustomLoadingView revLoadintText="Loading contacts" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  revContentBodyTtlTellTxt: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 32,
  },
  revFooterLoadingWrapper: {
    alignItems: 'center',
    height: 55,
    overflow: 'visible',
    marginLeft: 40,
    marginBottom: 32,
  },
});

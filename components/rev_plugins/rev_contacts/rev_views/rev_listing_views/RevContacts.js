import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Contacts from 'react-native-contacts';

import {RevContact} from './rev_entity_views/RevContact';

import {useRevSiteStyles} from '../../../../rev_views/RevSiteStyles';

import RevCustomLoadingView from '../../../../rev_views/rev_loaders/RevCustomLoadingView';

export function RevContacts({revVarArgs}) {
  const {revSiteStyles} = useRevSiteStyles();

  const [revTotContactsCount, setRevTotContactsCount] = useState(null);
  const [revContactsData, setRevContactsData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isLoading, setIsLoading] = useState(false);

  const handleGetContacts = async () => {
    let revPermissionGranted = await requestContactsPermission();
    if (revPermissionGranted) {
      await getAllContacts();
    }
  };

  useEffect(() => {
    handleGetContacts();
  }, []);

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
        console.log('Contacts permission granted');

        return true;
      } else {
        console.log('Contacts permission denied');

        return false;
      }
    } catch (err) {
      console.warn(err);

      return false;
    }
  };

  const getAllContacts = async () => {
    try {
      const contacts = await Contacts.getAll();
      setRevContactsData(contacts);

      setRevTotContactsCount(contacts.length);

      console.log('>>> revTotContactsCount ' + revTotContactsCount);
    } catch (err) {
      console.warn(err);
    }
  };

  const loadMoreContacts = () => {
    console.log('Load more contacts!');

    if (revContactsData.length > page * pageSize) {
      console.log('>>> loadMoreContacts ', page + 1);

      setPage(page + 1);
    }
  };

  const renderItem = ({item}) => {
    if (revContactsData.length > page * pageSize) {
      setIsLoading(true);
    }

    return (
      <View key={item.recordID}>
        <RevContact revVarArgs={item} />
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }

    let revCurrPageSize = page * pageSize;
    let revNextPageSize = page * pageSize + pageSize;

    let revCurrLoadCount =
      'loading ' +
      revCurrPageSize +
      ' to ' +
      revNextPageSize +
      ' of ' +
      revTotContactsCount;

    return (
      <View
        style={[
          revSiteStyles.revFlexWrapper_WidthAuto,
          styles.revFooterLoadingWrapper,
        ]}>
        <RevCustomLoadingView backgroundColor={'#FFF'} />
        <Text
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtSmall,
            styles.revLoadingTxt,
          ]}>
          {revCurrLoadCount}
        </Text>
      </View>
    );
  };

  return (
    <View style={revSiteStyles.revFlexContainer}>
      <Text style={styles.revContentBodyTtlTellTxt}>
        <FontAwesome name="hashtag" />
        {revTotContactsCount} <FontAwesome name="dot-circle-o" />
        <FontAwesome name="long-arrow-right" /> Connections 27{' '}
        <FontAwesome name="dot-circle-o" />
        <FontAwesome name="long-arrow-right" /> Find
      </Text>
      {revTotContactsCount > 0 ? (
        <FlatList
          data={revContactsData.slice(0, page * pageSize)}
          renderItem={renderItem}
          keyExtractor={item => item.recordID}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          onEndReached={loadMoreContacts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          initialNumToRender={pageSize}
          maxToRenderPerBatch={pageSize}
        />
      ) : (
        <RevCustomLoadingView text="loading contacts" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  revContentBodyTtlTellTxt: {
    color: '#009688',
    fontSize: 11,
    lineHeight: 11,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingRight: 12,
    marginBottom: 5,
    paddingLeft: 38,
  },
  channelOptionItem: {
    color: '#999',
    fontSize: 11,
    lineHeight: 11,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    paddingHorizontal: 2,
    marginRight: 8,
  },
  revFooterLoadingWrapper: {
    alignItems: 'center',
    height: 55,
    overflow: 'visible',
    marginLeft: 40,
    marginTop: 12,
  },
  revLoadingTxt: {
    paddingLeft: 3,
  },
});

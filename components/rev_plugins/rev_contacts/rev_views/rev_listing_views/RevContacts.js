import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Contacts from 'react-native-contacts';

import {RevContact} from './rev_entity_views/RevContact';

export function RevContacts({revVarArgs}) {
  [revContactsData, setRevContactsData] = useState([]);
  [revTotContactsCount, setRevTotContactsCount] = useState(null);
  [RevContactsListingView, setRevContactsListingView] = useState(null);

  useEffect(() => {
    Contacts.getAll().then(contacts => {
      setRevTotContactsCount(Object.keys(contacts).length);

      let revContactsArr = [];

      for (const key in contacts) {
        if (Object.hasOwnProperty.call(contacts, key)) {
          const element = contacts[key];
          revContactsArr.push(element);
        }
      }

      setRevContactsData(revContactsArr);
    });
  }, []);

  function renderItem({item}) {
    return <RevContact revVarArgs={item} />;
  }

  return (
    <View>
      <Text style={styles.revContentBodyTtlTellTxt}>
        <FontAwesome name="hashtag" />
        {revTotContactsCount} <FontAwesome name="dot-circle-o" />
        <FontAwesome name="long-arrow-right" /> Connections 27{' '}
        <FontAwesome name="dot-circle-o" />
        <FontAwesome name="long-arrow-right" /> Find
      </Text>
      {revContactsData && (
        <FlatList
          data={revContactsData}
          renderItem={renderItem}
          keyExtractor={item => {
            return item.rawContactId.toString();
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />
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
});

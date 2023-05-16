import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {revGetRandInteger} from '../../rev_function_libs/rev_gen_helper_functions';

import {useRevSiteStyles} from './RevSiteStyles';

export const RevTagsOutputListing = ({revVarArgs}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const {revTagsArr = [], revDelTagItemCallBack = null} = revVarArgs;

  if (revDelTagItemCallBack == null) {
    return null;
  }

  const revDrawTagTab = revData => (
    <View
      key={'revDrawTagTab_' + revGetRandInteger()}
      style={[
        revSiteStyles.revFlexWrapper_WidthAuto,
        revSiteStyles.revTagOutputTabWrapper,
      ]}>
      <Text
        style={[
          revSiteStyles.revSiteTxtColorLight,
          revSiteStyles.revSiteTxtTiny,
        ]}>
        {revData}
      </Text>

      <TouchableOpacity
        style={revSiteStyles.revDeleteOutputTabItem}
        onPress={() => {
          revDelTagItemCallBack(revData);
        }}>
        <FontAwesome
          style={[
            revSiteStyles.revSiteTxtColor,
            revSiteStyles.revSiteTxtNormal,
          ]}
          name="dot-circle-o"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 0}}>
      <View
        style={[
          revSiteStyles.revFlexWrapper,
          revSiteStyles.revTagsOutputListingWrapper,
        ]}>
        {revTagsArr.map(revData => revDrawTagTab(revData))}
      </View>
    </ScrollView>
  );
};

export const RevScrollView_H = ({revScrollViewContent}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 0}}>
      {revScrollViewContent}
    </ScrollView>
  );
};

export const RevScrollView_V = ({revScrollViewContent, revStyles}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: 0}}>
      <View
        style={[revSiteStyles.revFlexContainer, {marginBottom: 25}, revStyles]}>
        {revScrollViewContent}
      </View>
    </ScrollView>
  );
};

export const RevInfoArea = ({revInfoText}) => {
  const {revSiteStyles} = useRevSiteStyles();

  return (
    <View style={[revSiteStyles.revFlexContainer, revSiteStyles.revInfoArea]}>
      <Text>
        <FontAwesome
          name="exclamation"
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtNormal,
          ]}
        />
        {'  '}
        <Text
          style={[
            revSiteStyles.revSiteTxtColorLight,
            revSiteStyles.revSiteTxtTiny,
          ]}>
          {revInfoText}
        </Text>
      </Text>
    </View>
  );
};

export const RevTable = ({columns}) => {
  const {revSiteStyles} = useRevSiteStyles();

  const [rows, setRows] = useState([]);

  const addRow = () => {
    const newRow = {};
    columns.forEach(column => {
      newRow[column] = '';
    });
    setRows([...rows, newRow]);
  };

  const updateCell = (rowIndex, column, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][column] = value;
    setRows(updatedRows);
  };

  return (
    <View style={revSiteStyles.table}>
      <View style={revSiteStyles.tableRow}>
        {columns.map(column => (
          <Text style={revSiteStyles.tableHeader} key={column}>
            {column}
          </Text>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View style={revSiteStyles.tableRow} key={rowIndex}>
          {columns.map(column => (
            <TextInput
              style={revSiteStyles.tableCell}
              value={row[column]}
              onChangeText={text => updateCell(rowIndex, column, text)}
              key={column}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity style={revSiteStyles.addButton} onPress={addRow}>
        <Text style={revSiteStyles.addButtonLabel}>Add Row</Text>
      </TouchableOpacity>
    </View>
  );
};

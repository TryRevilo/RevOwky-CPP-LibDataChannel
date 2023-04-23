import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {LoremIpsum} from 'lorem-ipsum';

import {revGetRandInteger} from '../../../../../rev_function_libs/rev_gen_helper_functions';

export const RevAdEntityListingView = () => {
  let minMessageLen = 7;
  let maxMessageLen = 22;

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: revGetRandInteger(minMessageLen, maxMessageLen),
      min: revGetRandInteger(1, 2),
    },
  });

  let chatMsg = lorem.generateSentences(revGetRandInteger(1, 5));

  let RevLikes = () => {
    return (
      <View
        key={revGetRandInteger(100, 1000)}
        style={[styles.revFlexWrapper, styles.revLikesTabsWrapper]}>
        <TouchableOpacity key={revGetRandInteger(100, 1000)}>
          <FontAwesome name="arrow-up" style={styles.revLikesTab} />
        </TouchableOpacity>
        <Text style={styles.revLikesText}>{revGetRandInteger(1, 100)}</Text>
        <TouchableOpacity key={revGetRandInteger(100, 1000)}>
          <FontAwesome name="arrow-down" style={styles.revLikesTab} />
        </TouchableOpacity>
      </View>
    );
  };

  let revPostTagsArr = [1, 2, 3, 4];

  let RevPostTagItem = () => {
    return (
      <TouchableOpacity key={revGetRandInteger(100, 1000)}>
        <Text style={styles.revPostTagsListItem}>hello_world</Text>
      </TouchableOpacity>
    );
  };

  let revCommentUsersArr = [1, 2, 3, 4, 5, 6, 7];

  const RevCommentEntityIcon = () => {
    return (
      <TouchableOpacity key={revGetRandInteger(100, 1000)}>
        <View style={[styles.revCommentUserIcon]}></View>
      </TouchableOpacity>
    );
  };

  return (
    <View key={revGetRandInteger(100, 1000)} style={[styles.revFlexContainer]}>
      <View style={[styles.revFlexWrapper, styles.revAdHeaderWrapper]}>
        <Text style={[styles.revSiteTxtColorLight, styles.revSiteTxtTiny]}>
          Promoted
        </Text>
        <TouchableOpacity style={[styles.revAddAdTab]}>
          <FontAwesome
            name="plus"
            style={[styles.revSiteTxtColorLight, styles.revSiteTxtSmall]}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.revFlexWrapper, styles.revAdPublisherInfoWrapper]}>
        <View style={styles.revPublisherIcon}></View>
        <TouchableOpacity
          style={[styles.revFlexContainer, styles.revAdContentBodyContainer]}>
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteFontBold,
              styles.revSiteTxtSmall,
              styles.revPublisherInfoDescWrapper,
            ]}>
            Safaricom LLC
          </Text>
          <Text
            style={[
              styles.revSiteTxtColorLight,
              styles.revSiteTxtTiny,
              styles.revSiteTxtColorLight,
              styles.revAdDescTxt,
            ]}>
            {chatMsg}
          </Text>
          <View style={[styles.revAdMeadia]}></View>
          <View style={[styles.revFlexWrapper, styles.revPostTagsListWrapper]}>
            <FontAwesome name="hashtag" style={styles.revPostTagsListIcon} />
            <View style={[styles.revFlexWrapper]}>
              {revPostTagsArr.map(revItem => {
                let revKey =
                  'RevPostTagItem_' +
                  revItem +
                  '_' +
                  revGetRandInteger(10, 1000);
                return <RevPostTagItem key={revKey} />;
              })}
            </View>
          </View>
          <View style={[styles.revFlexWrapper, styles.revAdStatsFooterWrapper]}>
            <RevLikes />
            <TouchableOpacity>
              <Text
                style={[
                  styles.revSiteTxtColorLight,
                  styles.revSiteTxtTiny,
                  styles.revSiteTxtColorLight,
                  styles.revCommentsTxtCount,
                ]}>
                22 comments
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.revFlexWrapper, styles.revCommentUsersWrapper]}>
            {revCommentUsersArr.map(revCommentEntity => {
              return <RevCommentEntityIcon key={revCommentEntity} />;
            })}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    alignItems: 'flex-start',
  },
  revFlexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  revAdHeaderWrapper: {
    alignItems: 'center',
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 1,
  },
  revAddAdTab: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 12,
  },
  revAdPublisherInfoWrapper: {
    marginLeft: 0,
  },
  revPublisherIcon: {
    backgroundColor: '#999',
    width: 22,
    height: 22,
    marginTop: -1,
  },
  revPostTagsListWrapper: {
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  revPostTagsListIcon: {
    color: '#999',
    fontSize: 10,
  },
  revAdContentBodyContainer: {
    width: maxChatMessageContainerWidth - 12,
    marginLeft: 17,
  },
  revPublisherInfoDescWrapper: {
    marginTop: 2,
  },
  revAdDescTxt: {
    marginTop: 2,
  },
  revAdMeadia: {
    backgroundColor: '#F7F7F7',
    height: 55,
    marginTop: 4,
  },
  revPostTagsListItem: {
    color: '#999',
    fontSize: 10,
    lineHeight: 10,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    marginHorizontal: 4,
  },
  revAdStatsFooterWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  revLikesArea: {
    marginLeft: -6,
  },
  revLikesTabsWrapper: {
    alignItems: 'center',
  },
  revLikesTab: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  revLikesText: {
    color: '#999',
    fontSize: 10,
  },
  revCommentsTxtCount: {
    marginLeft: 10,
  },
  revCommentUsersWrapper: {
    marginTop: 4,
  },
  revCommentUserIcon: {
    backgroundColor: '#F7F7F7',
    width: 20,
    height: 20,
    marginLeft: 2,
  },
});

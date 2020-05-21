import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Text, StyleSheet, View } from 'react-native';
import { parseTagName, truncateNumber } from 'src/utils';
import { Colors } from 'src/constants';
import { BooruAPIResponseTag } from 'src/types';

function TagTab({
  tag,
  navigate,
  isHome,
}: {
  tag: BooruAPIResponseTag;
  navigate: Function;
  isHome?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.tag}
      activeOpacity={0.5}
      onPress={() => {
        navigate();
      }}>
      <View style={styles.tagNameContainer}>
        <ScrollView contentContainerStyle={styles.scrollView} horizontal>
          <Text style={[styles.tagText]}>{parseTagName(tag.name, isHome)}</Text>
        </ScrollView>
      </View>
      <View style={styles.postCountContainer}>
        <Text style={styles.tagTextPostCount}>
          {truncateNumber(tag.post_count)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default TagTab;

const styles = StyleSheet.create({
  tag: {
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: Colors.menuColorDark,
    width: 275,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 20,
  },
  tagNameContainer: {
    height: 50,
    width: 275 * 0.75,
  },
  scrollView: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  postCountContainer: {
    width: 50,
    height: 50,
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  tagTextPostCount: {
    fontSize: 16,
    color: 'white',
  },
});
